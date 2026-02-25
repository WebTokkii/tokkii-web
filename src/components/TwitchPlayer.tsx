import { useState, useEffect } from 'react';

const TwitchPlayer = () => {
    const [status, setStatus] = useState<{ isLive: boolean; lastVideoId?: string; title?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/twitch-status');
                const data = await response.json();
                setStatus(data);
            } catch (error) {
                console.error('Error fetching Twitch status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

    let twitchUrl = '';

    if (status?.isLive) {
        // Si está en vivo, usamos el canal
        twitchUrl = `https://player.twitch.tv/?channel=tokkiixa&parent=${hostname}&parent=localhost&parent=127.0.0.1&autoplay=true&muted=true`;
    } else if (status?.lastVideoId) {
        // Si está offline, usamos el último video (VOD)
        twitchUrl = `https://player.twitch.tv/?video=${status.lastVideoId}&parent=${hostname}&parent=localhost&parent=127.0.0.1&autoplay=true&muted=true`;
    } else {
        // Fallback al canal por si acaso
        twitchUrl = `https://player.twitch.tv/?channel=tokkiixa&parent=${hostname}&parent=localhost&parent=127.0.0.1&autoplay=true&muted=true`;
    }

    if (loading) {
        return (
            <div className="twitch-container" style={{ width: '100%', maxWidth: '900px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Cargando reproductor...</p>
            </div>
        );
    }

    return (
        <div className="twitch-container" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <div
                className="glass"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '2rem',
                    padding: '1.5rem',
                    borderRadius: '24px',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                {/* Lado Izquierdo: Información y Botón */}
                <div style={{ flex: '0 0 320px', textAlign: 'left' }}>
                    <div style={{ marginBottom: '0.6rem' }}>
                        {status?.isLive ? (
                            <span style={{
                                background: 'transparent',
                                color: '#10b981', // Verde esmeralda para LIVE
                                border: '1px solid #10b981',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                boxShadow: '0 0 8px rgba(16, 185, 129, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center'
                            }}>
                                🟢 LIVE
                            </span>
                        ) : (
                            <span style={{
                                background: 'transparent',
                                color: '#ef4444', // Rojo para OFFLINE
                                border: '1px solid #ef4444',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                boxShadow: '0 0 8px rgba(239, 68, 68, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center'
                            }}>
                                🔴 OFFLINE
                            </span>
                        )}
                    </div>

                    <h2 style={{
                        color: '#ff4b4b',
                        margin: '0',
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        lineHeight: '1.2',
                        letterSpacing: '0.5px',
                        textShadow: '0 0 10px rgba(255, 75, 75, 0.4)'
                    }}>
                        {status?.isLive ? 'Tokkiixa esta en directo' : 'Tokkiixa esta offline'}
                    </h2>

                    {status?.title && (
                        <p style={{
                            color: 'white',
                            fontSize: '0.85rem',
                            margin: '0.5rem 0 1.5rem 0',
                            opacity: 0.7,
                            maxWidth: '300px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: '400',
                            fontStyle: 'italic'
                        }} title={status.title}>
                            {status.title}
                        </p>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <a
                            href="https://www.twitch.tv/tokkiixa"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                padding: '0.6rem 1.4rem',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                borderRadius: '50px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                color: '#9146ff',
                                backgroundColor: 'transparent',
                                border: '1.5px solid #9146ff',
                                boxShadow: '0 0 10px rgba(145, 70, 255, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            className="twitch-btn-hollow"
                        >
                            🔊 VER EN TWITCH
                        </a>

                        <p style={{
                            marginTop: '1.2rem',
                            color: '#fbbf24', // Amarillo cálido (Amber)
                            fontSize: '0.85rem',
                            opacity: 1,
                            lineHeight: '1.5',
                            maxWidth: '300px',
                            fontWeight: '600',
                            textShadow: '0 0 5px rgba(0,0,0,0.5)'
                        }}>
                            Si el vídeo no carga, asegúrate de haber dado permisos de "Autoplay".
                        </p>
                    </div>
                </div>

                {/* Lado Derecho: Reproductor de Video */}
                <div style={{ flex: '1', width: '100%', maxWidth: '550px' }}>
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '56.25%',
                            background: '#000',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <iframe
                            src={twitchUrl}
                            allowFullScreen
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            title={status?.isLive ? "Twitch Live Stream" : "Twitch Last Stream"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwitchPlayer;