import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://hddzijixsigsqsmabtej.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_bJGAVsHsVrSu2KAhbEC7DA_DpYnxDAp';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_AUTHORS = ['EVILTOKKII', 'REQUIEM373', 'ESPEEEOON', 'PAMACHE', 'NPEZE'];

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

export async function syncRssFeeds(limit = 3) {
    const feeds = [
        { url: 'https://feeds.feedburner.com/ign/news', name: 'IGN', category: 'VIDEOJUEGOS' },
        { url: 'https://www.gamespot.com/feeds/news/', name: 'GameSpot', category: 'VIDEOJUEGOS' },
        { url: 'https://www.polygon.com/rss/index.xml', name: 'Polygon', category: 'VIDEOJUEGOS' },
        { url: 'https://www.animenewsnetwork.com/news/rss.xml?ann-edition=w', name: 'Anime News Network', category: 'ANIME' },
        { url: 'https://otakuusamagazine.com/feed/', name: 'Otaku USA', category: 'ANIME' }
    ];

    console.log(`Starting RSS Feed Sync (Limit: ${limit} new articles per category)...`);
    let countVideojuegos = 0;
    let countAnime = 0;

    for (const feed of feeds) {
        if (feed.category === 'VIDEOJUEGOS' && countVideojuegos >= limit) continue;
        if (feed.category === 'ANIME' && countAnime >= limit) continue;

        try {
            console.log(`Fetching feed from: ${feed.name} (${feed.category})...`);
            const response = await axios.get(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/120.0.0.0'
                }
            });
            const xml = response.data;
            
            const itemBlocks = xml.split('<item>');
            itemBlocks.shift();

            for (const itemXml of itemBlocks) {
                if (feed.category === 'VIDEOJUEGOS' && countVideojuegos >= limit) break;
                if (feed.category === 'ANIME' && countAnime >= limit) break;

                const rawTitle = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || 
                                 itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
                const titleEnglish = decodeHtmlEntities(rawTitle.trim());
                
                const link = (itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '').trim();
                
                if (!titleEnglish || !link) continue;

                const hash = Math.abs(link.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)).toString(36).substring(0, 5);
                
                // Check if this article (link) already exists in Supabase to avoid duplicates
                const { data: existing } = await supabase
                    .from('news_articles')
                    .select('id')
                    .filter('slug', 'like', `%-${hash}`)
                    .maybeSingle();

                if (existing) {
                    continue;
                }

                console.log(`Found new article: "${titleEnglish}" for category ${feed.category}. Translating...`);

                // Translate Title and Subtitle/Description to Spanish
                const title = await translateText(titleEnglish);
                
                let subtitleEnglish = '';

                // Try content:encoded first (typically has full paragraphs)
                const contentEncoded = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || 
                                       itemXml.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/)?.[1] || '';
                let cleanedContent = cleanDescription(contentEncoded);
                
                if (cleanedContent && cleanedContent.trim().length >= 100) {
                    subtitleEnglish = cleanedContent;
                } else {
                    // Try description
                    const rawDesc = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || 
                                    itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';
                    const cleanedDesc = cleanDescription(rawDesc);
                    if (cleanedDesc && cleanedDesc.trim().length >= 50) {
                        subtitleEnglish = cleanedDesc;
                    } else {
                        // Try summary
                        const summary = itemXml.match(/<summary><!\[CDATA\[([\s\S]*?)\]\]><\/summary>/)?.[1] || 
                                        itemXml.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || '';
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

                if (subtitleEnglish && subtitleEnglish.length >= 10) {
                    subtitle = await translateText(subtitleEnglish.length > 200 ? subtitleEnglish.substring(0, 197) + '...' : subtitleEnglish);
                    fullDescriptionSpanish = await translateText(subtitleEnglish);
                    
                    // If it is too short (less than 500 chars), it will look empty. Add two paragraphs to guarantee the same text depth!
                    if (fullDescriptionSpanish.length < 500) {
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
                        const idx = titleEnglish.length % extraFallbacks.length;
                        const chosenParagraphs = extraFallbacks[idx];
                        fullDescriptionSpanish = fullDescriptionSpanish + "\n\n" + chosenParagraphs.join("\n\n");
                    }
                } else {
                    // Complete fallback text with 2 structured paragraphs
                    const fallbacks = [
                        `¡Mantente al día con las últimas novedades del mundo de los videojuegos y el anime! Hay grandes noticias sucediendo en este momento en la industria.\n\nHaz clic en el botón de abajo para leer el artículo completo con todos los detalles directamente en la fuente oficial.`,
                        `El universo del gaming y el anime no se detiene y hoy nos trae detalles emocionantes que no te puedes perder.\n\nTe invitamos a leer la cobertura completa y detallada de esta noticia haciendo clic en el enlace oficial que se encuentra a continuación.`,
                        `¡Una nueva actualización ha llegado a la comunidad geek! Explora todas las novedades, detalles técnicos e información relevante de este lanzamiento.\n\nPuedes acceder a la nota completa de forma directa en el portal oficial de noticias.`,
                        `¡Entérate de lo último en tecnología, lanzamientos y tendencias del mundo geek, del anime y de los videojuegos!\n\nHaz clic en el botón inferior para consultar la publicación original y no perderte ningún detalle.`
                    ];
                    const index = titleEnglish.length % fallbacks.length;
                    fullDescriptionSpanish = fallbacks[index];
                    subtitle = fullDescriptionSpanish.split('\n')[0];
                    if (subtitle.length > 200) {
                        subtitle = subtitle.substring(0, 197) + '...';
                    }
                }

                const pubDateStr = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
                const published_at = pubDateStr ? new Date(pubDateStr).toISOString() : new Date().toISOString();
                
                const author = DEFAULT_AUTHORS[Math.floor(Math.random() * DEFAULT_AUTHORS.length)];

                // Find image url
                let header_image = '';
                const encMatch = itemXml.match(/<enclosure[^>]*url="([^"]*)"/i);
                const medMatch = itemXml.match(/<media:content[^>]*url="([^"]*)"/i) || 
                                 itemXml.match(/<media:thumbnail[^>]*url="([^"]*)"/i);
                
                if (encMatch) {
                    header_image = encMatch[1];
                } else if (medMatch) {
                    header_image = medMatch[1];
                } else {
                    const rawDesc = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || 
                                    itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';
                    const decodedDesc = decodeHtmlEntities(rawDesc);
                    const imgMatch = decodedDesc.match(/<img[^>]*src="([^"]*)"/i);
                    if (imgMatch) {
                        header_image = imgMatch[1];
                    }
                }

                // If still empty (like ANN feeds), scrape the page for og:image/twitter:image
                if (!header_image && link) {
                    try {
                        console.log(`Scraping page for cover image: ${link}...`);
                        const pageRes = await axios.get(link, {
                            headers: { 
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
                            },
                            timeout: 6000
                        });
                        const html = pageRes.data;
                        const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) || 
                                             html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i) ||
                                             html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"/i);
                        if (ogImageMatch) {
                            header_image = ogImageMatch[1];
                            console.log(`Found og:image: ${header_image}`);
                        }
                    } catch (err) {
                        console.error(`Failed to scrape cover image from ${link}:`, err.message);
                    }
                }

                if (!header_image) {
                    header_image = feed.category === 'ANIME' 
                        ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60' 
                        : 'https://pub-0bf9a87cec964ff49bfd058873c948c3.r2.dev/public/logo.png';
                }

                const slug = `${generateSlug(title)}-${hash}`;

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
                    { type: 'metadata', category: feed.category },
                    { type: 'text', content: articleHtml }
                ];

                // Insert into Supabase
                const { error: insertError } = await supabase
                    .from('news_articles')
                    .insert({
                        title,
                        subtitle,
                        slug,
                        header_image,
                        content_blocks,
                        author,
                        published_at
                    });

                if (insertError) {
                    console.error(`Error inserting article "${title}":`, insertError.message);
                } else {
                    console.log(`Successfully imported in Spanish: "${title}" [${feed.category}] by ${author}`);
                    if (feed.category === 'VIDEOJUEGOS') {
                        countVideojuegos++;
                    } else {
                        countAnime++;
                    }
                }
            }
        } catch (e) {
            console.error(`Error syncing feed ${feed.name}:`, e.message);
        }
    }
    console.log(`RSS Feed Sync Completed! Synced ${countVideojuegos} Videojuegos and ${countAnime} Anime new articles.`);
}
