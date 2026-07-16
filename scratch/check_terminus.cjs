const https = require('https');
const crypto = require('crypto');

const baseName = 'IconPerks_terminus.png';
const hash = crypto.createHash('md5').update(baseName).digest('hex');
const f = hash.charAt(0);
const s = hash.substring(0, 2);

const url = `https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/${f}/${s}/${baseName}`;

const options = {
  method: 'HEAD',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(url, options, (res) => {
  console.log(`URL: ${url}`);
  console.log(`Status for IconPerks_terminus.png: ${res.statusCode}`);
});
req.on('error', (err) => console.error(err));
req.end();
