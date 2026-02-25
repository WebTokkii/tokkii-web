import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const EventoDetalle: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    // Esta data debería estar en un lugar compartido en el futuro
    const eventosData: Record<string, any> = {
        "clash-of-mishi": {
            titulo: "Clash of Mishi",
            descripcion: "Clash of Mishis llega con combates aéreos intensos donde solo el último en el aire avanza!",
            detalles: "Prepárate para la acción más felina y frenética. Demuestra tus 9 vidas, gana tu final y consigue hasta 1.000 monedas. En este evento comunitario, los jugadores se enfrentarán en duelos aéreos donde la destreza y los reflejos lo son todo.",
            normas: [
                "Es obligatorio tener el BattleTag correctamente vinculado.",
                "Estar presente en el stream de Tokkiixa durante el evento.",
                "Seguir las instrucciones del moderador en todo momento.",
                "Respeto absoluto hacia todos los participantes."
            ],
            premios: "Hasta 1.000 monedas para el ganador final.",
            fecha: "Próximamente",
            imagen: "ClashOfMishi_Portada.png",
        }
    };

    const evento = eventosData[slug || ""];

    if (!evento) {
        return (
            <section className="section text-center">
                <div className="container">
                    <h2 className="section-title">Evento no encontrado</h2>
                    <p className="section-description">Lo sentimos, no pudimos encontrar los detalles de este evento.</p>
                    <Link to="/eventos" className="btn-primary glow">Volver a Eventos</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="section fade-in">
            <div className="container">
                <Link to="/eventos" className="card-link" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <FontAwesomeIcon icon={faChevronLeft} /> Volver a Eventos
                </Link>

                <div className="event-detail-card glass" style={{ padding: '3rem', borderRadius: '32px' }}>
                    <div style={{ width: '100%', height: '400px', borderRadius: '24px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                        <img src={`${import.meta.env.VITE_R2_BASE_URL}/Imagenes/${evento.imagen}`} alt={evento.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div className="event-hero-info" style={{ marginBottom: '3rem' }}>
                        <h1 className="section-title" style={{ textAlign: 'left', fontSize: '4rem', marginBottom: '1rem' }}>{evento.titulo}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ff4d4d', fontSize: '1.4rem', fontWeight: 'bold' }}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>FECHA: {evento.fecha}</span>
                        </div>
                    </div>

                    <div className="event-content" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
                        <div className="event-main-text">
                            <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>Sobre el evento</h3>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                                {evento.detalles}
                            </p>

                            <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>Normas de participación</h3>
                            <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: '2' }}>
                                {evento.normas.map((norma: string, i: number) => (
                                    <li key={i}>{norma}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="event-sidebar">
                            <div className="sidebar-box glass" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255, 77, 77, 0.05)', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
                                <h3 style={{ fontSize: '1.6rem', color: '#ff4d4d', marginBottom: '1rem' }}>Premios</h3>
                                <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '500' }}>
                                    {evento.premios}
                                </p>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <Link to="/eventos" className="btn-primary glow" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                                    Inscribirse ahora
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventoDetalle;
