import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './MostStreamed.css';

interface StreamedItem {
    id: number;
    title: string;
    image_url: string;
}

const MostStreamed: React.FC = () => {
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

    if (loading || streamedData.length === 0) return null;

    return (
        <section className="most-streamed-section">
            <div className="streamed-header">
                <h3 className="streamed-widget-title">Lo más Streameado</h3>
            </div>

            <div className="streamed-grid-vertical">
                {streamedData.map((item) => (
                    <div key={item.id} className="streamed-vertical-card">
                        <div className="streamed-card-inner">
                            <img 
                                src={getImageUrl(item.image_url)} 
                                alt={item.title} 
                                className="streamed-card-img"
                            />
                            <div className="streamed-card-overlay">
                                <h4 className="streamed-card-name">{item.title}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MostStreamed;
