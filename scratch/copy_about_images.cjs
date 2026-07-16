const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\lokii\\.gemini\\antigravity\\brain\\a1b76da0-e260-4134-a9f3-d71dc44ce104';
const destDir = 'E:\\Imágenes\\Tokkii\\Web\\public\\Imagenes';

const mappings = [
  { src: 'media__1784195138042.png', dest: 'sobre_tokkii_1.png' },
  { src: 'media__1784195138064.png', dest: 'sobre_tokkii_2.png' },
  { src: 'media__1784195138145.png', dest: 'sobre_tokkii_3.png' }
];

mappings.forEach(m => {
  const srcPath = path.join(srcDir, m.src);
  const destPath = path.join(destDir, m.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${m.src} to ${m.dest}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});
