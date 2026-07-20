import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sparkles, Trophy, Calendar, CheckCircle } from 'lucide-react';
import './TierList.css';

export default function Perfil() {
  const [profile, setProfile] = useState<any>(null);
  const [completions, setCompletions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboards, setLeaderboards] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        let currentProfile = profileData;
        const authUser = session.user;
        const metaAvatar = authUser.user_metadata?.avatar_url;
        const metaUsername = authUser.user_metadata?.preferred_username || authUser.user_metadata?.name || authUser.user_metadata?.full_name;

        const needsUpdate = 
          (metaAvatar && profileData.avatar_url !== metaAvatar) || 
          (metaUsername && profileData.username !== metaUsername);

        if (needsUpdate) {
          const updates: any = {};
          if (metaAvatar) updates.avatar_url = metaAvatar;
          if (metaUsername) updates.username = metaUsername;

          const { data: updatedData } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', session.user.id)
            .select()
            .single();

          if (updatedData) {
            currentProfile = updatedData;
            window.dispatchEvent(new Event('points-updated'));
          }
        }
        setProfile(currentProfile);
      }

      // Fetch completions for today
      const today = new Date().toISOString().split('T')[0];
      const { data: completionsData } = await supabase
        .from('user_quiz_completions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('completed_date', today);

      if (completionsData) {
        setCompletions(completionsData);
      }

      // Lazy monthly leaderboard rotation logic
      try {
        const now = new Date();
        const prevMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const prevMonthVal = now.getMonth() === 0 ? 12 : now.getMonth();
        const prevMonthStr = `${prevMonthYear}-${String(prevMonthVal).padStart(2, '0')}`;

        // Call database RPC to archive previous month points if not already archived
        await supabase.rpc('rotate_monthly_leaderboard', { target_year_month: prevMonthStr });
      } catch (e) {
        console.error("Monthly rotation check error:", e);
      }

      // Fetch monthly leaderboards history
      const { data: boards } = await supabase
        .from('monthly_leaderboards')
        .select('*')
        .order('year_month', { ascending: false });

      if (boards) {
        setLeaderboards(boards);
        if (boards.length > 0) {
          setSelectedMonth(boards[0].year_month);
        }
      }

      setLoading(false);
    };

    fetchProfileAndStats();
  }, []);

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Cargando estadísticas de perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="controls-bar" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Inicia Sesión</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Debes conectar tu cuenta de Twitch para ver tu perfil de estadísticas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Perfil */}
        <header className="header-banner" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', textAlign: 'left', position: 'relative' }}>
          {profile.avatar_url && (
            <img 
              src={profile.avatar_url} 
              alt="Avatar" 
              style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid var(--highlight)', display: 'block', boxShadow: '0 0 20px rgba(233,176,255,0.2)' }} 
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="header-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
              <Sparkles size={12} />
              Perfil de Usuario
            </span>
            <h1 className="header-title" style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>{profile.username}</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Miembro desde: {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div className="controls-bar" style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
            <Trophy size={28} style={{ color: 'var(--highlight)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Puntos del Mes</span>
            <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{profile.points} Pts</strong>
          </div>
          <div className="controls-bar" style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '1.8rem', lineHeight: '28px' }}>🔥</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Racha de Días</span>
            <strong style={{ fontSize: '1.6rem', color: '#ffaa00' }}>{profile.current_streak || 0} {profile.current_streak === 1 ? 'Día' : 'Días'}</strong>
          </div>
          <div className="controls-bar" style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
            <Calendar size={28} style={{ color: '#33ecc0' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Quizzes Hoy</span>
            <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{completions.length}/5</strong>
          </div>
        </div>

        {/* Actividades del día */}
        <div className="controls-bar" style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>Historial de Hoy</h3>
          
          {completions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No has completado desafíos el día de hoy. ¡Ve a la pestaña Minijuegos para empezar!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {completions.map((completion: any) => (
                <div 
                  key={completion.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                    <CheckCircle size={16} style={{ color: '#33ecc0', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {completion.quiz_type === 'overwatch' ? 'Overwatch Quiz' : completion.quiz_type === 'games' ? 'Videojuegos Trivia' : completion.quiz_type === 'flags' ? 'Adivina la Bandera' : completion.quiz_type === 'dbd_perks' ? 'Perks de Dead by Daylight' : 'Word Scramble'}
                    </span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: 'var(--highlight)', whiteSpace: 'nowrap', flexShrink: 0 }}>+{completion.score} Pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial Mensual - Top 10 */}
        {leaderboards.length > 0 && (
          <div className="controls-bar" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>Templo de la Fama</h3>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {leaderboards.map((b) => (
                  <option key={b.year_month} value={b.year_month} style={{ background: '#120b1d' }}>
                    Mes: {b.year_month}
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const currentBoard = leaderboards.find(b => b.year_month === selectedMonth);
              if (!currentBoard) return null;
              const data = Array.isArray(currentBoard.leaderboard_data) ? currentBoard.leaderboard_data : [];
              if (data.length === 0) return <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No hay datos para este mes.</p>;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '0.5rem' }}>
                  {data.slice(0, 10).map((user: any, idx: number) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.8rem 1rem',
                        background: idx === 0 
                          ? 'rgba(255, 170, 0, 0.05)' 
                          : idx === 1 
                            ? 'rgba(255, 255, 255, 0.02)' 
                            : 'rgba(255, 255, 255, 0.01)',
                        borderRadius: '14px',
                        border: idx === 0 
                          ? '1px solid rgba(255, 170, 0, 0.2)' 
                          : '1px solid rgba(255, 255, 255, 0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ 
                          fontSize: '1rem', 
                          fontWeight: 'bold', 
                          color: idx === 0 ? '#ffaa00' : idx === 1 ? '#cccccc' : idx === 2 ? '#b08d57' : 'var(--text-muted)',
                          width: '24px'
                        }}>
                          #{idx + 1}
                        </span>
                        {user.avatar_url && (
                          <img 
                            src={user.avatar_url} 
                            alt="Avatar" 
                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} 
                          />
                        )}
                        <span style={{ fontWeight: idx === 0 ? 'bold' : 'normal', color: '#fff', fontSize: '0.95rem' }}>
                          {user.username}
                        </span>
                      </div>
                      <span style={{ fontWeight: 'bold', color: idx === 0 ? '#ffaa00' : 'var(--text-muted)' }}>
                        {user.points} Pts
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
}
