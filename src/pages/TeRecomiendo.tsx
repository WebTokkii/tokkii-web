import React from 'react';

const TeRecomiendo: React.FC = () => {
    return (
        <section className="section fade-in">
            <div className="container">
                <h2 className="section-title text-center">Streamers Amigos 💜</h2>
                <div className="section-description">
                    <p>En este espacio quiero destacar a personas increíbles que no solo crean contenido, sino que también ponen corazón en cada directo. Mis amigos streamers son parte fundamental de esta aventura: talento, esfuerzo y dedicación que se nota en cada transmisión.</p>
                    <p>Cada uno tiene su propio estilo, su propia energía y una comunidad hermosa que los acompaña. Algunos te harán reír, otros te sorprenderán con jugadas épicas, y otros simplemente te harán sentir como en casa.</p>
                    <p>Si estás buscando nuevos canales para descubrir, pasar un buen rato y apoyar a creadores apasionados, te invito a darles una oportunidad. Estoy segura de que encontrarás un lugar donde encajar. 💜✨</p>
                    <p>Apoyar a otros streamers es apoyar sueños, constancia y muchas horas de dedicación detrás de cámaras. Y eso siempre vale la pena. 🚀🎥</p>
                </div>
                <h2 className="subtitle-grid">Te los recomiendo, Dales una Oportunidad</h2>
                <div className="grid grid-2">
                    <div className="card streamer-horizontal glass glow-hover">
                        <div className="streamer-image-box">
                            <img src={`${import.meta.env.VITE_R2_BASE_URL}/sanaedeko.png`} alt="Sanaedeko" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="streamer-info">
                            <h3>Sanaedeko</h3>
                            <p>Buenas, gracias por pasarte y espero que te diviertas con este random 🗿</p>
                            <a
                                href="https://www.twitch.tv/sanaedeko"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary glow btn-twitch"
                            >
                                Twitch
                            </a>
                        </div>
                    </div>

                    <div className="card streamer-horizontal glass glow-hover">
                        <div className="streamer-image-box">
                            <img src={`${import.meta.env.VITE_R2_BASE_URL}/yutaneox.png`} alt="YutaNeoX" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="streamer-info">
                            <h3>YutaNeoX</h3>
                            <p>Soy Yutaneox, tu streamer chileno de confianza para pasarla increíble. 😌🔥</p>
                            <a
                                href="https://www.twitch.tv/yutaneox"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary glow btn-twitch"
                            >
                                Twitch
                            </a>
                        </div>
                    </div>

                    <div className="card streamer-horizontal glass glow-hover">
                        <div className="streamer-image-box">
                            <img src={`${import.meta.env.VITE_R2_BASE_URL}/ilaleli.png`} alt="Ilaleli" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="streamer-info">
                            <h3>Ilaleli</h3>
                            <p>vtuber con dislexia adicta a Ow2 (y mil juegos más)💛🪶</p>
                            <a
                                href="https://www.twitch.tv/ilalelivt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary glow btn-twitch"
                            >
                                Twitch
                            </a>
                        </div>
                    </div>

                    <div className="card streamer-horizontal glass glow-hover">
                        <div className="streamer-image-box">
                            <img src={`${import.meta.env.VITE_R2_BASE_URL}/morgiana.png`} alt="Morgianna13" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="streamer-info">
                            <h3>Morgianna13</h3>
                            <p>Soy Euge, Juego OW, DBD y otros. Las manqueadas y las risas no faltan. 🎮💜</p>
                            <a
                                href="https://www.twitch.tv/morgianna13"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary glow btn-twitch"
                            >
                                Twitch
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeRecomiendo;
