import fs from 'fs';

async function fetchTriviaBatch(amount = 50, category = 23) {
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple`;
  const res = await fetch(url);
  return await res.json();
}

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&deg;/g, '°')
    .replace(/&eacute;/g, 'é')
    .replace(/&aacute;/g, 'á')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ');
}

async function collectAllHistory() {
  const questionsMap = new Map();
  console.log('Fetching questions from OpenTDB...');
  
  for (const cat of [23, 9]) {
    for (let i = 0; i < 8; i++) {
      try {
        const data = await fetchTriviaBatch(50, cat);
        if (data.results) {
          data.results.forEach(q => {
            const cleanText = decodeHtml(q.question);
            if (!questionsMap.has(cleanText)) {
              questionsMap.set(cleanText, {
                question: cleanText,
                correct: decodeHtml(q.correct_answer),
                incorrect: q.incorrect_answers.map(decodeHtml),
                category: q.category
              });
            }
          });
        }
        await new Promise(r => setTimeout(r, 1000));
      } catch (e) {
        console.error('Fetch error:', e);
      }
    }
  }

  console.log('Total unique raw questions collected:', questionsMap.size);
  fs.writeFileSync('raw_questions.json', JSON.stringify(Array.from(questionsMap.values()), null, 2));
}

collectAllHistory();
