import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar glass">
            <div className="container nav-content">
                <Link to="/" className="logo-container">
                    <img src={`${import.meta.env.VITE_R2_BASE_URL}/logo.png`} alt="Logo" className="logo-img" />
                    <span className="logo-text">Tokkiixa</span>
                </Link>
                <ul className="nav-links">
                    <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink></li>
                    <li><NavLink to="/eventos" className={({ isActive }) => (isActive ? 'active' : '')}>Eventos</NavLink></li>
                    <li><NavLink to="/sorteos" className={({ isActive }) => (isActive ? 'active' : '')}>Sorteos</NavLink></li>
                    <li><NavLink to="/sobre" className={({ isActive }) => (isActive ? 'active' : '')}>Sobre Tokkiixa</NavLink></li>
                    <li><NavLink to="/tierlist" className={({ isActive }) => (isActive ? 'active' : '')}>Tierlist</NavLink></li>
                    <li><NavLink to="/noticias" className={({ isActive }) => (isActive ? 'active' : '')}>Noticias</NavLink></li>
                    <li><NavLink to="/te-recomiendo" className={({ isActive }) => (isActive ? 'active' : '')}>Te recomiendo</NavLink></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
