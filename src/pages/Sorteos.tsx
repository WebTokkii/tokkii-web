import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Ruleta from '../components/Ruleta';
import TwitchGiveaway from '../components/TwitchGiveaway';
import '../components/NewsWidget.css';
import ParticipationForm from '../components/ParticipationForm';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Sorteos: React.FC = () => {
    const [selectedSorteo, setSelectedSorteo] = useState<{ id: string, title: string } | null>(null);
    const [showRuleta, setShowRuleta] = useState(localStorage.getItem("tokki_admin") === "true");

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

                <div className="news-header" style={{ marginTop: '4rem' }}>
                    <h3 className="widget-title">Sorteos Activos</h3>
                </div>
                <div className="grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="card glass glow-hover">
                            <div className="card-body">
                                <span className="badge">ACTIVO</span>
                                <h3>Sorteo Especial de Temporada #{i}</h3>
                                <p>Participa ahora y gana increíbles premios diseñados para nuestra comunidad de Tokkiixa.</p>
                                <button
                                    onClick={() => setSelectedSorteo({ id: `sorteo-temp-${i}`, title: `Sorteo Especial de Temporada #${i}` })}
                                    className="btn-primary glow"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        justifyContent: 'center',
                                        width: '100%'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserPlus} /> Participar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedSorteo && (
                    <ParticipationForm
                        tipo="sorteo"
                        itemId={selectedSorteo.id}
                        itemTitle={selectedSorteo.title}
                        onClose={() => setSelectedSorteo(null)}
                    />
                )}

                <div className="news-header" style={{ marginTop: '3rem' }}>
                    <h3 className="widget-title">Próximos Sorteos</h3>
                </div>
                <div className="grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="card glass">
                            <div className="card-body">
                                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>PRÓXIMO</span>
                                <h3>Próximo Sorteo #{i}</h3>
                                <p>Mantente atento a las novedades de Tokkiixa para no perderte este sorteo.</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Sorteos;
