import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sparkles, Trophy, Calendar, CheckCircle } from 'lucide-react';
import './TierList.css';

const renderBadge = (role?: string) => {
  if (!role) return null;
  if (role === 'usuario') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '9px',
        height: '9px',
        borderRadius: '50%',
        backgroundColor: '#94A3B8',
        boxShadow: '0 0 8px rgba(148, 163, 184, 0.7)',
        marginLeft: '6px'
      }} title="Usuario"></span>
    );
  }
  if (role === 'vip') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 6px',
        borderRadius: '6px',
        backgroundColor: 'rgba(255, 0, 115, 0.15)',
        border: '1px solid rgba(255, 0, 115, 0.4)',
        color: '#FF0073',
        fontSize: '0.65rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: '0 0 10px rgba(255, 0, 115, 0.3)',
        marginLeft: '6px',
        lineHeight: 1
      }} title="VIP">VIP</span>
    );
  }
  if (role === 'webmaster') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 6px',
        borderRadius: '6px',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        border: '1px solid rgba(34, 197, 94, 0.4)',
        color: '#4ADE80',
        fontSize: '0.65rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)',
        marginLeft: '6px',
        lineHeight: 1
      }} title="Webmaster">WEB</span>
    );
  }
  if (role === 'streamer') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 6px',
        borderRadius: '6px',
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        color: '#C084FC',
        fontSize: '0.65rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)',
        marginLeft: '6px',
        lineHeight: 1
      }} title="Streamer">STREAMER</span>
    );
  }
  return null;
};

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

      const today = new Date().toISOString().split('T')[0];
      const { data: completionsData } = await supabase
        .from('user_quiz_completions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('completed_date', today);

      if (completionsData) {
        setCompletions(completionsData);
      }

      try {
        const now = new Date();
        const prevMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const prevMonthVal = now.getMonth() === 0 ? 12 : now.getMonth();
        const prevMonthStr = `${prevMonthYear}-${String(prevMonthVal).padStart(2, '0')}`;
        await supabase.rpc('rotate_monthly_leaderboard', { target_year_month: prevMonthStr });
      } catch (e) {
        console.error("Monthly rotation check error:", e);
      }

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
        <div className="glass text-center" style={{ padding: '3rem 2rem', borderRadius: '24px', maxWidth: '450px' }}>
          <Trophy size={48} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Inicia Sesión</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Debes estar registrado para ver las estadísticas de tu perfil y competir en las tablas de clasificación de la comunidad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="wrap" style={{ maxWidth: '900px' }}>
        
        <header className="glass" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '2rem', borderRadius: '24px', marginBottom: '2rem' }}>
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
            <h1 className="header-title" style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, display: 'inline-flex', alignItems: 'center' }}>
              {profile.username}
              {renderBadge(profile.role)}
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Miembro desde: {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div className="controls-bar" style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
            <Trophy size={28} style={{ color: 'var(--highlight)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Puntos del Mes</span>
            <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{profile.points} Pts</strong>
          </div>
          <div className="controls-bar" style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
            <Calendar size={28} style={{ color: '#ff7b00' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Racha Actual</span>
            <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{profile.current_streak || 0} Días</strong>
          </div>
          <div className="controls-bar" style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' }}>
            <CheckCircle size={28} style={{ color: '#00cc88' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Completados Hoy</span>
            <strong style={{ fontSize: '1.6rem', color: '#fff' }}>{completions.length} Trivias</strong>
          </div>
        </div>

        {leaderboards.length > 0 && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px 0' }}>Tablas de Clasificación Históricas</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Consulta el ranking de meses anteriores.</p>
              </div>
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
                        <span style={{ fontWeight: idx === 0 ? 'bold' : 'normal', color: '#fff', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center' }}>
                          {user.username}
                          {renderBadge(user.role)}
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
