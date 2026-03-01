import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../components/NewsWidget.css';

const Eventos: React.FC = () => {
    const [nombre, setNombre] = useState("");
    const [eventoPremio, setEventoPremio] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    // Variable para próximos eventos
    const proximosEventos = [
        {
            titulo: "Clash of Mishi",
            descripcion: "Clash of Mishis llega con combates aéreos intensos donde solo el último en el aire avanza! 🐾🚀 Demuestra tus 9 vidas, gana tu final y consigue hasta 1.000 monedas.",
            fecha: "Próximamente",
            imagen: "ClashOfMishi_Portada.png",
            slug: "clash-of-mishi"
        }
    ];

    const enviarFormulario = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        try {
            const res = await fetch(`${API_URL}/api/eventos`, {
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
                            Los formularios de Eventos con información incorrecta, incompleta o que no coincida con los datos verificados en stream serán invalidados automáticamente, perdiendo el derecho a participación. Revisa bien tus datos antes de enviarlo.
                        </p>
                    </div>
                </div>

                <div className="contact-card glass" style={{ marginBottom: '4rem', padding: '3rem' }}>
                    <div className="split-container" style={{ alignItems: 'flex-start', gap: '3rem' }}>
                        <div className="split-content" style={{ textAlign: 'left' }}>
                            <h2 className="section-title" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>Para participar en algún evento, presta atención:</h2>
                            <p className="section-description" style={{ margin: '0', textAlign: 'left', maxWidth: '100%' }}>
                                Completa los campos según lo solicitado por Tokkiixa para participar en el evento. Es obligatorio ingresar todos los datos requeridos correctamente y sin omisiones.
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
                                        placeholder="Evento al cual participas"
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
                    <h3 className="widget-title">Próximos Eventos</h3>
                </div>

                {proximosEventos.map((evento, index) => (
                    <div key={index} className="event-highlight" style={{
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
                                src={`${import.meta.env.VITE_R2_BASE_URL}/Imagenes/${evento.imagen}?v=${Date.now()}`}
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
                            <h4 style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', fontWeight: '400', lineHeight: '1.4' }}>
                                {evento.descripcion}
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                                <div style={{ display: 'block' }}>
                                    <span style={{ fontWeight: 'bold', color: '#ff4d4d', fontSize: '1.3rem' }}>FECHA:</span>
                                    <span style={{ marginLeft: '10px', color: '#fff', fontSize: '1.3rem' }}>{evento.fecha}</span>
                                </div>
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
                                        opacity: '0.9'
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
                ))}
            </div>
        </section>
    );
};

export default Eventos;
