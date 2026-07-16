const https = require('https');
const crypto = require('crypto'); // Built-in node crypto for MD5

function getWikiaUrl(perkName) {
  // MediaWiki normalizes filename: replace spaces with underscores, first letter capitalized
  let filename = perkName.replace(/ /g, '_');
  filename = filename.charAt(0).toUpperCase() + filename.slice(1);
  filename = filename + '.png';
  
  const hash = crypto.createHash('md5').update(filename).digest('hex');
  const f = hash.charAt(0);
  const s = hash.substring(0, 2);
  
  return `https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/${f}/${s}/${encodeURIComponent(filename)}`;
}

const testPerks = [
  'Adrenaline',
  'Ace in the Hole',
  'Aftercare',
  'Agitation',
  'Alert',
  'Hex: Ruin',
  'A Nurse\'s Calling'
];

function checkUrl(perkName) {
  const url = getWikiaUrl(perkName);
  return new Promise((resolve) => {
    const options = {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };
    const req = https.request(url, options, (res) => {
      resolve({ perkName, url, status: res.statusCode });
    });
    req.on('error', () => resolve({ perkName, url, status: 'error' }));
    req.end();
  });
}

Promise.all(testPerks.map(checkUrl)).then((results) => {
  console.log(JSON.stringify(results, null, 2));
});
