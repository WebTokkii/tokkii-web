import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Noticias.css";

const Noticias: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        fetch("https://public-api.wordpress.com/rest/v1.1/sites/tokkiixanews.wordpress.com/posts")
            .then(res => res.json())
            .then(data => {
                const sortedPosts = (data.posts || []).sort((a: any, b: any) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setPosts(sortedPosts);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching posts:", err);
                setLoading(false);
            });
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
                            // Extract plain text from excerpt if possible, or use dangerouslySetInnerHTML
                            return (
                                <Link
                                    key={post.ID}
                                    to={`/noticias/${post.slug}`}
                                    className="news-item-link"
                                >
                                    <article className="news-item">
                                        <div className="news-image">
                                            {post.featured_image ? (
                                                <img src={post.featured_image} alt={post.title} loading="lazy" />
                                            ) : (
                                                <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
                                            )}
                                        </div>

                                        <div className="news-content">
                                            <h3
                                                className="news-title"
                                                dangerouslySetInnerHTML={{ __html: post.title }}
                                            />

                                            <div
                                                className="news-excerpt"
                                                dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                            />

                                            <div className="news-meta" style={{ marginTop: 'auto', justifyContent: 'space-between', width: '100%' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span>Creado por</span>
                                                    <img
                                                        src={post.author?.avatar_URL || `${import.meta.env.VITE_R2_BASE_URL}/logo.png`}
                                                        alt={post.author?.name}
                                                        className="news-meta-author-img"
                                                    />
                                                    <span>{post.author?.name || "Tokkiixa"}</span>
                                                </div>
                                                <span>{new Date(post.date).toLocaleDateString()}</span>
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
