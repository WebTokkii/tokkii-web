const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const filePath = path.join(__dirname, '../src/data/DbdPerks.ts');
const content = fs.readFileSync(filePath, 'utf8');

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

// Map database codenames / typos to real Fandom Wiki filenames
function cleanPerkName(rawName, perkName) {
  let cleaned = rawName;
  
  // Strip common prefixes case-insensitively
  cleaned = cleaned.replace(/^(T_UI_)?(iconsPerks_|iconPerks_|IconPerks_|iconPerk_|T_UI_)/i, '');
  
  // Manual overrides for codenames / typos
  const lowerCleaned = cleaned.toLowerCase();
  if (lowerCleaned === 'hatred') return 'rancor';
  if (lowerCleaned === 'vittoriosgambit') return 'quickGambit';
  if (lowerCleaned === 'awakenedawarenesss') return 'awakenedAwareness';
  if (lowerCleaned === 'darknessrevelated') return 'darknessRevealed';
  if (lowerCleaned === 'thatanophobia') return 'thanatophobia';
  if (lowerCleaned === 'selfaware' && perkName === 'Machine Learning') return 'machineLearning';
  if (lowerCleaned === 'selfaware' && perkName === 'Self-Aware') return 'self-aware';
  if (lowerCleaned === 'illumination') return 'boonIllumination';
  
  // Use the perkName itself if we have weird paths
  if (perkName === 'Scourge Hook: Monstrous Shrine') return 'MonstrousShrine';
  if (perkName === 'Mindbreaker') return 'Mindbreaker';
  if (perkName === 'Hex: No One Escapes Death') return 'NoOneEscapesDeath';
  if (perkName === 'Open-Handed') return 'Open-Handed';
  if (perkName === 'Boon: Exponential') return 'BoonExponential';
  if (perkName === 'Boon: Dark Theory') return 'BoonDarkTheory';
  if (perkName === 'Boon: Circle of Healing') return 'BoonCircleOfHealing';
  if (perkName === 'Boon: Shadow Step') return 'BoonShadowStep';
  if (perkName === 'Boon: Illumination') return 'BoonIllumination';
  
  return cleaned;
}

async function downloadPerkImage(perk) {
  const parts = perk.image.split('/');
  const rawBaseName = parts[parts.length - 1]; // e.g. iconPerks_Terminus
  
  const destPath = path.join(targetDir, `${rawBaseName}.png`);
  
  // Skip if already downloaded and valid
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100) {
    return { name: perk.name, status: 'skipped' };
  }

  const cleaned = cleanPerkName(rawBaseName, perk.name);
  
  // Candidate filenames to try
  const candidates = [
    `IconPerks_${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}.png`,
    `IconPerks_${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)}.png`,
    `IconPerks_${cleaned}.png`,
    // Try matching the formatting of perk name (e.g. ScourgeHookMonstrousShrine)
    `IconPerks_${perk.name.replace(/[^a-zA-Z0-9]/g, '')}.png`,
    `IconPerks_${perk.name.charAt(0).toLowerCase() + perk.name.slice(1).replace(/[^a-zA-Z0-9]/g, '')}.png`,
    `${perk.name.replace(/[^a-zA-Z0-9]/g, '')}.png`
  ];

  // De-duplicate candidate list
  const uniqueCandidates = [...new Set(candidates)];

  for (const candidate of uniqueCandidates) {
    const url = getFandomUrl(candidate);
    try {
      await download(url, destPath);
      console.log(`[OK] Downloaded: ${perk.name} using ${candidate}`);
      return { name: perk.name, status: 'success' };
    } catch (err) {
      // Try next candidate
    }
  }

  console.error(`[FAIL] Could not get image for ${perk.name} (Paths tried: ${uniqueCandidates.join(', ')})`);
  return { name: perk.name, status: 'failed' };
}

async function run() {
  console.log(`Starting v2 download of ${perks.length} perks...`);
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  const chunkSize = 8;
  for (let i = 0; i < perks.length; i += chunkSize) {
    const chunk = perks.slice(i, i + chunkSize);
    const promises = chunk.map(perk => downloadPerkImage(perk));
    const results = await Promise.all(promises);
    
    for (const res of results) {
      if (res.status === 'success') {
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
