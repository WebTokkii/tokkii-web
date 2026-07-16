import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Noticias.css';

const Noticias = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [sideItems, setSideItems] = useState<{ sorteos: any[], eventos: any[] }>({ sorteos: [], eventos: [] });
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState<'videojuegos' | 'animes'>(
        location.state?.category || 'videojuegos'
    );

    useEffect(() => {
        setVisibleCount(10);
    }, [activeCategory]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch News Articles
                const { data: newsData } = await supabase
                    .from('news_articles')
                    .select('*')
                    .order('published_at', { ascending: false, nullsFirst: true })
                    .order('created_at', { ascending: false });

                // Fetch Sorteos (2) & Eventos (2) from content_items
                const [{ data: sorteosData }, { data: eventosData }] = await Promise.all([
                    supabase.from('content_items').select('*').eq('tipo', 'sorteo').order('created_at', { ascending: false }).limit(2),
                    supabase.from('content_items').select('*').eq('tipo', 'evento').order('created_at', { ascending: false }).limit(2)
                ]);

                if (newsData) setPosts(newsData);
                setSideItems({
                    sorteos: sorteosData || [],
                    eventos: eventosData || []
                });
            } catch (error) {
                console.error('Error fetching news content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
    };

    const getImageUrl = (image: string) => {
        if (!image) return `${import.meta.env.VITE_R2_BASE_URL}/logo.png`;
        return image.startsWith('http') ? image : `${import.meta.env.VITE_R2_BASE_URL}/${image}`;
    };

    const getAuthorAvatar = (authorName: string) => {
        const name = authorName || 'EvilTokkii';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6F00DB&color=fff&bold=true&rounded=true`;
    };

    const getDisplayPosts = () => {
        const isAnimePost = (post: any) => {
            if (post.content_blocks && Array.isArray(post.content_blocks)) {
                const meta = post.content_blocks.find((b: any) => b.type === 'metadata');
                if (meta && meta.category) {
                    return meta.category === 'ANIME';
                }
            }
            const animeKeywords = ['anime', 'manga', 'otaku', 'crunchyroll', 'demon slayer', 'shingeki', 'dragon ball', 'jujutsu', 'goku', 'naruto', 'boruto', 'one piece'];
            return animeKeywords.some(kw => post.title.toLowerCase().includes(kw) || (post.subtitle && post.subtitle.toLowerCase().includes(kw)));
        };
        
        if (activeCategory === 'videojuegos') {
            return posts.filter(p => !isAnimePost(p));
        } else {
            const dbAnime = posts.filter(p => isAnimePost(p));
            if (dbAnime.length > 0) return dbAnime;
            
            // Premium placeholders if no anime is synced yet
            return [
                {
                    id: 'anime-mock-1',
                    title: 'JUJUTSU KAISEN TEMPORADA 3 REVELA SU PRIMER ADELANTO OFICIAL',
                    subtitle: 'El estudio MAPPA comparte las primeras escenas de la esperada continuación del arco de la Cacería del Sacrificio.',
                    header_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60',
                    slug: 'jujutsu-kaisen-temporada-3-adelanto',
                    author: 'EVILTOKKII',
                    published_at: new Date().toISOString(),
                    category: 'ANIME'
                },
                {
                    id: 'anime-mock-2',
                    title: 'DEMON SLAYER MOVIE TRILOGY CONTRAPRODUCE FECHAS DE LANZAMIENTO',
                    subtitle: 'Ufotable detalla la distribución global de la trilogía de películas del arco del Castillo Infinito para finales de año.',
                    header_image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=60',
                    slug: 'demon-slayer-castillo-infinito-peliculas',
                    author: 'ESPEEEOON',
                    published_at: new Date(Date.now() - 3600000 * 5).toISOString(),
                    category: 'ANIME'
                }
            ];
        }
    };

    // Componente para Sidebar (Estilo CR Mini)
    const SidebarNewsCard = ({ item, type }: { item: any, type: string }) => (
        <Link to={`/dinamicas/${item.slug}`} className="cr-side-card">
            <div className="cr-side-image">
                <img 
                    src={getImageUrl(item.imagen)} 
                    alt={item.titulo} 
                    onError={(e) => (e.currentTarget.src = `${import.meta.env.VITE_R2_BASE_URL}/logo.png`)}
                />
            </div>
            <div className="cr-side-content">
                <div className="cr-badges">
                    <span className={`cr-badge ${type === 'sorteo' ? 'purple' : 'blue'}`}>
                        {type === 'sorteo' ? 'SORTEO' : 'EVENTO'}
                    </span>
                </div>
                <h3 className="cr-side-title">{item.titulo}</h3>
                <span className="cr-side-date">{formatDate(item.created_at)}</span>
            </div>
        </Link>
    );

    if (loading) {
        return (
            <div className="loading-state" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                Cargando noticias...
            </div>
        );
    }

    const displayPosts = getDisplayPosts();
    const visiblePosts = displayPosts.slice(0, visibleCount);
    const mainPost = visiblePosts[0];
    const sidePosts = visiblePosts.slice(1);

    return (
        <section className="noticias-page">
            <div className="wrap">
                {/* Switch superior de categorías */}
                <div className="news-switch-container">
                    <button 
                        className={`btn ${activeCategory === 'videojuegos' ? 'primary' : 'secondary'}`} 
                        onClick={() => setActiveCategory('videojuegos')}
                    >
                        Videojuegos
                    </button>
                    <button 
                        className={`btn ${activeCategory === 'animes' ? 'primary' : 'secondary'}`} 
                        onClick={() => setActiveCategory('animes')}
                    >
                        Anime
                    </button>
                </div>

                <div className="cr-grid">
                    {/* Columna Izquierda: Noticias Principales */}
                    <div className="cr-feed">
                        <div className="news-grid" style={{ gridTemplateColumns: '1fr' }}>
                            {/* Noticia destacada */}
                            {mainPost && (
                                <Link 
                                    to={`/noticias/${mainPost.slug}`} 
                                    className="featured glass"
                                    aria-label={`Abrir noticia principal: ${mainPost.title}`}
                                >
                                    <div className="img">
                                        <img src={getImageUrl(mainPost.header_image)} alt={mainPost.title} />
                                    </div>
                                    <div className="content">
                                        <span className="tag">{mainPost.category || (activeCategory === 'animes' ? 'ANIME' : 'VIDEOJUEGOS')}</span>
                                        <h3>{mainPost.title}</h3>
                                        <p style={{ color: 'var(--muted)', fontSize: '1rem', marginTop: '8px', marginBottom: '16px', lineHeight: '1.5' }}>
                                            {mainPost.subtitle}
                                        </p>
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

                            {/* Resto de Noticias en Rejilla */}
                            {sidePosts.length > 0 && (
                                <div className="news-side" style={{ marginTop: '24px' }}>
                                    {sidePosts.map((post) => (
                                        <Link 
                                            key={post.id} 
                                            to={`/noticias/${post.slug}`} 
                                            className="side glass"
                                            aria-label={`Abrir noticia: ${post.title}`}
                                        >
                                            <div className="img">
                                                <img src={getImageUrl(post.header_image)} alt={post.title} />
                                            </div>
                                            <div className="content">
                                                <span className="tag">{post.category || (activeCategory === 'animes' ? 'ANIME' : 'VIDEOJUEGOS')}</span>
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
                                    ))}
                                </div>
                            )}

                            {/* Botón de cargar más */}
                            {displayPosts.length > visibleCount && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                                    <button 
                                        className="btn secondary"
                                        onClick={() => setVisibleCount(prev => prev + 10)}
                                        style={{
                                            padding: '0.8rem 2.5rem',
                                            fontSize: '0.95rem',
                                            fontWeight: 'bold',
                                            borderRadius: '999px',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        Cargar más
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha: Sidebar */}
                    <aside className="cr-sidebar">
                        <div className="cr-sticky-wrapper">
                            <div className="section-head" style={{ marginBottom: '20px' }}>
                                <div>
                                    <div className="kicker">Comunidad</div>
                                    <h3 className="title" style={{ fontSize: '1.4rem' }}>Dinámicas</h3>
                                </div>
                            </div>
                            {sideItems.sorteos.map(item => (
                                <SidebarNewsCard key={item.id} item={item} type="sorteo" />
                            ))}
                            {sideItems.eventos.map(item => (
                                <SidebarNewsCard key={item.id} item={item} type="evento" />
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default Noticias;
