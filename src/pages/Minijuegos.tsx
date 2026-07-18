import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { OVERWATCH_QUESTIONS } from '../data/OverwatchQuestions';
import { GAMES_QUESTIONS } from '../data/GamesQuestions';
import { MUSIC_HITS_QUESTIONS } from '../data/MusicHitsQuestions';
import { FLAG_QUESTIONS } from '../data/FlagQuestions';
import { SCRAMBLE_WORDS } from '../data/ScrambleWords';
import { DBD_PERKS } from '../data/DbdPerks';
import { DOWNLOADED_PERKS } from '../data/DbdPerksDownloaded';
import md5 from 'blueimp-md5';
import './TierList.css'; // Reuse existing glass styles


function getDbdPerkImageUrl(apiPath: string) {
  if (!apiPath) return '';
  const parts = apiPath.split('/');
  const rawBaseName = parts[parts.length - 1]; // e.g. iconPerks_Terminus
  
  if (DOWNLOADED_PERKS.has(rawBaseName)) {
    return `/Imagenes/Perks/${rawBaseName}.png`;
  }

  let baseName = rawBaseName;
  if (baseName.startsWith('iconPerks_')) {
    const perkPart = baseName.substring(10); // e.g. Terminus
    const formattedPerkPart = perkPart.charAt(0).toLowerCase() + perkPart.slice(1); // e.g. terminus
    baseName = 'IconPerks_' + formattedPerkPart + '.png'; // e.g. IconPerks_terminus.png
  } else {
    baseName = baseName.charAt(0).toUpperCase() + baseName.slice(1) + '.png';
  }
  
  const hash = md5(baseName);
  const f = hash.charAt(0);
  const s = hash.substring(0, 2);
  
  return `https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/${f}/${s}/${baseName}`;
}

interface QuizQuestion {
  text?: string;
  flagCode?: string;
  youtubeId?: string;
  scrambleWord?: string;
  scrambleHint?: string;
  scrambleJumbled?: string;
  dbdPerkImage?: string;
  options: string[];
  answerIndex: number;
}

export default function Minijuegos() {
  const [currentView, setCurrentView] = useState<'hub' | 'quiz'>('hub');
  const [quizType, setQuizType] = useState<'overwatch' | 'games' | 'audio_music' | 'flags' | 'word_scramble' | 'dbd_perks'>('overwatch');
  
  // Quiz play states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(15);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [scrambleGuess, setScrambleGuess] = useState<string>('');

  // Audio Play states
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const playerRef = useRef<HTMLDivElement | null>(null);

  // User state
  const [userId, setUserId] = useState<string | null>(null);
  const [completionsToday, setCompletionsToday] = useState<string[]>([]);
  const [streakAwardInfo, setStreakAwardInfo] = useState<{ show: boolean; days: number; points: number } | null>(null);

  // Database custom minigames config
  const [dbMinigames, setDbMinigames] = useState<Record<string, any>>({});

  useEffect(() => {
    supabase
      .from('minigames_content')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) {
          const dict: Record<string, any> = {};
          data.forEach(row => {
            dict[row.game_type] = row.data;
          });
          setDbMinigames(dict);
        }
      });
  }, []);

  const triggerStreakAward = async () => {
    if (!userId) return;
    
    // Fetch profile to get current streak, last streak date, and points
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('points, current_streak, last_streak_date')
      .eq('id', userId)
      .single();
      
    if (error || !profile) return;
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Prevent double streak awards on the same day
    if (profile.last_streak_date === todayStr) {
      return;
    }
    
    let newStreak = 1;
    if (profile.last_streak_date) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (profile.last_streak_date === yesterdayStr) {
        newStreak = profile.current_streak + 1;
      }
    }
    
    // Streak reward formula: 3 base + 1 point per consecutive day after the first (e.g. 1st=3, 2nd=4, 3rd=5)
    const streakReward = 3 + (newStreak - 1);
    
    // Update profile in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        points: (profile.points || 0) + streakReward,
        current_streak: newStreak,
        last_streak_date: todayStr
      })
      .eq('id', userId);
      
    if (!updateError) {
      window.dispatchEvent(new Event('points-updated'));
    }
      
    // Set popup state to show modal to user
    setStreakAwardInfo({
      show: true,
      days: newStreak,
      points: streakReward
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setCompletionsToday([]);
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    supabase
      .from('user_quiz_completions')
      .select('quiz_type')
      .eq('user_id', userId)
      .eq('completed_date', todayStr)
      .then(({ data, error }) => {
        if (!error && data) {
          setCompletionsToday(data.map(d => d.quiz_type));
        }
      });
  }, [userId]);

  // Load YouTube Iframe API Script
  useEffect(() => {
    if ((window as any).YT) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  const initYoutubePlayer = () => {
    if (ytPlayer || !playerRef.current) return;
    try {
      new (window as any).YT.Player(playerRef.current, {
        height: '200',
        width: '320',
        videoId: '',
        playerVars: {
          autoplay: 1,
          mute: 0,
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event: any) => {
            setYtPlayer(event.target);
            const currentQ = quizQuestions[currentQuestionIdx];
            if (quizStarted && currentQ && currentQ.youtubeId) {
              event.target.loadVideoById({
                videoId: currentQ.youtubeId,
                startSeconds: 30
              });
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (event.data === 1) {
              setIsAudioPlaying(true);
            } else {
              setIsAudioPlaying(false);
            }
          }
        }
      });
    } catch (e) {
      console.error('Failed to init YT player:', e);
    }
  };

  useEffect(() => {
    if (currentView === 'quiz' && quizType === 'audio_music') {
      const timer = setTimeout(() => {
        if ((window as any).YT && (window as any).YT.Player) {
          initYoutubePlayer();
        } else {
          const checkAPI = setInterval(() => {
            if ((window as any).YT && (window as any).YT.Player) {
              initYoutubePlayer();
              clearInterval(checkAPI);
            }
          }, 100);
          setTimeout(() => clearInterval(checkAPI), 5000);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentView, quizType]);

  const playCurrentQuestionAudio = (index: number) => {
    const question = quizQuestions[index];
    if (!question || !question.youtubeId) return;

    if (!ytPlayer) {
      initYoutubePlayer();
      setTimeout(() => {
        if (ytPlayer) {
          try {
            ytPlayer.loadVideoById({
              videoId: question.youtubeId,
              startSeconds: 30
            });
            ytPlayer.playVideo();
          } catch (e) {}
        }
      }, 1000);
      return;
    }

    try {
      ytPlayer.loadVideoById({
        videoId: question.youtubeId,
        startSeconds: 30
      });
      ytPlayer.playVideo();
    } catch (err) {
      console.error('Error playing YT video:', err);
    }
  };

  const stopCurrentQuestionAudio = () => {
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
      try {
        ytPlayer.stopVideo();
      } catch (e) {}
    }
  };

  const getDailyQuestions = (type: 'overwatch' | 'games' | 'audio_music' | 'flags' | 'word_scramble' | 'dbd_perks') => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Hash the date string to get a highly distinct seed value
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    // Mulberry32 generator for robust, seedable random numbers
    let seedVal = Math.abs(hash);
    const random = () => {
      let t = seedVal += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    if (type === 'dbd_perks') {
      const activeDbdPerks = dbMinigames['dbd'] || DBD_PERKS;
      const selectedPerks = [];
      const tempPerks = [...activeDbdPerks];
      for (let i = 0; i < 15; i++) {
        const randIdx = Math.floor(random() * tempPerks.length);
        const perk = tempPerks.splice(randIdx, 1)[0];
        if (perk) {
          const incorrectOptions = [];
          const potentialIncorrect = activeDbdPerks.filter(p => p.role === perk.role && p.name !== perk.name);
          for (let j = 0; j < 3; j++) {
            const randIncIdx = Math.floor(random() * potentialIncorrect.length);
            const incPerk = potentialIncorrect.splice(randIncIdx, 1)[0];
            if (incPerk) {
              incorrectOptions.push(incPerk.name);
            }
          }
          const options = [perk.name, ...incorrectOptions];
          for (let s = options.length - 1; s > 0; s--) {
            const r = Math.floor(random() * (s + 1));
            const tmp = options[s];
            options[s] = options[r];
            options[r] = tmp;
          }
          selectedPerks.push({
            dbdPerkImage: perk.image,
            options: options,
            answerIndex: options.indexOf(perk.name)
          });
        }
      }
      return selectedPerks;
    }

    // Calculate dayIndex since a fixed epoch
    const startOfEpoch = new Date('2026-01-01');
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const msInDay = 24 * 60 * 60 * 1000;
    const dayIndex = Math.floor((localToday.getTime() - startOfEpoch.getTime()) / msInDay);

    const sourceQuestions = 
      type === 'flags' ? (dbMinigames['flags'] || FLAG_QUESTIONS) :
      type === 'overwatch' ? (dbMinigames['overwatch'] || OVERWATCH_QUESTIONS) : 
      type === 'games' ? (dbMinigames['games'] || GAMES_QUESTIONS) : 
      type === 'word_scramble' ? (dbMinigames['scramble'] || SCRAMBLE_WORDS.map(w => ({
        scrambleWord: w.word,
        scrambleHint: w.hint,
        options: [],
        answerIndex: 0
      }))) :
      (dbMinigames['music'] || MUSIC_HITS_QUESTIONS);

    const totalQuestions = sourceQuestions.length;
    const blockSize = 15;

    let dayBlock;
    if (totalQuestions <= blockSize) {
      dayBlock = sourceQuestions;
    } else {
      const totalBlocks = Math.floor(totalQuestions / blockSize);
      const currentBlockIdx = Math.abs(dayIndex) % totalBlocks;
      const startIndex = currentBlockIdx * blockSize;
      dayBlock = sourceQuestions.slice(startIndex, startIndex + blockSize);
    }

    const shuffled = JSON.parse(JSON.stringify(dayBlock));
    // 1. Shuffle the order of the questions
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    // 2. Shuffle the options within each question and update answerIndex
    for (const q of shuffled) {
      if (q.options && q.options.length > 0) {
        const correctText = q.options[q.answerIndex];
        for (let i = q.options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = q.options[i];
          q.options[i] = q.options[j];
          q.options[j] = temp;
        }
        q.answerIndex = q.options.indexOf(correctText);
      }
    }

    return shuffled;
  };

  const startQuiz = (type: 'overwatch' | 'games' | 'audio_music' | 'flags' | 'word_scramble' | 'dbd_perks') => {
    if (!userId) {
      alert("Inicia sesión con Twitch para realizar las trivias diarias.");
      return;
    }
    if (completionsToday.includes(type)) {
      alert("Ya has realizado esta trivia hoy. ¡Vuelve mañana!");
      return;
    }
    setQuizType(type);
    const questions = getDailyQuestions(type);
    
    // Pre-scramble letters for Word Scramble
    if (type === 'word_scramble') {
      questions.forEach((q: any) => {
        if (q.scrambleWord) {
          const arr = q.scrambleWord.split('');
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
          }
          let jumbled = arr.join('');
          if (jumbled === q.scrambleWord) {
            jumbled = arr.reverse().join('');
          }
          q.scrambleJumbled = jumbled;
        }
      });
    }

    setQuizQuestions(questions);
    setCurrentQuestionIdx(0);
    setUserScore(0);
    setSelectedOptionIdx(null);
    setQuizTimeLeft(type === 'word_scramble' ? 30 : 15);
    setQuizFinished(false);
    setIsAnswerRevealed(false);
    setQuizStarted(false);
    setCurrentView('quiz');
  };

  const beginQuiz = () => {
    setQuizStarted(true);
    if (quizType === 'audio_music') {
      playCurrentQuestionAudio(0);
    }
  };

  const handleCheckScramble = () => {
    if (isAnswerRevealed) return;
    setIsAnswerRevealed(true);

    const question = quizQuestions[currentQuestionIdx];
    const userAns = scrambleGuess.trim().toUpperCase();
    const correctAns = question.scrambleWord || '';

    if (userAns === correctAns) {
      setUserScore(prev => prev + 3);
      if (userId) {
        supabase
          .rpc('increment_points', { user_id: userId, amount: 3 })
          .then(({ error }) => {
            if (error) {
              supabase
                .from('profiles')
                .select('points')
                .eq('id', userId)
                .single()
                .then(({ data }) => {
                  if (data) {
                    supabase
                      .from('profiles')
                      .update({ points: (data.points || 0) + 3 })
                      .eq('id', userId)
                      .then(() => {
                        window.dispatchEvent(new Event('points-updated'));
                      });
                  }
                });
            } else {
              window.dispatchEvent(new Event('points-updated'));
            }
          });
      }
    }
  };

  const handleRefreshScramble = () => {
    if (isAnswerRevealed) return;
    const question = quizQuestions[currentQuestionIdx];
    if (question && question.scrambleWord) {
      const arr = question.scrambleWord.split('');
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      let jumbled = arr.join('');
      if (jumbled === question.scrambleWord) {
        jumbled = arr.reverse().join('');
      }
      setQuizQuestions(prev => prev.map((q, idx) => 
        idx === currentQuestionIdx ? { ...q, scrambleJumbled: jumbled } : q
      ));
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    if (isAnswerRevealed) return;
    setSelectedOptionIdx(optionIdx);
    setIsAnswerRevealed(true);
    stopCurrentQuestionAudio();

    const question = quizQuestions[currentQuestionIdx];
    if (optionIdx === question.answerIndex) {
      setUserScore(prev => prev + 3);
      if (userId) {
        // Increment points in Supabase using raw update query
        supabase
          .rpc('increment_points', { user_id: userId, amount: 3 })
          .then(({ error }) => {
            if (error) {
              // Fallback to basic increment if RPC not created
              supabase
                .from('profiles')
                .select('points')
                .eq('id', userId)
                .single()
                .then(({ data }) => {
                  if (data) {
                    supabase
                      .from('profiles')
                      .update({ points: (data.points || 0) + 3 })
                      .eq('id', userId)
                      .then(() => {
                        window.dispatchEvent(new Event('points-updated'));
                      });
                  }
                });
            } else {
              window.dispatchEvent(new Event('points-updated'));
            }
          });
      }
    }
  };

  const nextQuestion = () => {
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < quizQuestions.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOptionIdx(null);
      setScrambleGuess('');
      setQuizTimeLeft(quizType === 'word_scramble' ? 30 : 15);
      setIsAnswerRevealed(false);
      if (quizType === 'audio_music') {
        playCurrentQuestionAudio(nextIdx);
      }
    } else {
      setQuizFinished(true);
      stopCurrentQuestionAudio();
      if (userId) {
        supabase
          .from('user_quiz_completions')
          .insert({
            user_id: userId,
            quiz_type: quizType,
            score: userScore
          })
          .then(({ error }) => {
            if (!error) {
              setCompletionsToday(prev => {
                const nextCompletions = [...prev, quizType];
                const required = ['overwatch', 'games', 'flags', 'word_scramble', 'dbd_perks'];
                const completedAll = required.every(req => nextCompletions.includes(req));
                if (completedAll) {
                  triggerStreakAward();
                }
                return nextCompletions;
              });
            }
          });
      }
    }
  };

  useEffect(() => {
    if (currentView !== 'quiz' || !quizStarted || quizFinished) return;

    if (quizType === 'audio_music' && !isAudioPlaying && !isAnswerRevealed) {
      return;
    }

    if (quizTimeLeft === 0) {
      setIsAnswerRevealed(true);
      stopCurrentQuestionAudio();
      const autoNextTimeout = setTimeout(() => {
        nextQuestion();
      }, 2000);
      return () => clearTimeout(autoNextTimeout);
    }

    const timer = setInterval(() => {
      if (!isAnswerRevealed) {
        setQuizTimeLeft(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentView, quizStarted, currentQuestionIdx, quizTimeLeft, quizFinished, isAnswerRevealed, isAudioPlaying, quizType]);

  useEffect(() => {
    return () => {
      if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        try {
          ytPlayer.stopVideo();
} catch (e) {}
      }
    };
  }, [ytPlayer]);

  return (
    <div className="app-container" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
      {currentView === 'hub' ? (
        <div className="home-dashboard" style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <article className="hero-main glass" style={{ margin: '0 auto', textAlign: 'center', padding: '40px 34px', width: '100%', maxWidth: '900px' }}>
            <div className="eyebrow" style={{ display: 'inline-flex', margin: '0 auto 18px' }}>
              <span className="dot"></span>Minijuegos Interactivos
            </div>
            <h1 style={{ margin: '0 auto 16px', maxWidth: 'none', fontSize: '3rem', fontWeight: 900 }}>Desafíos Diarios</h1>
            <p style={{ margin: '0 auto', maxWidth: '650px', color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Pon a prueba tus conocimientos en nuestras trivias y juegos diarios con sistema de puntuación.
            </p>

          </article>

          {!userId && (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1.5rem' }}>
              <div style={{
                padding: '0 24px',
                minHeight: '48px',
                borderRadius: '999px',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, .04), rgba(255, 255, 255, .01))',
                border: '1px solid rgba(255, 77, 77, 0.35)',
                color: '#ff4d4d',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontWeight: 800,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                boxShadow: '0 0 14px rgba(255, 77, 77, 0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                letterSpacing: '1px'
              }}>
                ⚠️ Logea para poder realizar los minijuegos.
              </div>
            </div>
          )}

          <div className="game-tabs-grid">
              {[
                { id: 'overwatch', name: 'Overwatch Quiz', desc: '15 Preguntas Diarias sobre Lore y mecánicas de Overwatch. Tienes 15 segundos por pregunta. +3 puntos por acierto.', color: '#f08226', bg: '/Imagenes/minijuego_overwatch.png' },
                { id: 'games', name: 'Videojuegos Trivia', desc: 'Preguntas aleatorias de la cultura gamer desde los 90s hasta la actualidad.', color: '#33ecc0', bg: '/Imagenes/minijuego_games.png' },
                { id: 'flags', name: 'Adivina la Bandera', desc: 'Trivia de geografía mundial para identificar las banderas de diferentes países.', color: '#ff4d4d', bg: '/Imagenes/minijuego_flags.png' },
                { id: 'word_scramble', name: 'Word Scramble', desc: 'Adivina la palabra desordenada con la ayuda de una pista. 15 palabras diarias. +3 puntos por acierto.', color: '#d833ff', bg: '/Imagenes/minijuego_scramble.png' },
                { id: 'dbd_perks', name: 'Perks de DBD', desc: 'Identifica la perk de Dead by Daylight a partir de su icono. 15 preguntas diarias. +3 puntos por acierto.', color: '#00d27f', bg: '/Imagenes/minijuego_dbd.png' }
              ].map((g) => {
                  const isCompleted = completionsToday.includes(g.id);
                  const isLocked = !userId;
                  return (
                      <div
                          key={g.id}
                          onClick={isLocked || isCompleted ? undefined : () => startQuiz(g.id as any)}
                          className="glass"
                          style={{
                              position: 'relative',
                              overflow: 'hidden',
                              cursor: isLocked ? 'not-allowed' : isCompleted ? 'default' : 'pointer',
                              padding: '2rem 1.5rem',
                              borderRadius: '24px',
                              boxShadow: 'var(--shadow)',
                              transition: 'all 0.3s ease',
                              textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                              if (isLocked || isCompleted) return;
                              e.currentTarget.style.borderColor = 'var(--accent)';
                              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 115, 0.15)';
                              e.currentTarget.style.transform = 'translateY(-4px)';
                              const bgImg = e.currentTarget.querySelector('.card-bg-img') as HTMLImageElement;
                              if (bgImg) bgImg.style.transform = 'scale(1.08)';
                          }}
                          onMouseLeave={(e) => {
                              if (isLocked || isCompleted) return;
                              e.currentTarget.style.borderColor = 'rgba(233, 176, 255, .08)';
                              e.currentTarget.style.boxShadow = 'var(--shadow)';
                              e.currentTarget.style.transform = 'none';
                              const bgImg = e.currentTarget.querySelector('.card-bg-img') as HTMLImageElement;
                              if (bgImg) bgImg.style.transform = 'scale(1)';
                          }}
                      >
                          {/* Background image underlay with 50% opacity */}
                          {g.bg && (
                              <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 0,
                                  opacity: 0.5,
                                  overflow: 'hidden'
                              }}>
                                  <img 
                                      src={g.bg} 
                                      alt="background" 
                                      className="card-bg-img"
                                      style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                          filter: 'brightness(0.3) contrast(1.15)',
                                          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                          pointerEvents: 'none'
                                      }}
                                  />
                              </div>
                          )}

                          {/* Locked full color overlay */}
                          {isLocked && (
                              <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: 'rgba(8, 4, 13, 0.92)',
                                  backdropFilter: 'blur(40px)',
                                  WebkitBackdropFilter: 'blur(40px)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 10,
                                  borderRadius: '24px',
                                  animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                                }}>
                                  <span style={{
                                      color: '#fff',
                                      fontSize: '1.6rem',
                                      fontWeight: 900,
                                      letterSpacing: '2px',
                                      textTransform: 'uppercase',
                                      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                  }}>
                                      Bloqueado
                                  </span>
                              </div>
                          )}

                          {/* Completed full color overlay */}
                          {isCompleted && (
                              <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: 'rgba(8, 4, 13, 0.92)',
                                  backdropFilter: 'blur(40px)',
                                  WebkitBackdropFilter: 'blur(40px)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 10,
                                  borderRadius: '24px',
                                  animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                              }}>
                                  <span style={{
                                      color: '#fff',
                                      fontSize: '1.6rem',
                                      fontWeight: 900,
                                      letterSpacing: '2px',
                                      textTransform: 'uppercase',
                                      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                  }}>
                                      Completado
                                  </span>
                              </div>
                          )}

                          <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                  <h3 style={{
                                      color: '#fff',
                                      fontSize: '1.4rem',
                                      fontWeight: 800,
                                      margin: 0,
                                      fontFamily: 'var(--font-primary)',
                                      textShadow: isLocked || isCompleted ? 'none' : `0 0 10px ${g.color}33`
                                  }}>
                                      {g.name}
                                  </h3>
                              </div>
                              <p style={{
                                  color: 'var(--text-muted)',
                                  fontSize: '0.95rem',
                                  lineHeight: 1.5,
                                  margin: 0
                              }}>
                                  {g.desc}
                              </p>
                          </div>
                      </div>
                  );
              })}
          </div>
        </div>
      ) : (
        <div className="quiz-view-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Hidden YouTube Player container */}
          <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '320px', height: '200px', top: '-10px', left: '-10px', overflow: 'hidden', zIndex: -9999 }}>
            <div ref={playerRef}></div>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
            <button 
              onClick={() => {
                stopCurrentQuestionAudio();
                setCurrentView('hub');
              }}
              className="btn btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.08)',
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              &larr; Volver a Minijuegos
            </button>
          </div>

          {/* Tarjeta de Entrada al Desafío (Combinada: Info y Reglas en una sola) */}
          {!quizStarted ? (
            <div className="glass" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '900px', margin: '0 auto 2.5rem', borderRadius: '24px', overflow: 'hidden' }}>
              
              {/* Bloque Superior: Info del Desafío */}
              <div style={{ padding: '40px 34px', textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="eyebrow" style={{ display: 'inline-flex', margin: '0 auto 18px' }}>
                  <span className="dot"></span>
                  {quizType === 'overwatch' 
                    ? 'Overwatch Daily Quiz' 
                    : quizType === 'games' 
                    ? 'Videojuegos Daily Quiz' 
                    : quizType === 'flags' 
                    ? 'Adivina la Bandera Daily Quiz' 
                    : quizType === 'audio_music'
                    ? 'Música Daily Quiz'
                    : 'Word Scramble Daily Quiz'}
                </div>
                <h1 style={{ margin: '0 auto 16px', maxWidth: 'none', fontSize: '3rem', fontWeight: 900 }}>Desafío Diario</h1>
                <p style={{ margin: '0 auto', maxWidth: '650px', color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                  {quizType === 'overwatch' 
                    ? 'Responde las preguntas antes de que se agote el tiempo. ¡Demuestra que eres un gran estratega!'
                    : quizType === 'games'
                    ? 'Demuestra cuánto sabes sobre los videojuegos más populares desde los 90s en adelante.'
                    : quizType === 'flags'
                    ? 'Adivina a qué país corresponde la bandera mostrada antes de que se agote el tiempo.'
                    : 'Adivina la palabra desordenada con la ayuda de la pista antes de que se agote el tiempo.'}
                </p>
              </div>

              {/* Bloque Inferior: Reglas y Botón de Inicio */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3.5rem 2rem', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>¿Listo para el desafío?</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.6, fontSize: '1rem', margin: 0 }}>
                  {quizType === 'audio_music' 
                    ? 'Se reproducirán clips musicales de 6 segundos. Escucha con atención y adivina el hit. 15 segundos límite por pregunta.' 
                    : quizType === 'flags'
                    ? 'Se te mostrarán 15 banderas de países. Adivina a qué país pertenecen. Tienes exactamente 15 segundos por pregunta. Cada acierto suma 3 puntos.'
                    : 'Se generarán 15 preguntas de opción múltiple. Dispones de exactamente 15 segundos por pregunta. Cada acierto suma 3 puntos.'}
                </p>
                <button 
                  onClick={beginQuiz} 
                  className="btn btn-primary" 
                  style={{ 
                    fontSize: '1.2rem', 
                    padding: '0.8rem 2.5rem', 
                    marginTop: '1rem'
                  }}
                >
                  Comenzar Desafío
                </button>
              </div>
            </div>
          ) : null}

          {/* VISTA EMERGENTE (MODAL POPUP) CON FONDO DIFUMINADO PARA EL JUEGO ACTIVO Y RESULTADOS */}
          {quizStarted && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(8, 4, 15, 0.85)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1.5rem'
            }}>
              {!quizFinished ? (
                /* Casilla de Preguntas Activas */
                <div className="glass" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.5rem', 
                  padding: '2rem', 
                  borderRadius: '24px',
                  width: '100%',
                  maxWidth: '650px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.65), 0 0 35px rgba(255, 0, 110, 0.15)',
                  border: '1px solid rgba(255, 0, 110, 0.22)',
                  maxHeight: '95vh',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600 }}>Pregunta {currentQuestionIdx + 1} de {quizQuestions.length}</span>
                    <span style={{ color: quizTimeLeft <= 5 ? '#ff4d4d' : '#fff', fontWeight: 'bold' }}>
                      Tiempo: {quizTimeLeft}s
                    </span>
                  </div>

                  {quizQuestions[currentQuestionIdx] && (
                    <div style={{ width: '100%' }}>
                      {quizType === 'word_scramble' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', padding: '1rem 0' }}>
                          <div style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            padding: '2rem 1.5rem',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            width: '100%',
                            textAlign: 'center',
                            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
                          }}>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'nowrap',
                              justifyContent: 'center',
                              gap: 'clamp(4px, 1vw, 8px)',
                              width: '100%',
                              padding: '0.5rem 0'
                            }}>
                              {quizQuestions[currentQuestionIdx].scrambleJumbled?.split('').map((char: string, idx: number) => (
                                <span 
                                  key={idx}
                                  style={{
                                    fontSize: 'clamp(1.2rem, 3.5vw, 2.2rem)',
                                    fontWeight: 900,
                                    color: '#fff',
                                    textShadow: '0 0 15px rgba(216, 51, 255, 0.6)',
                                    textTransform: 'uppercase',
                                    fontFamily: 'monospace',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(216, 51, 255, 0.3)',
                                    borderRadius: '10px',
                                    maxWidth: 'clamp(32px, 8vw, 55px)',
                                    width: '100%',
                                    aspectRatio: '1 / 1',
                                    flex: '1 1 auto',
                                    minWidth: 0,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                  }}
                                >
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>

                          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                            💡 <strong>Pista:</strong> {quizQuestions[currentQuestionIdx].scrambleHint}
                          </p>

                          <input 
                            type="text" 
                            value={scrambleGuess}
                            disabled={isAnswerRevealed}
                            onChange={(e) => setScrambleGuess(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCheckScramble();
                            }}
                            placeholder={isAnswerRevealed ? 'TIEMPO TERMINADO' : 'Escribe tu respuesta...'}
                            style={{
                              width: '100%',
                              background: 'rgba(0,0,0,0.2)',
                              border: isAnswerRevealed 
                                ? '1px solid rgba(255,255,255,0.05)' 
                                : '1px solid rgba(216, 51, 255, 0.3)',
                              padding: '1rem 1.25rem',
                              borderRadius: '16px',
                              color: '#fff',
                              fontSize: '1.2rem',
                              textAlign: 'center',
                              outline: 'none',
                              transition: 'all 0.3s ease',
                              letterSpacing: '2px',
                              textTransform: 'uppercase',
                              boxShadow: 'var(--shadow)'
                            }}
                          />

                          {!isAnswerRevealed && (
                            <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
                              <button 
                                onClick={handleRefreshScramble} 
                                className="btn btn-secondary"
                                style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', fontWeight: 600 }}
                              >
                                🔄 Mezclar Letras
                              </button>
                              <button 
                                onClick={handleCheckScramble} 
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', fontWeight: 700 }}
                              >
                                Comprobar Palabra
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {quizType === 'audio_music' ? (
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                              <div className={`audio-visualizer-bars ${isAudioPlaying ? 'animating' : ''}`} style={{ display: 'inline-flex', gap: '4px', height: '30px', alignItems: 'center' }}>
                                <span style={{ display: 'inline-block', width: '4px', height: '100%', background: '#fff', animation: isAudioPlaying ? 'bounce 0.6s infinite alternate' : 'none' }}></span>
                                <span style={{ display: 'inline-block', width: '4px', height: '80%', background: '#fff', animation: isAudioPlaying ? 'bounce 0.6s infinite alternate 0.15s' : 'none' }}></span>
                                <span style={{ display: 'inline-block', width: '4px', height: '100%', background: '#fff', animation: isAudioPlaying ? 'bounce 0.6s infinite alternate 0.3s' : 'none' }}></span>
                                <span style={{ display: 'inline-block', width: '4px', height: '60%', background: '#fff', animation: isAudioPlaying ? 'bounce 0.6s infinite alternate 0.1s' : 'none' }}></span>
                              </div>
                              <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                {isAudioPlaying ? 'Reproduciendo audio...' : 'Audio detenido'}
                              </p>
                            </div>
                          ) : quizType === 'flags' ? (
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                              <div style={{
                                display: 'inline-block',
                                padding: '6px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: 'var(--shadow)'
                              }}>
                                <img 
                                  src={`https://flagcdn.com/h240/${quizQuestions[currentQuestionIdx].flagCode}.png`} 
                                  alt="Bandera" 
                                  style={{
                                    height: '140px',
                                    display: 'block',
                                    borderRadius: '6px',
                                  }} 
                                />
                              </div>
                              <h2 style={{ marginTop: '1.5rem', fontSize: '1.4rem', fontWeight: 800 }}>¿A qué país pertenece esta bandera?</h2>
                            </div>
                          ) : quizType === 'dbd_perks' ? (
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                              <div style={{
                                display: 'inline-block',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                boxShadow: 'var(--shadow)',
                                backdropFilter: 'blur(10px)'
                              }}>
                                <img 
                                  src={getDbdPerkImageUrl(quizQuestions[currentQuestionIdx].dbdPerkImage || '')} 
                                  alt="Perk Icon" 
                                  style={{
                                    height: '140px',
                                    display: 'block',
                                  }} 
                                />
                              </div>
                              <h2 style={{ marginTop: '1.5rem', fontSize: '1.4rem', fontWeight: 800 }}>¿Cómo se llama esta habilidad (Perk)?</h2>
                            </div>
                          ) : (
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>{quizQuestions[currentQuestionIdx].text}</h2>
                          )}

                          {/* Opciones en cuadrícula normal */}
                          <div style={{ display: 'grid', gap: '0.75rem', width: '100%' }}>
                            {quizQuestions[currentQuestionIdx].options.map((option: string, idx: number) => {
                              const isCorrect = idx === quizQuestions[currentQuestionIdx].answerIndex;
                              const isSelected = idx === selectedOptionIdx;
                              
                              let btnBg = 'rgba(255,255,255,0.02)';
                              let btnBorder = '1px solid rgba(255,255,255,0.06)';
                              let color = '#fff';

                              if (isAnswerRevealed) {
                                if (isCorrect) {
                                  btnBg = 'rgba(0, 210, 127, 0.15)';
                                  btnBorder = '1px solid #00d27f';
                                } else if (isSelected) {
                                  btnBg = 'rgba(255, 77, 77, 0.15)';
                                  btnBorder = '1px solid #ff4d4d';
                                } else {
                                  btnBg = 'rgba(255,255,255,0.01)';
                                  color = 'rgba(255,255,255,0.2)';
                                }
                              } else if (isSelected) {
                                btnBg = 'rgba(255,255,255,0.08)';
                                btnBorder = '1px solid rgba(255,255,255,0.2)';
                              }

                              return (
                                <button
                                  key={idx}
                                  disabled={isAnswerRevealed}
                                  onClick={() => handleSelectOption(idx)}
                                  style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: btnBg,
                                    border: btnBorder,
                                    color: color,
                                    textAlign: 'left',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    gap: '10px',
                                    transition: 'all 0.2s ease',
                                    cursor: isAnswerRevealed ? 'default' : 'pointer'
                                  }}
                                >
                                  <span style={{ opacity: 0.5 }}>{String.fromCharCode(65 + idx)})</span>
                                  <span>{option}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {isAnswerRevealed && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                      {quizType === 'word_scramble' ? (
                        (() => {
                          const correctWord = quizQuestions[currentQuestionIdx].scrambleWord || '';
                          const isCorrect = scrambleGuess.trim().toUpperCase() === correctWord;
                          return isCorrect ? (
                            <p style={{ color: '#00d27f', fontWeight: 600, margin: '0 0 1rem 0', fontSize: '1.1rem' }}>¡Correcto! La palabra era {correctWord}. +3 puntos.</p>
                          ) : (
                            <p style={{ color: '#ff4d4d', fontWeight: 600, margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
                              {scrambleGuess.trim() === '' ? '¡Se acabó el tiempo!' : 'Incorrecto.'} La respuesta correcta era: <strong style={{ color: '#00d27f', fontSize: '1.2rem', marginLeft: '6px' }}>{correctWord}</strong>
                            </p>
                          );
                        })()
                      ) : (
                        selectedOptionIdx === null ? (
                          <p style={{ color: '#ff4d4d', fontWeight: 600, margin: '0 0 1rem 0' }}>¡Se acabó el tiempo! No sumas puntos.</p>
                        ) : selectedOptionIdx === quizQuestions[currentQuestionIdx].answerIndex ? (
                          <p style={{ color: '#00d27f', fontWeight: 600, margin: '0 0 1rem 0' }}>¡Correcto! +3 puntos.</p>
                        ) : (
                          <p style={{ color: '#ff4d4d', fontWeight: 600, margin: '0 0 1rem 0' }}>Incorrecto. La respuesta correcta era la indicada en verde.</p>
                        )
                      )}
                      <button onClick={nextQuestion} className="btn btn-primary">
                        {currentQuestionIdx + 1 === quizQuestions.length ? 'Ver Resultados' : 'Siguiente Pregunta'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Casilla de Resultados del Quiz */
                <div className="glass" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center', 
                  padding: '3rem 2rem', 
                  gap: '1.5rem', 
                  borderRadius: '24px',
                  width: '100%',
                  maxWidth: '550px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.65), 0 0 35px rgba(255, 0, 110, 0.15)',
                  border: '1px solid rgba(255, 0, 110, 0.22)'
                }}>
                  <h2>Resultados del Quiz</h2>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '2px solid var(--primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow)'
                  }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900 }}>{userScore}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>/ {quizQuestions.length * 3} Pts</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
                    Respondiste correctamente {userScore / 3} de {quizQuestions.length} preguntas hoy.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button onClick={() => {
                      setCurrentView('hub');
                      setQuizStarted(false);
                      setQuizFinished(false);
                    }} className="btn btn-primary">
                      Volver a Minijuegos
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Streak Completed celebration Modal */}
      {streakAwardInfo?.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.5rem'
        }}>
          <div className="glass" style={{
            maxWidth: '450px',
            width: '100%',
            background: 'rgba(20, 10, 30, 0.95)',
            border: '2px solid #ffaa00',
            borderRadius: '28px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(255, 170, 0, 0.25)',
            animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🔥</div>
            <h2 style={{
              color: '#ffaa00',
              fontSize: '2rem',
              fontWeight: 900,
              margin: '0 0 0.5rem 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              ¡Racha Diaria!
            </h2>
            <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>
              Has completado los 3 desafíos del día
            </p>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '20px',
              padding: '1.5rem',
              margin: '0 0 2rem 0',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Racha consecutiva</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{streakAwardInfo.days} {streakAwardInfo.days === 1 ? 'día' : 'días'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Recompensa de puntos</span>
                <span style={{ color: '#00d27f', fontWeight: 'bold' }}>+{streakAwardInfo.points} Puntos</span>
              </div>
            </div>

            <button
              onClick={() => setStreakAwardInfo(null)}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffaa00 0%, #ff5500 100%)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Reclamar y Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
