import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

interface Hero {
    id: string;
    name: string;
    img: string;
}

interface TierState {
    [key: string]: Hero[];
}

const TierRow: React.FC<{
    tier: { id: string, label: string, color: string },
    heroes: Hero[],
    onDrop: (index?: number) => void,
    onDragStart: (hero: Hero) => void,
    onLabelChange: (newLabel: string) => void
}> = ({ tier, heroes, onDrop, onDragStart, onLabelChange }) => {
    return (
        <div
            className="tier-row"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop()}
            style={{
                display: 'flex',
                alignItems: 'stretch',
                marginBottom: '8px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                minHeight: '100px'
            }}
        >
            <div className="tier-label" style={{
                width: '100px',
                backgroundColor: tier.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontWeight: '900',
                flexShrink: 0,
                cursor: 'text',
                padding: '10px',
                textAlign: 'center'
            }}>
                <textarea
                    defaultValue={tier.label}
                    onBlur={(e) => onLabelChange(e.target.value)}
                    spellCheck={false}
                    style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: '#000',
                        fontWeight: '900',
                        fontSize: '1.4rem',
                        textAlign: 'center',
                        resize: 'none',
                        fontFamily: 'inherit',
                        textTransform: 'uppercase',
                        height: 'auto',
                        overflow: 'hidden',
                        lineHeight: '1.1',
                        display: 'block'
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault();
                    }}
                />
            </div>
            <div className="tier-dropzone" style={{
                flex: 1,
                padding: '15px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignContent: 'flex-start'
            }}>
                {heroes.map((hero, index) => (
                    <div
                        key={hero.id}
                        draggable
                        onDragStart={() => onDragStart(hero)}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDrop(index);
                        }}
                        className="hero-tile"
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '10px',
                            backgroundImage: `url(${hero.img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'grab',
                            border: `2px solid ${tier.color}`,
                            boxShadow: `0 0 15px ${tier.color}66`,
                            transition: 'all 0.2s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const TierList: React.FC = () => {
    const [tierConfig, setTierConfig] = useState([
        { id: 'S', label: 'S', color: '#ff4b4b' },
        { id: 'A', label: 'A', color: '#ff9f43' },
        { id: 'B', label: 'B', color: '#feca57' },
        { id: 'C', label: 'C', color: '#1dd1a1' },
        { id: 'D', label: 'D', color: '#576574' },
    ]);

    const initialHeroes: Hero[] = [
        { id: "ana", name: "Ana", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Ana.png` },
        { id: "anran", name: "Anran", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Anran.png` },
        { id: "ashe", name: "Ashe", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Ashe.png` },
        { id: "baptiste", name: "Baptiste", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Baptiste.png` },
        { id: "bastion", name: "Bastion", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Bastion.png` },
        { id: "brigitte", name: "Brigitte", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Brigitte.png` },
        { id: "cassidy", name: "Cassidy", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Cassidy.png` },
        { id: "dva", name: "D.va", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/D.va.png` },
        { id: "domina", name: "Domina", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Domina.png` },
        { id: "doomfist", name: "Doomfist", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Doomfist.png` },
        { id: "echo", name: "Echo", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Echo.png` },
        { id: "emre", name: "Emre", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Emre.png` },
        { id: "freja", name: "Freja", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Freja.png` },
        { id: "genji", name: "Genji", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Genji.png` },
        { id: "hanzo", name: "Hanzo", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Hanzo.png` },
        { id: "hazard", name: "Hazard", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Hazard.png` },
        { id: "illari", name: "Illari", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Illari.png` },
        { id: "jetpackcat", name: "JetPackCat", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/JetPackCat.png` },
        { id: "junkerqueen", name: "Junker Queen", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/JunkerQueen.png` },
        { id: "junkrat", name: "Junkrat", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Junkrat.png` },
        { id: "juno", name: "Juno", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Juno.png` },
        { id: "kiriko", name: "Kiriko", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Kiriko.png` },
        { id: "lifeweaver", name: "Lifeweaver", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Lifeweaver.png` },
        { id: "lucio", name: "Lucio", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Lucio.png` },
        { id: "mauga", name: "Mauga", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Mauga.png` },
        { id: "mei", name: "Mei", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Mei.png` },
        { id: "mercy", name: "Mercy", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Mercy.png` },
        { id: "mizuki", name: "Mizuki", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Mizuki.png` },
        { id: "moira", name: "Moira", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Moira.png` },
        { id: "orisa", name: "Orisa", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Orisa.png` },
        { id: "pharah", name: "Pharah", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Pharah.png` },
        { id: "ramatra", name: "Ramatra", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Ramatra.png` },
        { id: "reaper", name: "Reaper", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Reaper.png` },
        { id: "reinhardt", name: "Reinhardt", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Reinhardt.png` },
        { id: "roadhog", name: "RoadHog", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/RoadHog.png` },
        { id: "sigma", name: "Sigma", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Sigma.png` },
        { id: "sojourn", name: "Sojourn", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Sojourn.png` },
        { id: "soldado76", name: "Soldado 76", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Soldado76.png` },
        { id: "sombra", name: "Sombra", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Sombra.png` },
        { id: "symmetra", name: "Symmetra", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Symmetra.png` },
        { id: "torbjorn", name: "Torbjörn", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Torbjörn.png` },
        { id: "tracer", name: "Tracer", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Tracer.png` },
        { id: "vendeta", name: "Vendeta", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Vendeta.png` },
        { id: "venture", name: "Venture", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Venture.png` },
        { id: "widowmaker", name: "Widowmaker", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Widowmaker.png` },
        { id: "winston", name: "Winston", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Winston.png` },
        { id: "wreckingball", name: "Wrecking Ball", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/WreckingBall.png` },
        { id: "wuyang", name: "Wuyang", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Wuyang.png` },
        { id: "zarya", name: "Zarya", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Zarya.png` },
        { id: "zenyatta", name: "Zenyatta", img: `${import.meta.env.VITE_R2_BASE_URL}/Overwatch/Zenyatta.png` },
    ];

    const [tiers, setTiers] = useState<TierState>({
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
        pool: initialHeroes
    });

    const [draggedHero, setDraggedHero] = useState<{ hero: Hero, fromTier: string } | null>(null);

    const handleDragStart = (hero: Hero, fromTier: string) => {
        setDraggedHero({ hero, fromTier });
    };

    const handleDrop = (toTier: string, toIndex?: number) => {
        if (!draggedHero) return;
        const { hero, fromTier } = draggedHero;

        setTiers(prev => {
            const newTiers = { ...prev };
            if (fromTier === toTier) {
                const list = [...newTiers[fromTier]];
                const oldIndex = list.findIndex(h => h.id === hero.id);
                if (oldIndex !== -1) {
                    list.splice(oldIndex, 1);
                    const targetIndex = typeof toIndex === 'number' ? toIndex : list.length;
                    list.splice(targetIndex, 0, hero);
                    newTiers[fromTier] = list;
                }
            } else {
                newTiers[fromTier] = newTiers[fromTier].filter(h => h.id !== hero.id);
                const destList = [...newTiers[toTier]];
                if (typeof toIndex === 'number') {
                    destList.splice(toIndex, 0, hero);
                } else {
                    destList.push(hero);
                }
                newTiers[toTier] = destList;
            }
            return newTiers;
        });
        setDraggedHero(null);
    };

    const resetTierlist = () => {
        setTiers({ S: [], A: [], B: [], C: [], D: [], pool: initialHeroes });
    };

    const updateLabel = (id: string, newLabel: string) => {
        setTierConfig(prev => prev.map(t => t.id === id ? { ...t, label: newLabel } : t));
    };

    // Efecto para Auto-scroll durante el Drag & Drop
    React.useEffect(() => {
        let scrollSpeed = 0;
        let animationFrameId: number;

        const handleGlobalDragOver = (e: DragEvent) => {
            if (!draggedHero) return;

            const threshold = 150; // Distancia desde el borde para empezar a scrollear
            const maxSpeed = 20;

            if (e.clientY < threshold) {
                // Scrollear hacia arriba
                scrollSpeed = -Math.max(1, (threshold - e.clientY) / threshold * maxSpeed);
            } else if (window.innerHeight - e.clientY < threshold) {
                // Scrollear hacia abajo
                scrollSpeed = Math.max(1, (threshold - (window.innerHeight - e.clientY)) / threshold * maxSpeed);
            } else {
                scrollSpeed = 0;
            }
        };

        const scrollLoop = () => {
            if (scrollSpeed !== 0) {
                window.scrollBy(0, scrollSpeed);
            }
            animationFrameId = requestAnimationFrame(scrollLoop);
        };

        if (draggedHero) {
            window.addEventListener('dragover', handleGlobalDragOver);
            animationFrameId = requestAnimationFrame(scrollLoop);
        }

        return () => {
            window.removeEventListener('dragover', handleGlobalDragOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, [draggedHero]);

    return (
        <section className="section fade-in">
            <div className="container-fluid" style={{ padding: '0 2rem' }}>
                <h1 className="section-title text-center">Tierlist Overwatch Personalizada</h1>

                <div className="warning-box glass" style={{
                    maxWidth: '1200px',
                    margin: '2.5rem auto 1.5rem',
                    border: '2px solid #ff4d4d',
                    padding: '1.5rem 2rem',
                    borderRadius: '16px',
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center',
                    background: 'rgba(255, 77, 77, 0.05)',
                    boxShadow: '0 0 30px rgba(255, 77, 77, 0.1)'
                }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#ff4d4d', fontSize: '2rem' }} />
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem', textShadow: '0 0 10px rgba(255, 77, 77, 0.3)' }}>
                            Información Legal
                        </p>
                        <p style={{ margin: 0, lineHeight: '1.5', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                            Overwatch y todos los personajes, nombres y elementos relacionados son marcas registradas y propiedad de Blizzard Entertainment.
                            Esta página web es un proyecto independiente de carácter informativo y no está afiliada, patrocinada ni respaldada por Blizzard Entertainment.
                        </p>
                    </div>
                </div>

                <div className="tierlist-main-layout" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4rem',
                    alignItems: 'center',
                    marginTop: '5rem',
                    position: 'relative',
                    width: '100%'
                }}>


                    {/* Tiers arriba */}
                    <div className="tiers-section" style={{ width: '100%', maxWidth: '1200px', position: 'relative' }}>
                        {/* Botón Reset alineado con la grilla */}
                        <button
                            onClick={resetTierlist}
                            style={{
                                position: 'absolute',
                                top: '-35px',
                                right: '0',
                                background: 'none',
                                border: 'none',
                                color: '#ff4d4d',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textShadow: '0 0 8px rgba(255, 77, 77, 0.6)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                zIndex: 10
                            }}
                        >
                            Resetear
                        </button>
                        <div className="tiers-grid">
                            {tierConfig.map(t => (
                                <TierRow
                                    key={t.id}
                                    tier={t}
                                    heroes={tiers[t.id]}
                                    onDrop={(idx) => handleDrop(t.id, idx)}
                                    onDragStart={(hero) => handleDragStart(hero, t.id)}
                                    onLabelChange={(label) => updateLabel(t.id, label)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Pool de personajes abajo */}
                    <div className="pool-section glass" style={{
                        width: '100%',
                        maxWidth: '1200px',
                        padding: '2rem',
                        borderRadius: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid rgba(255, 77, 77, 0.2)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                        marginBottom: '4rem'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.4rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px' }}>Héroes disponibles</h3>
                        <div
                            className="hero-pool"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop('pool')}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(12, 1fr)',
                                gap: '12px',
                                background: 'rgba(0,0,0,0.2)',
                                padding: '20px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            {tiers.pool.map((hero, index) => (
                                <div
                                    key={hero.id}
                                    draggable
                                    onDragStart={() => handleDragStart(hero, 'pool')}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDrop('pool', index); }}
                                    className="hero-tile"
                                    style={{
                                        width: '70px',
                                        height: '70px',
                                        borderRadius: '8px',
                                        backgroundImage: `url(${hero.img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'grab',
                                        border: '2px solid #000',
                                        boxShadow: '0 0 15px rgba(0, 0, 0, 0.8)',
                                        transition: 'all 0.2s ease',
                                        margin: 'auto'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hero-tile:hover { 
                    transform: scale(1.1); 
                    z-index: 10; 
                    filter: brightness(1.2);
                }
                .hero-tile:active { cursor: grabbing; }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 77, 77, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 77, 77, 0.5);
                }

                @media (max-width: 1100px) {
                    .tierlist-main-layout {
                        flex-direction: column;
                    }
                    .pool-section {
                        width: 100% !important;
                        position: relative !important;
                        top: 0 !important;
                        max-height: 400px !important;
                    }
                    .tierlist-main-layout > button {
                        top: -30px !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default TierList;
