const https = require('https');

const url = 'https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/c/cc/IconPerks_lithe.png';

const options = {
  method: 'HEAD',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(url, options, (res) => {
  console.log(`Status of Lithe icon: ${res.statusCode}`);
});

req.on('error', (err) => console.error(err));
req.end();
