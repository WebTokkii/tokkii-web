import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Noticias.css";

const Noticias: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data, error } = await supabase
                    .from('news_articles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPosts(data || []);
            } catch (err) {
                console.error("Error fetching articles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const SkeletonLoader = () => (
        <div className="news-list">
            {[1, 2, 3].map((i) => (
                <article key={i} className="news-item">
                    <div className="news-image skeleton"></div>
                    <div className="news-content">
                        <div className="news-meta skeleton"></div>
                        <div className="news-title skeleton"></div>
                        <div className="news-excerpt skeleton"></div>
                    </div>
                </article>
            ))}
        </div>
    );

    return (
        <section className="section fade-in">
            <div className="container" style={{ maxWidth: '1000px' }}>
                <h2 className="section-title text-center">💫 Noticias Gamer que No Te Puedes Perder 💫</h2>
                <p className="news-list-subtitle">
                    Las últimas noticias de videojuegos, lanzamientos, actualizaciones y tendencias del mundo gamer.
                </p>

                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="news-list">
                        {posts.slice(0, visibleCount).map(post => {
                            return (
                                <Link
                                    key={post.id}
                                    to={`/noticias/${post.slug}`}
                                    className="news-item-link"
                                >
                                    <article className="news-item">
                                        <div className="news-image">
                                            {post.header_image ? (
                                                <img 
                                                    src={post.header_image.startsWith('http') ? post.header_image : `${import.meta.env.VITE_R2_BASE_URL}/${post.header_image}`} 
                                                    alt={post.title} 
                                                    loading="lazy" 
                                                />
                                            ) : (
                                                <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
                                            )}
                                        </div>

                                        <div className="news-content">
                                            <h3 className="news-title">{post.title}</h3>

                                            {post.subtitle && (
                                                <p className="news-excerpt">{post.subtitle}</p>
                                            )}

                                            <div className="news-meta" style={{ marginTop: 'auto', justifyContent: 'space-between', width: '100%' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span>Creado por</span>
                                                    <div style={{
                                                        width: '1.4em',
                                                        height: '1.4em',
                                                        borderRadius: '50%',
                                                        overflow: 'hidden',
                                                        border: '1.5px solid var(--secondary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: 'var(--bg-dark)',
                                                        flexShrink: 0
                                                    }}>
                                                        <img
                                                            src={`${import.meta.env.VITE_R2_BASE_URL}/logo.png`}
                                                            alt={post.author}
                                                            className="news-meta-author-img"
                                                        />
                                                    </div>
                                                    <span>{post.author || "EvilTokkii"}</span>
                                                </div>
                                                <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!loading && visibleCount < posts.length && (
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <button
                            className="btn-primary glow"
                            onClick={() => setVisibleCount(prev => prev + 10)}
                            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
                        >
                            Ver más noticias
                        </button>
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center" style={{ padding: '4rem 0' }}>
                        <p className="hero-subtitle">No hay noticias disponibles por el momento.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Noticias;
