import fs from 'fs';

const content = fs.readFileSync('e:/Imágenes/Tokkii/Web/src/pages/Minijuegos.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('points') || line.includes('puntos') || line.includes('score') || line.includes('update')) {
    if (line.includes('supabase') || line.includes('from')) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  }
});
