import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './NewsWidget.css';

const NewsWidget: React.FC = () => {
    const [latestPosts, setLatestPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const { data, error } = await supabase
                    .from('news_articles')
                    .select('*')
                    .order('published_at', { ascending: false, nullsFirst: false })
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (error) throw error;
                setLatestPosts(data || []);
            } catch (err) {
                console.error("Error fetching latest posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLatest();
    }, []);

    useEffect(() => {
        if (latestPosts.length > 0) {
            const startAutoPlay = () => {
                timeoutRef.current = setInterval(() => {
                    handleNext();
                }, 6000);
            };

            startAutoPlay();
            return () => {
                if (timeoutRef.current) clearInterval(timeoutRef.current);
            };
        }
    }, [latestPosts, currentIndex]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % latestPosts.length);
    };

    if (loading || latestPosts.length === 0) return null;
    return (
        <aside className="news-widget">
            <div className="news-header">
                <h3 className="widget-title">Últimas Noticias</h3>
            </div>
            <div className="news-fade-container">
                {latestPosts.map((post, index) => (
                    <div
                        key={post.id}
                        className={`news-fade-slide ${index === (currentIndex % latestPosts.length) ? 'active' : ''}`}
                    >
                        <Link
                            to={`/noticias/${post.slug}`}
                            className="news-widget-item-slim"
                        >
                            {/* Blurred background layer */}
                            <div
                                className="news-slim-bg"
                                style={{ 
                                    backgroundImage: `url(${post.header_image ? (post.header_image.startsWith('http') ? post.header_image : `${import.meta.env.VITE_R2_BASE_URL}/${post.header_image}`) : `${import.meta.env.VITE_R2_BASE_URL}/logo.png`})` 
                                }}
                            />

                            <div className="news-slim-content">
                                <div className="news-slim-text">
                                    <span className="news-widget-tag">NOTICIA</span>
                                    <h4>{post.title}</h4>
                                </div>
                                <div className="news-slim-image">
                                    <img
                                        src={post.header_image ? (post.header_image.startsWith('http') ? post.header_image : `${import.meta.env.VITE_R2_BASE_URL}/${post.header_image}`) : `${import.meta.env.VITE_R2_BASE_URL}/logo.png`}
                                        alt={post.title}
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default NewsWidget;
