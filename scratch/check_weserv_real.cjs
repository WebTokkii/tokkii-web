const https = require('https');

const url = 'https://images.weserv.nl/?url=dbd.tricky.lol/assets/Game/UI/UMGAssets/Icons/Perks/iconPerks_adrenaline.png';

const options = {
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(url, options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(`Status for weserv.nl proxy: ${res.statusCode}`);
    console.log('Body:', body);
  });
});

req.on('error', (err) => {
  console.error('Error:', err);
});

req.end();
