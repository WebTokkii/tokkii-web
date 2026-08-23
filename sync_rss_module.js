import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://hddzijixsigsqsmabtej.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_bJGAVsHsVrSu2KAhbEC7DA_DpYnxDAp';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_AUTHORS = ['EVILTOKKII', 'REQUIEM373', 'ESPEEEOON', 'PAMACHE', 'NPEZE'];
const DAILY_CATEGORY_LIMIT = 3;

function getLocalDateStr(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getHash(value) {
    return Math.abs(
        String(value || '').split('').reduce((acc, char) => {
            acc = ((acc << 5) - acc) + char.charCodeAt(0);
            return acc & acc;
        }, 0)
    ).toString(36).substring(0, 8);
}

function pickAuthor(seed) {
    const hash = getHash(seed);
    const index = parseInt(hash, 36) % DEFAULT_AUTHORS.length;
    return DEFAULT_AUTHORS[index];
}

function ensureAbsoluteUrl(url, baseUrl) {
    if (!url) return '';
    try {
        return new URL(url, baseUrl).toString();
    } catch {
        return url;
    }
}

function extractTagValue(xml, tagName) {
    const escapedTag = tagName.replace(':', '\\:');
    const cdataMatch = xml.match(new RegExp(`<${escapedTag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${escapedTag}>`, 'i'));
    if (cdataMatch?.[1]) return cdataMatch[1];
    const regularMatch = xml.match(new RegExp(`<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`, 'i'));
    return regularMatch?.[1] || '';
}

function getCategoryFallbackImage(category) {
    return category === 'ANIME'
        ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80';
}

// Helper to translate text to Spanish using Google Translate public API
async function translateText(text) {
    if (!text) return '';
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url);
        const sentences = response.data[0];
        let translatedText = '';
        for (const sentence of sentences) {
            if (sentence[0]) {
                translatedText += sentence[0];
            }
        }
        return translatedText;
    } catch (e) {
        console.error("Translation error:", e.message);
        return text; // Fallback to English on error
    }
}

// Helper to decode HTML entities
function decodeHtmlEntities(text) {
    if (!text) return '';
    return text
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ');
}

// Generate slugs
function generateSlug(title) {
    return title
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function cleanDescription(html) {
    if (!html) return '';
    let clean = decodeHtmlEntities(html);
    clean = clean.replace(/<img[^>]*>/gi, '').replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
    // Replace structural block tags with newlines to preserve separation
    clean = clean.replace(/<\/p>|<br\s*\/?>|<\/div>|<\/li>|<\/h[1-6]>/gi, '\n');
    clean = clean.replace(/<[^>]*>/g, '').trim();
    return clean;
}

function formatParagraphs(text) {
    if (!text) return '';
    // Split by newlines first
    const lines = text.split(/\r?\n+/);
    const paragraphs = [];
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        // If a line is very long (over 400 chars), split by sentences to make it readable
        if (trimmed.length > 400) {
            const sentences = trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed];
            let currentParagraph = '';
            for (let i = 0; i < sentences.length; i++) {
                currentParagraph += sentences[i];
                if ((i + 1) % 3 === 0 || currentParagraph.length > 300) {
                    paragraphs.push(currentParagraph.trim());
                    currentParagraph = '';
                }
            }
            if (currentParagraph.trim()) {
                paragraphs.push(currentParagraph.trim());
            }
        } else {
            paragraphs.push(trimmed);
        }
    }
    
    // Wrap each block in a paragraph tag with readable styling
    return paragraphs
        .map(p => `<p style="margin-bottom: 1.5rem; text-align: justify; line-height: 1.8;">${p}</p>`)
        .join('\n');
}

const ANIME_KEYWORDS = [
    'anime', 'manga', 'otaku', 'crunchyroll', 'animacion', 'animación',
    'temporada', 'doblaje', 'doblaje latino', 'pelicula', 'película',
    'demon slayer', 'kimetsu', 'jujutsu', 'dragon ball', 'naruto', 'one piece',
    'chainsaw man', 'bleach', 'toei', 'mappa', 'ufotable', 'aniplex', 'boku no hero',
    'my hero academia', 'spy x family', 'solo leveling', 'frieren', 'mononoke',
    'dan da dan', 'dandadan', 'blue lock', 'kaiju', 'isekai', 'shingeki',
    'attack on titan', 'gundam', 'evangelion', 'romance', 'manhwa', 'webtoon'
];

function isStrictCategory(category, title, description, sourceCategory) {
    const text = `${title} ${description}`.toLowerCase();
    
    if (category === 'ANIME') {
        const isPureGaming = (text.includes('gta 6') || text.includes('gta vi') || text.includes('playstation 5') || text.includes('xbox series') || text.includes('tarjeta gráfica') || text.includes('rtx 40') || text.includes('gameplay trailer') || text.includes('nintendo switch 2')) && !text.includes('anime') && !text.includes('manga');
        if (isPureGaming) return false;

        if (sourceCategory === 'ANIME') {
            const hasAnimeMatch = ANIME_KEYWORDS.some(k => text.includes(k));
            return hasAnimeMatch || !isPureGaming;
        }
        return ANIME_KEYWORDS.some(k => text.includes(k));
    }

    if (category === 'VIDEOJUEGOS') {
        const isPureAnime = text.includes('estreno del anime') || text.includes('episodio del anime') || (text.includes('manga') && !text.includes('juego') && !text.includes('gameplay'));
        if (isPureAnime) return false;
        return true;
    }

    return true;
}

export async function syncRssFeeds(limit = DAILY_CATEGORY_LIMIT) {
    const vgFeeds = [
        { url: 'https://www.3djuegos.com/universo/rss/rss.php', name: '3DJuegos', category: 'VIDEOJUEGOS', lang: 'es' },
        { url: 'https://es.ign.com/feed.xml', name: 'IGN España', category: 'VIDEOJUEGOS', lang: 'es' },
        { url: 'https://www.gamespot.com/feeds/news/', name: 'GameSpot', category: 'VIDEOJUEGOS', lang: 'en' }
    ];

    const animeFeeds = [
        { url: 'https://ramenparados.com/feed/', name: 'Ramen Para Dos', category: 'ANIME', lang: 'es' },
        { url: 'https://areajugones.sport.es/anime/feed/', name: 'Areajugones', category: 'ANIME', lang: 'es' },
        { url: 'https://www.crunchyroll.com/news/rss?lang=esES', name: 'Crunchyroll', category: 'ANIME', lang: 'es' }
    ];

    const targetDateStr = getLocalDateStr();
    console.log(`Starting RSS Feed Sync (Limit: ${limit} new articles per category for ${targetDateStr})...`);
    let countVideojuegos = 0;
    let countAnime = 0;

    // 1. Sincronizar exactamente 3 de VIDEOJUEGOS
    for (const feed of vgFeeds) {
        if (countVideojuegos >= limit) break;

        try {
            console.log(`Fetching feed from: ${feed.name} (${feed.category}) [${feed.lang}]...`);
            const response = await axios.get(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
                },
                timeout: 10000
            });
            const xml = String(response.data || '');
            const itemBlocks = xml.includes('<item>') ? xml.split('<item>') : xml.split('<entry>');
            itemBlocks.shift();

            for (const itemXml of itemBlocks) {
                if (countVideojuegos >= limit) break;

                const rawTitle = extractTagValue(itemXml, 'title');
                const rawTitleClean = decodeHtmlEntities(rawTitle.trim());
                let rawLink = extractTagValue(itemXml, 'link').trim();
                if (!rawLink || rawLink.startsWith('<')) {
                    rawLink = itemXml.match(/<link[^>]*href=["']([^"']*)["']/i)?.[1] || '';
                }
                const guid = extractTagValue(itemXml, 'guid').trim() || extractTagValue(itemXml, 'id').trim();
                const link = ensureAbsoluteUrl(rawLink || (guid.startsWith('http') ? guid : ''), feed.url);

                if (!rawTitleClean || !link || !link.startsWith('http')) continue;

                const contentEncoded = extractTagValue(itemXml, 'content:encoded') || extractTagValue(itemXml, 'summary') || extractTagValue(itemXml, 'description');
                let subtitleEnglish = cleanDescription(contentEncoded);

                if (!isStrictCategory('VIDEOJUEGOS', rawTitleClean, subtitleEnglish, 'VIDEOJUEGOS')) {
                    continue;
                }

                const hash = getHash(link || `${feed.name}-${rawTitleClean}`);
                const baseSlug = generateSlug(rawTitleClean || `${feed.name}-${hash}`);
                const slug = `${baseSlug}-${hash}`;

                const { data: existing } = await supabase
                    .from('news_articles')
                    .select('id')
                    .eq('slug', slug)
                    .maybeSingle();

                if (existing) continue;

                console.log(`Found new article: "${rawTitleClean}" for category VIDEOJUEGOS from ${feed.name}...`);

                let title = rawTitleClean;
                if (feed.lang === 'en') {
                    title = await translateText(rawTitleClean);
                }
                
                let subtitleEnglish = '';

                // Try content:encoded first (typically has full paragraphs)
                const contentEncoded = extractTagValue(itemXml, 'content:encoded') || extractTagValue(itemXml, 'summary') || extractTagValue(itemXml, 'description');
                let cleanedContent = cleanDescription(contentEncoded);
                
                if (cleanedContent && cleanedContent.trim().length >= 100) {
                    subtitleEnglish = cleanedContent;
                } else {
                    // Try description
                    const rawDesc = extractTagValue(itemXml, 'description');
                    const cleanedDesc = cleanDescription(rawDesc);
                    if (cleanedDesc && cleanedDesc.trim().length >= 50) {
                        subtitleEnglish = cleanedDesc;
                    } else {
                        // Try summary
                        const summary = extractTagValue(itemXml, 'summary');
                        const cleanedSummary = cleanDescription(summary);
                        if (cleanedSummary && cleanedSummary.trim().length >= 50) {
                            subtitleEnglish = cleanedSummary;
                        }
                    }
                }

                subtitleEnglish = subtitleEnglish.trim();
                
                // Limit to 1500 characters to avoid overwhelming the user
                if (subtitleEnglish.length > 1500) {
                    subtitleEnglish = subtitleEnglish.substring(0, 1500);
                }                
                let subtitle = '';
                let fullDescriptionSpanish = '';

                if (feed.lang === 'es') {
                    // Source is natively in Spanish -> No translation needed, avoids 429
                    fullDescriptionSpanish = subtitleEnglish;
                    subtitle = fullDescriptionSpanish.length > 200 ? fullDescriptionSpanish.substring(0, 197) + '...' : fullDescriptionSpanish;
                } else if (subtitleEnglish && subtitleEnglish.length >= 10) {
                    subtitle = await translateText(subtitleEnglish.length > 200 ? subtitleEnglish.substring(0, 197) + '...' : subtitleEnglish);
                    fullDescriptionSpanish = await translateText(subtitleEnglish);
                }

                // If description is short (less than 400 chars), add thematic complementary paragraphs
                if (fullDescriptionSpanish && fullDescriptionSpanish.length < 400) {
                    const extraFallbacks = feed.category === 'ANIME' ? [
                        [
                            `¡No te pierdas ningún detalle de este estreno! Te mantendremos informado sobre las últimas novedades del mundo del anime, manga y la cultura otaku. Haz clic en el botón de abajo para explorar el artículo completo y ver todo el contenido oficial disponible.`,
                            `La comunidad otaku y los amantes de la animación japonesa están muy atentos a estos nuevos desarrollos. Te invitamos a profundizar más y consultar opiniones de expertos accediendo directamente a la nota original.`
                        ],
                        [
                            `Esta producción promete ser de lo más comentado de la temporada. Puedes conocer todos los pormenores, detalles del staff de animación y fechas clave visitando el enlace al sitio oficial que te dejamos abajo.`,
                            `El mundo del anime se expande constantemente con lanzamientos y producciones cada semana. Accede a la cobertura completa y detallada de este estreno directo de la fuente oficial.`
                        ]
                    ] : [
                        [
                            `¡No te pierdas ningún detalle de esta noticia! Te mantendremos informado sobre las últimas novedades del mundo de los videojuegos y la cultura geek. Haz clic en el botón de abajo para explorar el artículo completo y ver todo el contenido oficial disponible.`,
                            `La comunidad gamer está atenta a estos nuevos desarrollos. Te invitamos a profundizar más y consultar todos los detalles técnicos y opiniones de los expertos accediendo directamente a la nota de prensa original a continuación.`
                        ],
                        [
                            `Esta actualización promete cambiar las cosas para los jugadores. Puedes conocer todos los pormenores, imágenes y videos relacionados visitando el enlace al sitio oficial que te dejamos en la parte inferior.`,
                            `El gaming evoluciona constantemente y esta es solo una de las muchas novedades de la semana. Accede a la cobertura completa y detallada de este lanzamiento directamente desde la fuente original.`
                        ]
                    ];
                    const idx = title.length % extraFallbacks.length;
                    const chosenParagraphs = extraFallbacks[idx];
                    fullDescriptionSpanish = fullDescriptionSpanish + "\n\n" + chosenParagraphs.join("\n\n");
                } else if (!fullDescriptionSpanish) {
                    // Complete fallback text with structured paragraphs
                    const fallbacks = feed.category === 'ANIME' ? [
                        `¡El universo del anime y el manga continúa sorprendiéndonos con noticias de impacto!\n\nNo te pierdas ningún detalle de esta historia haciendo clic en el enlace oficial a continuación para acceder al reporte completo.`,
                        `¡Grandes novedades para los fans de la animación japonesa! Mantente al día con todos los anuncios, trailers y fechas clave.\n\nPuedes consultar todos los pormenores accediendo directamente a la fuente original de la noticia.`
                    ] : [
                        `¡Mantente al día con las últimas novedades del mundo de los videojuegos! Hay grandes noticias sucediendo en este momento en la industria.\n\nHaz clic en el botón de abajo para leer el artículo completo con todos los detalles directamente en la fuente oficial.`,
                        `El universo del gaming no se detiene y hoy nos trae anuncios y detalles que todo jugador debe conocer.\n\nTe invitamos a leer la cobertura completa y detallada haciendo clic en el enlace oficial que se encuentra a continuación.`
                    ];
                    const index = title.length % fallbacks.length;
                    fullDescriptionSpanish = fallbacks[index];
                    subtitle = fullDescriptionSpanish.split('\n')[0];
                }

                const pubDateStr = extractTagValue(itemXml, 'pubDate') || extractTagValue(itemXml, 'dc:date') || extractTagValue(itemXml, 'updated');
                const parsedDate = pubDateStr ? new Date(pubDateStr) : new Date();
                const published_at = Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
                
                const author = pickAuthor(link);

                // Find image url
                let header_image = '';
                const encMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']*)["']/i);
                const medMatch = itemXml.match(/<media:content[^>]*url=["']([^"']*)["']/i) || 
                                 itemXml.match(/<media:thumbnail[^>]*url=["']([^"']*)["']/i);
                
                if (encMatch) {
                    header_image = encMatch[1];
                } else if (medMatch) {
                    header_image = medMatch[1];
                } else {
                    const rawDesc = extractTagValue(itemXml, 'description') || extractTagValue(itemXml, 'content:encoded');
                    const decodedDesc = decodeHtmlEntities(rawDesc);
                    const imgMatch = decodedDesc.match(/<img[^>]*src=["']([^"']*)["']/i);
                    if (imgMatch) {
                        header_image = ensureAbsoluteUrl(imgMatch[1], link);
                    }
                }

                // If Blogger/Google thumbnail, upgrade to original high-res size
                if (header_image && (header_image.includes('blogger.googleusercontent.com') || header_image.includes('bp.blogspot.com'))) {
                    header_image = header_image.replace(/\/s[0-9]+(-c)?\//i, '/s1600/').replace(/\/w[0-9]+-h[0-9]+[^/]*\//i, '/s1600/');
                }

                // If still empty, scrape the page for og:image/twitter:image
                if (!header_image && link) {
                    try {
                        console.log(`Scraping page for cover image: ${link}...`);
                        const pageRes = await axios.get(link, {
                            headers: { 
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/122.0.0.0' 
                            },
                            timeout: 6000
                        });
                        const html = pageRes.data;
                        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) || 
                                             html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["']/i) ||
                                             html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["']/i);
                        if (ogImageMatch) {
                            header_image = ogImageMatch[1];
                            console.log(`Found og:image: ${header_image}`);
                        }
                    } catch (err) {
                        console.error(`Failed to scrape cover image from ${link}:`, err.message);
                    }
                }

                if (!header_image) {
                    header_image = getCategoryFallbackImage(feed.category);
                }

                const paragraphsHtml = formatParagraphs(fullDescriptionSpanish);
                const articleHtml = `
                    ${paragraphsHtml}
                    <p style="margin-top: 2rem; text-align: center;">
                        <a href="${link}" target="_blank" rel="noopener noreferrer" class="games-join-btn" style="display: inline-flex; text-decoration: none; padding: 1rem 2.5rem; background: var(--primary); color: white; border-radius: 30px; font-weight: bold; box-shadow: 0 5px 15px rgba(157, 78, 221, 0.4);">
                            LEER ARTÍCULO COMPLETO EN ${feed.name.toUpperCase()} (EN INGLÉS)
                        </a>
                    </p>
                `;

                // Tag category in metadata block inside content_blocks JSON
                const content_blocks = [
                    { type: 'metadata', category: feed.category, source: feed.name, source_url: link, source_hash: hash, imported_date: targetDateStr },
                    { type: 'text', content: articleHtml }
                ];

                const articlePayload = {
                    title,
                    subtitle,
                    slug,
                    header_image,
                    content_blocks,
                    author,
                    published_at,
                    category: feed.category
                };

                // Insert into Supabase
                let { error: insertError } = await supabase
                    .from('news_articles')
                    .upsert(articlePayload, { onConflict: 'slug' });

                if (insertError && insertError.message?.includes('category')) {
                    const { category, ...payloadWithoutCategory } = articlePayload;
                    const retry = await supabase
                        .from('news_articles')
                        .upsert(payloadWithoutCategory, { onConflict: 'slug' });
                    insertError = retry.error;
                }

                if (insertError) {
                    console.error(`Error inserting article "${title}":`, insertError.message);
                } else {
                    console.log(`Successfully imported in Spanish: "${title}" [VIDEOJUEGOS] by ${author}`);
                    countVideojuegos++;
                }
            }
        } catch (e) {
            console.error(`Error syncing feed ${feed.name}:`, e.message);
        }
    }

    // 2. Sincronizar exactamente 3 de ANIME
    for (const feed of animeFeeds) {
        if (countAnime >= limit) break;

        try {
            console.log(`Fetching feed from: ${feed.name} (${feed.category}) [${feed.lang}]...`);
            const response = await axios.get(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
                },
                timeout: 10000
            });
            const xml = String(response.data || '');
            const itemBlocks = xml.includes('<item>') ? xml.split('<item>') : xml.split('<entry>');
            itemBlocks.shift();

            for (const itemXml of itemBlocks) {
                if (countAnime >= limit) break;

                const rawTitle = extractTagValue(itemXml, 'title');
                const rawTitleClean = decodeHtmlEntities(rawTitle.trim());
                let rawLink = extractTagValue(itemXml, 'link').trim();
                if (!rawLink || rawLink.startsWith('<')) {
                    rawLink = itemXml.match(/<link[^>]*href=["']([^"']*)["']/i)?.[1] || '';
                }
                const guid = extractTagValue(itemXml, 'guid').trim() || extractTagValue(itemXml, 'id').trim();
                const link = ensureAbsoluteUrl(rawLink || (guid.startsWith('http') ? guid : ''), feed.url);

                if (!rawTitleClean || !link || !link.startsWith('http')) continue;

                const contentEncoded = extractTagValue(itemXml, 'content:encoded') || extractTagValue(itemXml, 'summary') || extractTagValue(itemXml, 'description');
                let subtitleEnglish = cleanDescription(contentEncoded);

                if (!isStrictCategory('ANIME', rawTitleClean, subtitleEnglish, feed.category)) {
                    continue;
                }

                const hash = getHash(link || `${feed.name}-${rawTitleClean}`);
                const baseSlug = generateSlug(rawTitleClean || `${feed.name}-${hash}`);
                const slug = `${baseSlug}-${hash}`;

                const { data: existing } = await supabase
                    .from('news_articles')
                    .select('id')
                    .eq('slug', slug)
                    .maybeSingle();

                if (existing) continue;

                console.log(`Found new article: "${rawTitleClean}" for category ANIME from ${feed.name}...`);

                let title = rawTitleClean;
                if (feed.lang === 'en') {
                    title = await translateText(rawTitleClean);
                }

                subtitleEnglish = subtitleEnglish.trim();
                if (subtitleEnglish.length > 1500) {
                    subtitleEnglish = subtitleEnglish.substring(0, 1500);
                }

                let subtitle = '';
                let fullDescriptionSpanish = '';

                if (feed.lang === 'es') {
                    fullDescriptionSpanish = subtitleEnglish;
                    subtitle = fullDescriptionSpanish.length > 200 ? fullDescriptionSpanish.substring(0, 197) + '...' : fullDescriptionSpanish;
                } else if (subtitleEnglish && subtitleEnglish.length >= 10) {
                    subtitle = await translateText(subtitleEnglish.length > 200 ? subtitleEnglish.substring(0, 197) + '...' : subtitleEnglish);
                    fullDescriptionSpanish = await translateText(subtitleEnglish);
                }

                if (!fullDescriptionSpanish || fullDescriptionSpanish.length < 50) {
                    fullDescriptionSpanish = '¡Grandes novedades para los fans de la animación japonesa! Mantente al día con todos los anuncios, trailers y fechas clave de esta producción.\n\nPuedes consultar todos los pormenores accediendo directamente a la fuente original de la noticia.';
                    subtitle = fullDescriptionSpanish.split('\n')[0];
                }

                const pubDateStr = extractTagValue(itemXml, 'pubDate') || extractTagValue(itemXml, 'dc:date') || extractTagValue(itemXml, 'updated');
                const parsedDate = pubDateStr ? new Date(pubDateStr) : new Date();
                const published_at = Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
                const author = pickAuthor(link);

                let header_image = '';
                const encMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']*)["']/i);
                const medMatch = itemXml.match(/<media:content[^>]*url=["']([^"']*)["']/i) || itemXml.match(/<media:thumbnail[^>]*url=["']([^"']*)["']/i);
                if (encMatch) header_image = encMatch[1];
                else if (medMatch) header_image = medMatch[1];
                else {
                    const imgMatch = itemXml.match(/<img[^>]*src=["']([^"']*)["']/i);
                    if (imgMatch) header_image = ensureAbsoluteUrl(imgMatch[1], link);
                }

                if (header_image && (header_image.includes('blogger.googleusercontent.com') || header_image.includes('bp.blogspot.com'))) {
                    header_image = header_image.replace(/\/s[0-9]+(-c)?\//i, '/s1600/').replace(/\/w[0-9]+-h[0-9]+[^/]*\//i, '/s1600/');
                }

                if (!header_image) {
                    header_image = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80';
                }

                const paragraphsHtml = formatParagraphs(fullDescriptionSpanish);
                const articleHtml = `
                    ${paragraphsHtml}
                    <p style="margin-top: 2rem; text-align: center;">
                        <a href="${link}" target="_blank" rel="noopener noreferrer" class="games-join-btn" style="display: inline-flex; text-decoration: none; padding: 1rem 2.5rem; background: var(--primary); color: white; border-radius: 30px; font-weight: bold; box-shadow: 0 5px 15px rgba(157, 78, 221, 0.4);">
                            LEER ARTÍCULO COMPLETO EN ${feed.name.toUpperCase()}
                        </a>
                    </p>
                `;

                const content_blocks = [
                    { type: 'metadata', category: 'ANIME', source: feed.name, source_url: link, source_hash: hash, imported_date: targetDateStr },
                    { type: 'text', content: articleHtml }
                ];

                const articlePayload = {
                    title,
                    subtitle,
                    slug,
                    header_image,
                    content_blocks,
                    author,
                    published_at,
                    category: 'ANIME'
                };

                let { error: insertError } = await supabase
                    .from('news_articles')
                    .upsert(articlePayload, { onConflict: 'slug' });

                if (insertError && insertError.message?.includes('category')) {
                    const { category, ...payloadWithoutCategory } = articlePayload;
                    const retry = await supabase
                        .from('news_articles')
                        .upsert(payloadWithoutCategory, { onConflict: 'slug' });
                    insertError = retry.error;
                }

                if (insertError) {
                    console.error(`Error inserting article "${title}":`, insertError.message);
                } else {
                    console.log(`Successfully imported in Spanish: "${title}" [ANIME] by ${author}`);
                    countAnime++;
                }
            }
        } catch (e) {
            console.error(`Error syncing feed ${feed.name}:`, e.message);
        }
    }

    console.log(`RSS Feed Sync Completed! Synced ${countVideojuegos} Videojuegos and ${countAnime} Anime new articles.`);
    await checkMonthlyLeaderboardRotation();
}

async function checkMonthlyLeaderboardRotation() {
    try {
        const now = new Date();
        const currentDay = now.getDate();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const rotationDay = Math.min(30, lastDayOfMonth);

        if (currentDay < rotationDay) {
            console.log(`Monthly rotation is not due yet. Current day: ${currentDay}.`);
            return;
        }

        const targetYear = now.getFullYear();
        const targetMonth = now.getMonth() + 1;
        const targetMonthStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;

        const { data: existing } = await supabase
            .from('monthly_leaderboards')
            .select('id')
            .eq('year_month', targetMonthStr)
            .maybeSingle();

        if (!existing) {
            console.log(`Monthly rotation due for ${targetMonthStr}. Executing rotate_monthly_leaderboard RPC...`);
            const { data, error } = await supabase.rpc('rotate_monthly_leaderboard', {
                target_year_month: targetMonthStr
            });
            if (error) {
                console.warn(`Monthly rotation RPC error (${error.message}). Running JS fallback rotation...`);

                // Fetch top 10 profiles by points
                const { data: topProfiles } = await supabase
                    .from('profiles')
                    .select('username, avatar_url, points, role')
                    .order('points', { ascending: false })
                    .limit(10);

                // Insert snapshot to monthly_leaderboards
                const { error: insErr } = await supabase
                    .from('monthly_leaderboards')
                    .insert({
                        year_month: targetMonthStr,
                        leaderboard_data: topProfiles || []
                    });

                if (insErr) {
                    console.error(`JS Fallback insert error: ${insErr.message}`);
                } else {
                    console.log(`JS Fallback snapshot saved successfully for ${targetMonthStr}!`);
                }

                // Reset all user points to 0
                const { error: resetErr } = await supabase
                    .from('profiles')
                    .update({ points: 0 })
                    .neq('id', '00000000-0000-0000-0000-000000000000');

                if (resetErr) {
                    console.error(`JS Fallback reset points error: ${resetErr.message}`);
                } else {
                    console.log(`JS Fallback reset points to 0 successfully for ${targetMonthStr}!`);
                }
            } else {
                console.log(`Monthly rotation successful for ${targetMonthStr}! Result: ${data}`);
            }
        } else {
            console.log(`Monthly leaderboard for ${targetMonthStr} is up to date.`);
        }
    } catch (e) {
        console.error('Error during monthly rotation check:', e.message);
    }
}
