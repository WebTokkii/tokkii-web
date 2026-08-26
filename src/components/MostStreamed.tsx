import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface StreamedItem {
    id: number;
    title: string;
    image_url: string;
    description?: string;
    order_index?: number;
}

interface MostStreamedProps {
    hideHeader?: boolean;
    onGamesLoad?: (images: string[]) => void;
    onlyLoad?: boolean;
}

const MostStreamed: React.FC<MostStreamedProps> = ({ hideHeader = false, onGamesLoad, onlyLoad = false }) => {
    const [streamedData, setStreamedData] = useState<StreamedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreamed = async () => {
            try {
                const { data, error } = await supabase
                    .from('most_streamed')
                    .select('*')
                    .order('order_index', { ascending: true });

                if (error) throw error;
                setStreamedData(data || []);
            } catch (err) {
                console.error("Error fetching most streamed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStreamed();
    }, []);

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return `${import.meta.env.VITE_R2_BASE_URL}/logo.png`;
        return imagePath.startsWith('http') ? imagePath : `${import.meta.env.VITE_R2_BASE_URL}/${imagePath}`;
    };

    useEffect(() => {
        if (streamedData.length > 0 && onGamesLoad) {
            onGamesLoad(streamedData.map(item => getImageUrl(item.image_url)));
        }
    }, [streamedData, onGamesLoad]);

    if (loading || streamedData.length === 0) return null;
    if (onlyLoad) return null;

    return (
        <div style={{ width: '100%' }}>
            {!hideHeader && (
                <div className="section-head">
                    <div>
                        <div className="kicker">Catálogo reciente</div>
                        <h2 className="title">Lo stremeado últimamente</h2>
                    </div>
                </div>
            )}

            <div 
                className="streamed-two-columns-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
                    gap: '20px',
                    width: '100%',
                    marginTop: '10px'
                }}
            >
                {streamedData.map((item) => (
                    <div 
                        key={item.id} 
                        className="streamed-horizontal-card"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '20px',
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(111, 0, 219, 0.08))',
                            backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                            border: '1px solid var(--line, rgba(233, 176, 255, 0.15))',
                            borderRadius: '20px',
                            padding: '18px 22px',
                            boxShadow: 'var(--shadow, 0 10px 30px rgba(0, 0, 0, 0.35))',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Miniatura Izquierda (92px x 132px) */}
                        <div 
                            className="streamed-card-thumb"
                            style={{
                                width: '92px',
                                minWidth: '92px',
                                maxWidth: '92px',
                                height: '132px',
                                maxHeight: '132px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                background: '#0d0714',
                                border: '1px solid rgba(233, 176, 255, 0.2)',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img 
                                src={getImageUrl(item.image_url)} 
                                alt={item.title} 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    display: 'block'
                                }}
                                onError={(e: any) => {
                                    e.target.src = `${import.meta.env.VITE_R2_BASE_URL}/logo.png`;
                                }}
                            />
                        </div>

                        {/* Contenido Derecho: Título Mayor + Descripción Mayor */}
                        <div 
                            className="streamed-card-body"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                flex: 1,
                                minWidth: 0
                            }}
                        >
                            <h3 
                                className="streamed-card-title"
                                style={{
                                    margin: 0,
                                    fontSize: '1.35rem',
                                    fontWeight: 800,
                                    color: '#ffffff',
                                    lineHeight: 1.25,
                                    letterSpacing: '-0.01em'
                                }}
                            >
                                {item.title}
                            </h3>

                            {item.description ? (
                                <p 
                                    className="streamed-card-desc"
                                    style={{
                                        margin: 0,
                                        fontSize: '0.98rem',
                                        color: '#cbd5e1',
                                        lineHeight: 1.6,
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-line'
                                    }}
                                >
                                    {item.description}
                                </p>
                            ) : (
                                <p 
                                    className="streamed-card-desc placeholder"
                                    style={{
                                        margin: 0,
                                        fontSize: '0.92rem',
                                        color: 'var(--muted, #a1a1aa)',
                                        fontStyle: 'italic',
                                        opacity: 0.75,
                                        lineHeight: 1.5
                                    }}
                                >
                                    Partidas, directos y momentos destacados de {item.title}.
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MostStreamed;
