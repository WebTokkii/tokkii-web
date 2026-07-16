const fs = require('fs');
const https = require('https');

https.get('https://dbd.tricky.lol/api/perks', (res) => {
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
