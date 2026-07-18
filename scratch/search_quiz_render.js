import fs from 'fs';

const content = fs.readFileSync('e:/Imágenes/Tokkii/Web/src/pages/Minijuegos.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('currentView') || line.includes('quizQuestions')) {
    if (line.includes('===') || line.includes('&&') || line.includes('map')) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  }
});
