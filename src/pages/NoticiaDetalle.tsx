import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Parrafo de Keywords constante para todas las noticias (Oculto para el usuario, visible para SEO)
const SEO_KEYWORDS_PARAGRAPH = "Keywords: Tokkii, EvilTokkii, Noticias de Videojuegos, Anime, Manga, Cultura Geek, Sorteos, Comunidad, Streaming, Capcom, Pragata, Atomic Heart DLC final, noticia gaming hoy, videojuegos 2026, lanzamientos gaming abril, Atomic Heart expansión, Análisis de juegos, Reviews, Gaming News, Noticias de hoy";

const NoticiaDetalle = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const { data, error: sbError } = await supabase
                    .from('news_articles')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (sbError || !data) {
                    throw new Error("No se pudo encontrar la noticia.");
                }

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short'
        };
        const formatted = date.toLocaleDateString('es-ES', options).toUpperCase();
        // ABRIL -> ABR, etc. to match the image style "16 ABR 2026"
        return formatted;
    };

    if (loading) {
        return (
            <section className="section text-center" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container">
                    <p style={{
                        color: 'rgba(255, 0, 110, 1)', 
                        fontSize: '1.4rem', 
                        fontWeight: 900,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        textShadow: '0 0 20px rgba(255, 0, 110, 0.6)',
                        margin: 0
                    }}>
                        Cargando noticia...
                    </p>
                    <div className="glow" style={{
                        width: '50px',
                        height: '50px',
                        margin: '2rem auto 0',
                        border: '4px solid rgba(255, 0, 110, 0.15)',
                        borderRadius: '50%',
                        borderTopColor: 'rgba(255, 0, 110, 1)',
                        boxShadow: '0 0 15px rgba(255, 0, 110, 0.4)',
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
                <article className="noticia-article">
                    <header className="noticia-header">
                        <div className="noticia-tags">
                            {(() => {
                                const getPostCategory = () => {
                                    if (post && post.content_blocks && Array.isArray(post.content_blocks)) {
                                        const meta = post.content_blocks.find((b: any) => b.type === 'metadata');
                                        if (meta && meta.category) {
                                            return meta.category.toLowerCase() === 'anime' ? 'animes' : 'videojuegos';
                                        }
                                    }
                                    return 'videojuegos';
                                };
                                const postCategory = getPostCategory();
                                return (
                                    <Link to="/noticias" state={{ category: postCategory }} className="back-btn-styled" title="Volver a Noticias">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                                        </svg>
                                        <span>VOLVER ATRÁS</span>
                                    </Link>
                                );
                            })()}
                            <span className="tag-badge">ARTÍCULO</span>
                        </div>
                        
                        <p className="noticia-date">
                            Publicado: {formatDate(post.published_at || post.created_at)}
                        </p>

                        <h1 className="noticia-title">
                            {post.title.toUpperCase()}
                        </h1>

                        {post.subtitle && (
                            <p className="noticia-subtitle">
                                {post.subtitle}
                            </p>
                        )}

                        <div className="noticia-author">
                            <span className="by-prefix">por</span>
                            <span className="author-name">{post.author || "EvilTokkii"}</span>
                        </div>
                    </header>

                    {post.header_image && (
                        <div className="noticia-hero-image">
                            <img 
                                src={post.header_image.startsWith('http') ? post.header_image : `${import.meta.env.VITE_R2_BASE_URL}/${post.header_image}`} 
                                alt={post.title} 
                            />
                        </div>
                    )}

                    <div className="noticia-content">
                        {post.content_blocks && Array.isArray(post.content_blocks) ? (
                            post.content_blocks.map((block: any, index: number) => {
                                if (block.type === 'text') {
                                    // Si el bloque de texto empieza con "Keywords:", lo ocultamos visualmente pero lo mantenemos para SEO
                                    const isKeywordsBlock = block.content.trim().toLowerCase().startsWith('keywords:') || 
                                                           block.content.trim().toLowerCase().startsWith('<p>keywords:');
                                    
                                    return (
                                        <div 
                                            key={index} 
                                            className={`text-block ${isKeywordsBlock ? 'seo-hidden-paragraph' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: block.content }} 
                                        />
                                    );
                                } else if (block.type === 'image') {
                                    return (
                                        <figure key={index} className="image-block">
                                            <img 
                                                src={block.url?.startsWith('http') ? block.url : `${import.meta.env.VITE_R2_BASE_URL}/${block.url}`} 
                                                alt={block.caption || ''} 
                                            />
                                            {block.caption && <figcaption>{block.caption}</figcaption>}
                                        </figure>
                                    );
                                }
                                return null;
                            })
                        ) : (
                            <p style={{ opacity: 0.5 }}>Esta noticia no tiene contenido aún.</p>
                        )}

                        {/* Párrafo constante oculto para SEO al final de todas las noticias */}
                        <div className="seo-hidden-paragraph">
                            <p>{SEO_KEYWORDS_PARAGRAPH}</p>
                        </div>
                    </div>
                </article>
            </div>
            <style>{`
                .noticia-article {
                    max-width: 900px;
                    margin: 0 auto 4rem;
                }

                .noticia-header {
                    margin-bottom: 2.5rem;
                }

                .noticia-tags {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }
                .back-btn-styled {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    color: white;
                    font-weight: 800;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                    transition: var(--transition);
                }
                .back-btn-styled:hover {
                    color: var(--secondary);
                    transform: translateX(-5px);
                }
                .tag-badge {
                    background: var(--secondary);
                    color: white;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    box-shadow: 0 4px 15px rgba(255, 0, 110, 0.3);
                }

                .noticia-date {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin-bottom: 1.5rem;
                    opacity: 0.8;
                }

                .noticia-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1.1;
                    margin-bottom: 1rem;
                    color: white;
                }

                .noticia-subtitle {
                    font-size: 1.6rem;
                    color: #d1d1d1;
                    margin-bottom: 2rem;
                    line-height: 1.4;
                    font-weight: 400;
                }

                .noticia-author {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .author-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .author-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .by-prefix {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: lowercase;
                    font-weight: 500;
                    margin-right: 2px;
                }
                .author-name {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--secondary);
                    text-shadow: 0 0 10px rgba(255, 0, 110, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .noticia-hero-image {
                    width: 100%;
                    max-height: 600px;
                    border-radius: 0;
                    overflow: hidden;
                    margin-bottom: 3rem;
                }
                .noticia-hero-image img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .noticia-content {
                    font-size: 1.25rem;
                    line-height: 1.8;
                    color: #ececec;
                    --heading-top-margin: 3.5rem;
                    --heading-bottom-margin: 1.2rem;
                }
                .noticia-content p {
                    margin-bottom: 2rem;
                }
                .noticia-content h1, 
                .noticia-content h2, 
                .noticia-content h3 {
                    margin-top: var(--heading-top-margin);
                    margin-bottom: var(--heading-bottom-margin);
                    color: white;
                    font-weight: 700;
                    line-height: 1.3;
                }
                /* Evitar margen superior excesivo si el título es lo primero */
                .noticia-content *:first-child {
                    margin-top: 0;
                }
                .noticia-content img {
                    max-width: 100%;
                    border-radius: 8px;
                    margin: 2.5rem 0;
                }
                
                /* Override source/external link button inside news content to turquoise glass */
                .noticia-content a[style*="display"], 
                .noticia-content a[style*="border-radius"],
                .noticia-content a[class*="btn"] {
                    display: block !important;
                    background: linear-gradient(180deg, rgba(255, 255, 255, .04), rgba(255, 255, 255, .01)) !important;
                    border: 1px solid rgba(51, 236, 192, 0.45) !important;
                    box-shadow: 0 0 14px rgba(51, 236, 192, 0.18) !important;
                    color: #fff !important;
                    text-shadow: none !important;
                    padding: 14px 24px !important;
                    border-radius: 999px !important;
                    text-align: center !important;
                    text-transform: uppercase !important;
                    font-weight: 800 !important;
                    font-size: 0.9rem !important;
                    text-decoration: none !important;
                    margin: 2.5rem auto !important;
                    max-width: 100% !important;
                    transition: all 0.25s ease !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                }

                .noticia-content a[style*="display"]:hover,
                .noticia-content a[style*="border-radius"]:hover,
                .noticia-content a[class*="btn"]:hover {
                    border-color: rgba(51, 236, 192, 0.85) !important;
                    box-shadow: 0 0 25px rgba(51, 236, 192, 0.45) !important;
                    transform: translateY(-2px) !important;
                }

                /* SEO Hidden Paragraph - Modern hiding technique for SEO (Visible to crawlers/screen readers, hidden from users) */
                .seo-hidden-paragraph {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }

                @media (max-width: 768px) {
                    .noticia-title {
                        font-size: 2.5rem;
                    }
                    .noticia-subtitle {
                        font-size: 1.3rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default NoticiaDetalle;
