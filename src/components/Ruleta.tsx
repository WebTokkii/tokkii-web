import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Trash2, RotateCcw, Trophy, X, Edit2, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './Ruleta.css';

const COLORS = [
    '#9d4edd', // Primary
    '#ff006e', // Secondary
    '#00d4ff', // Accent Blue
    '#ffffff', // White
    '#c77dff', // Light Purple
    '#fb5607', // Orange/Secondary Hover
];

const Ruleta: React.FC = () => {
    const [participants, setParticipants] = useState<string[]>(['Tokkoo', 'Requiem', 'Zaluu', 'Mago']);
    const [inputValue, setInputValue] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [spinDuration, setSpinDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [hideNames, setHideNames] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const lastTickAngleRef = useRef(0);

    const playTick = useCallback(() => {
        if (isMuted) return;
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.error("Audio error", e);
        }
    }, [isMuted]);

    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = canvas.width;
        const center = size / 2;
        const radius = center - 10;
        const total = participants.length;
        const arcSize = (Math.PI * 2) / total;

        ctx.clearRect(0, 0, size, size);

        // Borde exterior
        ctx.beginPath();
        ctx.arc(center, center, radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        participants.forEach((name, i) => {
            const angle = i * arcSize;

            // Segmento
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, angle, angle + arcSize);
            ctx.fillStyle = COLORS[i % COLORS.length];
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Texto
            if (!hideNames) {
                ctx.save();
                ctx.translate(center, center);
                ctx.rotate(angle + arcSize / 2);
                ctx.textAlign = 'right';
                // Color de texto dinámico para legibilidad
                const bgColor = COLORS[i % COLORS.length];
                ctx.fillStyle = bgColor === '#ffffff' ? '#0f021a' : '#ffffff';
                ctx.font = `bold ${Math.max(14, 26 - total)}px Outfit, sans-serif`;
                ctx.shadowColor = bgColor === '#ffffff' ? 'transparent' : 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 4;
                ctx.fillText(name, radius - 30, 10);
                ctx.restore();
            } else {
                ctx.save();
                ctx.translate(center, center);
                ctx.rotate(angle + arcSize / 2);
                ctx.textAlign = 'right';
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.font = `bold 24px Outfit, sans-serif`;
                ctx.fillText("?", radius - 30, 10);
                ctx.restore();
            }
        });

        // Centro
        ctx.beginPath();
        ctx.arc(center, center, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.stroke();
    }, [participants, hideNames]);

    useEffect(() => {
        drawWheel();
    }, [drawWheel, participants, hideNames]);

    const addParticipant = () => {
        if (inputValue.trim()) {
            setParticipants([...participants, inputValue.trim()]);
            setInputValue('');
        }
    };

    const removeParticipant = (index: number) => {
        if (participants.length <= 2) {
            alert("Se necesitan al menos 2 participantes.");
            return;
        }
        setParticipants(participants.filter((_, i) => i !== index));
    };

    const startSpin = () => {
        if (isSpinning || participants.length < 2) return;

        setIsSpinning(true);
        setWinner(null);

        const duration = 8 + Math.random() * 4;
        setSpinDuration(duration);

        const extraRotation = 3600 + Math.random() * 720;
        const newRotation = rotation + extraRotation;

        setRotation(newRotation);
    };

    const calculateWinner = (finalRotation: number) => {
        const totalSegments = participants.length;
        const segmentAngle = 360 / totalSegments;
        const normalizedRotation = finalRotation % 360;
        const winningIndex = Math.floor(((270 - normalizedRotation + 360) % 360) / segmentAngle);
        setWinner(participants[winningIndex]);
    };

    const handleAnimationComplete = () => {
        if (isSpinning) {
            setIsSpinning(false);
            calculateWinner(rotation);
        }
    };

    const handleUpdate = (latest: any) => {
        if (!isSpinning) return;
        const currentRotation = latest.rotate;
        const totalSegments = participants.length;
        const segmentAngle = 360 / totalSegments;
        if (Math.floor(currentRotation / segmentAngle) !== Math.floor(lastTickAngleRef.current / segmentAngle)) {
            playTick();
        }
        lastTickAngleRef.current = currentRotation;
    };

    const reset = () => {
        setRotation(0);
        setWinner(null);
        setIsSpinning(false);
    };

    return (
        <div className="ruleta-container fade-in">
            <div className="ruleta-header">
                <h2 className="ruleta-title">Ruleta de Sorteos Tokkiixa</h2>
                <p className="ruleta-subtitle">¡Gira la rueda y descubre quién es el afortunado!</p>
            </div>

            <div className="ruleta-main-grid">
                <div className="ruleta-wheel-side">
                    <div className="wheel-indicator"></div>

                    <div className="wheel-wrapper">
                        <motion.div
                            animate={{ rotate: rotation }}
                            transition={{
                                duration: isSpinning ? spinDuration : 0,
                                ease: [0.1, 0, 0.1, 1]
                            }}
                            onUpdate={handleUpdate}
                            onAnimationComplete={handleAnimationComplete}
                        >
                            <canvas
                                ref={canvasRef}
                                width={500}
                                height={500}
                                className="wheel-canvas"
                            />
                        </motion.div>

                        <button
                            onClick={startSpin}
                            disabled={isSpinning}
                            className="spin-button"
                        >
                            <div className="spin-btn-bg"></div>
                            <span>{isSpinning ? '...' : 'GIRAR'}</span>
                        </button>
                    </div>

                    <div className="ruleta-controls">
                        <button onClick={reset} className="control-btn" title="Reiniciar">
                            <RotateCcw size={20} />
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)} className="control-btn" title={isMuted ? "Activar sonido" : "Silenciar"}>
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <button
                            onClick={() => setHideNames(!hideNames)}
                            disabled={isSpinning}
                            className={`control-btn control-btn-long ${hideNames ? 'active' : ''}`}
                        >
                            {hideNames ? <Eye size={18} /> : <EyeOff size={18} />}
                            {hideNames ? "Misterio ON" : "Misterio OFF"}
                        </button>
                    </div>
                </div>

                <div className="participants-panel">
                    <div className="participants-header">
                        <h3>Participantes</h3>
                        <span className="participants-count">{participants.length} en total</span>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                            placeholder="Nombre..."
                            className="add-input"
                        />
                        <button onClick={addParticipant} className="add-btn">
                            <Plus size={24} />
                        </button>
                    </div>

                    <div className="participants-list custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {participants.map((name, index) => (
                                <motion.div
                                    key={`p-${index}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="participant-item"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                        <div className="participant-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        {editingIndex === index ? (
                                            <input
                                                autoFocus
                                                className="add-input"
                                                style={{ padding: '0.2rem', height: 'auto', borderRadius: '4px' }}
                                                value={name}
                                                onChange={(e) => {
                                                    const newParts = [...participants];
                                                    newParts[index] = e.target.value;
                                                    setParticipants(newParts);
                                                }}
                                                onBlur={() => setEditingIndex(null)}
                                                onKeyDown={(e) => e.key === 'Enter' && setEditingIndex(null)}
                                            />
                                        ) : (
                                            <span className="participant-name" onClick={() => setEditingIndex(index)}>{name}</span>
                                        )}
                                    </div>
                                    <div className="participant-actions">
                                        <button onClick={() => setEditingIndex(index)} className="action-btn">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => removeParticipant(index)} className="action-btn delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {winner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="winner-overlay"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 20 }}
                            className="winner-modal"
                        >
                            <div className="winner-decoration"></div>
                            <div className="winner-icon-box">
                                <Trophy size={48} />
                            </div>
                            <h3 className="winner-label">¡Tenemos un ganador!</h3>
                            <div className="winner-name gradient-text">{winner}</div>
                            <button onClick={() => setWinner(null)} className="close-modal-btn">
                                CERRAR <X size={20} />
                            </button>

                            <div className="confetti-container">
                                {[...Array(30)].map((_, i) => (
                                    <div key={i} className="confetti" style={{
                                        left: `${Math.random() * 100}%`,
                                        backgroundColor: COLORS[i % COLORS.length],
                                        animationDelay: `${Math.random() * 3}s`,
                                        width: `${Math.random() * 10 + 5}px`,
                                        height: `${Math.random() * 10 + 5}px`,
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

export default Ruleta;
