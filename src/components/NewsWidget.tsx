import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NewsWidget.css';

const NewsWidget: React.FC = () => {
    const [latestPosts, setLatestPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
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
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    useEffect(() => {
        // If we reached the clone (index 3 if there are 3 news)
        if (currentIndex === latestPosts.length && latestPosts.length > 0) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 800); // Wait for transition animation to finish (matching CSS)
        }
    }, [currentIndex, latestPosts.length]);

    if (loading || latestPosts.length === 0) return null;

    // Create a list with the first item cloned at the end for the infinite loop
    const slides = [...latestPosts, latestPosts[0]];

    return (
        <aside className="news-widget">
            <div className="news-header">
                <h3 className="widget-title">Últimas Noticias</h3>
            </div>
            <div className="news-slider-container">
                <div
                    className="news-slider-track"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                    }}
                >
                    {slides.map((post, index) => (
                        <div key={`${post.ID}-${index}`} className="news-slide">
                            <Link
                                to={`/noticias/${post.slug}`}
                                className="news-widget-item"
                                style={{ backgroundImage: `url(${post.featured_image || `${import.meta.env.VITE_R2_BASE_URL}/placeholder.jpg`})` }}
                            >
                                <div className="news-widget-overlay">
                                    <div className="news-text-content">
                                        <h4 dangerouslySetInnerHTML={{ __html: post.title }} />
                                        <div
                                            className="news-widget-excerpt"
                                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default NewsWidget;
