const https = require('https');

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      console.log('Status Code:', res.statusCode);
      console.log('Headers:', res.headers);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function test() {
  const url = 'https://deadbydaylight.fandom.com/wiki/File:IconPerks_MonstrousShrine.png';
  console.log('Fetching', url);
  const html = await fetchHtml(url);
  
  // Find any nocookie link
  const matches = html.match(/https:\/\/static\.wikia\.nocookie\.net\/[^"'\s]+/gi);
  console.log('Matches:', matches ? matches.slice(0, 5) : 'None');
}
test();
