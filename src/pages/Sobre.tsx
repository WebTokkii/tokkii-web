import React from 'react';
import Carousel from '../components/Carousel';

const Sobre: React.FC = () => {
    return (
        <div className="sobre-page">
            <section className="section section-split fade-in">
                <div className="container split-container">
                    <div className="split-content">
                        <h2 className="section-title">Sobre EvilTokkii</h2>
                        <p>¡Hola! Soy EvilTokkii, streamer chilena y amante de los videojuegos. 💜 Desde que descubrí el mundo del streaming en Twitch, encontré un espacio perfecto para compartir lo que más me apasiona: jugar, reír y conectar con personas que disfrutan el gaming tanto como yo.</p>
                        <p>En mis directos suelo jugar Overwatch, donde me encanta vivir cada partida con intensidad, celebrar las buenas jugadas y también reírme de los fails. Para mí, lo importante no es solo ganar, sino disfrutar el proceso y compartir ese momento con la comunidad.</p>
                        <p>Me gusta mantener un ambiente cercano, relajado y lleno de buena energía. Aquí siempre hay espacio para conversar, pasar un buen rato y desconectarse de la rutina. Más que un canal, quiero que sea un lugar donde todos se sientan cómodos y parte de algo. 🐰💬</p>
                        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Gracias por estar aquí y ser parte de esta aventura gamer. 🎮💫</p>
                    </div>
                    <div className="split-image">
                        <img
                            src={`${import.meta.env.VITE_R2_BASE_URL}/tokkii_sit.png`}
                            alt="Tokkii Sit"
                            style={{
                                maxWidth: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                zIndex: 2,
                                filter: 'drop-shadow(0 0 20px rgba(157, 78, 221, 0.3))'
                            }}
                        />
                    </div>
                </div>
            </section>

            <Carousel />

            <section className="section section-split fade-in">
                <div className="container split-container reverse">
                    <div className="split-content">
                        <h2 className="section-title">Nuestro Equipo de Moderación</h2>
                        <p>Detrás de cada stream hay un equipo increíble que hace que todo funcione como debe. En Twitch, el chat es una parte esencial de la experiencia, y eso no sería posible sin quienes lo cuidan día a día.</p>
                        <p style={{ fontWeight: '600' }}>
                            👑 ZAALUZ – Jefa de Mods<br />
                            ✨ ESPEEEOON<br />
                            ✨ REQUIEM373<br />
                            ✨ SANAEDEKO<br />
                            ✨ Naofumiivt
                        </p>
                        <p>Cada uno cumple un rol fundamental manteniendo un ambiente seguro, respetuoso y amigable. Siempre atentos al chat, apoyando durante los directos y asegurándose de que la comunidad sea un espacio donde todos puedan disfrutar sin preocupaciones.</p>
                        <p>Ser mod no es solo tener una espada junto al nombre; es compromiso, responsabilidad y mucho cariño por la comunidad. Gracias a su trabajo, este espacio sigue creciendo con buena energía, respeto y compañerismo.💜</p>
                    </div>
                    <div className="split-image">
                        <img
                            src={`${import.meta.env.VITE_R2_BASE_URL}/tokkii_seria.png`}
                            alt="Tokkii Seria"
                            style={{
                                maxWidth: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                zIndex: 2,
                                filter: 'drop-shadow(0 0 20px rgba(157, 78, 221, 0.3))'
                            }}
                        />
                    </div>
                </div>
            </section>
            <section className="section fade-in" style={{ padding: '0 0 100px 0' }}>
                <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
                    <div className="glass" style={{ padding: '3rem', borderRadius: '32px', background: 'rgba(157, 78, 221, 0.05)', border: '1px solid rgba(157, 78, 221, 0.2)' }}>
                        <p style={{ fontSize: '1.4rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#fff' }}>
                            Este canal es un proyecto hecho con muchísimo amor y dedicación.<br />
                            Cada directo y cada idea existen gracias a ustedes.
                        </p>
                        <p style={{ fontSize: '1.4rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#fff' }}>
                            Hoy más que nunca necesitamos su apoyo para seguir creciendo y trayéndoles cosas bonitas y entretenidas.
                        </p>
                        <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: '#fff', fontWeight: 'bold' }}>
                            Gracias por estar, por acompañar y por creer en este espacio.<br />
                            <span className="gradient-text" style={{ fontSize: '1.8rem' }}>EvilTokkii también es de ustedes 💜</span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Sobre;
