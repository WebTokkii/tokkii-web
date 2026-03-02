import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NewsWidget.css';

const NewsWidget: React.FC = () => {
    const [latestPosts, setLatestPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        fetch("https://public-api.wordpress.com/rest/v1.1/sites/tokkiixanews.wordpress.com/posts?number=3")
            .then(res => res.json())
            .then(data => {
                setLatestPosts(data.posts || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching latest posts:", err);
                setLoading(false);
            });
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
                        key={post.ID}
                        className={`news-fade-slide ${index === (currentIndex % latestPosts.length) ? 'active' : ''}`}
                    >
                        <Link
                            to={`/noticias/${post.slug}`}
                            className="news-widget-item-slim"
                        >
                            {/* Blurred background layer */}
                            <div
                                className="news-slim-bg"
                                style={{ backgroundImage: `url(${post.featured_image || `${import.meta.env.VITE_R2_BASE_URL}/logo.png`})` }}
                            />

                            <div className="news-slim-content">
                                <div className="news-slim-text">
                                    <span className="news-widget-tag">NOTICIA</span>
                                    <h4 dangerouslySetInnerHTML={{ __html: post.title }} />
                                </div>
                                <div className="news-slim-image">
                                    <img
                                        src={post.featured_image || `${import.meta.env.VITE_R2_BASE_URL}/logo.png`}
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
