const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/Imagenes/Perks');
const files = fs.readdirSync(targetDir);

// Filter only png files and get their base names (without .png extension)
const baseNames = files
  .filter(file => file.endsWith('.png'))
  .map(file => file.substring(0, file.length - 4));

const outContent = `// This file is auto-generated. Do not edit manually.
export const DOWNLOADED_PERKS = new Set([
${baseNames.map(name => `  ${JSON.stringify(name)}`).join(',\n')}
]);
`;

const destFile = path.join(__dirname, '../src/data/DbdPerksDownloaded.ts');
fs.writeFileSync(destFile, outContent, 'utf8');
console.log(`Generated list of ${baseNames.length} downloaded perks in DbdPerksDownloaded.ts`);
