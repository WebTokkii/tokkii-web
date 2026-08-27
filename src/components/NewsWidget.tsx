import { resolveAssetUrl } from '../utils/assets';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import { getDailyNewsBundle } from '../data/DailyNewsData';

interface NewsWidgetProps {
    onActiveNewsChange?: (url: string) => void;
}

const NewsWidget: React.FC<NewsWidgetProps> = ({ onActiveNewsChange }) => {
    const [latestPosts, setLatestPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const { data } = await supabase
                    .from('news_articles')
                    .select('*')
                    .order('published_at', { ascending: false, nullsFirst: true })
                    .order('created_at', { ascending: false })
                    .limit(60);

                setLatestPosts(getDailyNewsBundle(data || []));
            } catch (err) {
                console.error("Error fetching latest posts:", err);
                setLatestPosts(getDailyNewsBundle([]));
            } finally {
                setLoading(false);
            }
        };

        fetchLatest();
    }, []);

    useEffect(() => {
        if (latestPosts.length > 0 && onActiveNewsChange) {
            const activeIndex = hoveredIndex !== null ? hoveredIndex : 0;
            const activePost = latestPosts[activeIndex];
            if (activePost) {
                onActiveNewsChange(getImageUrl(activePost));
            }
        }
    }, [latestPosts, hoveredIndex, onActiveNewsChange]);

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

    const getAuthorAvatar = (authorName: string) => {
        const name = authorName || 'EvilTokkii';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6F00DB&color=fff&bold=true&rounded=true`;
    };

    if (loading || latestPosts.length === 0) return null;

    const mainPost = latestPosts[0];
    const sidePosts = latestPosts.slice(1, 5);

    return (
        <div>
            {/* Encabezado */}
            <div className="section-head">
                <div>
                    <div className="kicker">Editorial</div>
                    <h2 className="title">En Tendencia</h2>
                </div>
            </div>

            {/* Layout principal */}
            <div className="news-grid">
                {/* Noticia destacada */}
                {mainPost && (
                    <Link 
                        to={`/noticias/${mainPost.slug}`} 
                        className="featured glass"
                        onMouseEnter={() => setHoveredIndex(0)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        aria-label={`Abrir noticia principal: ${mainPost.title}`}
                    >
                        <div className="img">
                            <img src={getImageUrl(mainPost)} alt={mainPost.title} />
                        </div>
                        <div className="content">
                            <span className="tag">{mainPost.category || 'Anuncios'}</span>
                            <h3>{mainPost.title}</h3>
                            <div className="meta">
                                <div className="author">
                                    <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginRight: '4px' }}>por</span>
                                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{mainPost.author || 'EvilTokkii'}</span>
                                </div>
                                <div className="date">{formatDate(mainPost.published_at || mainPost.created_at)}</div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Columna derecha */}
                <div className="news-side">
                    {sidePosts.map((post, idx) => {
                        const originalIndex = idx + 1;
                        return (
                            <Link 
                                key={post.id} 
                                to={`/noticias/${post.slug}`} 
                                className="side glass"
                                onMouseEnter={() => setHoveredIndex(originalIndex)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                aria-label={`Abrir noticia: ${post.title}`}
                            >
                                <div className="img">
                                    <img src={getImageUrl(post)} alt={post.title} />
                                </div>
                                <div className="content">
                                    <span className="tag">{post.category || 'Anuncios'}</span>
                                    <h4>{post.title}</h4>
                                    <div className="meta">
                                        <div className="date">{formatDate(post.published_at || post.created_at)}</div>
                                        <span style={{ opacity: 0.4 }}>•</span>
                                        <div className="author-simple" style={{ fontSize: '.88rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                                            por <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{(post.author || 'EVILTOKKII').toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NewsWidget;
