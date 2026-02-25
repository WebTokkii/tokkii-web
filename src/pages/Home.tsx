import React from 'react';
import NewsWidget from '../components/NewsWidget';
import MostStreamed from '../components/MostStreamed';
import TwitchPlayer from '../components/TwitchPlayer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch, faInstagram, faTiktok, faXTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import './Home.Socials.css';

const Home: React.FC = () => {
    return (
        <section className="hero fade-in">
            <div className="container">
                <h1 className="hero-title">
                    Bienvenido a <span className="gradient-text">Tokkiixa</span>
                </h1>

                <p className="hero-subtitle">
                    Descubre una experiencia única llena de eventos y sorpresas.
                </p>

                {/* Twitch Video Player Automático */}
                <div className="video-container fade-in" style={{ margin: '3rem auto' }}>
                    <TwitchPlayer />
                </div>

                {/* Social Links Section */}
                <div className="home-socials fade-in">
                    <a
                        href="https://www.twitch.tv/tokkiixa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link twitch"
                    >
                        <FontAwesomeIcon icon={faTwitch} /> <span>Twitch</span>
                    </a>

                    <a
                        href="https://www.instagram.com/tokkixa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link instagram"
                    >
                        <FontAwesomeIcon icon={faInstagram} /> <span>Instagram</span>
                    </a>

                    <a
                        href="https://www.tiktok.com/@tokkixa_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link tiktok"
                    >
                        <FontAwesomeIcon icon={faTiktok} /> <span>TikTok</span>
                    </a>

                    <a
                        href="https://x.com/Tokkiixa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link x-twitter"
                    >
                        <FontAwesomeIcon icon={faXTwitter} /> <span>Twitter</span>
                    </a>

                    <a
                        href="https://discord.com/invite/Kxvw4KfSBF"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link discord"
                    >
                        <FontAwesomeIcon icon={faDiscord} /> <span>Discord</span>
                    </a>
                </div>

                <NewsWidget />
                <MostStreamed />
            </div>
        </section>
    );
};

export default Home;