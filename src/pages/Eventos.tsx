import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faArrowRight, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import '../components/NewsWidget.css';
import { supabase } from '../lib/supabase';
import ParticipationForm from '../components/ParticipationForm';

const EventCard: React.FC<{ evento: any, onParticipate?: (evento: any) => void }> = ({ evento, onParticipate }) => (
    <div className="event-highlight" style={{
        display: 'flex',
        borderRadius: '28px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.02)',
        marginTop: '2.5rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
        position: 'relative'
    }}>
        <div className="event-image" style={{ flex: '1', maxWidth: '450px', lineHeight: 0 }}>
            <img
                src={`${import.meta.env.VITE_R2_BASE_URL}/Imagenes/${evento.imagen}`}
                alt={evento.titulo}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                }}
            />
        </div>
        <div className="event-details" style={{
            flex: '1.8',
            padding: '1.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
            position: 'relative',
            minHeight: '220px'
        }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '0.4rem', color: '#fff' }}>{evento.titulo}</h2>
            <h4 style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', fontWeight: '400', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                {evento.descripcion}
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'block' }}>
                    <span style={{ fontWeight: 'bold', color: '#ff4d4d', fontSize: '1.3rem' }}>FECHA:</span>
                    <span style={{ marginLeft: '10px', color: '#fff', fontSize: '1.3rem' }}>{evento.fecha}</span>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {evento.estado === 'activo' && onParticipate && (
                        <button
                            onClick={() => onParticipate(evento)}
                            className="btn-primary glow"
                            style={{
                                padding: '0.6rem 1.5rem',
                                fontSize: '1rem',
                                borderRadius: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <FontAwesomeIcon icon={faUserPlus} /> Participar
                        </button>
                    )}

                    <Link
                        to={`/eventos/${evento.slug}`}
                        style={{
                            color: '#ff4d4d',
                            textDecoration: 'none',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            fontWeight: 'bold',
                            opacity: '0.9',
                            padding: '0.8rem 0'
                        }}
                        className="more-info-link"
                        onMouseOver={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.textShadow = '0 0 10px rgba(255, 77, 77, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                            e.currentTarget.style.textShadow = 'none';
                        }}
                    >
                        Más información <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '1rem' }} />
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

const Eventos: React.FC = () => {
    const [eventos, setEventos] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedEvento, setSelectedEvento] = React.useState<{ id: string, title: string } | null>(null);

    React.useEffect(() => {
        const fetchEventos = async () => {
            const { data, error } = await supabase
                .from('content_items')
                .select('*')
                .eq('tipo', 'evento')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching events:', error);
            } else {
                setEventos(data || []);
            }
            setLoading(false);
        };

        fetchEventos();
    }, []);

    const eventosActivos = eventos.filter(e => e.estado === 'activo');
    const proximosEventos = eventos.filter(e => e.estado === 'proximo');

    return (
        <section className="section fade-in">
            <div className="container">
                {/* Participation Form Modal */}
                {selectedEvento && (
                    <ParticipationForm
                        tipo="evento"
                        itemId={selectedEvento.id}
                        itemTitle={selectedEvento.title}
                        onClose={() => setSelectedEvento(null)}
                    />
                )}

                {/* Warning Box */}
                <div className="warning-box glass" style={{
                    border: '2px solid #ff4d4d',
                    padding: '1.5rem 2rem',
                    borderRadius: '16px',
                    marginBottom: '3rem',
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center',
                    background: 'rgba(255, 77, 77, 0.05)'
                }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#ff4d4d', fontSize: '2rem' }} />
                    <div>
                        <p style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>¡Atención importante!</p>
                        <p style={{ margin: 0, lineHeight: '1.5', color: 'rgba(255,255,255,0.9)' }}>
                            Los formularios de Eventos con información incorrecta, incompleta o que no coincida con los datos verificados en stream serán invalidados automáticamente, perdiendo el derecho a participación. Revisa bien tus datos antes de enviarlo.
                        </p>
                    </div>
                </div>

                <div className="news-header" style={{ marginBottom: '2rem' }}>
                    <h3 className="widget-title">Eventos Activos</h3>
                </div>

                {loading ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>Cargando eventos...</p>
                    </div>
                ) : eventosActivos.length === 0 ? (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '24px',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        marginBottom: '4rem'
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', margin: 0 }}>
                            No hay eventos activos en este momento. ¡Vuelve pronto!
                        </p>
                    </div>
                ) : (
                    eventosActivos.map((evento, index) => (
                        <EventCard
                            key={index}
                            evento={evento}
                            onParticipate={(ev) => setSelectedEvento({ id: ev.slug, title: ev.titulo })}
                        />
                    ))
                )}

                <div className="news-header" style={{ marginBottom: '2rem', marginTop: '4rem' }}>
                    <h3 className="widget-title">Próximos Eventos</h3>
                </div>

                {!loading && proximosEventos.length === 0 ? (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '24px',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        marginBottom: '4rem'
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', margin: 0 }}>
                            No hay próximos eventos programados. ¡Mantente atento!
                        </p>
                    </div>
                ) : (
                    proximosEventos.map((evento, index) => (
                        <EventCard key={index} evento={evento} />
                    ))
                )}
            </div>
        </section>
    );
};

export default Eventos;
