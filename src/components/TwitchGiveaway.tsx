import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, StopCircle, Trophy, X, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import tmi from 'tmi.js';
import './TwitchGiveaway.css';

const TwitchGiveaway: React.FC = () => {
    const [participants, setParticipants] = useState<string[]>([]);
    const [keyword, setKeyword] = useState('!web');
    const [isStarted, setIsStarted] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    const clientRef = useRef<tmi.Client | null>(null);
    const participantsRef = useRef<string[]>([]);

    useEffect(() => {
        participantsRef.current = participants;
    }, [participants]);

    const connectToTwitch = useCallback(() => {
        if (clientRef.current) return;

        const client = new tmi.Client({
            channels: ['tokkiixa']
        });

        client.connect().then(() => {
            console.log('Conectado a Twitch');
        }).catch(err => {
            console.error('Error conectando a Twitch:', err);
        });

        client.on('message', (_channel, tags, message, self) => {
            if (self) return;
            if (!isStarted) return;

            const msg = message.trim();
            const user = tags['display-name'] || tags.username;

            if (msg === keyword.trim() && user) {
                if (!participantsRef.current.includes(user)) {
                    setParticipants(prev => {
                        if (prev.includes(user)) return prev;
                        return [user, ...prev];
                    });
                }
            }
        });

        clientRef.current = client;
    }, [isStarted, keyword]);

    useEffect(() => {
        if (isStarted) {
            connectToTwitch();
        }
        return () => {
            // No desconectamos al desmontar si queremos mantener la conexión viva, 
            // pero para este componente es mejor limpiar si el usuario para el sorteo.
        };
    }, [isStarted, connectToTwitch]);

    const handleStart = () => {
        setIsStarted(true);
        setWinner(null);
    };

    const handleStop = () => {
        setIsStarted(false);
        // Mantenemos los participantes recolectados
    };

    const handleDraw = () => {
        if (participants.length === 0) {
            alert("No hay participantes todavía.");
            return;
        }
        setIsStarted(false);
        const randomIndex = Math.floor(Math.random() * participants.length);
        setWinner(participants[randomIndex]);
    };

    const handleClear = () => {
        setParticipants([]);
        setWinner(null);
    };

    return (
        <div className="gift-container fade-in">
            <div className="gift-header">
                <h2 className="gift-title">Sorteo en Vivo (Twitch)</h2>
                <div className={`gift-status-badge ${isStarted ? 'active' : ''}`}>
                    {isStarted && <div className="gift-pulse"></div>}
                    {isStarted ? "ESCUCHANDO CHAT..." : "LISTO PARA EMPEZAR"}
                </div>
                <p className="section-description" style={{ marginTop: '1rem', marginBottom: 0 }}>
                    Los usuarios que escriban <span style={{ color: '#9146FF', fontWeight: 'bold' }}>{keyword}</span> entrarán automáticamente en la lista.
                </p>
            </div>

            <div className="gift-main-layout">
                {/* Panel Izquierdo: Controles */}
                <div className="gift-controls-panel">
                    <div className="gift-setup-card">
                        <div className="gift-setup-title">Configuración</div>
                        <label style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', display: 'block' }}>COMANDO DE ACTIVACIÓN</label>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            disabled={isStarted}
                            placeholder="Ej: !emilia"
                            className="gift-input-field"
                        />

                        <div className="gift-action-btns">
                            {!isStarted ? (
                                <button onClick={handleStart} className="gift-btn gift-btn-start">
                                    <Play size={20} fill="currentColor" /> COMENZAR
                                </button>
                            ) : (
                                <button onClick={handleStop} className="gift-btn gift-btn-stop">
                                    <StopCircle size={20} /> DETENER
                                </button>
                            )}

                            <button onClick={handleClear} className="gift-btn gift-btn-clear" disabled={isStarted}>
                                <RefreshCcw size={18} /> LIMPIAR
                            </button>

                            <button
                                onClick={handleDraw}
                                className="gift-btn gift-btn-draw"
                                disabled={participants.length === 0}
                                style={{
                                    border: participants.length > 0 ? '2px solid #9146FF' : 'none'
                                }}
                            >
                                <Trophy size={22} color={participants.length > 0 ? "#9146FF" : "#888"} />
                                {winner ? "VOLVER A SORTEAR" : "SORTEAR GANADOR"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Panel Derecho: Lista de Usuarios */}
                <div className="gift-list-panel">
                    <div className="gift-list-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Trophy size={18} color="#9146FF" />
                            <span style={{ fontWeight: 'bold' }}>En lista</span>
                        </div>
                        <div className="gift-count">{participants.length}</div>
                    </div>

                    <div className="gift-users-scroll custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {participants.map((user) => (
                                <motion.div
                                    key={`twitch-user-${user}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="gift-user-item"
                                >
                                    <div className="gift-user-avatar">
                                        {user.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="gift-user-name">{user}</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {participants.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#555', fontSize: '0.9rem' }}>
                                Aún no hay nadie. ¡Diles que escriban {keyword}!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Ganador */}
            <AnimatePresence>
                {winner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="gift-winner-overlay"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="gift-winner-card"
                        >
                            <div className="gift-winner-label">¡GANADOR SORTEO!</div>
                            <div className="gift-winner-name">{winner}</div>

                            <button onClick={() => setWinner(null)} className="close-modal-btn" style={{ background: 'white', color: '#1a0b2e' }}>
                                <X size={20} /> CERRAR
                            </button>

                            <div className="confetti-container">
                                {[...Array(40)].map((_, i) => (
                                    <div key={i} className="gift-confetti" style={{
                                        left: `${Math.random() * 100}%`,
                                        backgroundColor: ['#9146FF', '#00d4ff', '#ff006e', '#ffffff'][i % 4],
                                        animationDelay: `${Math.random() * 3}s`,
                                        transform: `rotate(${Math.random() * 360}deg)`
                                    }}></div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TwitchGiveaway;
