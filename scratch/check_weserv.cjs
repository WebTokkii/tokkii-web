const https = require('https');

const url = 'https://images.weserv.nl/?url=dbd.tricky.lol/assets/UI/Icons/Perks/iconPerks_adrenaline.png';

const options = {
  method: 'HEAD',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(url, options, (res) => {
  console.log(`Status for weserv.nl proxy: ${res.statusCode}`);
  console.log(JSON.stringify(res.headers, null, 2));
});

req.on('error', (err) => {
  console.error('Error:', err);
});

req.end();
