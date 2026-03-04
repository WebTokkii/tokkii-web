import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="footer" style={{ padding: '1.2rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>
                    &copy; 2026 Tokkiixa.
                </p>

                <div className="socials" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', fontSize: '0.85rem' }}>
                    <a href="https://www.twitch.tv/tokkiixa" target="_blank" rel="noopener noreferrer">Twitch</a>
                    <a href="https://www.instagram.com/tokkixa" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://www.tiktok.com/@tokkixa_" target="_blank" rel="noopener noreferrer">TikTok</a>
                    <a href="https://x.com/Tokkiixa" target="_blank" rel="noopener noreferrer">X</a>
                    <a href="https://discord.com/invite/Kxvw4KfSBF" target="_blank" rel="noopener noreferrer">Discord</a>
                </div>

                <Link to="/politicas" style={{
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    transition: 'all 0.3s ease'
                }} className="legal-link-hover">
                    Políticas y Privacidad
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
