import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import ParticipationForm from '../components/ParticipationForm';
import { supabase } from '../lib/supabase';

const EventoDetalle: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [evento, setEvento] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [showForm, setShowForm] = React.useState(false);

    React.useEffect(() => {
        const fetchEvento = async () => {
            const { data, error } = await supabase
                .from('content_items')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                console.error('Error fetching event details:', error);
            } else {
                setEvento(data);
            }
            setLoading(false);
        };

        if (slug) {
            fetchEvento();
        }
    }, [slug]);

    if (loading) {
        return (
            <section className="section text-center">
                <div className="container">
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>Cargando detalles del evento...</p>
                </div>
            </section>
        );
    }

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
                        <img
                            src={`${import.meta.env.VITE_R2_BASE_URL}/Imagenes/${evento.imagen}`}
                            alt={evento.titulo}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
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
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', whiteSpace: 'pre-line' }}>
                                {evento.detalles || evento.descripcion || ''}
                            </p>

                            {evento.normas && evento.normas.length > 0 && (
                                <>
                                    <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>Normas de participación</h3>
                                    <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: '2' }}>
                                        {evento.normas.map((norma: string, i: number) => (
                                            <li key={i}>{norma}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        <div className="event-sidebar">
                            {evento.premios && (
                                <div className="sidebar-box glass" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255, 77, 77, 0.05)', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
                                    <h3 style={{ fontSize: '1.6rem', color: '#ff4d4d', marginBottom: '1rem' }}>Premios</h3>
                                    <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '500' }}>
                                        {evento.premios}
                                    </p>
                                </div>
                            )}

                            {evento.estado === 'activo' && (
                                <div style={{ marginTop: '2rem' }}>
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="btn-primary glow"
                                        style={{ width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    >
                                        <FontAwesomeIcon icon={faUserPlus} /> Participar ahora
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showForm && (
                    <ParticipationForm
                        tipo="evento"
                        itemId={slug || ""}
                        itemTitle={evento.titulo}
                        onClose={() => setShowForm(false)}
                    />
                )}
            </div>
        </section>
    );
};

export default EventoDetalle;
