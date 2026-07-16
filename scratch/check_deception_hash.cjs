const crypto = require('crypto');

const baseName = 'IconPerks_deception.png';
const hash = crypto.createHash('md5').update(baseName).digest('hex');
console.log('Filename:', baseName);
console.log('MD5 Hash:', hash);
console.log('First char:', hash.charAt(0));
console.log('First two:', hash.substring(0, 2));
