import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
  return null;
};

const Navbar: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser.id, currentUser);
            } else {
                setProfile(null);
            }
        });

        const handlePointsUpdate = () => {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    fetchProfile(session.user.id, session.user);
                }
            });
        };
        window.addEventListener('points-updated', handlePointsUpdate);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('points-updated', handlePointsUpdate);
        };
    }, []);

    const fetchProfile = async (userId: string, authUser?: any) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (!error && data) {
            let currentProfile = data;
            if (authUser) {
                const metaAvatar = authUser.user_metadata?.avatar_url;
                const metaUsername = authUser.user_metadata?.preferred_username || authUser.user_metadata?.name || authUser.user_metadata?.full_name;

                const needsUpdate = 
                    (metaAvatar && data.avatar_url !== metaAvatar) || 
                    (metaUsername && data.username !== metaUsername);

                if (needsUpdate) {
                    const updates: any = {};
                    if (metaAvatar) updates.avatar_url = metaAvatar;
                    if (metaUsername) updates.username = metaUsername;

                    const { data: updatedData } = await supabase
                        .from('profiles')
                        .update(updates)
                        .eq('id', userId)
                        .select()
                        .single();

                    if (updatedData) {
                        currentProfile = updatedData;
                    }
                }
            }
            setProfile(currentProfile);
        }
    };

    const handleLoginWithTwitch = async () => {
        setShowLoginModal(false);
        await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo: window.location.origin
            }
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <nav className="navbar glass">
            <div className="wrap nav-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="logo-container">
                    <img src={`${import.meta.env.VITE_R2_BASE_URL}/logo.png`} alt="Logo" className="logo-img" />
                    <span className="logo-text">EvilTokkii</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <ul className="nav-links">
                        <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink></li>
                        <li><NavLink to="/noticias" className={({ isActive }) => (isActive ? 'active' : '')}>Noticias</NavLink></li>
                        <li><NavLink to="/dinamicas" className={({ isActive }) => (isActive ? 'active' : '')}>Dinámicas</NavLink></li>
                        <li><NavLink to="/sobre" className={({ isActive }) => (isActive ? 'active' : '')}>Sobre EvilTokkii</NavLink></li>
                        <li><NavLink to="/minijuegos" className={({ isActive }) => (isActive ? 'active' : '')}>Minijuegos</NavLink></li>
                        <li><NavLink to="/tierlists" className={({ isActive }) => (isActive ? 'active' : '')}>Tierlists</NavLink></li>
                        <li><NavLink to="/ayuda" className={({ isActive }) => (isActive ? 'active' : '')}>Ayuda</NavLink></li>
                    </ul>
                    <div className="auth-nav-section"
                         style={{ 
                             borderLeft: '1px solid rgba(255,255,255,0.1)', 
                             paddingLeft: '20px', 
                             position: 'relative',
                             display: 'flex',
                             alignItems: 'center',
                             paddingTop: '8px',
                             paddingBottom: '8px',
                             cursor: 'pointer'
                         }}
                         onMouseEnter={() => setShowUserMenu(true)}
                         onMouseLeave={() => setShowUserMenu(false)}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
                                        {profile?.username || user.user_metadata?.preferred_username || user.user_metadata?.name}
                                        {renderBadge(profile?.role)}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>&bull;</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--highlight)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                        {profile?.points ?? 0} Pts
                                    </span>
                                </div>
                                {(profile?.avatar_url || user.user_metadata?.avatar_url) && (
                                    <img 
                                        src={profile?.avatar_url || user.user_metadata.avatar_url} 
                                        alt="Avatar" 
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--highlight)' }} 
                                    />
                                )}

                                {/* Hover Submenu */}
                                {showUserMenu && (
                                    <div className="glass" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        width: '180px',
                                        borderRadius: '12px',
                                        background: 'rgba(18, 11, 29, 0.98)',
                                        border: '1px solid rgba(233,176,255,0.15)',
                                        padding: '0.5rem',
                                        zIndex: 999999,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        marginTop: '-5px'
                                    }}>
                                        <Link 
                                            to="/perfil"
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '8px',
                                                color: '#fff',
                                                textDecoration: 'none',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                textAlign: 'left',
                                                transition: 'background 0.2s ease',
                                                background: 'rgba(255,255,255,0.02)'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        >
                                            📊 Estadísticas
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '8px',
                                                color: '#ff4d4d',
                                                background: 'rgba(255,77,77,0.02)',
                                                border: '1px solid rgba(255,77,77,0.1)',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,77,77,0.1)';
                                                e.currentTarget.style.borderColor = 'rgba(255,77,77,0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,77,77,0.02)';
                                                e.currentTarget.style.borderColor = 'rgba(255,77,77,0.1)';
                                            }}
                                        >
                                            🔌 Desconectar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button 
                                onClick={() => setShowLoginModal(true)} 
                                className="btn secondary" 
                                style={{
                                    padding: '0.45rem 1.25rem',
                                    minHeight: 'auto',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    borderColor: 'rgba(233, 176, 255, 0.08)'
                                }}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Twitch Login Modal Dialog */}
            {showLoginModal && !user && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(5, 3, 8, 0.75)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                }}>
                    <div className="controls-bar" style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        padding: '2.5rem 2rem', 
                        gap: '1.5rem', 
                        maxWidth: '420px', 
                        width: '90%', 
                        textAlign: 'center', 
                        position: 'relative',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(233, 176, 255, 0.08)',
                        borderRadius: '24px',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                    }}>
                        
                        <button 
                            onClick={() => setShowLoginModal(false)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '30px',
                                height: '30px'
                            }}
                        >
                            &times;
                        </button>

                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: 0 }}>Inicia Sesión</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                            Conéctate con tu cuenta de Twitch para registrar tu usuario del canal y competir por los mejores puestos del marcador.
                        </p>
                        
                        <button 
                            onClick={handleLoginWithTwitch}
                            className="btn primary"
                            style={{ 
                                width: '100%', 
                                justifyContent: 'center',
                                padding: '0.8rem',
                                fontSize: '1rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #9146FF 0%, #6441A5 100%)',
                                border: 'none',
                                boxShadow: '0 8px 20px rgba(145, 70, 255, 0.25)'
                            }}
                        >
                            Conectar con Twitch
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
