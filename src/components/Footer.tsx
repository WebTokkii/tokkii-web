import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="footer" style={{ padding: '2rem 0', background: 'rgba(8, 4, 13, 0.6)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="wrap" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.2rem',
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.45)',
                textAlign: 'center',
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '0 1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span>&copy; 2026 EvilTokkii.</span>
                    <span>•</span>
                    <Link to="/legal" style={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 'bold' }}>
                        Términos, Privacidad & DMCA
                    </Link>
                    <span>•</span>
                    <div className="socials" style={{ 
                        display: 'flex', 
                        gap: '1.2rem', 
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

                <p style={{ margin: 0, fontSize: '0.75rem', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.35)', maxWidth: '850px' }}>
                    <strong>Aviso Legal de Marcas:</strong> EvilTokkii es un proyecto comunitario independiente sin afiliación, patrocinio ni licencia oficial con Nintendo, Sony, Microsoft ni desarrolladores de videojuegos. Todas las marcas registradas pertenecen a sus respectivos dueños bajo el marco de Uso Justo (Fair Use).
                </p>
            </div>
        </footer>
    );
};

export default Footer;
