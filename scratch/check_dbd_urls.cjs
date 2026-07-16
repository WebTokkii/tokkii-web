const https = require('https');

const urls = [
  'https://dbd.tricky.lol/assets/Game/UI/UMGAssets/Icons/Perks/iconPerks_adrenaline.png',
  'https://dbd.tricky.lol/assets/UI/Icons/Perks/iconPerks_adrenaline.png',
  'https://dbd.tricky.lol/assets/UI/Icons/Perks/DLC3/iconPerks_aceInTheHole.png',
  'https://dbd.tricky.lol/assets/UI/UMGAssets/Icons/Perks/DLC3/iconPerks_aceInTheHole.png'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    const req = https.request(url, options, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', () => resolve({ url, status: 'error' }));
    req.end();
  });
}

Promise.all(urls.map(checkUrl)).then((results) => {
  console.log(JSON.stringify(results, null, 2));
});
