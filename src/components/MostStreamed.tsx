import React from 'react';
import './MostStreamed.css';

interface StreamedItem {
    id: number;
    title: string;
    image: string;
}

const mostStreamedData: StreamedItem[] = [
    { id: 1, title: 'Overwatch', image: `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Overwatch.png` },
    { id: 2, title: 'Reanimal', image: `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Reanimal.png` },
    { id: 3, title: 'Poppy Playtime', image: `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/PoppyPlayTime.png` },
    { id: 4, title: 'Teamfight Tactics', image: `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/TeamfightTactics.png` },
    { id: 5, title: 'GTA V', image: `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/GTA_V.png` },
    { id: 6, title: 'Just Chatting', image: `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/JustCHatting.png` },
];

const MostStreamed: React.FC = () => {
    return (
        <section className="most-streamed-section">
            <div className="news-header">
                <h3 className="widget-title">Lo más Streameado</h3>
            </div>

            <div className="streamed-grid">
                {mostStreamedData.map((item) => (
                    <div key={item.id} className="streamed-card glass glow-hover">
                        <div
                            className="streamed-image"
                            style={{ backgroundImage: `url(${item.image})` }}
                        >
                            <div className="streamed-overlay">
                                <h4>{item.title}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MostStreamed;
