import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './NewsWidget.css';

const NewsWidget: React.FC = () => {
    const [latestPosts, setLatestPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<any>(null);
    const AUTO_PLAY_TIME = 8000; // 8 segundos por noticia

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const { data, error } = await supabase
                    .from('news_articles')
                    .select('*')
                    .order('published_at', { ascending: false, nullsFirst: true })
                    .order('created_at', { ascending: false })
                    .limit(5);

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
                if (timeoutRef.current) clearInterval(timeoutRef.current);
                timeoutRef.current = setInterval(() => {
                    handleNext();
                }, AUTO_PLAY_TIME);
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

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric'
        };
        return date.toLocaleDateString('es-ES', options).toUpperCase();
    };

    const getImageUrl = (post: any) => {
        if (!post.header_image) return `${import.meta.env.VITE_R2_BASE_URL}/logo.png`;
        return post.header_image.startsWith('http') ? post.header_image : `${import.meta.env.VITE_R2_BASE_URL}/${post.header_image}`;
    };

    if (loading || latestPosts.length === 0) return null;

    return (
        <section className="news-widget-hero">
            <div className="news-hero-container">
                {latestPosts.map((post, index) => (
                    <Link
                        key={post.id}
                        to={`/noticias/${post.slug}`}
                        className={`news-hero-slide ${index === currentIndex ? 'active' : ''}`}
                    >
                        <div className="news-hero-image-wrapper">
                            <img src={getImageUrl(post)} alt={post.title} className="news-hero-img" />
                            <div className="news-hero-overlay"></div>
                        </div>

                        <div className="news-hero-content">
                            <div className="news-hero-tags">
                                <span className="news-hero-tag">{post.category || 'ARTÍCULO'}</span>
                            </div>
                            
                            <h2 className="news-hero-title">{post.title}</h2>
                            
                            <div className="news-hero-meta">
                                <span className="meta-date">{formatDate(post.published_at || post.created_at)}</span>
                                <div className="meta-author">
                                    <span>por {post.author || 'EvilTokkii'}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {/* Progress Indicators ( Estilo Crunchyroll ) */}
                <div className="news-hero-indicators">
                    {latestPosts.map((_, index) => (
                        <div 
                            key={index} 
                            className="indicator-track"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDotClick(index);
                            }}
                        >
                            <div 
                                className={`indicator-bar ${index === currentIndex ? 'filling' : (index < currentIndex ? 'full' : '')}`}
                                style={{ animationDuration: `${AUTO_PLAY_TIME}ms` }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsWidget;
