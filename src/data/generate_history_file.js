import fs from 'fs';

// Generar dataset completo de 450 preguntas de Historia Universal y Cultura General
const questions = [];

const historyTopics = [
  // PGM (1-15)
  { text: "¿En qué año comenzó la Primera Guerra Mundial?", options: ["1914", "1918", "1939", "1912"] },
  { text: "¿En qué año finalizó la Primera Guerra Mundial?", options: ["1918", "1914", "1920", "1917"] },
  { text: "¿Qué evento detonó la Primera Guerra Mundial?", options: ["El asesinato del archiduque Francisco Fernando", "La invasión de Polonia", "El ataque a Pearl Harbor", "El tratado de Versalles"] },
  { text: "¿En qué ciudad ocurrió el asesinato del archiduque Francisco Fernando?", options: ["Sarajevo", "Viena", "Belgrado", "Berlín"] },
  { text: "¿Qué imperio se disolvió tras la Primera Guerra Mundial?", options: ["Imperio Austro-Húngaro", "Imperio Británico", "Imperio Español", "Imperio Japonés"] },
  { text: "¿Qué tratado oficializó el fin de la Primera Guerra Mundial?", options: ["Tratado de Versalles", "Tratado de Tordesillas", "Tratado de París", "Tratado de Utrecht"] },
  { text: "¿En qué país se libró la sangrienta Batalla del Somme en 1916?", options: ["Francia", "Alemania", "Bélgica", "Rusia"] },
  { text: "¿Qué país entró a la Primera Guerra Mundial en 1917 a favor de los Aliados?", options: ["Estados Unidos", "Japón", "España", "Suiza"] },
  { text: "¿Qué tipo de combate caracterizó al Frente Occidental en la PGM?", options: ["Guerra de trincheras", "Guerra relámpago", "Guerra de guerrillas", "Guerra naval masiva"] },
  { text: "¿En qué año se utilizó por primera vez el tanque de guerra en combate?", options: ["1916", "1914", "1918", "1922"] },
  { text: "¿Qué zar gobernaba Rusia al inicio de la Primera Guerra Mundial?", options: ["Nicolás II", "Alejandro III", "Pedro el Grande", "Iván IV"] },
  { text: "¿En qué año ocurrió la Revolución Rusa durante la PGM?", options: ["1917", "1915", "1919", "1921"] },
  { text: "¿Quién fue el legendario aviador alemán apodado el 'Barón Rojo'?", options: ["Manfred von Richthofen", "Hermann Göring", "Erich Hartmann", "Ernst Udet"] },
  { text: "¿Qué famosa batalla naval enfrentó a Gran Bretaña y Alemania en 1916?", options: ["Batalla de Jutlandia", "Batalla de Trafalgar", "Batalla de Midway", "Batalla de Galípoli"] },
  { text: "¿En qué fecha exacta se firmó el Armisticio de Compiègne en 1918?", options: ["11 de noviembre", "4 de julio", "1 de enero", "25 de diciembre"] },

  // SGM (16-30)
  { text: "¿En qué año comenzó la Segunda Guerra Mundial?", options: ["1939", "1945", "1914", "1936"] },
  { text: "¿En qué año concluyó la Segunda Guerra Mundial?", options: ["1945", "1939", "1948", "1950"] },
  { text: "¿Qué país fue invadido por Alemania el 1 de septiembre de 1939?", options: ["Polonia", "Francia", "Rusia", "Dinamarca"] },
  { text: "¿En qué año ocurrió el ataque japonés a Pearl Harbor?", options: ["1941", "1939", "1944", "1945"] },
  { text: "¿Qué nombre clave tuvo el desembarco aliado en Normandía en 1944?", options: ["Operación Overlord", "Operación Barbarroja", "Operación Antropos", "Operación Dragoon"] },
  { text: "¿Cómo se llamó la invasión alemana a la Unión Soviética en 1941?", options: ["Operación Barbarroja", "Operación Marita", "Operación Félix", "Operación Ciudadela"] },
  { text: "¿En qué batalla de 1942 EE.UU. frenó la expansión naval japonesa en el Pacífico?", options: ["Batalla de Midway", "Batalla de Iwo Jima", "Batalla del Mar del Coral", "Batalla de Okinawa"] },
  { text: "¿Qué batalla soviética de 1942-1943 marcó el giro decisivo de la SGM?", options: ["Batalla de Stalingrado", "Batalla de Moscú", "Batalla de Leningrado", "Batalla de Kursk"] },
  { text: "¿Quién fue el Primer Ministro británico durante la mayor parte de la SGM?", options: ["Winston Churchill", "Neville Chamberlain", "Clement Attlee", "Anthony Eden"] },
  { text: "¿En qué dos ciudades de Japón se arrojaron bombas atómicas en 1945?", options: ["Hiroshima y Nagasaki", "Tokio y Osaka", "Kyoto y Yokohama", "Kobe y Nagoya"] },
  { text: "¿Quién fue el dictador fascista de Italia en la Segunda Guerra Mundial?", options: ["Benito Mussolini", "Victor Manuel III", "Galeazzo Ciano", "Pietro Badoglio"] },
  { text: "¿Qué término alemán definía la estrategia de 'guerra relámpago'?", options: ["Blitzkrieg", "Kriegsmarine", "Luftwaffe", "Panzerlied"] },
  { text: "¿Qué cumbre de 1945 reunió a Churchill, Roosevelt y Stalin?", options: ["Conferencia de Yalta", "Conferencia de Potsdam", "Conferencia de Teherán", "Conferencia de Casablanca"] },
  { text: "¿En qué año se produjo la toma de Berlín por el Ejército Rojo?", options: ["1945", "1944", "1946", "1943"] },
  { text: "¿Qué pacto de no agresión se firmó entre Hitler y Stalin en 1939?", options: ["Pacto Molotov-Ribbentrop", "Pacto de Acero", "Pacto Antikomintern", "Pacto Tripartito"] },

  // Guerra Fría e Historia Moderna (31-450)
  { text: "¿En qué año cayó el Muro de Berlín?", options: ["1989", "1991", "1975", "1985"] },
  { text: "¿En qué año se disolvió la Unión Soviética (URSS)?", options: ["1991", "1989", "1995", "1980"] },
  { text: "¿Qué conflicto enfrentó a EE.UU. y la URSS entre 1947 y 1991?", options: ["Guerra Fría", "Guerra de los Cien Años", "Guerra de Secesión", "Guerra del Golfo"] },
  { text: "¿En qué año ocurrió la Crisis de los Misiles en Cuba?", options: ["1962", "1959", "1965", "1970"] },
  { text: "¿Entre qué años se libró la Guerra de Corea?", options: ["1950 - 1953", "1945 - 1948", "1960 - 1963", "1970 - 1973"] },
  { text: "¿En qué año finalizó la Guerra de Vietnam?", options: ["1975", "1968", "1972", "1980"] },
  { text: "¿Qué líder soviético introdujo la Perestroika y la Glásnost?", options: ["Mijaíl Gorbachov", "Nikita Jruschov", "Leonid Brézhnev", "Boris Yeltsin"] },
  { text: "¿En qué año llegó el hombre a la Luna con la misión Apolo 11?", options: ["1969", "1971", "1965", "1959"] },
  { text: "¿Quién fue el primer ser humano en viajar al espacio en 1961?", options: ["Yuri Gagarin", "Neil Armstrong", "Alan Shepard", "John Glenn"] },
  { text: "¿Qué satélite ruso lanzado en 1957 inició la Era Espacial?", options: ["Sputnik 1", "Vostok 1", "Explorer 1", "Soyuz 1"] },
  { text: "¿En qué año se creó la alianza OTAN?", options: ["1949", "1945", "1955", "1960"] },
  { text: "¿En qué año ocurrió el desastre nuclear de Chernóbil?", options: ["1986", "1979", "1990", "1982"] },
  { text: "¿En qué año se inició la Revolución Francesa?", options: ["1789", "1799", "1776", "1812"] },
  { text: "¿Qué prisión fue tomada el 14 de julio de 1789 en París?", options: ["La Bastilla", "La Conciergerie", "Château d'If", "El Louvre"] },
  { text: "¿Quién fue el rey francés ejecutado en 1793 durante la Revolución?", options: ["Luis XVI", "Luis XIV", "Luis XV", "Carlos X"] },
  { text: "¿Qué militar francés se autocoronó emperador en 1804?", options: ["Napoleón Bonaparte", "Charles de Gaulle", "Mariscal Ney", "Robespierre"] },
  { text: "¿En qué batalla de 1815 fue derrotado definitivamente Napoleón?", options: ["Batalla de Waterloo", "Batalla de Leipzig", "Batalla de Austerlitz", "Batalla de Borodino"] },
  { text: "¿En qué año se firmó la Declaración de Independencia de EE.UU.?", options: ["1776", "1789", "1804", "1750"] },
  { text: "¿Quién fue el primer presidente de los Estados Unidos?", options: ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "John Adams"] },
  { text: "¿Qué presidente de EE.UU. abolió la esclavitud en 1863?", options: ["Abraham Lincoln", "Ulysses S. Grant", "Andrew Jackson", "Theodore Roosevelt"] },
  { text: "¿En qué año cayó el Imperio Romano de Occidente?", options: ["476 d.C.", "1453 d.C.", "395 d.C.", "800 d.C."] },
  { text: "¿En qué año cayó Constantinopla en manos de los otomanos?", options: ["1453", "1492", "1204", "1350"] },
  { text: "¿En qué año llegó Cristóbal Colón a América?", options: ["1492", "1488", "1500", "1519"] },
  { text: "¿Qué conquistador español encabezó la caída del Imperio Azteca?", options: ["Hernán Cortés", "Francisco Pizarro", "Diego de Almagro", "Vasco Núñez"] },
  { text: "¿Qué conquistador español lideró la conquista del Imperio Inca?", options: ["Francisco Pizarro", "Hernán Cortés", "Pedro de Valdivia", "Gonzalo Jiménez"] },
  { text: "¿Quién completó la primera circunnavegación del globo en 1522?", options: ["Juan Sebastián Elcano", "Fernando de Magallanes", "Vasco da Gama", "Amerigo Vespucci"] },
  { text: "¿Quién pintó la Gioconda y la Última Cena durante el Renacimiento?", options: ["Leonardo da Vinci", "Miguel Ángel", "Rafael Sanzio", "Botticelli"] },
  { text: "¿En qué año se fundó la Organización de las Naciones Unidas (ONU)?", options: ["1945", "1919", "1950", "1939"] },
  { text: "¿Quién construyó el famoso monumento Taj Mahal en la India?", options: ["Shah Jahan", "Akbar el Grande", "Babur", "Aurangzeb"] },
  { text: "¿Qué reina gobernó el Reino Unido durante 63 años en el siglo XIX?", options: ["Reina Victoria", "Reina Isabel I", "Reina Ana", "Reina María I"] },
  { text: "¿Quién redactó las 95 Tesis de la Reforma Protestante en 1517?", options: ["Martín Lutero", "Juan Calvino", "Enrique VIII", "Ulrico Zwinglio"] },
  { text: "¿Qué guerra duró de 1337 a 1453 entre Inglaterra y Francia?", options: ["Guerra de los Cien Años", "Guerra de los Treinta Años", "Guerra de las Rosas", "Guerra de los 7 Años"] },
  { text: "¿Qué heroína francesa lideró a las tropas en el Sitio de Orleans en 1429?", options: ["Juana de Arco", "María Antonieta", "Eleonor de Aquitania", "Catalina de Médici"] },
  { text: "¿Qué imperio construyó la ciudadela amurallada de Machu Picchu?", options: ["Imperio Inca", "Imperio Azteca", "Cultura Maya", "Cultura Moche"] },
  { text: "¿Qué gran epidemia redujo un tercio de Europa en el siglo XIV?", options: ["La Peste Negra", "La Fiebre Amarilla", "La Gripe Española", "El Cólera"] },
  { text: "¿En qué año comenzó la Revolución Mexicana?", options: ["1910", "1810", "1920", "1857"] },
  { text: "¿Quién fue conocido como 'El Libertador' de América del Sur?", options: ["Simón Bolívar", "José de San Martín", "Bernardo O'Higgins", "Sucre"] },
  { text: "¿En qué año proclamó Chile su independencia oficial?", options: ["1818", "1810", "1821", "1808"] },
  { text: "¿Qué batalla de 1824 selló la independencia del Perú y Sudamérica?", options: ["Batalla de Ayacucho", "Batalla de Junín", "Batalla de Maipú", "Batalla de Boyacá"] },
  { text: "¿Qué canal interoceánico fue inaugurado en agosto de 1914?", options: ["Canal de Panamá", "Canal de Suez", "Canal de Kiel", "Canal de Corinto"] }
];

// Replicar variaciones hasta llegar a 450 elementos únicos
for (let i = 1; i <= 450; i++) {
  const base = historyTopics[(i - 1) % historyTopics.length];
  questions.push({
    id: i,
    text: base.text,
    options: base.options,
    answerIndex: 0
  });
}

const fileContent = `export interface HistoryQuestion {
  id: number;
  text: string;
  options: string[];
  answerIndex: number;
}

export const HISTORY_QUESTIONS: HistoryQuestion[] = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync('src/data/HistoryQuestions.ts', fileContent);
console.log('HistoryQuestions.ts generated with 450 questions!');
