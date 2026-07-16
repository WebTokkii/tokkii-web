import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons';
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
                    <Link to="/dinamicas" className="btn-primary glow">Volver a Dinámicas</Link>
                </div>
            </section>
        );
    }

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/${imagePath}`;
    };

    return (
        <section className="section fade-in" style={{ padding: '3rem 0' }}>
            <div className="wrap">
                <Link to="/dinamicas" className="card-link" style={{ marginBottom: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>
                    <FontAwesomeIcon icon={faChevronLeft} /> Volver a Dinámicas
                </Link>

                <div className="event-detail-container glass" style={{ padding: '3.5rem', borderRadius: '32px', background: 'rgba(15, 2, 26, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    {/* Fila 1: Imagen (Izquierda) y Premio (Derecha) */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                        gap: '2.5rem',
                        marginBottom: '3.5rem'
                    }}>
                        {/* Recuadro de la Imagen */}
                        <div style={{
                            height: '380px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(157, 78, 221, 0.12)',
                            border: '1px solid rgba(157, 78, 221, 0.25)'
                        }}>
                            {evento.imagen ? (
                                <img
                                    src={getImageUrl(evento.imagen)}
                                    alt={evento.titulo}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #1e0536 0%, #7b2cbf 50%, #ff006e 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '6px', opacity: 0.8 }}>TOKKII</span>
                                </div>
                            )}
                        </div>

                        {/* Recuadro de Fecha y Premio Dividido */}
                        <div className="glass" style={{
                            height: '380px',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(157, 78, 221, 0.12)',
                            background: 'rgba(157, 78, 221, 0.03)',
                            border: '1px solid rgba(157, 78, 221, 0.25)',
                            overflow: 'hidden'
                        }}>
                            {/* Mitad Superior: Fecha */}
                            <div style={{
                                flex: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '1.5rem',
                                borderBottom: '1px solid rgba(157, 78, 221, 0.2)'
                            }}>
                                <div className="kicker" style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', justifyContent: 'center' }}>
                                    Fecha de Realización
                                </div>
                                <p style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.5rem)', color: '#fff', fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1.1, margin: 0 }}>
                                    {evento.fecha}
                                </p>
                            </div>

                            {/* Mitad Inferior: Premio */}
                            <div style={{
                                flex: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '1.5rem'
                            }}>
                                <div className="kicker" style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem', justifyContent: 'center' }}>
                                    Premios a repartir
                                </div>
                                <p style={{ fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: '500', lineHeight: '1.4', margin: 0 }}>
                                    {evento.premios || 'Sin premios especificados'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fila 2: Barra de color + Kicker + Título de Home */}
                    <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                        <div>
                            <div className="kicker">{evento.tipo === 'sorteo' ? 'Sorteo Especial' : 'Evento de la Comunidad'}</div>
                            <h2 className="title">{evento.titulo}</h2>
                        </div>
                    </div>

                    {/* Resto de Informaciones */}
                    <div style={{ marginBottom: '3.5rem' }}>

                        {/* Detalles / Descripción */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <p style={{
                                fontSize: '1.25rem',
                                lineHeight: '1.8',
                                color: 'rgba(255, 255, 255, 0.85)',
                                whiteSpace: 'pre-line',
                                margin: 0
                            }}>
                                {evento.detalles || evento.descripcion || 'No hay más detalles disponibles para este evento.'}
                            </p>
                        </div>

                        {/* Normas de participación */}
                        {evento.normas && evento.normas.length > 0 && (
                            <div className="glass" style={{
                                padding: '2.5rem',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                background: 'rgba(255, 255, 255, 0.01)',
                                marginTop: '3rem'
                            }}>
                                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '1.2rem', fontWeight: 700 }}>
                                    Normas de participación
                                </h3>
                                <ul style={{
                                    paddingLeft: '1.5rem',
                                    color: 'rgba(255, 255, 255, 0.75)',
                                    fontSize: '1.15rem',
                                    lineHeight: '2',
                                    margin: 0
                                }}>
                                    {evento.normas.map((norma: string, i: number) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{norma}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Fila 3: Botón de Participar al final del todo */}
                    {evento.estado === 'activo' ? (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn primary glow"
                                style={{
                                    padding: '1rem 3rem',
                                    fontSize: '1.25rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    borderRadius: '999px',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    letterSpacing: '1px'
                                }}
                            >
                                <FontAwesomeIcon icon={faUserPlus} /> Participar ahora
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                            <div style={{
                                padding: '1rem 3rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px dashed rgba(255, 255, 255, 0.15)',
                                borderRadius: '999px',
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>
                                Esta dinámica se encuentra {evento.estado === 'proximo' ? 'próxima a iniciar' : 'finalizada'}.
                            </div>
                        </div>
                    )}
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
