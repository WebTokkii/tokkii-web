import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <section className="section fade-in text-center">
            <div className="container">
                <h1 style={{ fontSize: '8rem', color: 'var(--primary)' }}>404</h1>
                <h2 className="section-title">Página no encontrada</h2>
                <p className="section-description">
                    ¡Ups! Parece que te has perdido en el espacio. La página que buscas no existe o ha sido movida.
                </p>
                <Link to="/" className="btn-primary glow" style={{ display: 'inline-block', marginTop: '2rem' }}>
                    Volver al Inicio
                </Link>
            </div>
        </section>
    );
};

export default NotFound;
