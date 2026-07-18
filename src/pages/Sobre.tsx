import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faGamepad, faCommentDots, faStar, faCrown } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

const Sobre: React.FC = () => {
    // Valores de difuminado final ajustados por el usuario
    const maskStyleImg1 = {
        maskImage: 'linear-gradient(to bottom, transparent, black 21%, black 50%, transparent), linear-gradient(to right, transparent, black 35%, black 56%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 21%, black 50%, transparent), linear-gradient(to right, transparent, black 35%, black 56%, transparent)',
        maskComposite: 'intersect' as const,
        WebkitMaskComposite: 'source-in' as const
    };

    const maskStyleImg2 = {
        maskImage: 'linear-gradient(to bottom, transparent, black 23%, black 83%, transparent), linear-gradient(to right, transparent, black 22%, black 71%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 23%, black 83%, transparent), linear-gradient(to right, transparent, black 22%, black 71%, transparent)',
        maskComposite: 'intersect' as const,
        WebkitMaskComposite: 'source-in' as const
    };

    const maskStyleImg3 = {
        maskImage: 'linear-gradient(to bottom, transparent, black 17%, black 58%, transparent), linear-gradient(to right, transparent, black 32%, black 69%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 17%, black 58%, transparent), linear-gradient(to right, transparent, black 32%, black 69%, transparent)',
        maskComposite: 'intersect' as const,
        WebkitMaskComposite: 'source-in' as const
    };

    return (
        <div className="sobre-page fade-in" style={{ width: '100%', position: 'relative' }}>
            {/* 1. Sección Sobre EvilTokkii */}
            <section className="home-section juegos-section-gradient" style={{ minHeight: 'auto', padding: '5rem 0', position: 'relative' }}>
                <div className="section-overlay" style={{ background: 'radial-gradient(circle, rgba(15, 2, 26, 0.35) 0%, rgba(15, 2, 26, 0.85) 100%)' }}></div>
                
                <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3rem',
                            flexDirection: 'row',
                            flexWrap: 'wrap-reverse'
                        }}>
                            {/* Columna Texto */}
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                                    <div>
                                        <div className="kicker">Conóceme</div>
                                        <h2 className="title">Sobre EvilTokkii</h2>
                                    </div>
                                </div>

                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    textAlign: 'left',
                                    alignItems: 'flex-start'
                                }}>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.8', margin: 0 }}>
                                        ¡Hola! Soy EvilTokkii, streamer chilena y amante de los videojuegos. <FontAwesomeIcon icon={faHeart} style={{ color: '#ffffff', filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.6))' }} /> Desde que descubrí el mundo del streaming en Twitch, encontré un espacio perfecto para compartir lo que más me apasiona: jugar, reír y conectar con personas que enjoyen el gaming tanto como yo.
                                    </p>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.8', margin: 0 }}>
                                        En mis directos suelo jugar Overwatch, donde me encanta vivir cada partida con intensidad, celebrar las buenas jugadas y también reírme de los fails. Para mí, lo importante no es solo ganar, sino disfrutar el proceso y compartir ese momento con la comunidad.
                                    </p>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.8', margin: 0 }}>
                                        Me gusta mantener un ambiente cercano, relajado y lleno de buena energía. Aquí siempre hay espacio para conversar, pasar un buen rato y desconectarse de la rutina. Más que un canal, quiero que sea un lugar donde todos se sientan cómodos y parte de algo. <FontAwesomeIcon icon={faCommentDots} style={{ color: '#ffffff', filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.6))' }} />
                                    </p>
                                    <p style={{ fontSize: '1.15rem', color: 'var(--secondary)', fontWeight: 'bold', margin: '0.5rem 0 0 0', textShadow: '0 0 10px rgba(255, 0, 110, 0.4)' }}>
                                        Gracias por estar aquí y ser parte de esta aventura gamer. <FontAwesomeIcon icon={faGamepad} style={{ color: '#ffffff', filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.6))' }} /> <FontAwesomeIcon icon={faStar} style={{ color: '#ffffff', filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.6))' }} />
                                    </p>
                                </div>
                            </div>
                            
                            {/* Columna Imagen (Simétrica) */}
                            <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img 
                                    src="/Imagenes/sobre_tokkii_2.png" 
                                    alt="EvilTokkii" 
                                    style={{
                                        ...maskStyleImg1,
                                        width: '100%',
                                        maxWidth: '440px',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 0 25px rgba(255, 0, 110, 0.2))',
                                        transform: 'scale(1.15)',
                                        transformOrigin: 'center'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Sección Moderadores */}
            <section className="home-section redes-section-gradient" style={{ minHeight: 'auto', padding: '5rem 0', position: 'relative' }}>
                <div className="section-overlay" style={{ background: 'radial-gradient(circle, rgba(15, 2, 26, 0.35) 0%, rgba(15, 2, 26, 0.85) 100%)' }}></div>
                
                <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3rem',
                            flexDirection: 'row-reverse',
                            flexWrap: 'wrap-reverse'
                        }}>
                            {/* Columna Texto */}
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                                    <div>
                                        <div className="kicker">Comunidad</div>
                                        <h2 className="title">Equipo de Moderación</h2>
                                    </div>
                                </div>

                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    textAlign: 'left',
                                    alignItems: 'flex-start'
                                }}>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.7', margin: 0 }}>
                                        Detrás de cada stream hay un equipo increíble que hace que todo funcione como debe. En Twitch, el chat es una parte esencial de la experiencia, y eso no sería posible sin quienes lo cuidan día a día.
                                    </p>
                                    
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '0.6rem 0.8rem',
                                        padding: '0.5rem 0',
                                        width: '100%',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        margin: '0.5rem 0',
                                        overflow: 'visible'
                                    }}>
                                        <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.95rem)', fontWeight: 'bold', color: '#ffb703', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                            <FontAwesomeIcon icon={faCrown} /> REQUIEM373 (JEFE)
                                        </span>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>|</span>
                                        <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.95rem)', color: '#fff', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                            <img src="/Imagenes/Espada_Twitch_Verde.png" alt="Espada Mod" style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} /> NPEZE
                                        </span>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>|</span>
                                        <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.95rem)', color: '#fff', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                            <img src="/Imagenes/Espada_Twitch_Verde.png" alt="Espada Mod" style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} /> ESPEEEOON
                                        </span>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>|</span>
                                        <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.95rem)', color: '#fff', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                            <img src="/Imagenes/Espada_Twitch_Verde.png" alt="Espada Mod" style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} /> NAOFUMIIVT
                                        </span>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>|</span>
                                        <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.95rem)', color: '#fff', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                            <img src="/Imagenes/Espada_Twitch_Verde.png" alt="Espada Mod" style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} /> THEDRAGONBLK
                                        </span>
                                    </div>

                                    <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.7', margin: 0 }}>
                                        Cada uno cumple un rol fundamental manteniendo un ambiente seguro, respetuoso y amigable. Siempre atentos al chat, apoyando durante los directos y asegurándose de que la comunidad sea un espacio donde todos puedan disfrutar sin preocupaciones.
                                    </p>
                                    <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.7', margin: 0 }}>
                                        Ser mod no es solo tener una espada junto al nombre; es compromiso, responsibility y mucho cariño por la comunidad. Gracias a su trabajo, este espacio sigue creciendo con buena energía, respeto y compañerismo. <FontAwesomeIcon icon={faHeart} style={{ color: '#ffffff', filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.6))' }} />
                                    </p>
                                </div>
                            </div>
                            
                            {/* Columna Imagen (Simétrica) */}
                            <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img 
                                    src="/Imagenes/sobre_tokkii_1.png" 
                                    alt="Moderadores" 
                                    style={{
                                        ...maskStyleImg2,
                                        width: '100%',
                                        maxWidth: '440px',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 0 25px rgba(255, 0, 110, 0.2))',
                                        transform: 'scale(1.15)',
                                        transformOrigin: 'center'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Sección Agradecimiento */}
            <section className="home-section twitch-section-gradient" style={{ minHeight: 'auto', padding: '5rem 0', position: 'relative' }}>
                <div className="section-overlay" style={{ background: 'radial-gradient(circle, rgba(15, 2, 26, 0.35) 0%, rgba(15, 2, 26, 0.85) 100%)' }}></div>
                
                <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3rem',
                            flexDirection: 'row',
                            flexWrap: 'wrap-reverse'
                        }}>
                            {/* Columna Texto */}
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#fff', fontWeight: '500' }}>
                                    Este canal es un proyecto hecho con muchísimo amor y dedicación.<br />
                                    Cada directo y cada idea existen gracias a ustedes.
                                </p>
                                <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#fff', fontWeight: '500' }}>
                                    Hoy más que nunca necesitamos su apoyo para seguir creciendo y trayéndoles cosas bonitas y entretenidas.
                                </p>
                                <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#fff', fontWeight: 'bold', margin: 0 }}>
                                    Gracias por estar, por acompañar y por creer en este espacio.<br />
                                    <span style={{ fontSize: '1.6rem', display: 'inline-block', marginTop: '1rem', color: 'var(--secondary)', fontWeight: 'bold', textShadow: '0 0 15px rgba(255, 0, 110, 0.45)' }}>EvilTokkii también es de ustedes &lt;3</span>
                                </p>
                            </div>

                            {/* Columna Imagen (Simétrica) */}
                            <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img 
                                    src="/Imagenes/sobre_tokkii_3.png" 
                                    alt="Agradecimiento" 
                                    style={{
                                        ...maskStyleImg3,
                                        width: '100%',
                                        maxWidth: '440px',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 0 25px rgba(255, 0, 110, 0.2))',
                                        transform: 'scale(1.15)',
                                        transformOrigin: 'center'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Sobre;
