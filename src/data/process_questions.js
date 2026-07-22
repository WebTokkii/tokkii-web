import fs from 'fs';

// Cargar preguntas de raw_questions.json
const rawData = JSON.parse(fs.readFileSync('raw_questions.json', 'utf8'));

// Mapa de traducciones para términos e historia
const translations = [
  { en: "World War I", es: "Primera Guerra Mundial" },
  { en: "World War II", es: "Segunda Guerra Mundial" },
  { en: "Cold War", es: "Guerra Fría" },
  { en: "French Revolution", es: "Revolución Francesa" },
  { en: "American Civil War", es: "Guerra Civil Estadounidense" },
  { en: "Russian Revolution", es: "Revolución Rusa" },
  { en: "United States", es: "Estados Unidos" },
  { en: "Soviet Union", es: "Unión Soviética" },
  { en: "United Kingdom", es: "Reino Unido" },
  { en: "Germany", es: "Alemania" },
  { en: "France", es: "Francia" },
  { en: "Japan", es: "Japón" },
  { en: "Italy", es: "Italia" },
  { en: "Spain", es: "España" },
  { en: "China", es: "China" },
  { en: "Russia", es: "Rusia" },
  { en: "England", es: "Inglaterra" },
  { en: "What year did", es: "¿En qué año ocurrió" },
  { en: "Which of the following", es: "¿Cuál de los siguientes" },
  { en: "Who was the", es: "¿Quién fue el" },
  { en: "Who is the", es: "¿Quién es el" },
  { en: "Which country", es: "¿Qué país" },
  { en: "Where was", es: "¿Dónde se" }
];

console.log('Processing total questions:', rawData.length);
