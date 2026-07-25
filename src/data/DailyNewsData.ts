// Sistema de Generación Constante de Noticias Diarias (3 Videojuegos + 3 Anime = 6 Noticias Diarias)

export interface ContentBlock {
  type: 'text' | 'image' | 'metadata';
  content?: string;
  url?: string;
  caption?: string;
  category?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  header_image: string;
  slug: string;
  author: string;
  published_at: string;
  created_at: string;
  category: 'VIDEOJUEGOS' | 'ANIME';
  content_blocks: ContentBlock[];
}

// Helper to get local date string YYYY-MM-DD
function getLocalDateStr(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const VIDEOJUEGOS_NEWS_POOL: Omit<NewsArticle, 'published_at' | 'created_at'>[] = [
  {
    id: 'vg-news-1',
    title: 'GTA VI: ROCKSTAR GAMES CONFIRMA NUEVA VENTANA DE LANZAMIENTO Y DETALLES DE VICE CITY',
    subtitle: 'Rockstar revela nuevos avances sobre el mapa dinámico de Leonida y las físicas de nueva generación.',
    header_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    slug: 'gta-vi-rockstar-games-detalles-vice-city',
    author: 'EVILTOKKII',
    category: 'VIDEOJUEGOS',
    content_blocks: [
      {
        type: 'text',
        content: '<p><strong>Rockstar Games</strong> ha actualizado oficialmente la información sobre <em>Grand Theft Auto VI</em>, reafirmando su compromiso de revolucionar el género del mundo abierto en consolas de última generación. El estado ficticio de Leonida promete ser el entorno gráfico más complejo jamás creado en la industria de los videojuegos.</p>'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80',
        caption: 'Vice City contará con densidad de transeúntes e Inteligencia Artificial adaptativa sin precedentes.'
      },
      {
        type: 'text',
        content: '<p>Entre las principales novedades destacan la interacción con redes sociales dentro del juego, eventos climáticos dinámicos como huracanes e inundaciones, y un sistema de físicas de vehículos mejorado con el motor RAGE de última versión.</p>'
      },
      {
        type: 'text',
        content: '<p>Keywords: GTA VI, Rockstar Games, Vice City, Grand Theft Auto 6, lanzamientos 2026, PS5, Xbox Series X, EvilTokkii Noticias</p>'
      }
    ]
  },
  {
    id: 'vg-news-2',
    title: 'MONSTER HUNTER WILDS: CAPCOM REVELA NUEVAS CRIATURAS Y CAZAS COOPERATIVAS',
    subtitle: 'Capcom presenta la jugabilidad de las Tierras Prohibidas con ecosistemas cambiantes en tiempo real.',
    header_image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
    slug: 'monster-hunter-wilds-capcom-nuevas-criaturas',
    author: 'ESPEEEOON',
    category: 'VIDEOJUEGOS',
    content_blocks: [
      {
        type: 'text',
        content: '<p>La franquicia estrella de <strong>Capcom</strong> da un salto masivo con <em>Monster Hunter Wilds</em>. En esta entrega, las tormentas eléctricas y sequías alterarán drásticamente el comportamiento de los monstruos e introducirán recursos minerales exclusivos durante los cambios climáticos.</p>'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1000&auto=format&fit=crop&q=80',
        caption: 'Las monturas Seikret permitirán llevar dos armas distintas durante la misma cacería.'
      },
      {
        type: 'text',
        content: '<p>Los cazadores podrán invocar a camaradas Palamute y Seikrets para realizar ataques combinados y transportar botiquines adicionales en batallas de alta dificultad contra los ápex regionales.</p>'
      }
    ]
  },
  {
    id: 'vg-news-3',
    title: 'PLAYSTATION 5 PRO REVELA MEJORAS CON UNREAL ENGINE 5.5 Y PSSR AVANZADO',
    subtitle: 'Sony y Epic Games muestran cómo la tecnología de reescalado por IA duplica la tasa de cuadros en 4K.',
    header_image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&auto=format&fit=crop&q=80',
    slug: 'playstation-5-pro-unreal-engine-pssr-avanzado',
    author: 'PAMACHE',
    category: 'VIDEOJUEGOS',
    content_blocks: [
      {
        type: 'text',
        content: '<p><strong>Sony Interactive Entertainment</strong> ha presentado una demostración técnica mostrando las capacidades de la PS5 Pro integrando las últimas utilidades de <em>Unreal Engine 5.5</em>. La tecnología PSSR (PlayStation Spectral Super Resolution) logra mantener 60 FPS estables con Ray Tracing completo activado.</p>'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
        caption: 'El trazado de rayos por aceleración de hardware logra reflejos hyper-realistas en superficies acuáticas y cristales.'
      },
      {
        type: 'text',
        content: '<p>Más de 50 títulos existentes recibirán parches de optimización gratuitos para aprovechar la GPU ampliada e iluminación global mejorada.</p>'
      }
    ]
  },
  {
    id: 'vg-news-4',
    title: 'ELDEN RING SHADOW OF THE ERDTREE RECIBE PARCHE DE EQUILIBRIO FINAL Y NUEVOS DESAFÍOS',
    subtitle: 'FromSoftware ajusta las armas de la Tierra de las Sombras e incluye opciones para jefes de prueba.',
    header_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    slug: 'elden-ring-shadow-erdtree-parche-final-desafios',
    author: 'EVILTOKKII',
    category: 'VIDEOJUEGOS',
    content_blocks: [
      {
        type: 'text',
        content: '<p><strong>FromSoftware</strong> y Hidetaka Miyazaki han publicado la actualización 1.14 para la célebre expansión <em>Shadow of the Erdtree</em> de Elden Ring. Este parche implementa ajustes de balance en las armas de tipo Perfumista y espadas de empuñadura inversa.</p>'
      },
      {
        type: 'text',
        content: '<p>Asimismo, los jugadores podrán volver a enfrentarse a los jefes principales desde los Sitios de Gracia en un modo de panteón especial con modificadores de dificultad personalizables.</p>'
      }
    ]
  },
  {
    id: 'vg-news-5',
    title: 'ATOMIC HEART FINAL EXPANSION: MUNDFISH ANUNCIA EL DESENLACE DE LA SAGA SOVIÉTICA',
    subtitle: 'El último DLC incluirá nuevas instalaciones subterráneas y ciborgs de seguridad autónomos.',
    header_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    slug: 'atomic-heart-dlc-final-expansion-mundfish',
    author: 'ESPEEEOON',
    category: 'VIDEOJUEGOS',
    content_blocks: [
      {
        type: 'text',
        content: '<p>El estudio <strong>Mundfish</strong> ha desvelado los primeros detalles del cuarto y final contenido descargable para <em>Atomic Heart</em>. El Agente P-3 se adentrará en el núcleo del Complejo 3826 para revelar los secretos finales del polímero sintético.</p>'
      },
      {
        type: 'text',
        content: '<p>Se añadirán dos guantes elementales inéditos, rompecabezas de gravedad cero y una banda sonora electromagnética producida junto a compositores invitados.</p>'
      }
    ]
  }
];

export const ANIME_NEWS_POOL: Omit<NewsArticle, 'published_at' | 'created_at'>[] = [
  {
    id: 'anime-news-1',
    title: 'JUJUTSU KAISEN TEMPORADA 3: MAPPA PRESENTA EL PRIMER TRÁILER DE LA CACERÍA DEL SACRIFICIO',
    subtitle: 'El popular anime de batallas sobrenaturales confirma su regreso con una animación de escala cinematográfica.',
    header_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    slug: 'jujutsu-kaisen-temporada-3-mappa-trailer-caceria',
    author: 'EVILTOKKII',
    category: 'ANIME',
    content_blocks: [
      {
        type: 'text',
        content: '<p>El reconocido estudio de animación <strong>MAPPA</strong> ha liberado el primer tráiler oficial de la tercera temporada de <em>Jujutsu Kaisen</em>, adaptando el aclamado arco del <em>Culling Game</em> (La Cacería del Sacrificio).</p>'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
        caption: 'Yuji Itadori y Yuta Okkotsu protagonizarán intensos combates en las colonias de barreras mágicas.'
      },
      {
        type: 'text',
        content: '<p>La producción mantendrá al director Sunghoo Park y a Shota Goshozono liderando el diseño de secuencias de acción, prometiendo los efectos de energía maldita más fluidos hasta la fecha.</p>'
      },
      {
        type: 'text',
        content: '<p>Keywords: Jujutsu Kaisen, MAPPA, Anime 2026, Yuji Itadori, Sukuna, Culling Game, Otaku, EvilTokkii Anime</p>'
      }
    ]
  },
  {
    id: 'anime-news-2',
    title: 'DEMON SLAYER (KIMETSU NO YAIBA): UFOTABLE CONFIRMA LA TRILOGÍA DEL CASTILLO INFINITO',
    subtitle: 'La batalla final contra Muzan Kibutsuji se dividirá en tres largometrajes globales para cines.',
    header_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    slug: 'demon-slayer-trilogia-castillo-infinito-ufotable',
    author: 'ESPEEEOON',
    category: 'ANIME',
    content_blocks: [
      {
        type: 'text',
        content: '<p><strong>Ufotable</strong> y Aniplex han anunciado oficialmente el plan de lanzamiento para el desenlace de <em>Kimetsu no Yaiba</em>. La saga del Castillo Infinito llegará a los cines de todo el mundo en formato de una trilogía cinematográfica de alto presupuesto.</p>'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=80',
        caption: 'Los Pilares y Tanjiro Kamado se adentrarán en la dimensión distorsionada de Nakime.'
      },
      {
        type: 'text',
        content: '<p>La primera entrega cinematográfica contará con sonido envolvente Dolby Atmos y proyección IMAX en salas seleccionadas.</p>'
      }
    ]
  },
  {
    id: 'anime-news-3',
    title: 'ONE PIECE: TOEI ANIMATION ANUNCIA EL INICIO DE LA SAGA DE ELBAF CON NUEVO ESTILO VISUAL',
    subtitle: 'Luffy y los Sombrero de Paja arriban a la mítica tierra de los gigantes en una adaptación totalmente renovada.',
    header_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    slug: 'one-piece-toei-animation-saga-elbaf-nuevo-estilo',
    author: 'PAMACHE',
    category: 'ANIME',
    content_blocks: [
      {
        type: 'text',
        content: '<p>Tras la conclusión del vibrante arco de Egghead, <strong>Toei Animation</strong> ha presentado la nueva dirección de arte para la saga de Elbaf en <em>One Piece</em>. La animación adoptará acuarelas nórdicas y trazados dinámicos inspirados en la mitología vikinga.</p>'
      },
      {
        type: 'text',
        content: '<p>Eiichiro Oda ha colaborado estrechamente con el equipo de diseño para plasmar la majestuosidad del árbol Yggdrasil y los guerreros gigantes de Elbaf.</p>'
      }
    ]
  },
  {
    id: 'anime-news-4',
    title: 'CHAINSAW MAN: LA PELÍCULA DEL ARCO DE REZE ANUNCIA FECHA DE ESTRENO MUNDIAL',
    subtitle: 'MAPPA adapta la historia de la Chica Bomba en una producción cinematográfica apasionante.',
    header_image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
    slug: 'chainsaw-man-pelicula-arco-reze-estreno',
    author: 'EVILTOKKII',
    category: 'ANIME',
    content_blocks: [
      {
        type: 'text',
        content: '<p>El peligroso romance entre Denji y Reze llegará a las grandes pantallas. <strong>MAPPA</strong> ha confirmado que <em>Chainsaw Man The Movie: Reze Arc</em> se estrenará mundialmente con clasificación para adultos.</p>'
      },
      {
        type: 'text',
        content: '<p>La banda sonora estará a cargo de Kensuke Ushio, combinando sintetizadores oscuros con arreglos orquestales para los enfrentamientos de alta velocidad.</p>'
      }
    ]
  },
  {
    id: 'anime-news-5',
    title: 'SOLO LEVELING TEMPORADA 2 (ARISE FROM THE SHADOW): A-1 PICTURES REVELA AVANCES',
    subtitle: 'Sung Jinwoo enfrenta la amenaza de los Monarcas en la esperada continuación del éxito de acción.',
    header_image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    slug: 'solo-leveling-temporada-2-arise-shadow-a1-pictures',
    author: 'ESPEEEOON',
    category: 'ANIME',
    content_blocks: [
      {
        type: 'text',
        content: '<p><strong>A-1 Pictures</strong> y Crunchyroll han presentado el primer avance extendido para la segunda temporada de <em>Solo Leveling</em>, titulada <em>Arise from the Shadow</em>.</p>'
      },
      {
        type: 'text',
        content: '<p>Sung Jinwoo expandirá su ejército de sombras e ingresará a mazmorras de rango S nunca antes exploradas.</p>'
      }
    ]
  }
];

// Combine all pool news
export const ALL_POOL_NEWS: Omit<NewsArticle, 'published_at' | 'created_at'>[] = [
  ...VIDEOJUEGOS_NEWS_POOL,
  ...ANIME_NEWS_POOL
];

/**
 * Generates exact 3 Videojuegos news and 3 Anime news for a specific day.
 * Rotates deterministically based on date so news change/refresh daily.
 */
export function getConstantDailyNews(category: 'videojuegos' | 'animes', targetDateStr?: string): NewsArticle[] {
  const dateStr = targetDateStr || getLocalDateStr();
  
  // Calculate deterministic seed from date string YYYY-MM-DD
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed += dateStr.charCodeAt(i) * (i + 1);
  }

  const pool = category === 'videojuegos' ? VIDEOJUEGOS_NEWS_POOL : ANIME_NEWS_POOL;
  const count = pool.length;
  
  // Pick 3 distinct items based on seed
  const selected: NewsArticle[] = [];
  const startIndex = Math.abs(seed) % count;

  for (let i = 0; i < 3; i++) {
    const itemIdx = (startIndex + i) % count;
    const baseItem = pool[itemIdx];
    selected.push({
      ...baseItem,
      published_at: `${dateStr}T10:${String(i * 15).padStart(2, '0')}:00Z`,
      created_at: `${dateStr}T10:${String(i * 15).padStart(2, '0')}:00Z`
    });
  }

  return selected;
}

/**
 * Ensures there are ALWAYS at least 3 news articles per category for the specified date (or overall).
 * Merges Supabase articles with generated daily news cleanly.
 */
export function getGuaranteedCategoryNews(
  category: 'videojuegos' | 'animes',
  supabaseArticles: any[]
): NewsArticle[] {
  const todayStr = getLocalDateStr();

  // Helper to check if post is anime
  const isAnimePost = (post: any) => {
    if (post.category && post.category.toUpperCase() === 'ANIME') return true;
    if (post.content_blocks && Array.isArray(post.content_blocks)) {
      const meta = post.content_blocks.find((b: any) => b.type === 'metadata');
      if (meta && meta.category && meta.category.toUpperCase() === 'ANIME') {
        return true;
      }
    }
    const animeKeywords = ['anime', 'manga', 'otaku', 'crunchyroll', 'demon slayer', 'shingeki', 'dragon ball', 'jujutsu', 'goku', 'naruto', 'boruto', 'one piece', 'chainsaw', 'solo leveling', 'bleach', 'hero academia', 'spy x family'];
    const title = (post.title || '').toLowerCase();
    const subtitle = (post.subtitle || '').toLowerCase();
    return animeKeywords.some(kw => title.includes(kw) || subtitle.includes(kw));
  };

  const filteredSb = supabaseArticles
    .filter(p => category === 'animes' ? isAnimePost(p) : !isAnimePost(p))
    .sort((a, b) => new Date(b.published_at || b.created_at || 0).getTime() - new Date(a.published_at || a.created_at || 0).getTime());

  const merged = [...filteredSb];
  if (merged.length < 3) {
    const fallbackDaily = getConstantDailyNews(category, todayStr);
    const existingSlugs = new Set(merged.map(p => p.slug));

    for (const item of fallbackDaily) {
      if (merged.length >= 3) break;
      if (!existingSlugs.has(item.slug)) {
        merged.push(item);
        existingSlugs.add(item.slug);
      }
    }
  }

  // Strictly cap at 3 articles per category per day
  return merged.slice(0, 3);
}

/**
 * Searches for a news article by slug in both Supabase data and Pool news dataset
 */
export function findNewsArticleBySlug(slug: string, supabaseData?: any): NewsArticle | null {
  if (supabaseData) return supabaseData;

  const found = ALL_POOL_NEWS.find(n => n.slug === slug);
  if (found) {
    const todayStr = getLocalDateStr();
    return {
      ...found,
      published_at: `${todayStr}T10:00:00Z`,
      created_at: `${todayStr}T10:00:00Z`
    };
  }

  return null;
}
