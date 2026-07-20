import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NewsWidget from '../components/NewsWidget';
import TwitchPlayer from '../components/TwitchPlayer';
import MostStreamed from '../components/MostStreamed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch, faInstagram, faTiktok, faXTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabase';
import './Home.Socials.css';
import './Home.css';

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

const Home: React.FC = () => {
    // Mantener estado por compatibilidad con firmas previas
    const [, setActiveNewsBg] = useState<string>('/Imagenes/Carrusel2.jpg');
    const [scoreboard, setScoreboard] = useState<any[]>([]);

    useEffect(() => {
        // Fetch top 10 profiles by points
        const fetchScoreboard = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, points, role')
                .order('points', { ascending: false })
                .limit(10);
            if (!error && data) {
                setScoreboard(data);
            }
        };

        fetchScoreboard();

        // Subscribe to changes on public.profiles table in real-time
        const channel = supabase
            .channel('profiles-realtime-scoreboard')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profiles' },
                () => {
                    fetchScoreboard();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="home-wrapper">
            {/* 1. Sección Hero (Bienvenida) */}
            <section className="section">
                <div className="wrap" style={{ maxWidth: '900px' }}>
                    <article className="hero-main glass" style={{ margin: '0 auto', textAlign: 'center' }}>
                        <div className="eyebrow" style={{ display: 'inline-flex', margin: '0 auto 18px' }}>
                            <span className="dot"></span>Streaming, eventos y comunidad
                        </div>
                        <h1 style={{ margin: '0 auto 16px', maxWidth: 'none' }}>Bienvenido a <span className="grad">EvilTokkii</span></h1>
                        <p style={{ margin: '0 auto 24px', maxWidth: 'none' }}>Descubre una experiencia única llena de eventos y sorpresas con la mejor compañía.</p>
                        <div className="actions" style={{ justifyContent: 'center' }}>
                            <a className="btn primary" href="https://www.twitch.tv/eviltokkii" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faTwitch} /> Ver Twitch
                            </a>
                            <Link className="btn secondary" to="/dinamicas">Explorar noticias</Link>
                        </div>
                        <div className="stats">
                            <div className="stat">
                                <strong>Streamer Chilena</strong>
                                <span>Me gusta jugar, conversar y pasarla bien.</span>
                            </div>
                            <div className="stat">
                                <strong>Mi canal, tu Hogar</strong>
                                <span>Este espacio es seguro y lleno de buena energía.</span>
                            </div>
                            <div className="stat">
                                <strong>Crecemos juntos</strong>
                                <span>Comparte y sé parte de esta linda comunidad.</span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {/* 2. Sección Twitch (Reproductor en Vivo) */}
            <section className="section">
                <div className="wrap">
                    <div className="section-head">
                        <div>
                            <div className="kicker">Estado actual en Twitch</div>
                        </div>
                    </div>
                    <TwitchPlayer />
                </div>
            </section>

            {/* 2.5 Sección Scoreboard (Mayores Puntuadores) */}
            <section className="section">
                <div className="wrap">
                    <div className="section-head" style={{ marginBottom: '20px' }}>
                        <div>
                            <div className="kicker">Mayores puntuadores</div>
                            <h3 className="title" style={{ fontSize: '1.8rem', fontWeight: 800 }}>Marcador en Tiempo Real</h3>
                        </div>
                    </div>
                    
                    <div className="glass" style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        padding: '1.25rem 1.5rem',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {Array.from({ length: 10 }).map((_, index) => {
                            const userScore = scoreboard[index];
                            if (userScore) {
                                return (
                                    <div 
                                        key={userScore.id || index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.65rem 1rem',
                                            borderRadius: '12px',
                                            background: index === 0 ? 'rgba(233,176,255,0.06)' : 'rgba(255,255,255,0.01)',
                                            border: index === 0 ? '1px solid rgba(233,176,255,0.15)' : '1px solid transparent',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ 
                                                fontWeight: 'bold', 
                                                color: index === 0 ? 'var(--highlight)' : index === 1 ? '#b874ec' : index === 2 ? '#f08226' : 'rgba(255,255,255,0.4)',
                                                fontSize: '1rem',
                                                width: '24px'
                                            }}>
                                                #{index + 1}
                                            </span>
                                            {userScore.avatar_url && (
                                                <img 
                                                    src={userScore.avatar_url} 
                                                    alt={userScore.username}
                                                    style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                                                />
                                            )}
                                            <span style={{ fontWeight: 600, color: index === 0 ? '#fff' : 'rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center' }}>
                                                {userScore.username}
                                                {renderBadge(userScore.role)}
                                            </span>
                                        </div>
                                        <span style={{ fontWeight: 'bold', color: 'var(--highlight)' }}>
                                            {userScore.points} Pts
                                        </span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div 
                                        key={`placeholder-${index}`}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.65rem 1rem',
                                            borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.005)',
                                            border: '1px solid transparent',
                                            opacity: 0.4
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ 
                                                fontWeight: 'bold', 
                                                color: 'rgba(255,255,255,0.3)',
                                                fontSize: '1rem',
                                                width: '24px'
                                            }}>
                                                #{index + 1}
                                            </span>
                                            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', fontSize: '0.95rem' }}>
                                                Esperando participante...
                                            </span>
                                        </div>
                                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.95rem' }}>
                                            — Pts
                                        </span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </section>

            {/* 3. Sección Noticias (Noticias Recientes) */}
            <section className="section">
                <div className="wrap">
                    <NewsWidget onActiveNewsChange={setActiveNewsBg} />
                </div>
            </section>

            {/* 4. Sección Lo Más Streameado */}
            <section className="section">
                <div className="wrap">
                    <div className="games-box">
                        <div className="kicker">Catálogo reciente</div>
                        <h2 className="title">Lo stremeado últimamente</h2>
                        <p className="sub">Estos son los mundos que hemos estado explorando juntos. Juegos para reír, competir y, sobre todo, disfrutar de un espacio agradable en la mejor compañía.</p>
                        <div className="actions" style={{ marginTop: '22px' }}>
                            <a 
                                href="https://www.twitch.tv/eviltokkii" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn primary"
                            >
                                <FontAwesomeIcon icon={faGamepad} /> ¡ÚNETE AL PRÓXIMO DIRECTO!
                            </a>
                        </div>
                    </div>
                    <MostStreamed hideHeader={true} />
                </div>
            </section>

            {/* 5. Sección Redes Sociales (Comunidad) */}
            <section className="section">
                <div className="wrap">
                    <div className="social-box">
                        <div className="kicker">Comunidad</div>
                        <h2 className="title">Únete a nuestra comunidad</h2>
                        <p className="sub">Sígueme en mis redes sociales para no perderte ningún directo, evento especial, sorteo o actualización de la comunidad. ¡Te espero!</p>
                        <div className="social-grid">
                            <a
                                href="https://www.twitch.tv/eviltokkii"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social"
                            >
                                <FontAwesomeIcon icon={faTwitch} /> Twitch
                            </a>

                            <a
                                href="https://www.instagram.com/eviltokkii"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social"
                            >
                                <FontAwesomeIcon icon={faInstagram} /> Instagram
                            </a>

                            <a
                                href="https://www.tiktok.com/@eviltokkii"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social"
                            >
                                <FontAwesomeIcon icon={faTiktok} /> TikTok
                            </a>

                            <a
                                href="https://x.com/EvilTokkii"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social"
                            >
                                <FontAwesomeIcon icon={faXTwitter} /> Twitter
                            </a>

                            <a
                                href="https://discord.com/invite/Kxvw4KfSBF"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social"
                            >
                                <FontAwesomeIcon icon={faDiscord} /> Discord
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;