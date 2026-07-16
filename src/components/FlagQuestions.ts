export interface FlagQuestion {
  id: number;
  flagCode: string;
  options: string[];
  answerIndex: number;
}

// 75 flag questions. Divided into 5 blocks of 15 questions.
// Daily quiz will cycle through these blocks so flags do not repeat from one day to the next.
export const FLAG_QUESTIONS: FlagQuestion[] = [
  // BLOCK 1
  {
    id: 1,
    flagCode: "es",
    options: ["España", "Portugal", "Italia", "Francia"],
    answerIndex: 0
  },
  {
    id: 2,
    flagCode: "jp",
    options: ["China", "Corea del Sur", "Japón", "Tailandia"],
    answerIndex: 2
  },
  {
    id: 3,
    flagCode: "br",
    options: ["Argentina", "Brasil", "Colombia", "Bolivia"],
    answerIndex: 1
  },
  {
    id: 4,
    flagCode: "ca",
    options: ["Estados Unidos", "Reino Unido", "Canadá", "Australia"],
    answerIndex: 2
  },
  {
    id: 5,
    flagCode: "za",
    options: ["Egipto", "Nigeria", "Kenia", "Sudáfrica"],
    answerIndex: 3
  },
  {
    id: 6,
    flagCode: "de",
    options: ["Bélgica", "Alemania", "Austria", "Países Bajos"],
    answerIndex: 1
  },
  {
    id: 7,
    flagCode: "mx",
    options: ["México", "Italia", "Irlanda", "Colombia"],
    answerIndex: 0
  },
  {
    id: 8,
    flagCode: "ru",
    options: ["Francia", "Países Bajos", "Rusia", "Polonia"],
    answerIndex: 2
  },
  {
    id: 9,
    flagCode: "eg",
    options: ["Egipto", "Marruecos", "Arabia Saudita", "Irak"],
    answerIndex: 0
  },
  {
    id: 10,
    flagCode: "it",
    options: ["Francia", "Irlanda", "Italia", "México"],
    answerIndex: 2
  },
  {
    id: 11,
    flagCode: "in",
    options: ["Pakistán", "India", "Bangladés", "Irán"],
    answerIndex: 1
  },
  {
    id: 12,
    flagCode: "gr",
    options: ["Grecia", "Turquía", "Chipre", "Israel"],
    answerIndex: 0
  },
  {
    id: 13,
    flagCode: "ar",
    options: ["Uruguay", "Chile", "Argentina", "Paraguay"],
    answerIndex: 2
  },
  {
    id: 14,
    flagCode: "se",
    options: ["Noruega", "Finlandia", "Dinamarca", "Suecia"],
    answerIndex: 3
  },
  {
    id: 15,
    flagCode: "co",
    options: ["Ecuador", "Venezuela", "Colombia", "Rumanía"],
    answerIndex: 2
  },

  // BLOCK 2
  {
    id: 16,
    flagCode: "gb",
    options: ["Reino Unido", "Australia", "Nueva Zelanda", "Islandia"],
    answerIndex: 0
  },
  {
    id: 17,
    flagCode: "cn",
    options: ["Taiwán", "Vietnam", "Corea del Norte", "China"],
    answerIndex: 3
  },
  {
    id: 18,
    flagCode: "us",
    options: ["Canadá", "Estados Unidos", "Puerto Rico", "Liberia"],
    answerIndex: 1
  },
  {
    id: 19,
    flagCode: "fr",
    options: ["Italia", "Bélgica", "Francia", "Rusia"],
    answerIndex: 2
  },
  {
    id: 20,
    flagCode: "au",
    options: ["Nueva Zelanda", "Reino Unido", "Canadá", "Australia"],
    answerIndex: 3
  },
  {
    id: 21,
    flagCode: "kr",
    options: ["Japón", "Corea del Sur", "Corea del Norte", "China"],
    answerIndex: 1
  },
  {
    id: 22,
    flagCode: "tr",
    options: ["Grecia", "Turquía", "Túnez", "Egipto"],
    answerIndex: 1
  },
  {
    id: 23,
    flagCode: "pt",
    options: ["España", "Portugal", "Brasil", "Italia"],
    answerIndex: 1
  },
  {
    id: 24,
    flagCode: "ch",
    options: ["Suiza", "Austria", "Dinamarca", "Polonia"],
    answerIndex: 0
  },
  {
    id: 25,
    flagCode: "nl",
    options: ["Bélgica", "Luxemburgo", "Francia", "Países Bajos"],
    answerIndex: 3
  },
  {
    id: 26,
    flagCode: "be",
    options: ["Alemania", "Bélgica", "Rumanía", "Chad"],
    answerIndex: 1
  },
  {
    id: 27,
    flagCode: "ua",
    options: ["Suecia", "Ucrania", "Polonia", "Rumanía"],
    answerIndex: 1
  },
  {
    id: 28,
    flagCode: "pe",
    options: ["Bolivia", "Canadá", "Perú", "Austria"],
    answerIndex: 2
  },
  {
    id: 29,
    flagCode: "no",
    options: ["Dinamarca", "Suecia", "Noruega", "Islandia"],
    answerIndex: 2
  },
  {
    id: 30,
    flagCode: "vn",
    options: ["Vietnam", "China", "Tailandia", "Singapur"],
    answerIndex: 0
  },

  // BLOCK 3
  {
    id: 31,
    flagCode: "cl",
    options: ["Cuba", "Texas", "Chile", "Puerto Rico"],
    answerIndex: 2
  },
  {
    id: 32,
    flagCode: "dk",
    options: ["Suiza", "Noruega", "Dinamarca", "Finlandia"],
    answerIndex: 2
  },
  {
    id: 33,
    flagCode: "nz",
    options: ["Australia", "Reino Unido", "Nueva Zelanda", "Fiyi"],
    answerIndex: 2
  },
  {
    id: 34,
    flagCode: "pl",
    options: ["Polonia", "Indonesia", "Mónaco", "Singapur"],
    answerIndex: 0
  },
  {
    id: 35,
    flagCode: "ie",
    options: ["Italia", "Costa de Marfil", "Irlanda", "México"],
    answerIndex: 2
  },
  {
    id: 36,
    flagCode: "cu",
    options: ["Puerto Rico", "Cuba", "República Dominicana", "Panamá"],
    answerIndex: 1
  },
  {
    id: 37,
    flagCode: "ma",
    options: ["Túnez", "Turquía", "Marruecos", "Argelia"],
    answerIndex: 2
  },
  {
    id: 38,
    flagCode: "th",
    options: ["Costa Rica", "Tailandia", "Corea del Sur", "Filipinas"],
    answerIndex: 1
  },
  {
    id: 39,
    flagCode: "ph",
    options: ["República Checa", "Filipinas", "Cuba", "Malasia"],
    answerIndex: 1
  },
  {
    id: 40,
    flagCode: "at",
    options: ["Austria", "Suiza", "Polonia", "Letonia"],
    answerIndex: 0
  },
  {
    id: 41,
    flagCode: "ve",
    options: ["Ecuador", "Colombia", "Venezuela", "Bolivia"],
    answerIndex: 2
  },
  {
    id: 42,
    flagCode: "sa",
    options: ["Irak", "Egipto", "Siria", "Arabia Saudita"],
    answerIndex: 3
  },
  {
    id: 43,
    flagCode: "il",
    options: ["Grecia", "Israel", "Argentina", "Uruguay"],
    answerIndex: 1
  },
  {
    id: 44,
    flagCode: "fi",
    options: ["Finlandia", "Suecia", "Noruega", "Islandia"],
    answerIndex: 0
  },
  {
    id: 45,
    flagCode: "id",
    options: ["Polonia", "Mónaco", "Indonesia", "Singapur"],
    answerIndex: 2
  },

  // BLOCK 4
  {
    id: 46,
    flagCode: "ro",
    options: ["Rumanía", "Bélgica", "Andorra", "Moldavia"],
    answerIndex: 0
  },
  {
    id: 47,
    flagCode: "hr",
    options: ["Eslovaquia", "Eslovenia", "Croacia", "Serbia"],
    answerIndex: 2
  },
  {
    id: 48,
    flagCode: "cz",
    options: ["República Checa", "Filipinas", "Polonia", "Eslovaquia"],
    answerIndex: 0
  },
  {
    id: 49,
    flagCode: "hu",
    options: ["Italia", "Hungría", "Bulgaria", "Irán"],
    answerIndex: 1
  },
  {
    id: 50,
    flagCode: "is",
    options: ["Noruega", "Finlandia", "Suecia", "Islandia"],
    answerIndex: 3
  },
  {
    id: 51,
    flagCode: "sg",
    options: ["Singapur", "Indonesia", "Mónaco", "Polonia"],
    answerIndex: 0
  },
  {
    id: 52,
    flagCode: "my",
    options: ["Estados Unidos", "Liberia", "Malasia", "Filipinas"],
    answerIndex: 2
  },
  {
    id: 53,
    flagCode: "pk",
    options: ["Argelia", "Pakistán", "Turquía", "Libia"],
    answerIndex: 1
  },
  {
    id: 54,
    flagCode: "bd",
    options: ["Japón", "Palaos", "Bangladés", "India"],
    answerIndex: 2
  },
  {
    id: 55,
    flagCode: "ir",
    options: ["Irak", "Irán", "Siria", "Kuwait"],
    answerIndex: 1
  },
  {
    id: 56,
    flagCode: "iq",
    options: ["Egipto", "Siria", "Irak", "Yemen"],
    answerIndex: 2
  },
  {
    id: 57,
    flagCode: "qa",
    options: ["Catar", "Baréin", "Emiratos Árabes Unidos", "Omán"],
    answerIndex: 0
  },
  {
    id: 58,
    flagCode: "ae",
    options: ["Catar", "Arabia Saudita", "Emiratos Árabes Unidos", "Jordania"],
    answerIndex: 2
  },
  {
    id: 59,
    flagCode: "ec",
    options: ["Colombia", "Ecuador", "Venezuela", "Rumanía"],
    answerIndex: 1
  },
  {
    id: 60,
    flagCode: "bo",
    options: ["Bolivia", "Senegal", "Ghana", "Etiopía"],
    answerIndex: 0
  },

  // BLOCK 5
  {
    id: 61,
    flagCode: "py",
    options: ["Paraguay", "Uruguay", "Luxemburgo", "Países Bajos"],
    answerIndex: 0
  },
  {
    id: 62,
    flagCode: "uy",
    options: ["Argentina", "Uruguay", "Grecia", "Honduras"],
    answerIndex: 1
  },
  {
    id: 63,
    flagCode: "cr",
    options: ["Tailandia", "Costa Rica", "Panamá", "Cuba"],
    answerIndex: 1
  },
  {
    id: 64,
    flagCode: "pa",
    options: ["Panamá", "Costa Rica", "República Dominicana", "Puerto Rico"],
    answerIndex: 0
  },
  {
    id: 65,
    flagCode: "jm",
    options: ["Jamaica", "Bahamas", "Sudáfrica", "Brasil"],
    answerIndex: 0
  },
  {
    id: 66,
    flagCode: "do",
    options: ["Panamá", "República Dominicana", "Cuba", "Puerto Rico"],
    answerIndex: 1
  },
  {
    id: 67,
    flagCode: "mg",
    options: ["Madagascar", "Benín", "Togo", "Mauricio"],
    answerIndex: 0
  },
  {
    id: 68,
    flagCode: "sn",
    options: ["Mali", "Senegal", "Guinea", "Camerún"],
    answerIndex: 1
  },
  {
    id: 69,
    flagCode: "cm",
    options: ["Camerún", "Senegal", "Ghana", "Congo"],
    answerIndex: 0
  },
  {
    id: 70,
    flagCode: "gh",
    options: ["Etiopía", "Ghana", "Bolivia", "Camerún"],
    answerIndex: 1
  },
  {
    id: 71,
    flagCode: "et",
    options: ["Kenia", "Etiopía", "Bolivia", "Ghana"],
    answerIndex: 1
  },
  {
    id: 72,
    flagCode: "dz",
    options: ["Túnez", "Marruecos", "Argelia", "Libia"],
    answerIndex: 2
  },
  {
    id: 73,
    flagCode: "tn",
    options: ["Argelia", "Túnez", "Turquía", "Egipto"],
    answerIndex: 1
  },
  {
    id: 74,
    flagCode: "ke",
    options: ["Kenia", "Uganda", "Tanzania", "Sudáfrica"],
    answerIndex: 0
  },
  {
    id: 75,
    flagCode: "ng",
    options: ["Ghana", "Costa de Marfil", "Nigeria", "Camerún"],
    answerIndex: 2
  }
];
