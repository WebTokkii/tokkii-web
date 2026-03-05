import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Ruleta from '../components/Ruleta';
import TwitchGiveaway from '../components/TwitchGiveaway';
import '../components/NewsWidget.css';
import ParticipationForm from '../components/ParticipationForm';
import { supabase } from '../lib/supabase';

const Sorteos: React.FC = () => {
    const [selectedSorteo, setSelectedSorteo] = useState<{ id: string, title: string } | null>(null);
    const [showRuleta, setShowRuleta] = useState(localStorage.getItem("tokki_admin") === "true");
    const [sorteos, setSorteos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let inputKeys = "";
        const secretKeyword = "emilia";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            inputKeys += e.key.toLowerCase();
            inputKeys = inputKeys.slice(-secretKeyword.length);

            if (inputKeys === secretKeyword) {
                setShowRuleta(true);
                localStorage.setItem("tokki_admin", "true");
                console.log("Acceso de administradora activado.");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const fetchSorteos = async () => {
            const { data, error } = await supabase
                .from('content_items')
                .select('*')
                .eq('tipo', 'sorteo')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching raffles:', error);
            } else {
                setSorteos(data || []);
            }
            setLoading(false);
        };

        fetchSorteos();
    }, []);

    const sorteosActivos = sorteos.filter(s => s.estado === 'activo');
    const proximosSorteos = sorteos.filter(s => s.estado === 'proximo');

    return (
        <section className="section fade-in">
            <div className="container">
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
                            Los formularios de Sorteos con información incorrecta, incompleta o que no coincida con los datos verificados en stream serán invalidados automáticamente, perdiendo el derecho al premio. Revisa bien tus datos antes de enviarlo.
                        </p>
                    </div>
                </div>

                {showRuleta && (
                    <>
                        <Ruleta />
                        <div style={{ margin: '4rem 0' }}></div>
                        <TwitchGiveaway />
                    </>
                )}

                <div className="news-header" style={{ marginTop: '4rem', marginBottom: '2rem' }}>
                    <h3 className="widget-title">Sorteos Activos</h3>
                </div>

                {loading ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>Cargando sorteos...</p>
                    </div>
                ) : sorteosActivos.length === 0 ? (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '24px',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        marginBottom: '4rem'
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', margin: 0 }}>
                            No hay sorteos activos en este momento. ¡Vuelve pronto!
                        </p>
                    </div>
                ) : (
                    <div className="grid">
                        {sorteosActivos.map((sorteo, i) => (
                            <div key={i} className="card glass glow-hover">
                                <div className="card-body">
                                    <span className="badge">ACTIVO</span>
                                    <h3>{sorteo.titulo}</h3>
                                    <p style={{ whiteSpace: 'pre-line' }}>
                                        {sorteo.descripcion || ''}
                                    </p>
                                    <Link
                                        to={`/eventos/${sorteo.slug}`}
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
                                            justifyContent: 'center',
                                            padding: '0.8rem 0'
                                        }}
                                        className="more-info-link"
                                    >
                                        Más información <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '1rem' }} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedSorteo && (
                    <ParticipationForm
                        tipo="sorteo"
                        itemId={selectedSorteo.id}
                        itemTitle={selectedSorteo.title}
                        onClose={() => setSelectedSorteo(null)}
                    />
                )}

                <div className="news-header" style={{ marginTop: '3rem', marginBottom: '2rem' }}>
                    <h3 className="widget-title">Próximos Sorteos</h3>
                </div>

                {!loading && proximosSorteos.length === 0 ? (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '24px',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        marginBottom: '4rem'
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', margin: 0 }}>
                            No hay sorteos programados próximamente. ¡Mantente atento!
                        </p>
                    </div>
                ) : (
                    <div className="grid">
                        {proximosSorteos.map((sorteo, i) => (
                            <div key={i} className="card glass">
                                <div className="card-body">
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>PRÓXIMO</span>
                                    <h3>{sorteo.titulo}</h3>
                                    <p style={{ whiteSpace: 'pre-line' }}>{sorteo.descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Sorteos;
