const fs = require('fs');
const https = require('https');

const options = {
  hostname: 'dbd.tricky.lol',
  path: '/api/perks',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const perksObj = JSON.parse(data);
            const perksList = [];
            for (const key in perksObj) {
                const perk = perksObj[key];
                if (perk.name && perk.image && perk.role) {
                    perksList.push({
                        name: perk.name,
                        role: perk.role,
                        image: perk.image
                    });
                }
            }
            
            // Generate DbdPerks.ts file
            const fileContent = `export interface DbdPerk {
  name: string;
  role: 'survivor' | 'killer';
  image: string;
}

export const DBD_PERKS: DbdPerk[] = ${JSON.stringify(perksList, null, 2)};
`;
            fs.writeFileSync('E:/Imágenes/Tokkii/Web/src/data/DbdPerks.ts', fileContent);
            console.log(`Successfully wrote ${perksList.length} perks to DbdPerks.ts`);
        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching perks:', err);
});
