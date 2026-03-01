import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import '../components/NewsWidget.css';

const Sorteos: React.FC = () => {
    const [nombre, setNombre] = useState("");
    const [eventoPremio, setEventoPremio] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    const enviarFormulario = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        try {
            const res = await fetch(`${API_URL}/api/contacto`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre, eventoPremio, mensaje })
            });

            const data = await res.json();

            if (data.success) {
                alert("Mensaje enviado 🚀");
                setNombre("");
                setEventoPremio("");
                setMensaje("");
            } else {
                alert(`Error: ${data.error}\nDetalles: ${JSON.stringify(data.details)}`);
            }
        } catch (error) {
            alert("Error de conexión con el servidor");
        }

        setLoading(false);
    };

    return (
        <section className="section fade-in">
            <div className="container">
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
                            Los formularios de Sorteos con información incorrecta, incompleta o que no coincida con los datos verificados en stream serán invalidados automáticamente, perdiendo el derecho al premio. Revisa bien tus datos antes de enviarlo.
                        </p>
                    </div>
                </div>

                <div className="contact-card glass" style={{ marginBottom: '4rem', padding: '3rem' }}>
                    <div className="split-container" style={{ alignItems: 'flex-start', gap: '3rem' }}>
                        <div className="split-content" style={{ textAlign: 'left' }}>
                            <h2 className="section-title" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>Para Reclamar tú premio, presta atención:</h2>
                            <p className="section-description" style={{ margin: '0', textAlign: 'left', maxWidth: '100%' }}>
                                Rellena los campos según te solicito Tokkiixa, indicando el premio que reclamas, y la informacion solicitada al momento de ganar tu premio.
                            </p>
                        </div>

                        <div className="split-form" style={{ flex: '1.2', width: '100%' }}>
                            <form className="contact-form" onSubmit={enviarFormulario} style={{ marginTop: '0' }}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        className="glass-input"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Indica el premio que reclamas"
                                        className="glass-input"
                                        value={eventoPremio}
                                        onChange={(e) => setEventoPremio(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <textarea
                                        placeholder="BattleTag, Nick Discord, etc"
                                        className="glass-input"
                                        style={{ minHeight: '120px' }}
                                        value={mensaje}
                                        onChange={(e) => setMensaje(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary glow"
                                    style={{ width: '100%' }}
                                    disabled={loading}
                                >
                                    {loading ? "Enviando..." : "Enviar"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="news-header">
                    <h3 className="widget-title">Sorteos Activos</h3>
                </div>
                <div className="grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="card glass glow-hover">
                            <div className="card-body">
                                <span className="badge">ACTIVO</span>
                                <h3>Sorteo Especial de Temporada #{i}</h3>
                                <p>Participa ahora y gana increíbles premios diseñados para nuestra comunidad de Tokkiixa.</p>
                                <button className="btn-primary">Participar</button>
                            </div>
                        </div>
                    ))}
                </div>

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

