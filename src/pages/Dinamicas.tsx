import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faArrowRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../components/NewsWidget.css';
import './Home.css';
import { supabase } from '../lib/supabase';


const DinamicaCardVertical: React.FC<{ item: any, hoverColor?: string, style?: React.CSSProperties }> = ({ item, hoverColor = '255, 77, 77', style }) => {
    const [isHovered, setIsHovered] = useState(false);
    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/${imagePath}`;
    };

    return (
        <div
            className="event-card-vertical glass"
            style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.02)',
                border: isHovered ? `1px solid rgba(${hoverColor}, 0.5)` : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isHovered ? `0 0 25px rgba(${hoverColor}, 0.35)` : '0 20px 40px rgba(0, 0, 0, 0.4)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                height: '460px',
                position: 'relative',
                ...style
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                width: '100%',
                height: '220px',
                overflow: 'hidden',
                position: 'relative',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                WebkitMaskImage: '-webkit-radial-gradient(white, black)'
            }}>
                {item.imagen ? (
                    <img
                        src={getImageUrl(item.imagen)}
                        alt={item.titulo}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #1e0536 0%, #7b2cbf 50%, #ff006e 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <span style={{
                            fontSize: '2rem',
                            fontWeight: '900',
                            letterSpacing: '4px',
                            color: '#fff',
                            textShadow: '0 0 20px rgba(255, 77, 77, 0.6)',
                            opacity: 0.8
                        }}>TOKKII</span>
                    </div>
                )}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(15, 2, 26, 0.8) 100%)',
                    pointerEvents: 'none'
                }} />
            </div>
            <div style={{
                padding: '1.5rem',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgba(15, 2, 26, 0.45)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: isHovered ? '#ff4d4d' : '#fff',
                        margin: 0,
                        lineHeight: '1.3',
                        letterSpacing: '0.5px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        transition: 'color 0.3s ease'
                    }}>{item.titulo}</h3>
                    <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.65)',
                        margin: 0,
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                    }}>{item.descripcion || ''}</p>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ff4d4d', letterSpacing: '1px' }}>FECHA</span>
                        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '600' }}>{item.fecha}</span>
                    </div>
                    {item.estado === 'terminado' || item.estado === 'finalizado' ? (
                        <span style={{
                            color: 'rgba(255, 255, 255, 0.35)',
                            fontSize: '0.95rem',
                            fontWeight: '800',
                            letterSpacing: '0.5px'
                        }}>
                            Finalizado
                        </span>
                    ) : item.slug ? (
                        <Link
                            to={`/dinamicas/${item.slug}`}
                            style={{
                                color: '#ff4d4d',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: '800',
                                letterSpacing: '0.5px',
                                transition: 'all 0.3s ease',
                                textShadow: isHovered ? '0 0 10px rgba(255, 77, 77, 0.6)' : 'none'
                            }}
                        >
                            Más info <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
                        </Link>
                    ) : (
                        <span style={{
                            color: '#ff4d4d',
                            fontSize: '0.95rem',
                            fontWeight: '800',
                            letterSpacing: '0.5px',
                            opacity: 0.85
                        }}>
                            ¡Prepárate!
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const ArrowButton: React.FC<{ direction: 'left' | 'right', onClick: () => void, disabled?: boolean }> = ({ direction, onClick, disabled }) => {
    const isLeft = direction === 'left';
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                position: 'absolute',
                [isLeft ? 'left' : 'right']: '-20px',
                top: '50%',
                transform: isHovered ? 'translateY(-50%) scale(1.15)' : 'translateY(-50%) scale(1)',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: isHovered ? 'rgba(255, 77, 77, 0.15)' : 'rgba(15, 2, 26, 0.75)',
                border: isHovered ? '1px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isHovered ? '#ff4d4d' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: 10,
                boxShadow: isHovered ? '0 0 25px rgba(255, 77, 77, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                outline: 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <FontAwesomeIcon icon={isLeft ? faChevronLeft : faChevronRight} style={{ fontSize: '1.25rem' }} />
        </button>
    );
};

const DinamicasCarousel: React.FC<{ items: any[], hoverColor?: string }> = ({ items, hoverColor }) => {
    const [visibleCards, setVisibleCards] = useState(4);
    const [activeIndex, setActiveIndex] = useState(4);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const updateVisibleCards = () => {
            const width = window.innerWidth;
            if (width < 600) {
                setVisibleCards(1);
            } else if (width < 900) {
                setVisibleCards(2);
            } else if (width < 1200) {
                setVisibleCards(3);
            } else {
                setVisibleCards(4);
            }
        };
        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, []);

    useEffect(() => {
        setActiveIndex(visibleCards);
    }, [visibleCards]);

    if (items.length === 0) return null;

    if (items.length <= visibleCards) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${visibleCards}, minmax(220px, 320px))`,
                gap: '2rem',
                justifyContent: 'start',
                width: '100%',
                marginBottom: 0
            }}>
                {items.map((evento, index) => (
                    <DinamicaCardVertical key={`dinamica-grid-${index}`} item={evento} hoverColor={hoverColor} />
                ))}
            </div>
        );
    }

    const clonedItems = [
        ...items.slice(-visibleCards),
        ...items,
        ...items.slice(0, visibleCards)
    ];

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveIndex(prev => prev - 1);
    };

    const handleTransitionEnd = () => {
        setIsAnimating(false);
        if (activeIndex >= items.length + visibleCards) {
            setActiveIndex(visibleCards);
        } else if (activeIndex <= visibleCards - 1) {
            setActiveIndex(items.length + visibleCards - 1);
        }
    };

    const gap = '2rem';

    return (
        <div className="carousel-wrapper-container" style={{ position: 'relative', width: '100%', padding: '0 20px', marginBottom: 0 }}>
            <ArrowButton direction="left" onClick={handlePrev} />
            <ArrowButton direction="right" onClick={handleNext} />
            <div className="slider-window" style={{ width: '100%', overflow: 'hidden', padding: '10px 0' }}>
                <div
                    style={{
                        display: 'flex',
                        gap: gap,
                        transition: isAnimating ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                        transform: `translateX(calc(-${activeIndex} * (100% + ${gap}) / ${visibleCards}))`,
                        width: '100%'
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {clonedItems.map((evento, idx) => (
                        <DinamicaCardVertical
                            key={`dinamica-carousel-${idx}`}
                            item={evento}
                            hoverColor={hoverColor}
                            style={{
                                flex: `0 0 calc((100% - ${(visibleCards - 1) * 2}rem) / ${visibleCards})`,
                                minWidth: `calc((100% - ${(visibleCards - 1) * 2}rem) / ${visibleCards})`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Dinamicas: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            const { data, error } = await supabase
                .from('content_items')
                .select('*')
                .in('tipo', ['evento', 'sorteo'])
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching dynamic items:', error);
            } else {
                setItems(data || []);
            }
            setLoading(false);
        };

        fetchItems();
    }, []);

    const parseFecha = (fechaStr: string, createdAtStr: string) => {
        if (!fechaStr) return new Date(createdAtStr || 0);
        const months: { [key: string]: number } = {
            enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
            julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
        };
        const cleanStr = fechaStr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        let day: number | null = null;
        let month: number | null = null;
        let year: number | null = null;
        
        for (const [mName, mVal] of Object.entries(months)) {
            if (cleanStr.includes(mName)) {
                month = mVal;
                break;
            }
        }
        
        if (month !== null) {
            const numbers = cleanStr.match(/\d+/g);
            if (numbers) {
                if (numbers.length === 1) {
                    day = parseInt(numbers[0], 10);
                } else if (numbers.length >= 2) {
                    const possibleYear1 = parseInt(numbers[0], 10);
                    const possibleYear2 = parseInt(numbers[1], 10);
                    if (possibleYear1 > 1000) {
                        year = possibleYear1;
                        day = possibleYear2;
                    } else if (possibleYear2 > 1000) {
                        year = possibleYear2;
                        day = possibleYear1;
                    } else {
                        day = possibleYear1;
                    }
                }
            }
        }
        
        if (day !== null && month !== null) {
            const fallbackYear = createdAtStr ? new Date(createdAtStr).getFullYear() : 2026;
            const finalYear = year || fallbackYear;
            const timeMatch = cleanStr.match(/(\d{1,2}):(\d{2})/);
            let hours = 0;
            let minutes = 0;
            if (timeMatch) {
                hours = parseInt(timeMatch[1], 10);
                minutes = parseInt(timeMatch[2], 10);
            }
            return new Date(finalYear, month, day, hours, minutes);
        }
        
        return new Date(createdAtStr || 0);
    };

    const eventosActivos = items
        .filter(i => i.tipo === 'evento' && i.estado === 'activo')
        .sort((a, b) => parseFecha(a.fecha, a.created_at).getTime() - parseFecha(b.fecha, b.created_at).getTime());
    const sorteosActivos = items
        .filter(i => i.tipo === 'sorteo' && i.estado === 'activo')
        .sort((a, b) => parseFecha(a.fecha, a.created_at).getTime() - parseFecha(b.fecha, b.created_at).getTime());
    const proximasDinamicas = items
        .filter(i => (i.tipo === 'evento' || i.tipo === 'sorteo') && i.estado === 'proximo')
        .sort((a, b) => parseFecha(a.fecha, a.created_at).getTime() - parseFecha(b.fecha, b.created_at).getTime());

    const eventosTerminados = items
        .filter(i => (i.tipo === 'evento' || i.tipo === 'sorteo') && (i.estado === 'terminado' || i.estado === 'finalizado'))
        .sort((a, b) => parseFecha(b.fecha, b.created_at).getTime() - parseFecha(a.fecha, a.created_at).getTime());

    const displayProximas = proximasDinamicas.length > 0 ? proximasDinamicas : [{
        id: 'placeholder',
        titulo: 'Nuevos Sorteos y Eventos',
        descripcion: 'Estamos preparando dinámicas increíbles con fabulosos premios y eventos únicos. ¡Mantente muy atento a los próximos anuncios en el canal!',
        fecha: 'Próximamente',
        imagen: '',
        slug: ''
    }];

    return (
        <div className="dinamicas-wrapper fade-in" style={{ width: '100%' }}>
            {/* Warning Box & Admin Ruleta Container */}
            <div className="wrap" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
                {/* Warning Box */}
                <div className="warning-box glass" style={{
                    border: '2px solid #ff4d4d',
                    padding: '1.5rem 2rem',
                    borderRadius: '16px',
                    marginBottom: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: 'rgba(255, 77, 77, 0.05)'
                }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#ff4d4d', fontSize: '2rem' }} />
                    <div>
                        <p style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>¡Atención importante!</p>
                        <p style={{ margin: 0, lineHeight: '1.5', color: 'rgba(255,255,255,0.9)' }}>
                            Los formularios de Dinámicas (Eventos y Sorteos) con información incorrecta, incompleta o que no coincida con los datos verificados en stream serán invalidados automáticamente, perdiendo el derecho a participación o premio. Revisa bien tus datos antes de enviarlo.
                        </p>
                    </div>
                </div>


            </div>

            {/* 1. Sección Eventos Activos (con estructura de Juegos) */}
            <section className="home-section juegos-section-gradient" style={{ minHeight: 'auto', padding: '2.5rem 0' }}>
                <div className="section-overlay" style={{ background: 'radial-gradient(circle, rgba(15, 2, 26, 0.35) 0%, rgba(15, 2, 26, 0.85) 100%)' }}></div>
                
                <div className="wrap">
                    <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                        <div>
                            <div className="kicker">¡Participa y Gana!</div>
                            <h2 className="title">Eventos Activos</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center" style={{ padding: '3rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>Cargando dinámicas...</p>
                        </div>
                    ) : eventosActivos.length === 0 ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '24px',
                            border: '1px dashed rgba(255, 255, 255, 0.1)'
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', margin: 0 }}>
                                No hay eventos activos en este momento. ¡Vuelve pronto!
                            </p>
                        </div>
                    ) : (
                        <DinamicasCarousel items={eventosActivos} hoverColor="157, 78, 221" />
                    )}
                </div>
            </section>

            {/* 2. Sección Sorteos Activos (con estructura de Juegos/Redes) */}
            <section className="home-section redes-section-gradient" style={{ minHeight: 'auto', padding: '2.5rem 0' }}>
                <div className="section-overlay" style={{ background: 'radial-gradient(circle, rgba(15, 2, 26, 0.35) 0%, rgba(15, 2, 26, 0.85) 100%)' }}></div>
                
                <div className="wrap">
                    <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                        <div>
                            <div className="kicker">¡Prueba tu suerte!</div>
                            <h2 className="title">Sorteos Activos</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center" style={{ padding: '3rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>Cargando dinámicas...</p>
                        </div>
                    ) : sorteosActivos.length === 0 ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '24px',
                            border: '1px dashed rgba(255, 255, 255, 0.1)'
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', margin: 0 }}>
                                No hay sorteos activos en este momento. ¡Vuelve pronto!
                            </p>
                        </div>
                    ) : (
                        <DinamicasCarousel items={sorteosActivos} hoverColor="0, 245, 212" />
                    )}
                </div>
            </section>

            {/* 3. Sección Próximas Dinámicas (Próximamente) */}
            <section className="home-section twitch-section-gradient" style={{ minHeight: 'auto', padding: '2.5rem 0' }}>
                <div className="section-overlay" style={{ background: 'radial-gradient(circle, rgba(15, 2, 26, 0.35) 0%, rgba(15, 2, 26, 0.85) 100%)' }}></div>
                
                <div className="wrap">
                    <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                        <div>
                            <div className="kicker">¡Ten paciencia, que ya llegan!</div>
                            <h2 className="title">Próximas Dinámicas</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center" style={{ padding: '3rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>Cargando dinámicas...</p>
                        </div>
                    ) : (
                        <DinamicasCarousel items={displayProximas} hoverColor="255, 0, 110" />
                    )}
                </div>
            </section>

            {/* 4. Sección Eventos Terminados (Historial) */}
            <section className="home-section" style={{ minHeight: 'auto', padding: '2.5rem 0', background: 'linear-gradient(135deg, rgba(15, 7, 23, 0.4) 10%, rgba(20, 15, 30, 0.4) 60%, rgba(100, 100, 100, 0.05) 100%)' }}>
                <div className="section-overlay" style={{ background: 'radial-gradient(circle, rgba(15, 2, 26, 0.35) 0%, rgba(15, 2, 26, 0.85) 100%)' }}></div>
                
                <div className="wrap">
                    <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                        <div>
                            <div className="kicker">Historial</div>
                            <h2 className="title">Eventos Terminados</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center" style={{ padding: '3rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>Cargando dinámicas...</p>
                        </div>
                    ) : eventosTerminados.length === 0 ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '24px',
                            border: '1px dashed rgba(255, 255, 255, 0.1)'
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', margin: 0 }}>
                                No hay eventos terminados por el momento.
                            </p>
                        </div>
                    ) : (
                        <DinamicasCarousel items={eventosTerminados} hoverColor="150, 150, 150" />
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dinamicas;
