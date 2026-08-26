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

            <div className="streamed-horizontal-grid">
                {streamedData.map((item) => (
                    <div key={item.id} className="streamed-horizontal-card">
                        <div className="streamed-card-thumb">
                            <img 
                                src={getImageUrl(item.image_url)} 
                                alt={item.title} 
                                onError={(e: any) => {
                                    e.target.src = `${import.meta.env.VITE_R2_BASE_URL}/logo.png`;
                                }}
                            />
                        </div>
                        <div className="streamed-card-body">
                            <h3 className="streamed-card-title">{item.title}</h3>
                            {item.description ? (
                                <p className="streamed-card-desc">{item.description}</p>
                            ) : (
                                <p className="streamed-card-desc placeholder">Partidas, directos y momentos destacados de {item.title}.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MostStreamed;
