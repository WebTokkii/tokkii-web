const https = require('https');
const crypto = require('crypto');

const testCases = [
  { path: "/Game/UI/UMGAssets/Icons/Perks/DLC3/iconPerks_aceInTheHole", name: "Ace in the Hole" },
  { path: "/Game/UI/UMGAssets/Icons/Perks/iconPerks_adrenaline", name: "Adrenaline" },
  { path: "/Game/UI/UMGAssets/Icons/Perks/Kenya/iconPerks_aftercare", name: "Aftercare" },
  { path: "/Game/UI/UMGAssets/Icons/Perks/iconPerks_agitation", name: "Agitation" },
  { path: "/Game/UI/UMGAssets/Icons/Perks/iconPerks_alert", name: "Alert" }
];

function getWikiaUrl(apiPath) {
  // Extract base filename (e.g. iconPerks_aceInTheHole)
  const parts = apiPath.split('/');
  let baseName = parts[parts.length - 1];
  
  // Capitalize first letter (e.g. IconPerks_aceInTheHole.png)
  baseName = baseName.charAt(0).toUpperCase() + baseName.slice(1) + '.png';
  
  const hash = crypto.createHash('md5').update(baseName).digest('hex');
  const f = hash.charAt(0);
  const s = hash.substring(0, 2);
  
  return `https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/${f}/${s}/${baseName}`;
}

function checkUrl(tc) {
  const url = getWikiaUrl(tc.path);
  return new Promise((resolve) => {
    const options = {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };
    const req = https.request(url, options, (res) => {
      resolve({ name: tc.name, url, status: res.statusCode });
    });
    req.on('error', () => resolve({ name: tc.name, url, status: 'error' }));
    req.end();
  });
}

Promise.all(testCases.map(checkUrl)).then((results) => {
  console.log(JSON.stringify(results, null, 2));
});
