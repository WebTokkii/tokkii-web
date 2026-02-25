import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const NoticiaDetalle: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                // Usando la API REST v1.1 específicamente para el sitio tokkiixanews.wordpress.com
                const response = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/tokkiixanews.wordpress.com/posts/slug:${slug}`);

                if (!response.ok) {
                    throw new Error("No se pudo encontrar la noticia.");
                }

                const data = await response.json();
                setPost(data);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Ocurrió un error al cargar la noticia o el slug es inválido.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <section className="section text-center">
                <div className="container">
                    <p className="hero-subtitle">Cargando noticia...</p>
                    <div className="glow" style={{
                        width: '50px',
                        height: '50px',
                        margin: '2rem auto',
                        border: '4px solid var(--primary)',
                        borderRadius: '50%',
                        borderTopColor: 'transparent',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
                <style>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </section>
        );
    }

    if (error || !post) {
        return (
            <section className="section text-center">
                <div className="container">
                    <h2 className="section-title">¡Ups!</h2>
                    <p className="section-description">{error || "La noticia no existe."}</p>
                    <Link to="/noticias" className="btn-primary glow">Volver a Noticias</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="section fade-in">
            <div className="container">
                <Link to="/noticias" className="card-link" style={{ marginBottom: '2rem', display: 'inline-block' }}>
                    ← Volver a Noticias
                </Link>

                <article style={{ marginBottom: '4rem' }}>
                    {post.featured_image && (
                        <div style={{ width: '100%', height: '450px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                            <img src={post.featured_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    <h1 className="section-title" style={{ marginBottom: '1.5rem', textAlign: 'left' }}
                        dangerouslySetInnerHTML={{ __html: post.title }}
                    />

                    <div className="badge" style={{
                        marginBottom: '2rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '8px 20px',
                        background: 'rgba(255, 0, 110, 0.15)',
                        border: '1px solid var(--secondary)',
                        color: 'white',
                        borderRadius: '30px',
                        fontSize: '0.95rem'
                    }}>
                        <span style={{ fontWeight: '600' }}>{new Date(post.date).toLocaleDateString()}</span>
                        <span style={{ opacity: 0.3, height: '12px', width: '1px', background: 'white' }}></span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.9em', opacity: 0.9 }}>por {post.author?.name || "Tokkiixa"}</span>
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
                                flexShrink: 0,
                                boxShadow: '0 0 10px rgba(255, 0, 110, 0.3)'
                            }}>
                                <img src={post.author?.avatar_URL || `${import.meta.env.VITE_R2_BASE_URL}/logo.png`} alt={post.author?.name || "Tokkiixa"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>
                    </div>

                    <div
                        className="noticia-content"
                        style={{
                            fontSize: '1.15rem',
                            lineHeight: '1.8',
                            color: 'var(--text-main)',
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </div>
            <style>{`
                .noticia-content {
                    font-size: 1.2rem;
                    line-height: 1.85;
                }
                .noticia-content img {
                    margin: 2rem auto;
                    border-radius: 16px;
                    display: block;
                    max-width: 100%;
                    height: auto;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                .noticia-content figure {
                    margin: 3.5rem 0;
                    display: block;
                }
                .noticia-content figcaption {
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    margin-top: 1rem;
                    font-style: italic;
                }
                .noticia-content p {
                    margin-bottom: 2rem;
                }
                .noticia-content h1, .noticia-content h2, .noticia-content h3 {
                    margin-top: 4rem;
                    margin-bottom: 1.5rem;
                    color: #fff;
                    font-weight: 700;
                }
                .noticia-content ul, .noticia-content ol {
                    margin-bottom: 2rem;
                    padding-left: 1.5rem;
                }
                .noticia-content li {
                    margin-bottom: 0.8rem;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </section>
    );
};

export default NoticiaDetalle;
