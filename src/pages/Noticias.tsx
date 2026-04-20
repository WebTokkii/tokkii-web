import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Noticias.css';

const Noticias = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [sideItems, setSideItems] = useState<{ sorteos: any[], eventos: any[] }>({ sorteos: [], eventos: [] });
    const [loading, setLoading] = useState(true);

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

    const getRelativeTime = (dateStr: string) => {
        if (!dateStr) return '';
        const now = new Date();
        const past = new Date(dateStr);
        const diffInMs = now.getTime() - past.getTime();
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMins < 1) return 'AHORA MISMO';
        if (diffInMins < 60) return `HACE ${diffInMins} MINUTO${diffInMins !== 1 ? 'S' : ''}`;
        if (diffInHours < 24) return `HACE ${diffInHours} HORA${diffInHours !== 1 ? 'S' : ''}`;
        if (diffInDays < 30) return `HACE ${diffInDays} DÍA${diffInDays !== 1 ? 'S' : ''}`;
        return formatDate(dateStr);
    };

    const getImageUrl = (image: string) => {
        if (!image) return `${import.meta.env.VITE_R2_BASE_URL}/logo.png`;
        return image.startsWith('http') ? image : `${import.meta.env.VITE_R2_BASE_URL}/${image}`;
    };

    // Componente para Noticia Principal (Estilo solicitado)
    const MainNewsCard = ({ post }: { post: any }) => (
        <Link to={`/noticias/${post.slug}`} className="news-modern-card">
            <div className="news-card-content">
                <span className="news-card-category">{post.category || 'TENDENCIA'}</span>
                <h2 className="news-card-title">{post.title}</h2>
                {post.subtitle && <p className="news-card-excerpt">{post.subtitle}</p>}
                <span className="news-card-more">LEER MÁS »</span>
                <div className="news-card-footer">
                    <span className="footer-item author">
                        POR {(post.author || 'TOKII').toUpperCase()}
                    </span>
                    <span className="footer-divider">-</span>
                    <span className="footer-item time">
                        {getRelativeTime(post.published_at || post.created_at)}
                    </span>
                </div>
            </div>
            <div className="news-card-image">
                <img src={getImageUrl(post.header_image)} alt={post.title} />
            </div>
        </Link>
    );

    // Componente para Sidebar (Estilo CR Mini)
    const SidebarNewsCard = ({ item, type }: { item: any, type: string }) => (
        <Link to={type === 'sorteo' ? `/sorteos` : `/eventos`} className="cr-side-card">
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

    if (loading) return <div className="loading-state">Cargando noticias...</div>;

    return (
        <section className="noticias-page">
            <div className="container">
                <div className="cr-grid">
                    
                    {/* Columna Izquierda: Noticias Principales */}
                    <div className="cr-feed">
                        {posts.map(post => (
                            <MainNewsCard key={post.id} post={post} />
                        ))}
                    </div>

                    {/* Columna Derecha: Sidebar Minimalista */}
                    <aside className="cr-sidebar">
                        <div className="cr-sticky-wrapper">
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
