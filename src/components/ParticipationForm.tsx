import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabase';
import './ParticipationForm.css';

interface ParticipationFormProps {
    tipo: 'evento' | 'sorteo';
    itemId: string;
    itemTitle: string;
    onClose: () => void;
}

const ParticipationForm: React.FC<ParticipationFormProps> = ({ tipo, itemId, itemTitle, onClose }) => {
    const [nombre, setNombre] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('participations')
                .insert([
                    {
                        nombre,
                        tipo,
                        item_id: itemId,
                        item_titulo: itemTitle,
                        mensaje,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            setEnviado(true);
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error: any) {
            console.error('Error saving to Supabase:', error);
            alert("Error al enviar participación: " + (error.message || "Error desconocido"));
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="participation-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="participation-modal">
                <div className="contact-card glass" style={{ padding: '2.5rem', position: 'relative' }}>
                    {enviado ? (
                        <div style={{ padding: '1rem', textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#4BB543', fontSize: '4rem', marginBottom: '1.5rem' }} />
                            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>¡Registro Exitoso!</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Tu participación en <strong>{itemTitle}</strong> ha sido registrada.</p>
                        </div>
                    ) : (
                        <>
                            <button className="close-btn" onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>

                            <h2 style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                                Participar en {tipo === 'evento' ? 'Evento' : 'Sorteo'}
                            </h2>
                            <p style={{ marginBottom: '2rem', textAlign: 'left', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                                Rellena tus datos para participar en: <span style={{ color: '#ff006e', fontWeight: 'bold' }}>{itemTitle}</span>
                            </p>

                            <form className="contact-form" onSubmit={handleSubmit} style={{ marginTop: '0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: 600 }}>Nombre / Nickname</label>
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

                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: 600 }}>Detalles adicionales (BattleTag, Discord, etc)</label>
                                    <textarea
                                        placeholder="Escribe aquí los datos necesarios..."
                                        className="glass-input"
                                        style={{ minHeight: '120px', resize: 'vertical' }}
                                        value={mensaje}
                                        onChange={(e) => setMensaje(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn primary"
                                    style={{ width: '100%', marginTop: '0.5rem' }}
                                    disabled={loading}
                                >
                                    {loading ? "Registrando..." : "Confirmar Participación"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ParticipationForm;
