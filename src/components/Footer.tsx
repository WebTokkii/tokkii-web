import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <p>&copy; 2026 Tokkiixa. Todos los derechos reservados.</p>
                <div className="socials">
                    <a href="https://www.twitch.tv/tokkiixa" target="_blank" rel="noopener noreferrer">Twitch</a>
                    <a href="https://www.instagram.com/tokkixa" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://www.tiktok.com/@tokkixa_" target="_blank" rel="noopener noreferrer">TikTok</a>
                    <a href="https://x.com/Tokkiixa" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
                    <a href="https://discord.com/invite/Kxvw4KfSBF" target="_blank" rel="noopener noreferrer">Discord</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
