import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100) {
      return resolve(true);
    }

    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': 'https://fandom.com/'
        },
        timeout: 10000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadImage(res.headers.location, destPath).then(resolve);
        }

        if (res.statusCode !== 200) {
          return resolve(false);
        }

        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
        fileStream.on('error', () => resolve(false));
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
    } catch (e) {
      resolve(false);
    }
  });
}

function processOverwatch() {
  console.log('Procesando Overwatch...');
  const overwatchDbPath = path.join(rootDir, 'src/data/OverwatchDb.ts');
  let content = fs.readFileSync(overwatchDbPath, 'utf8');
  const overwatchDir = path.join(rootDir, 'public/Overwatch');
  const files = fs.readdirSync(overwatchDir).filter(f => f.endsWith('.png'));
  const fileMap = {};
  for (const f of files) {
    const clean = f.replace('.png', '').toLowerCase().replace(/[^a-z0-9]/g, '');
    fileMap[clean] = f;
  }

  content = content.replace(/"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"element":\s*"([^"]+)",\s*"weapon":\s*"([^"]+)",\s*"rarity":\s*(\d+),\s*"imgUrl":\s*"([^"]+)"/g, 
    (match, id, name, element, weapon, rarity, imgUrl) => {
      const cleanId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchedFile = fileMap[cleanId] || fileMap[cleanName];
      if (matchedFile) {
        return `"id": "${id}",\n    "name": "${name}",\n    "element": "${element}",\n    "weapon": "${weapon}",\n    "rarity": ${rarity},\n    "imgUrl": "/Overwatch/${matchedFile}"`;
      }
      return match;
    }
  );

  fs.writeFileSync(overwatchDbPath, content, 'utf8');
  console.log('Overwatch actualizado con imágenes locales.');
}

async function processCategory(dbFileName, publicFolderName) {
  console.log(`Descargando imágenes para ${publicFolderName}...`);
  const dbPath = path.join(rootDir, `src/data/${dbFileName}`);
  const publicDir = path.join(rootDir, `public/${publicFolderName}`);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let content = fs.readFileSync(dbPath, 'utf8');
  const regex = /"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"element":\s*"([^"]+)",\s*"weapon":\s*"([^"]+)",\s*"rarity":\s*(\d+),\s*"imgUrl":\s*"([^"]+)"/g;
  const matches = [...content.matchAll(regex)];
  console.log(`${publicFolderName}: ${matches.length} personajes encontrados.`);

  for (let i = 0; i < matches.length; i += 8) {
    const chunk = matches.slice(i, i + 8);
    await Promise.all(chunk.map(async (m) => {
      const [fullMatch, id, name, element, weapon, rarity, imgUrl] = m;
      if (imgUrl.startsWith('http')) {
        const destFile = path.join(publicDir, `${id}.png`);
        const success = await downloadImage(imgUrl, destFile);
        if (success) {
          content = content.replace(imgUrl, `/${publicFolderName}/${id}.png`);
        }
      }
    }));
    process.stdout.write(`\r${publicFolderName}: ${Math.min(i + 8, matches.length)} / ${matches.length}`);
  }
  console.log(`\n${publicFolderName} completado.`);
  fs.writeFileSync(dbPath, content, 'utf8');
}

async function main() {
  processOverwatch();
  await processCategory('GenshinDb.ts', 'Genshin');
  await processCategory('WutheringWavesDb.ts', 'Wuwa');
  await processCategory('DbdDb.ts', 'Dbd');
  console.log('\n--- ¡Todas las imágenes se han descargado y configurado en local! ---');
}

main().catch(console.error);
