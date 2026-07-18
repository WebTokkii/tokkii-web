import fs from 'fs';

const content = fs.readFileSync('e:/Imágenes/Tokkii/Web/src/pages/Minijuegos.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes("currentView === 'quiz'") || line.includes("view === 'quiz'")) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
