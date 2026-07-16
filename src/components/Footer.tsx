import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="footer" style={{ padding: '1.5rem 0' }}>
            <div className="wrap" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                fontSize: '0.88rem',
                color: 'rgba(255, 255, 255, 0.45)',
                textAlign: 'center'
            }}>
                <span>&copy; 2026 EvilTokkii.</span>
                <span>•</span>

                {/* Redes Sociales */}
                <div className="socials" style={{ 
                    display: 'flex', 
                    gap: '1.5rem', 
                    alignItems: 'center', 
                    fontWeight: 700
                }}>
                    <a href="https://www.twitch.tv/eviltokkii" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link-hover">Twitch</a>
                    <a href="https://www.instagram.com/eviltokkii" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link-hover">Instagram</a>
                    <a href="https://www.tiktok.com/@eviltokkii" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link-hover">TikTok</a>
                    <a href="https://x.com/EvilTokkii" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link-hover">X</a>
                    <a href="https://discord.com/invite/Kxvw4KfSBF" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link-hover">Discord</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
