import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { OVERWATCH_QUESTIONS } from '../data/OverwatchQuestions';
import { GAMES_QUESTIONS } from '../data/GamesQuestions';
import { MUSIC_HITS_QUESTIONS } from '../data/MusicHitsQuestions';
import { FLAG_QUESTIONS } from '../data/FlagQuestions';
import { SCRAMBLE_WORDS } from '../data/ScrambleWords';
import { DBD_PERKS } from '../data/DbdPerks';
import { DISNEY_QUESTIONS } from '../data/DisneyQuestions';
import { COVERS_QUESTIONS } from '../data/CoversQuestions';
import { DOWNLOADED_PERKS } from '../data/DbdPerksDownloaded';
import md5 from 'blueimp-md5';
import './TierList.css'; // Reuse existing glass styles


function getDbdPerkImageUrl(apiPath: string) {
  if (!apiPath) return '';
  const parts = apiPath.split('/');
  const rawBaseName = parts[parts.length - 1].replace('.png', ''); // e.g. iconPerks_Terminus
  
  if (DOWNLOADED_PERKS.has(rawBaseName)) {
    return `Imagenes/Perks/${rawBaseName}.png`;
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
  audioUrl?: string;
  scrambleWord?: string;
  scrambleHint?: string;
  scrambleJumbled?: string;
  dbdPerkImage?: string;
  image?: string;
  options: string[];
  answerIndex: number;
}

export default function Minijuegos() {
  const [currentView, setCurrentView] = useState<'hub' | 'quiz' | 'ruleta'>('hub');
  const [quizType, setQuizType] = useState<'overwatch' | 'games' | 'audio_music' | 'flags' | 'word_scramble' | 'dbd_perks' | 'disney' | 'covers'>('overwatch');
  
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
  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  // User state
  const [userId, setUserId] = useState<string | null>(null);
  const [completionsToday, setCompletionsToday] = useState<string[]>([]);
  const [streakAwardInfo, setStreakAwardInfo] = useState<{ show: boolean; days: number; points: number } | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [abandonedQuizInfo, setAbandonedQuizInfo] = useState<string | null>(null);
  const isExitingRef = useRef<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Volume states for music quiz
  const [audioVolume, setAudioVolume] = useState<number>(0.2);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  // Roulette states & variables
  const [betAmount, setBetAmount] = useState<10 | 50 | 100 | 500>(10);
  const [ruletaRotation, setRuletaRotation] = useState<number>(0);
  const [isRuletaSpinning, setIsRuletaSpinning] = useState<boolean>(false);
  const [ruletaResult, setRuletaResult] = useState<{ type: string; label: string; change: number } | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);

  const fetchUserPoints = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
    if (data) {
      setUserPoints(data.points || 0);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserPoints();
    window.addEventListener('points-updated', fetchUserPoints);
    return () => window.removeEventListener('points-updated', fetchUserPoints);
  }, [fetchUserPoints]);

  useEffect(() => {
    const abandoned = localStorage.getItem('active_quiz_abandoned');
    if (abandoned) {
      setAbandonedQuizInfo(abandoned);
      localStorage.removeItem('active_quiz_abandoned');
    }
  }, []);

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
    if (!question) return;

    // Si tiene audioUrl directa (iTunes), la reproducimos usando HTML5 Audio
    if (question.audioUrl) {
      if (localAudioRef.current) {
        localAudioRef.current.pause();
      }
      const audio = new Audio(question.audioUrl);
      audio.volume = audioVolume;
      audio.play().then(() => {
        setIsAudioPlaying(true);
      }).catch((e) => console.error("Error playing audio stream:", e));
      
      audio.onended = () => {
        setIsAudioPlaying(false);
      };
      localAudioRef.current = audio;
      return;
    }

    // Fallback heredado a YouTube
    if (!question.youtubeId) return;

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
    if (localAudioRef.current) {
      try {
        localAudioRef.current.pause();
        setIsAudioPlaying(false);
      } catch (e) {}
    }
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
      try {
        ytPlayer.stopVideo();
      } catch (e) {}
    }
  };

  const getDailyQuestions = (type: 'overwatch' | 'games' | 'audio_music' | 'flags' | 'word_scramble' | 'dbd_perks' | 'disney' | 'covers') => {
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
      const activeDbdPerks = (dbMinigames['dbd'] || DBD_PERKS).filter((perk: any) => {
        const parts = perk.image.split('/');
        const imgName = parts[parts.length - 1].replace('.png', '');
        return DOWNLOADED_PERKS.has(imgName);
      });

      // Calculate dayIndex since a fixed epoch
      const startOfEpoch = new Date('2026-01-01');
      const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const msInDay = 24 * 60 * 60 * 1000;
      const dayIndex = Math.floor((localToday.getTime() - startOfEpoch.getTime()) / msInDay);

      const totalPerks = activeDbdPerks.length;
      const blockSize = 15;
      let dayBlock;

      if (totalPerks <= blockSize) {
        dayBlock = activeDbdPerks;
      } else {
        const totalBlocks = Math.floor(totalPerks / blockSize);
        const currentBlockIdx = Math.abs(dayIndex) % totalBlocks;
        const startIndex = currentBlockIdx * blockSize;
        dayBlock = activeDbdPerks.slice(startIndex, startIndex + blockSize);
      }

      const selectedPerks = [];
      const tempPerks = [...dayBlock];
      
      for (let i = 0; i < 15; i++) {
        const randIdx = Math.floor(random() * tempPerks.length);
        const perk = tempPerks.splice(randIdx, 1)[0];
        if (perk) {
          const incorrectOptions = [];
          const potentialIncorrect = activeDbdPerks.filter((p: any) => p.role === perk.role && p.name !== perk.name);
          const tempIncorrect = [...potentialIncorrect];
          for (let j = 0; j < 3; j++) {
            const randIncIdx = Math.floor(random() * tempIncorrect.length);
            const incPerk = tempIncorrect.splice(randIncIdx, 1)[0];
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
      type === 'disney' ? (dbMinigames['disney'] || DISNEY_QUESTIONS) :
      type === 'covers' ? (dbMinigames['covers'] || COVERS_QUESTIONS) :
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

  const startQuiz = (type: 'overwatch' | 'games' | 'audio_music' | 'flags' | 'word_scramble' | 'dbd_perks' | 'disney' | 'covers') => {
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

  const beginQuiz = async () => {
    setQuizStarted(true);
    if (quizType === 'audio_music') {
      playCurrentQuestionAudio(0);
    }

    // Intercept navigation by pushing a dummy state in browser history
    window.history.pushState({ inQuiz: true }, '');

    // Set flag in localStorage to detect refresh/abandonment
    localStorage.setItem('active_quiz_abandoned', quizType);

    if (userId) {
      // Add immediately to local completed list so UI locks it
      setCompletionsToday(prev => prev.includes(quizType) ? prev : [...prev, quizType]);

      const todayStr = new Date().toISOString().split('T')[0];
      await supabase
        .from('user_quiz_completions')
        .upsert({
          user_id: userId,
          quiz_type: quizType,
          score: 0,
          completed_date: todayStr
        }, { onConflict: 'user_id,quiz_type,completed_date' });
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

      // Clean up browser history state
      isExitingRef.current = true;
      if (window.history.state && window.history.state.inQuiz) {
        window.history.back();
      }
      localStorage.removeItem('active_quiz_abandoned');

      if (userId) {
        const todayStr = new Date().toISOString().split('T')[0];
        supabase
          .from('user_quiz_completions')
          .upsert({
            user_id: userId,
            quiz_type: quizType,
            score: userScore,
            completed_date: todayStr
          }, { onConflict: 'user_id,quiz_type,completed_date' })
          .then(({ error }) => {
            if (!error) {
              setCompletionsToday(prev => {
                const nextCompletions = prev.includes(quizType) ? prev : [...prev, quizType];
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

  const confirmExitQuiz = async () => {
    setShowExitConfirm(false);
    stopCurrentQuestionAudio();

    // Clean up browser history state
    isExitingRef.current = true;
    if (window.history.state && window.history.state.inQuiz) {
      window.history.back();
    }
    localStorage.removeItem('active_quiz_abandoned');

    if (userId) {
      const todayStr = new Date().toISOString().split('T')[0];
      await supabase
        .from('user_quiz_completions')
        .upsert({
          user_id: userId,
          quiz_type: quizType,
          score: userScore,
          completed_date: todayStr
        }, { onConflict: 'user_id,quiz_type,completed_date' });
    }

    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentView('hub');
  };

  // Roulette constant & handlers
  const RULETA_SECTORS = [
    { label: 'Pierde', type: 'pierde', factor: 0, color: '#1a102f', textColor: '#a0aec0' },
    { label: 'x1', type: 'x1', factor: 1, color: '#7c3aed', textColor: '#fff' },
    { label: 'x2', type: 'x2', factor: 2, color: '#ec4899', textColor: '#fff' },
    { label: 'Pierde', type: 'pierde', factor: 0, color: '#1a102f', textColor: '#a0aec0' },
    { label: '+100 Pts', type: 'flat', add: 100, color: '#3b82f6', textColor: '#fff' },
    { label: 'x1', type: 'x1', factor: 1, color: '#7c3aed', textColor: '#fff' },
    { label: 'Pierde', type: 'pierde', factor: 0, color: '#1a102f', textColor: '#a0aec0' },
    { label: 'x5', type: 'x5', factor: 5, color: '#f59e0b', textColor: '#fff' },
    { label: 'Pierde', type: 'pierde', factor: 0, color: '#1a102f', textColor: '#a0aec0' },
    { label: '+300 Pts', type: 'flat', add: 300, color: '#10b981', textColor: '#fff' },
    { label: 'x2', type: 'x2', factor: 2, color: '#ec4899', textColor: '#fff' },
    { label: 'Pierde', type: 'pierde', factor: 0, color: '#1a102f', textColor: '#a0aec0' },
    { label: '+500 Pts', type: 'flat', add: 500, color: '#8b5cf6', textColor: '#fff' },
    { label: 'x1', type: 'x1', factor: 1, color: '#7c3aed', textColor: '#fff' },
    { label: 'Pierde', type: 'pierde', factor: 0, color: '#1a102f', textColor: '#a0aec0' },
    { label: '+1500 Pts', type: 'flat', add: 1500, color: '#e11d48', textColor: '#fff' }
  ];

  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSynthWinSound = (isWin: boolean) => {
    try {
      const audioCtx = getAudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (isWin) {
        osc.type = 'sine';
        // Happy fast arpeggio
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
        osc.frequency.setValueAtTime(1318.51, now + 0.32); // E6

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.start();
        osc.stop(now + 0.7);
      } else {
        osc.type = 'sawtooth';
        // Buzz/disappointment pitch drop
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.linearRampToValueAtTime(147, now + 0.35); // D3

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.start();
        osc.stop(now + 0.45);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const spinRuleta = async () => {
    if (isRuletaSpinning || !userId || userPoints < betAmount) return;

    setIsRuletaSpinning(true);
    setRuletaResult(null);

    // Deduct bet amount visually in real-time
    setUserPoints(prev => Math.max(0, prev - betAmount));

    const rand = Math.random() * 100;
    let targetType = 'pierde';

    if (rand < 0.5) {
      targetType = 'flat_1500';
    } else if (rand < 2.0) {
      targetType = 'flat_500';
    } else if (rand < 4.5) {
      targetType = 'flat_300';
    } else if (rand < 9.5) {
      targetType = 'flat_100';
    } else if (rand < 14.0) {
      targetType = 'x5';
    } else if (rand < 30.0) {
      targetType = 'x2';
    } else if (rand < 50.0) {
      targetType = 'x1';
    } else {
      targetType = 'pierde';
    }

    let matchingSectors: number[] = [];
    RULETA_SECTORS.forEach((sec, idx) => {
      if (targetType === 'flat_1500' && sec.type === 'flat' && sec.add === 1500) matchingSectors.push(idx);
      else if (targetType === 'flat_500' && sec.type === 'flat' && sec.add === 500) matchingSectors.push(idx);
      else if (targetType === 'flat_300' && sec.type === 'flat' && sec.add === 300) matchingSectors.push(idx);
      else if (targetType === 'flat_100' && sec.type === 'flat' && sec.add === 100) matchingSectors.push(idx);
      else if (targetType === 'x5' && sec.type === 'x5') matchingSectors.push(idx);
      else if (targetType === 'x2' && sec.type === 'x2') matchingSectors.push(idx);
      else if (targetType === 'x1' && sec.type === 'x1') matchingSectors.push(idx);
      else if (targetType === 'pierde' && sec.type === 'pierde') matchingSectors.push(idx);
    });

    const chosenSectorIdx = matchingSectors[Math.floor(Math.random() * matchingSectors.length)];
    const sector = RULETA_SECTORS[chosenSectorIdx];

    let finalWinAmount = 0;
    if (sector.type === 'x1') finalWinAmount = betAmount;
    else if (sector.type === 'x2') finalWinAmount = betAmount * 2;
    else if (sector.type === 'x5') finalWinAmount = betAmount * 5;
    else if (sector.type === 'flat') finalWinAmount = sector.add || 0;
    else finalWinAmount = 0;

    const netChange = finalWinAmount - betAmount;

    // Run database transaction in the background without blocking the UI
    const dbUpdatePromise = (async () => {
      const { error } = await supabase
        .rpc('increment_points', { user_id: userId, amount: netChange });

      if (error) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', userId)
          .single();
        if (profile) {
          const newPoints = Math.max(0, (profile.points || 0) + netChange);
          await supabase
            .from('profiles')
            .update({ points: newPoints })
            .eq('id', userId);
        }
      }
    })();

    const targetAngle = (270 - (chosenSectorIdx * 22.5 + 11.25) + 360) % 360;
    const currentSpins = Math.floor(ruletaRotation / 360);
    const newRotation = (currentSpins + 8) * 360 + targetAngle;
    setRuletaRotation(newRotation);

    setTimeout(async () => {
      // Ensure DB update is completed before finishing spin
      await dbUpdatePromise;

      setIsRuletaSpinning(false);
      setRuletaResult({
        type: sector.type,
        label: sector.label,
        change: netChange
      });

      // Update points globally (Navbar and display) in sync with animation end
      window.dispatchEvent(new Event('points-updated'));
      playSynthWinSound(netChange > 0);
    }, 5000);
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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (quizStarted && !quizFinished) {
        e.preventDefault();
        e.returnValue = 'Si sales o recargas perderás la oportunidad de realizar el minijuego y se registrará con la puntuación actual.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [quizStarted, quizFinished]);

  useEffect(() => {
    const handlePopState = () => {
      if (isExitingRef.current) {
        isExitingRef.current = false;
        return;
      }
      if (quizStarted && !quizFinished) {
        // Push the state again to block the navigation and show the modal
        window.history.pushState({ inQuiz: true }, '');
        setShowExitConfirm(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [quizStarted, quizFinished]);

  // Synchronize volume adjustments to active players
  useEffect(() => {
    if (localAudioRef.current) {
      localAudioRef.current.volume = audioVolume;
    }
    if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
      try {
        ytPlayer.setVolume(audioVolume * 100);
      } catch (e) {}
    }
  }, [audioVolume, ytPlayer]);

  // RequestAnimationFrame tick-sound synchronization based on physical SVG rotation
  useEffect(() => {
    if (!isRuletaSpinning || !svgRef.current) return;

    let lastSector = -1;
    let animFrame: number;

    const playTickSound = () => {
      try {
        const audioCtx = getAudioContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'triangle';
        // Rapid pitch drop to simulate a mechanical click peg
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.015);
        
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.02);
      } catch (e) {}
    };

    const checkTick = () => {
      if (!svgRef.current) return;
      const style = window.getComputedStyle(svgRef.current);
      const transform = style.transform;
      if (transform && transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        const a = parseFloat(values[0]);
        const b = parseFloat(values[1]);
        let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        if (angle < 0) angle += 360;

        const currentSector = Math.floor(((270 - angle + 360) % 360) / 22.5);
        if (currentSector !== lastSector) {
          playTickSound();
          lastSector = currentSector;
        }
      }
      animFrame = requestAnimationFrame(checkTick);
    };

    animFrame = requestAnimationFrame(checkTick);
    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [isRuletaSpinning]);

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
                { id: 'overwatch', name: 'Overwatch Quiz', desc: '15 Preguntas Diarias sobre Lore y mecánicas de Overwatch. Tienes 15 segundos por pregunta. +3 puntos por acierto.', color: '#f08226', bg: '/Imagenes/minijuego_overwatch.png?v=2' },
                { id: 'games', name: 'Videojuegos Trivia', desc: 'Preguntas aleatorias de la cultura gamer desde los 90s hasta la actualidad.', color: '#33ecc0', bg: '/Imagenes/minijuego_games.png?v=2' },
                { id: 'flags', name: 'Adivina la Bandera', desc: 'Trivia de geografía mundial para identificar las banderas de diferentes países.', color: '#ff4d4d', bg: '/Imagenes/minijuego_flags.png?v=2' },
                { id: 'word_scramble', name: 'Word Scramble', desc: 'Adivina la palabra desordenada con la ayuda de una pista. 15 palabras diarias. +3 puntos por acierto.', color: '#d833ff', bg: '/Imagenes/minijuego_scramble.png?v=2' },
                { id: 'dbd_perks', name: 'Perks de DBD', desc: 'Identifica la perk de Dead by Daylight a partir de su icono. 15 preguntas diarias. +3 puntos por acierto.', color: '#00d27f', bg: '/Imagenes/minijuego_dbd.png?v=2' },
                { id: 'disney', name: 'Personajes Disney', desc: 'Adivina qué personaje de Disney es a partir de su imagen. 15 preguntas diarias. +3 puntos por acierto.', color: '#ffdd00', bg: '/Imagenes/minijuego_disney.png?v=2' },
                { id: 'covers', name: 'Carátulas de Juegos', desc: 'Adivina el videojuego a partir de su carátula o box art limpio y sin logos. 15 preguntas diarias. +3 puntos por acierto.', color: '#a855f7', bg: '/Imagenes/minijuego_covers.png?v=2' },
                { id: 'audio_music', name: 'Adivina la Canción', desc: 'Escucha el fragmento de audio y adivina a qué éxito musical pertenece. 15 canciones diarias. +3 puntos por acierto.', color: '#e233ff', bg: '/Imagenes/minijuego_music.png?v=2' },
                { id: 'ruleta', name: 'Ruleta de la Suerte', desc: '¡Apuesta tus puntos y prueba tu suerte! Multiplica tu apuesta hasta x5 o gana premios planos de hasta 1500 puntos.', color: '#ffaa00', bg: '/Imagenes/minijuego_ruleta.png?v=2' }
              ].map((g) => {
                  const isCompleted = completionsToday.includes(g.id);
                  const isLocked = !userId;
                  const canClick = isLocked ? false : (g.id === 'ruleta' ? true : !isCompleted);
                  return (
                      <div
                          key={g.id}
                          onClick={canClick ? (g.id === 'ruleta' ? () => setCurrentView('ruleta') : () => startQuiz(g.id as any)) : undefined}
                          className="glass"
                          style={{
                              position: 'relative',
                              overflow: 'hidden',
                              cursor: !canClick ? 'not-allowed' : 'pointer',
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
      ) : currentView === 'ruleta' ? (
        <div className="ruleta-view-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
            <button 
              onClick={() => {
                if (isRuletaSpinning) {
                  alert("Espera a que la ruleta termine de girar.");
                  return;
                }
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

          <div className="glass" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', padding: '3rem', borderRadius: '24px', overflow: 'hidden', alignItems: 'center' }}>
            {/* Left Column: Betting Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #ffaa00 0%, #ff5500 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Ruleta de la Suerte
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  Prueba tu suerte apostando tus puntos. ¡Puedes multiplicar tu saldo o ganar premios instantáneos de hasta 1500 puntos!
                </p>
              </div>

              {/* User Balance card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Tus Puntos:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--highlight)' }}>
                  {userPoints} Pts
                </span>
              </div>

              {/* Bet Amount Selector */}
              <div>
                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                  Cantidad a Apostar
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {([10, 50, 100, 500] as const).map((amount) => (
                    <button
                      key={amount}
                      disabled={isRuletaSpinning}
                      onClick={() => setBetAmount(amount)}
                      style={{
                        padding: '0.75rem 0',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: isRuletaSpinning ? 'default' : 'pointer',
                        border: betAmount === amount ? '2px solid #ffaa00' : '1px solid rgba(255,255,255,0.06)',
                        background: betAmount === amount ? 'rgba(255, 170, 0, 0.1)' : 'rgba(255,255,255,0.02)',
                        color: betAmount === amount ? '#ffaa00' : '#fff',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spin Button */}
              <button
                disabled={isRuletaSpinning || userPoints < betAmount}
                onClick={spinRuleta}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  borderRadius: '18px',
                  background: userPoints < betAmount 
                    ? 'rgba(255,255,255,0.05)'
                    : 'linear-gradient(135deg, #ffaa00 0%, #ff5500 100%)',
                  border: 'none',
                  cursor: isRuletaSpinning || userPoints < betAmount ? 'not-allowed' : 'pointer',
                  color: userPoints < betAmount ? 'rgba(255,255,255,0.3)' : '#fff',
                  boxShadow: userPoints < betAmount ? 'none' : '0 10px 25px rgba(255, 85, 0, 0.25)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isRuletaSpinning 
                  ? 'Girando...' 
                  : userPoints < betAmount 
                  ? 'Puntos Insuficientes' 
                  : '¡GIRAR RULETA!'}
              </button>

              {/* Spin Result Feedback */}
              {ruletaResult && (
                <div style={{
                  background: ruletaResult.change > 0 ? 'rgba(0, 210, 127, 0.08)' : ruletaResult.change < 0 ? 'rgba(255, 77, 77, 0.08)' : 'rgba(255,255,255,0.04)',
                  border: ruletaResult.change > 0 ? '1px solid #00d27f' : ruletaResult.change < 0 ? '1px solid #ff4d4d' : '1px solid rgba(255,255,255,0.1)',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  textAlign: 'center',
                  animation: 'scaleIn 0.3s ease-out'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem', color: ruletaResult.change > 0 ? '#00d27f' : ruletaResult.change < 0 ? '#ff4d4d' : '#fff' }}>
                    {ruletaResult.change > 0 ? '¡Felicidades!' : ruletaResult.change < 0 ? '¡Suerte para la próxima!' : 'Empate'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    {ruletaResult.change > 0 
                      ? `Ganaste ${ruletaResult.label} (+${ruletaResult.change} Pts)` 
                      : ruletaResult.change < 0 
                      ? `Perdiste tu apuesta (${ruletaResult.change} Pts)` 
                      : 'Conservas tu apuesta (+0 Pts)'}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Wheel Graphic */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {/* Outer Glow Circle Ring decoration */}
              <div style={{
                position: 'relative',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                boxShadow: isRuletaSpinning ? '0 0 60px rgba(255, 170, 0, 0.25)' : '0 0 30px rgba(255, 255, 255, 0.05)',
                border: '4px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(10, 5, 20, 0.6)',
                transition: 'all 0.5s ease',
              }}>
                {/* Pointer Arrow Pin */}
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '16px solid transparent',
                  borderRight: '16px solid transparent',
                  borderTop: '28px solid #ff4d4d',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))',
                  zIndex: 10,
                }} />

                {/* Rotating Wheel Canvas/SVG */}
                <svg
                  ref={svgRef}
                  viewBox="0 0 400 400"
                  style={{
                    width: '356px',
                    height: '356px',
                    transform: `rotate(${ruletaRotation}deg)`,
                    transition: 'transform 5s cubic-bezier(0.1, 0.8, 0.1, 1)',
                    display: 'block',
                    transformOrigin: '50% 50%'
                  }}
                >
                  {/* Wheel Sectors */}
                  {RULETA_SECTORS.map((sec, i) => {
                    const angleStart = i * 22.5;
                    const angleEnd = (i + 1) * 22.5;
                    
                    const radStart = (angleStart * Math.PI) / 180;
                    const radEnd = (angleEnd * Math.PI) / 180;
                    
                    const x1 = 200 + 180 * Math.cos(radStart);
                    const y1 = 200 + 180 * Math.sin(radStart);
                    const x2 = 200 + 180 * Math.cos(radEnd);
                    const y2 = 200 + 180 * Math.sin(radEnd);
                    
                    const d = `M 200 200 L ${x1} ${y1} A 180 180 0 0 1 ${x2} ${y2} Z`;
                    
                    const textAngle = angleStart + 11.25;
                    const textRad = (textAngle * Math.PI) / 180;
                    const textX = 200 + 135 * Math.cos(textRad);
                    const textY = 200 + 135 * Math.sin(textRad);
                    
                    return (
                      <g key={i}>
                        <path d={d} fill={sec.color} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                        <text
                          x={textX}
                          y={textY}
                          fill={sec.textColor}
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)', fontFamily: 'sans-serif' }}
                        >
                          {sec.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Inner Decorative Circle */}
                  <circle cx="200" cy="200" r="28" fill="#fff" stroke="#ffaa00" strokeWidth="4" />
                  <circle cx="200" cy="200" r="12" fill="#1a102f" />
                </svg>
              </div>
            </div>
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
                  maxWidth: quizType === 'covers' ? '850px' : '650px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.65), 0 0 35px rgba(255, 0, 110, 0.15)',
                  border: '1px solid rgba(255, 0, 110, 0.22)',
                  maxHeight: '95vh',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600 }}>Pregunta {currentQuestionIdx + 1} de {quizQuestions.length}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ color: quizTimeLeft <= 5 ? '#ff4d4d' : '#fff', fontWeight: 'bold' }}>
                        Tiempo: {quizTimeLeft}s
                      </span>
                      <button
                        onClick={() => setShowExitConfirm(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          padding: '0.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4d'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Salir del minijuego"
                      >
                        ✕
                      </button>
                    </div>
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
                      ) : quizType === 'covers' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '2.5rem', alignItems: 'center', width: '100%', minHeight: '340px' }} className="covers-side-layout">
                          {/* Left Column: Cover Art */}
                          <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                              display: 'inline-block',
                              padding: '12px',
                              background: 'rgba(255, 255, 255, 0.02)',
                              borderRadius: '24px',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              boxShadow: 'var(--shadow)',
                              backdropFilter: 'blur(10px)',
                              width: '100%',
                              maxWidth: '260px'
                            }}>
                              <img 
                                src={quizQuestions[currentQuestionIdx].image || ''} 
                                alt="Video Game Cover" 
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  maxHeight: '340px',
                                  display: 'block',
                                  borderRadius: '16px',
                                  objectFit: 'contain'
                                }} 
                              />
                            </div>
                          </div>

                          {/* Right Column: Question & Options */}
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'left' }}>
                              {quizQuestions[currentQuestionIdx].text}
                            </h2>

                            {/* Opciones en cuadrícula */}
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
                          </div>
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
                               <p style={{ marginTop: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                 {isAudioPlaying ? 'Reproduciendo audio...' : 'Audio detenido'}
                               </p>

                               {/* Speaker and Volume Controller UI */}
                               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                 <button
                                   onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                                   style={{
                                     background: 'none',
                                     color: 'var(--highlight)',
                                     cursor: 'pointer',
                                     display: 'flex',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                     padding: '8px',
                                     borderRadius: '50%',
                                     backgroundColor: 'rgba(255,255,255,0.03)',
                                     border: '1px solid rgba(255,255,255,0.08)',
                                     transition: 'all 0.2s'
                                   }}
                                   title="Ajustar Volumen"
                                 >
                                   {audioVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                 </button>
                                 
                                 {showVolumeSlider && (
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', animation: 'fadeIn 0.2s ease' }}>
                                     <input 
                                       type="range" 
                                       min="0" 
                                       max="1" 
                                       step="0.05" 
                                       value={audioVolume} 
                                       onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                                       style={{
                                         width: '80px',
                                         height: '4px',
                                         accentColor: 'var(--highlight)',
                                         cursor: 'pointer'
                                       }}
                                     />
                                     <span style={{ fontSize: '0.75rem', color: '#fff', minWidth: '28px', textAlign: 'right' }}>
                                       {Math.round(audioVolume * 100)}%
                                     </span>
                                   </div>
                                 )}
                               </div>
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
                          ) : quizType === 'disney' ? (
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
                                  src={quizQuestions[currentQuestionIdx].image || ''} 
                                  alt="Quiz Illustration" 
                                  style={{
                                    height: '180px',
                                    display: 'block',
                                    borderRadius: '16px',
                                    objectFit: 'contain'
                                  }} 
                                />
                              </div>
                              <h2 style={{ marginTop: '1.5rem', fontSize: '1.4rem', fontWeight: 800 }}>{quizQuestions[currentQuestionIdx].text}</h2>
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

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
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
          zIndex: 999999,
          padding: '1.5rem'
        }}>
          <div className="glass" style={{
            maxWidth: '450px',
            width: '100%',
            background: 'rgba(20, 10, 30, 0.98)',
            border: '2px solid #ff4d4d',
            borderRadius: '28px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(255, 77, 77, 0.25)',
            animation: 'scaleIn 0.2s ease-out'
          }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{
              color: '#ff4d4d',
              fontSize: '1.8rem',
              fontWeight: 900,
              margin: '0 0 0.75rem 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              ¿Salir del Desafío?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5, margin: '0 0 2rem 0' }}>
              Si decides salir o abandonar el desafío actual, <strong>perderás la oportunidad de volver a realizarlo hoy</strong> y se registrará como completado con tu puntuación actual de <strong>{userScore} Pts</strong>.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmExitQuiz}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ff4d4d 0%, #ff1a1a 100%)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Sí, abandonar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Abandoned Quiz Alert Modal */}
      {abandonedQuizInfo && (
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
          zIndex: 999999,
          padding: '1.5rem'
        }}>
          <div className="glass" style={{
            maxWidth: '450px',
            width: '100%',
            background: 'rgba(20, 10, 30, 0.98)',
            border: '2px solid #ff4d4d',
            borderRadius: '28px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(255, 77, 77, 0.25)',
            animation: 'scaleIn 0.2s ease-out'
          }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{
              color: '#ff4d4d',
              fontSize: '1.8rem',
              fontWeight: 900,
              margin: '0 0 0.75rem 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Desafío Cancelado
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5, margin: '0 0 2rem 0' }}>
              Se detectó que recargaste o cerraste el minijuego <strong>{
                abandonedQuizInfo === 'overwatch' ? 'Overwatch Quiz' :
                abandonedQuizInfo === 'games' ? 'Videojuegos Trivia' :
                abandonedQuizInfo === 'flags' ? 'Adivina la Bandera' :
                abandonedQuizInfo === 'word_scramble' ? 'Word Scramble' :
                abandonedQuizInfo === 'dbd_perks' ? 'Perks de DBD' :
                abandonedQuizInfo === 'disney' ? 'Personajes Disney' :
                abandonedQuizInfo === 'covers' ? 'Carátulas de Juegos' :
                'Adivina la Canción'
              }</strong>. El desafío ha sido marcado como completado para el día de hoy.
            </p>
            <button
              onClick={() => setAbandonedQuizInfo(null)}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ff4d4d 0%, #ff1a1a 100%)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
