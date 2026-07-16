const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Load DBD_PERKS array by parsing the typescript file
const filePath = path.join(__dirname, '../src/data/DbdPerks.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Extract the array using regex / eval
const jsonStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
let perks;
try {
  perks = eval(jsonStr);
} catch (e) {
  console.error("Failed to parse DbdPerks.ts", e);
  process.exit(1);
}

const targetDir = path.join(__dirname, '../public/Imagenes/Perks');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function getFandomUrl(baseName) {
  const hash = md5(baseName);
  const f = hash.charAt(0);
  const s = hash.substring(0, 2);
  return `https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/${f}/${s}/${baseName}`;
}

// Fetch helper to get page HTML as string
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Scrape fallback from the wiki page itself
async function getUrlFromWikiPage(filename) {
  try {
    const wikiUrl = `https://deadbydaylight.fandom.com/wiki/File:${encodeURIComponent(filename)}`;
    const html = await fetchHtml(wikiUrl);
    
    // Look for wikia nocookie url in HTML
    // E.g. src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/f/f5/IconPerks_monstrousShrine.png/revision/latest..."
    const match = html.match(/https:\/\/static\.wikia\.nocookie\.net\/deadbydaylight_gamepedia_en\/images\/[a-f0-9]\/[a-f0-9]{2}\/[^"'\s]+/i);
    if (match) {
      // Clean up the URL (remove trailing revision query parts or slash revisions)
      let cleanUrl = match[0].split('/revision/')[0];
      return cleanUrl;
    }
  } catch (e) {
    // ignore scraper failure
  }
  return null;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    file.on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });

    const request = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Status ${response.statusCode}`));
      }
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadPerkImage(perk) {
  const parts = perk.image.split('/');
  const rawBaseName = parts[parts.length - 1]; // e.g. iconPerks_Terminus
  
  let baseName = '';
  let fallbackName = '';
  
  if (rawBaseName.startsWith('iconPerks_')) {
    const perkPart = rawBaseName.substring(10);
    const lowercased = perkPart.charAt(0).toLowerCase() + perkPart.slice(1);
    const capitalized = perkPart.charAt(0).toUpperCase() + perkPart.slice(1);
    baseName = 'IconPerks_' + lowercased + '.png';
    fallbackName = 'IconPerks_' + capitalized + '.png';
  } else {
    baseName = rawBaseName.charAt(0).toUpperCase() + rawBaseName.slice(1) + '.png';
  }

  const destPath = path.join(targetDir, `${rawBaseName}.png`);
  
  // Skip if file already exists and is valid
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100) {
    return { name: perk.name, status: 'skipped' };
  }

  // 1. Try default Fandom static URL format
  const url = getFandomUrl(baseName);
  try {
    await download(url, destPath);
    console.log(`[OK] Downloaded: ${perk.name}`);
    return { name: perk.name, status: 'success' };
  } catch (err) {
    // 2. Try capitalized fallback name
    if (fallbackName) {
      const fallbackUrl = getFandomUrl(fallbackName);
      try {
        await download(fallbackUrl, destPath);
        console.log(`[OK-FALLBACK] Downloaded: ${perk.name}`);
        return { name: perk.name, status: 'success-fallback' };
      } catch (err2) {
        // Fallback failed, proceed to scraper
      }
    }

    // 3. Scrape Fandom wiki file page directly as final resort
    try {
      const scrapedUrl = await getUrlFromWikiPage(baseName) || (fallbackName ? await getUrlFromWikiPage(fallbackName) : null);
      if (scrapedUrl) {
        await download(scrapedUrl, destPath);
        console.log(`[OK-SCRAPED] Downloaded: ${perk.name}`);
        return { name: perk.name, status: 'success-scraped' };
      }
    } catch (scrapeErr) {
      // Scrape download failed
    }

    console.error(`[FAIL] Could not get image for ${perk.name} (${rawBaseName})`);
    return { name: perk.name, status: 'failed', error: err.message };
  }
}

async function run() {
  console.log(`Starting safe download of ${perks.length} perks...`);
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  const chunkSize = 5;
  for (let i = 0; i < perks.length; i += chunkSize) {
    const chunk = perks.slice(i, i + chunkSize);
    const promises = chunk.map(perk => downloadPerkImage(perk));
    const results = await Promise.all(promises);
    
    for (const res of results) {
      if (res.status.startsWith('success')) {
        successCount++;
      } else if (res.status === 'skipped') {
        skippedCount++;
      } else {
        failCount++;
      }
    }
  }

  console.log(`Download finished!`);
  console.log(`Success: ${successCount}, Skipped: ${skippedCount}, Failed: ${failCount}`);
}

run();
