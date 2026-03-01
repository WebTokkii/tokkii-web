/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Trash2, Play, RotateCcw, Trophy, X, Edit2, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- CONFIGURACIÓN Y ESTILOS ---
const COLORS = [
  '#7c3aed', '#ffffff'
];

export default function App() {
  // --- ESTADO ---
  const [participants, setParticipants] = useState<string[]>(['Tokkoo', 'Requiem']);
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

  // --- LÓGICA DE AUDIO ---
  const playTick = useCallback(() => {
    if (isMuted) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, [isMuted]);

  // --- DIBUJO DE LA RULETA ---
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
    ctx.fillStyle = 'var(--color-ruleta-borde, #fff)';
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

        // Texto (Ocultar si modo misterio está activo)
        if (!hideNames) {
          ctx.save();
          ctx.translate(center, center);
          ctx.rotate(angle + arcSize / 2);
          ctx.textAlign = 'right';
          // Color de texto dinámico: si el fondo es blanco (segundo color), usar morado
          ctx.fillStyle = (i % COLORS.length === 1) ? '#7c3aed' : '#fff';
          ctx.font = `bold ${Math.max(12, 24 - total)}px Inter, sans-serif`;
          ctx.shadowColor = (i % COLORS.length === 1) ? 'transparent' : 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 4;
          ctx.fillText(name, radius - 30, 10);
          ctx.restore();
        } else {
          // Opcional: Dibujar un signo de interrogación en el centro del segmento
          ctx.save();
          ctx.translate(center, center);
          ctx.rotate(angle + arcSize / 2);
          ctx.textAlign = 'right';
          ctx.fillStyle = (i % COLORS.length === 1) ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255,255,255,0.3)';
          ctx.font = `bold 20px Inter, sans-serif`;
          ctx.fillText("?", radius - 30, 10);
          ctx.restore();
        }
      });

    // Centro decorativo
    ctx.beginPath();
    ctx.arc(center, center, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.stroke();
  }, [participants, hideNames]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // --- ACCIONES ---
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

    // Duración entre 8 y 12 segundos (duplicado)
    const duration = 8 + Math.random() * 4;
    setSpinDuration(duration);

    // Mínimo 10 vueltas completas (10 * 360) + ángulo aleatorio (proporcional a la duración)
    const extraRotation = 3600 + Math.random() * 720;
    const newRotation = rotation + extraRotation;
    
    setRotation(newRotation);
  };

  const handleAnimationComplete = () => {
    if (isSpinning) {
      setIsSpinning(false);
      calculateWinner(rotation);
    }
  };

  const lastTickAngleRef = useRef(0);
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

  const calculateWinner = (finalRotation: number) => {
    const totalSegments = participants.length;
    const segmentAngle = 360 / totalSegments;
    
    // El indicador está en la parte superior (12 en punto).
    // En el canvas, 0 grados es a las 3 en punto (derecha).
    // Por lo tanto, el indicador está en la posición de 270 grados del canvas.
    // La fórmula para encontrar el ángulo original que termina bajo el indicador es:
    // (ÁnguloIndicador - RotaciónFinal) mod 360
    
    const normalizedRotation = finalRotation % 360;
    const winningIndex = Math.floor(((270 - normalizedRotation + 360) % 360) / segmentAngle);
    
    setWinner(participants[winningIndex]);
  };

  const reset = () => {
    setRotation(0);
    setWinner(null);
    setIsSpinning(false);
  };

  return (
    <div className="min-h-screen bg-[#1e1b4b] text-white font-sans p-4 md:p-8 flex flex-col items-center justify-center overflow-x-hidden"
         style={{
           backgroundImage: 'radial-gradient(circle at center, #2e1065 0%, #1e1b4b 100%)',
           '--color-primario': '#7c3aed',
           '--color-secundario': '#ffffff',
         } as React.CSSProperties}>
      
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white">
          Ruleta Sorteos Tokkiixa
        </h1>
        <p className="text-purple-300 mt-2 font-medium">Si quieres mas chance de Ganar, enviar 5 dolares a Zaluu ugu</p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Panel Izquierdo: Ruleta */}
        <div className="flex flex-col items-center justify-center relative">
          {/* Indicador */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
            <div className="w-8 h-10 bg-white clip-path-triangle shadow-xl" 
                 style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
          </div>

          {/* Contenedor Ruleta */}
          <div className="relative p-4 rounded-full bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm">
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ 
                duration: isSpinning ? spinDuration : 0, 
                ease: [0.1, 0, 0.1, 1] 
              }}
              onUpdate={handleUpdate}
              onAnimationComplete={handleAnimationComplete}
              className="relative z-10"
            >
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
            
            <button
              onClick={startSpin}
              disabled={isSpinning}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white text-[#2e1065] font-bold text-xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group`}
            >
              <div className="absolute inset-0 rounded-full bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 group-hover:text-white transition-colors">{isSpinning ? '...' : 'GIRAR'}</span>
            </button>
          </div>

          {/* Controles Rápidos */}
          <div className="mt-8 flex gap-4">
            <button 
              onClick={reset}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Reiniciar"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
              title={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button 
              onClick={() => setHideNames(!hideNames)}
              disabled={isSpinning}
              className={`p-3 rounded-full transition-all flex items-center gap-2 px-4 font-bold text-sm ${hideNames ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              title={hideNames ? "Mostrar nombres" : "Ocultar nombres"}
            >
              {hideNames ? <Eye size={18} /> : <EyeOff size={18} />}
              {hideNames ? "MODO MISTERIO ON" : "MODO MISTERIO OFF"}
            </button>
          </div>
        </div>

        {/* Panel Derecho: Participantes */}
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Participantes <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-full">{participants.length}</span>
            </h2>
          </div>

          {/* Input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
              placeholder="Nombre del participante..."
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={addParticipant}
              className="bg-purple-600 hover:bg-purple-700 p-3 rounded-xl transition-all shadow-lg shadow-purple-900/20"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Lista */}
          <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
              {participants.map((name, index) => (
                <motion.div
                  key={`participant-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="group flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl p-3 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {editingIndex === index ? (
                      <input
                        autoFocus
                        className="bg-transparent border-b border-purple-500 outline-none w-full"
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
                      <span className="font-medium cursor-pointer" onClick={() => setEditingIndex(index)}>{name}</span>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingIndex(index)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => removeParticipant(index)}
                      className="p-2 text-slate-400 hover:text-purple-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal Ganador */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 md:p-12 max-w-md w-full text-center shadow-[0_0_100px_rgba(124,58,237,0.3)] relative overflow-hidden"
            >
              {/* Decoración Fondo */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              
              <div className="mb-6 inline-flex p-4 rounded-full bg-purple-500/10 text-purple-500">
                <Trophy size={48} />
              </div>
              
              <h3 className="text-slate-400 uppercase tracking-widest font-bold text-sm mb-2">¡Tenemos un ganador!</h3>
              <div className="text-4xl md:text-6xl font-black text-white mb-8 break-words">
                {winner}
              </div>

              <button
                onClick={() => setWinner(null)}
                className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                CERRAR <X size={20} />
              </button>

              {/* Efecto Confetti Simple (CSS) */}
              <div className="confetti-container">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="confetti" style={{ 
                    left: `${Math.random() * 100}%`,
                    backgroundColor: COLORS[i % COLORS.length],
                    animationDelay: `${Math.random() * 2}s`
                  }}></div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos Adicionales */}
      <style>{`
        .clip-path-triangle {
          clip-path: polygon(50% 100%, 0 0, 100% 0);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -20px;
          animation: confetti-fall 3s linear infinite;
          z-index: -1;
        }
      `}</style>
    </div>
  );
}
