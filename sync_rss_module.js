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

function generateSlug(title) {
    return title
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function cleanDescription(html) {
    if (!html) return '';
    let clean = decodeHtmlEntities(html);
    clean = clean.replace(/<img[^>]*>/gi, '').replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
    clean = clean.replace(/<\/p>|<br\s*\/?>|<\/div>|<\/li>|<\/h[1-6]>/gi, '\n');
    clean = clean.replace(/<[^>]*>/g, '').trim();
    return clean;
}

function buildRobustArticleContent(title, cleanDesc, category, sourceName, sourceUrl) {
    const isAnime = category === 'ANIME';
    
    const rawSentences = (cleanDesc || '').split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 25);
    const mainCore = rawSentences.slice(0, 3).join('. ') + (rawSentences.length > 0 ? '.' : '');

    const p1 = mainCore.length > 100 
        ? mainCore 
        : (isAnime 
            ? `${title}. Grandes novedades han salido a la luz en las últimas horas para la comunidad del anime y el manga con este nuevo anuncio oficial.`
            : `${title}. Una de las noticias más destacadas del momento en la industria del videojuego, trayendo importantes novedades y anuncios que han capturado la atención de la comunidad gamer.`);

    const p2 = rawSentences.length > 3 
        ? rawSentences.slice(3, 7).join('. ') + '.'
        : (isAnime
            ? 'Entre los detalles más relevantes compartidos por la producción, se destacan las fechas clave de estreno, el equipo creativo a cargo de la animación y los avances mostrados en los materiales promocionales. Esta entrega promete mantener el estándar visual y narrativo que los seguidores de la franquicia han estado esperando con gran expectativa.'
            : 'El informe detalla los aspectos técnicos y jugables más relevantes de este lanzamiento, incluyendo mejoras en la experiencia de juego, novedades en su contenido y la disponibilidad confirmada para las principales plataformas del mercado. Los desarrolladores han puesto especial énfasis en optimizar el rendimiento y la inmersión para los usuarios.');

    const p3 = isAnime
        ? 'La reacción de los fanáticos no se ha hecho esperar en redes sociales y foros especializados, donde se debaten las implicaciones de este estreno dentro de la temporada actual. Con un calendario repleto de lanzamientos de alto perfil, esta producción se posiciona como una de las más seguidas y comentadas por los aficionados a la cultura otaku.'
        : 'La comunidad de jugadores ha recibido estos anuncios con gran entusiasmo, generando amplios debates sobre el futuro de la saga y las expectativas depositadas en este proyecto. En un año repleto de grandes estrenos y competencia en el sector, este movimiento refuerza la posición del título dentro del panorama internacional.';

    const p4 = isAnime
        ? 'Desde EvilTokkii continuaremos dándole cobertura a todas las actualizaciones, trailers y anuncios oficiales que surjan al respecto. Te invitamos a leer el reporte original y todos los pormenores accediendo directamente a la fuente oficial a través del enlace a continuación.'
        : 'Desde EvilTokkii continuaremos siguiendo muy de cerca todos los avances, parches y novedades que se presenten sobre este título en nuestros directos y notas de actualidad. Puedes consultar el artículo completo y los detalles oficiales haciendo clic en el botón de abajo.';

    return `
        <p style="margin-bottom: 1.5rem; text-align: justify; line-height: 1.8;">${p1}</p>
        <p style="margin-bottom: 1.5rem; text-align: justify; line-height: 1.8;">${p2}</p>
        <p style="margin-bottom: 1.5rem; text-align: justify; line-height: 1.8;">${p3}</p>
        <p style="margin-bottom: 1.5rem; text-align: justify; line-height: 1.8;">${p4}</p>
        <p style="margin-top: 2.5rem; text-align: center;">
            <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="games-join-btn" style="display: inline-flex; text-decoration: none; padding: 1rem 2.5rem; background: var(--primary); color: white; border-radius: 30px; font-weight: bold; box-shadow: 0 5px 15px rgba(157, 78, 221, 0.4);">
                LEER ARTÍCULO COMPLETO EN ${sourceName.toUpperCase()}
            </a>
        </p>
    `;
}

function isStrictCategory(category, title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    if (category === 'ANIME') {
        const isPureGaming = (text.includes('gta 6') || text.includes('gta vi') || text.includes('playstation 5') || text.includes('xbox series') || text.includes('tarjeta gráfica') || text.includes('rtx 40') || text.includes('gameplay trailer') || text.includes('nintendo switch 2')) && !text.includes('anime') && !text.includes('manga');
        if (isPureGaming) return false;
        return true;
    }

    if (category === 'VIDEOJUEGOS') {
        const isPureAnime = text.includes('estreno del anime') || text.includes('episodio del anime') || (text.includes('manga') && !text.includes('juego') && !text.includes('gameplay'));
        if (isPureAnime) return false;
        return true;
    }

    return true;
}

async function fetchSourceItems(src) {
    // 1. Intentar con rss2json
    try {
        const r2jUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(src.url)}`;
        const res = await axios.get(r2jUrl, { timeout: 8000 });
        if (res.data?.status === 'ok' && Array.isArray(res.data?.items) && res.data.items.length > 0) {
            return res.data.items.map(item => {
                let img = item.thumbnail || item.enclosure?.link || '';
                if (!img && item.description) {
                    const match = item.description.match(/<img[^>]*src=["']([^"']*)["']/i);
                    if (match) img = match[1];
                }
                return {
                    title: item.title,
                    link: item.link,
                    description: item.description || item.content,
                    image: img,
                    date: item.pubDate || new Date().toISOString(),
                    sourceName: src.name
                };
            });
        }
    } catch (e) {
        // Fallback to direct axios
    }

    // 2. Fallback axios directo
    try {
        const res = await axios.get(src.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            },
            timeout: 8000
        });
        const xml = String(res.data || '');
        const itemBlocks = xml.includes('<item>') ? xml.split('<item>') : xml.split('<entry>');
        itemBlocks.shift();

        const parsed = [];
        for (const itemXml of itemBlocks) {
            const rawTitle = extractTagValue(itemXml, 'title');
            const rawTitleClean = decodeHtmlEntities(rawTitle.trim());
            let rawLink = extractTagValue(itemXml, 'link').trim();
            if (!rawLink || rawLink.startsWith('<')) {
                rawLink = itemXml.match(/<link[^>]*href=["']([^"']*)["']/i)?.[1] || '';
            }
            const guid = extractTagValue(itemXml, 'guid').trim() || extractTagValue(itemXml, 'id').trim();
            const link = ensureAbsoluteUrl(rawLink || (guid.startsWith('http') ? guid : ''), src.url);

            if (!rawTitleClean || !link || !link.startsWith('http')) continue;

            const contentEncoded = extractTagValue(itemXml, 'content:encoded') || extractTagValue(itemXml, 'summary') || extractTagValue(itemXml, 'description');
            
            let header_image = '';
            const encMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']*)["']/i);
            const medMatch = itemXml.match(/<media:content[^>]*url=["']([^"']*)["']/i) || itemXml.match(/<media:thumbnail[^>]*url=["']([^"']*)["']/i);
            if (encMatch) header_image = encMatch[1];
            else if (medMatch) header_image = medMatch[1];
            else {
                const imgMatch = itemXml.match(/<img[^>]*src=["']([^"']*)["']/i);
                if (imgMatch) header_image = ensureAbsoluteUrl(imgMatch[1], link);
            }

            const pubDateStr = extractTagValue(itemXml, 'pubDate') || extractTagValue(itemXml, 'dc:date') || extractTagValue(itemXml, 'updated');

            parsed.push({
                title: rawTitleClean,
                link,
                description: contentEncoded,
                image: header_image,
                date: pubDateStr || new Date().toISOString(),
                sourceName: src.name
            });
        }
        if (parsed.length > 0) return parsed;
    } catch (err) {
        console.error(`Failed to fetch direct feed from ${src.name}:`, err.message);
    }

    return [];
}

export async function syncRssFeeds(limit = DAILY_CATEGORY_LIMIT) {
    const vgSources = [
        { name: '3DJuegos', url: 'https://www.3djuegos.com/universo/rss/rss.php' },
        { name: 'Areajugones', url: 'https://areajugones.sport.es/videojuegos/feed/' },
        { name: 'GeneracionXbox', url: 'https://generacionxbox.com/feed/' },
        { name: 'Nintenderos', url: 'https://www.nintenderos.com/feed/' }
    ];

    const animeSources = [
        { name: 'Ramen Para Dos', url: 'https://ramenparados.com/feed/' },
        { name: 'Areajugones', url: 'https://areajugones.sport.es/anime/feed/' },
        { name: 'Crunchyroll', url: 'https://www.crunchyroll.com/news/rss?lang=esES' }
    ];

    const targetDateStr = getLocalDateStr();
    console.log(`Starting Daily News Sync (Target: ${limit} Videojuegos + ${limit} Anime in Spanish for ${targetDateStr})...`);
    let countVideojuegos = 0;
    let countAnime = 0;

    // 1. Videojuegos en Español
    for (const src of vgSources) {
        if (countVideojuegos >= limit) break;
        console.log(`Fetching Videojuegos from: ${src.name}...`);

        const items = await fetchSourceItems(src);
        for (const item of items) {
            if (countVideojuegos >= limit) break;

            const titleClean = decodeHtmlEntities(item.title || '').trim();
            const link = (item.link || '').trim();
            if (!titleClean || !link || !link.startsWith('http')) continue;

            let fullDesc = cleanDescription(item.description || '');
            if (!isStrictCategory('VIDEOJUEGOS', titleClean, fullDesc)) continue;

            const hash = getHash(link || `${src.name}-${titleClean}`);
            const baseSlug = generateSlug(titleClean || `${src.name}-${hash}`);
            const slug = `${baseSlug}-${hash}`;

            const { data: existing } = await supabase
                .from('news_articles')
                .select('id')
                .eq('slug', slug)
                .maybeSingle();

            if (existing) continue;

            console.log(`Found new article [Videojuegos ${countVideojuegos + 1}/${limit}]: "${titleClean}" from ${src.name}...`);

            const subtitle = fullDesc.length > 200 ? fullDesc.substring(0, 197) + '...' : (fullDesc || titleClean);
            let header_image = item.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80';

            const articleHtml = buildRobustArticleContent(titleClean, fullDesc, 'VIDEOJUEGOS', src.name, link);
            const author = pickAuthor(link);
            const parsedDate = item.date ? new Date(item.date) : new Date();
            const published_at = Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

            const payload = {
                title: titleClean,
                subtitle,
                slug,
                header_image,
                content_blocks: [
                    { type: 'metadata', category: 'VIDEOJUEGOS', source: src.name, source_url: link, source_hash: hash, imported_date: targetDateStr },
                    { type: 'text', content: articleHtml }
                ],
                author,
                published_at,
                category: 'VIDEOJUEGOS'
            };

            const { error: insErr } = await supabase
                .from('news_articles')
                .upsert(payload, { onConflict: 'slug' });

            if (!insErr) {
                countVideojuegos++;
                console.log(`Successfully saved: "${titleClean}" [VIDEOJUEGOS]`);
            }
        }
    }

    // 2. Anime en Español
    for (const src of animeSources) {
        if (countAnime >= limit) break;
        console.log(`Fetching Anime from: ${src.name}...`);

        const items = await fetchSourceItems(src);
        for (const item of items) {
            if (countAnime >= limit) break;

            const titleClean = decodeHtmlEntities(item.title || '').trim();
            const link = (item.link || '').trim();
            if (!titleClean || !link || !link.startsWith('http')) continue;

            let fullDesc = cleanDescription(item.description || '');
            if (!isStrictCategory('ANIME', titleClean, fullDesc)) continue;

            const hash = getHash(link || `${src.name}-${titleClean}`);
            const baseSlug = generateSlug(titleClean || `${src.name}-${hash}`);
            const slug = `${baseSlug}-${hash}`;

            const { data: existing } = await supabase
                .from('news_articles')
                .select('id')
                .eq('slug', slug)
                .maybeSingle();

            if (existing) continue;

            console.log(`Found new article [Anime ${countAnime + 1}/${limit}]: "${titleClean}" from ${src.name}...`);

            const subtitle = fullDesc.length > 200 ? fullDesc.substring(0, 197) + '...' : (fullDesc || titleClean);
            let header_image = item.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80';

            const articleHtml = buildRobustArticleContent(titleClean, fullDesc, 'ANIME', src.name, link);
            const author = pickAuthor(link);
            const parsedDate = item.date ? new Date(item.date) : new Date();
            const published_at = Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

            const payload = {
                title: titleClean,
                subtitle,
                slug,
                header_image,
                content_blocks: [
                    { type: 'metadata', category: 'ANIME', source: src.name, source_url: link, source_hash: hash, imported_date: targetDateStr },
                    { type: 'text', content: articleHtml }
                ],
                author,
                published_at,
                category: 'ANIME'
            };

            const { error: insErr } = await supabase
                .from('news_articles')
                .upsert(payload, { onConflict: 'slug' });

            if (!insErr) {
                countAnime++;
                console.log(`Successfully saved: "${titleClean}" [ANIME]`);
            }
        }
    }

    console.log(`Sync Completed! Total synced: ${countVideojuegos} Videojuegos and ${countAnime} Anime.`);
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

                const { data: topProfiles } = await supabase
                    .from('profiles')
                    .select('username, avatar_url, points, role')
                    .order('points', { ascending: false })
                    .limit(10);

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
