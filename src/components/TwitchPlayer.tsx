import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

interface ChannelInfo {
    login: string;
    displayName: string;
    isLive: boolean;
    title?: string;
    lastVideoId?: string;
    offlineImageURL?: string;
}

const TwitchPlayer = () => {
    const [channel, setChannel] = useState<ChannelInfo>({
        login: 'eviltokkii',
        displayName: 'EvilTokkii',
        isLive: false,
        offlineImageURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/b3c91ade-fa72-4deb-b8e7-8effeef94d1a-channel_offline_image-1920x1080.png'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('https://gql.twitch.tv/gql', {
                    method: 'POST',
                    headers: {
                        'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                user(login: "eviltokkii") {
                                    displayName
                                    offlineImageURL
                                    stream {
                                        id
                                        title
                                        viewersCount
                                        game {
                                            name
                                        }
                                    }
                                    videos(first: 1, type: ARCHIVE) {
                                        edges {
                                            node {
                                                id
                                                title
                                            }
                                        }
                                    }
                                }
                            }
                        `
                    })
                });

                const json = await response.json();
                const user = json?.data?.user;
                if (user) {
                    const stream = user.stream;
                    const lastVideo = user.videos?.edges?.[0]?.node;
                    const displayName = user.displayName || 'EvilTokkii';
                    const offlineImageURL = user.offlineImageURL || 'https://static-cdn.jtvnw.net/jtv_user_pictures/b3c91ade-fa72-4deb-b8e7-8effeef94d1a-channel_offline_image-1920x1080.png';

                    if (stream) {
                        setChannel({
                            login: 'eviltokkii',
                            displayName,
                            isLive: true,
                            title: stream.title,
                            offlineImageURL
                        });
                    } else {
                        setChannel({
                            login: 'eviltokkii',
                            displayName,
                            isLive: false,
                            lastVideoId: lastVideo?.id,
                            title: lastVideo ? `Último stream: ${lastVideo.title}` : undefined,
                            offlineImageURL
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching Twitch status from GQL:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 60000); // 1 minuto de intervalo
        return () => clearInterval(interval);
    }, []);

    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    let twitchUrl = '';
    let showOfflineImage = false;

    if (channel.isLive) {
        twitchUrl = `https://player.twitch.tv/?channel=eviltokkii&parent=${hostname}&parent=tokkii.online&parent=localhost&parent=127.0.0.1&autoplay=true&muted=true`;
    } else {
        showOfflineImage = true;
    }

    if (loading) {
        return (
            <div className="twitch-wrapper" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted)' }}>Cargando reproductor...</p>
            </div>
        );
    }

    return (
        <div className="twitch-wrapper">
            <div className="twitch-grid">
                {/* Lado Izquierdo: Información */}
                <div className="panel panel-in">
                    <div className={`status ${channel.isLive ? 'online' : 'offline'}`}>
                        <span className="dot2"></span>
                        {channel.isLive ? 'ONLINE' : 'OFFLINE'}
                    </div>
                    
                    <h2 className="title" style={{ marginTop: '18px' }}>
                        {channel.displayName} está {channel.isLive ? 'Online!' : 'Offline'}
                    </h2>
                    
                    <p className="sub" style={{ marginTop: '14px' }}>
                        {channel.title || 'Disfruta del stream en directo con la comunidad.'}
                    </p>

                    <div className="actions" style={{ marginTop: '22px' }}>
                        <a
                            href={`https://www.twitch.tv/eviltokkii`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn primary"
                        >
                            <FontAwesomeIcon icon={faTwitch} /> VER EN TWITCH
                        </a>
                    </div>

                    <p className="twitch-autoplay-note" style={{ marginTop: '20px', fontSize: '.8rem', color: 'var(--muted)', opacity: .7 }}>
                        Si el vídeo no carga, asegúrate de haber dado permisos de "Autoplay".
                    </p>
                </div>

                {/* Lado Derecho: Reproductor / Preview */}
                <div className="panel panel-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="player">
                        {showOfflineImage ? (
                            <a
                                href={`https://www.twitch.tv/eviltokkii`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="twitch-offline-container"
                            >
                                <img
                                    src={channel.offlineImageURL || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"}
                                    alt={`${channel.displayName} Offline`}
                                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";
                                    }}
                                />
                            </a>
                        ) : (
                            <iframe
                                src={twitchUrl}
                                allowFullScreen
                                className="twitch-iframe"
                                title={channel.isLive ? "Twitch Live Stream" : "Twitch Last Stream"}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwitchPlayer;