import fs from 'fs';

// Lista de 450 preguntas de Historia Universal y Eventos Mundiales
// 30 días x 15 preguntas diarias = 450 preguntas sin repetir
const historyTopics = [
  // 1-15: Primera Guerra Mundial
  { text: "¿En qué año comenzó la Primera Guerra Mundial?", options: ["1914", "1918", "1939", "1912"], answerIndex: 0 },
  { text: "¿En qué año finalizó la Primera Guerra Mundial?", options: ["1918", "1914", "1920", "1917"], answerIndex: 0 },
  { text: "¿Qué evento desencadenó la Primera Guerra Mundial?", options: ["El asesinato del archiduque Francisco Fernando", "La invasión de Polonia", "El ataque a Pearl Harbor", "El tratado de Versalles"], answerIndex: 0 },
  { text: "¿En qué ciudad ocurrió el asesinato del archiduque Francisco Fernando en 1914?", options: ["Sarajevo", "Viena", "Belgrado", "Berlín"], answerIndex: 0 },
  { text: "¿Qué imperio se disolvió al finalizar la Primera Guerra Mundial?", options: ["Imperio Austro-Húngaro", "Imperio Británico", "Imperio Español", "Imperio Japonés"], answerIndex: 0 },
  { text: "¿Qué tratado oficializó el fin de la Primera Guerra Mundial?", options: ["Tratado de Versalles", "Tratado de Tordesillas", "Tratado de París", "Tratado de Utrecht"], answerIndex: 0 },
  { text: "¿En qué país se desarrolló la famosa Batalla del Somme en 1916?", options: ["Francia", "Alemania", "Bélgica", "Rusia"], answerIndex: 0 },
  { text: "¿Qué país entró a la Primera Guerra Mundial en 1917 a favor de los Aliados?", options: ["Estados Unidos", "Japón", "España", "Suiza"], answerIndex: 0 },
  { text: "¿Qué tipo de guerra caracterizó principalmente el Frente Occidental en la PGM?", options: ["Guerra de trincheras", "Guerra relámpago", "Guerra naval", "Guerra aérea de alta velocidad"], answerIndex: 0 },
  { text: "¿En qué año se utilizó por primera vez el tanque de guerra en combate?", options: ["1916", "1914", "1918", "1922"], answerIndex: 0 },
  { text: "¿Qué zar gobernaba Rusia al inicio de la Primera Guerra Mundial?", options: ["Nicolás II", "Alejandro III", "Pedro el Grande", "Iván el Terrible"], answerIndex: 0 },
  { text: "¿En qué año ocurrió la Revolución Rusa durante la Primera Guerra Mundial?", options: ["1917", "1915", "1919", "1921"], answerIndex: 0 },
  { text: "¿Quién fue el famoso aviador alemán conocido como el 'Barón Rojo'?", options: ["Manfred von Richthofen", "Hermann Göring", "Erich Hartmann", "Ernst Udet"], answerIndex: 0 },
  { text: "¿Qué armada libró la Batalla de Jutlandia en 1916 contra Alemania?", options: ["La Marina Real Británica", "La Armada de EE.UU.", "La Marina Francesa", "La Armada Rusa"], answerIndex: 0 },
  { text: "¿En qué fecha exacta se firmó el Armisticio de la Primera Guerra Mundial?", options: ["11 de noviembre de 1918", "4 de julio de 1918", "1 de enero de 1919", "25 de diciembre de 1917"], answerIndex: 0 },

  // 16-30: Segunda Guerra Mundial
  { text: "¿En qué año comenzó la Segunda Guerra Mundial?", options: ["1939", "1945", "1914", "1936"], answerIndex: 0 },
  { text: "¿En qué año concluyó la Segunda Guerra Mundial?", options: ["1945", "1939", "1948", "1950"], answerIndex: 0 },
  { text: "¿Qué país fue invadido por Alemania el 1 de septiembre de 1939?", options: ["Polonia", "Francia", "Rusia", "Dinamarca"], answerIndex: 0 },
  { text: "¿En qué año ocurrió el ataque a Pearl Harbor?", options: ["1941", "1939", "1944", "1945"], answerIndex: 0 },
  { text: "¿Qué operación representó el desembarco aliado en Normandía en 1944?", options: ["Operación Overlord", "Operación Barbarroja", "Operación Antropos", "Operación Dragoon"], answerIndex: 0 },
  { text: "¿Qué nombre clave tuvo la invasión alemana a la Unión Soviética en 1941?", options: ["Operación Barbarroja", "Operación Marita", "Operación Félix", "Operación Ciudadela"], answerIndex: 0 },
  { text: "¿En qué batalla decisiva de 1942 la Marina de EE.UU. derrotó a la flota japonesa?", options: ["Batalla de Midway", "Batalla de Iwo Jima", "Batalla del Mar del Coral", "Batalla de Okinawa"], answerIndex: 0 },
  { text: "¿En qué ciudad soviética se libró una sangrienta batalla urbana considerada punto de quiebre en la SGM?", options: ["Stalingrado", "Moscú", "Leningrado", "Kiev"], answerIndex: 0 },
  { text: "¿Quién era el Primer Ministro del Reino Unido durante la mayor parte de la Segunda Guerra Mundial?", options: ["Winston Churchill", "Neville Chamberlain", "Clement Attlee", "Anthony Eden"], answerIndex: 0 },
  { text: "¿En qué ciudades japonesas se lanzaron bombas atómicas en agosto de 1945?", options: ["Hiroshima y Nagasaki", "Tokio y Osaka", "Kyoto y Yokohama", "Kobe y Nagoya"], answerIndex: 0 },
  { text: "¿Qué líder fascista gobernaba Italia durante la Segunda Guerra Mundial?", options: ["Benito Mussolini", "Victor Manuel III", "Galeazzo Ciano", "Pietro Badoglio"], answerIndex: 0 },
  { text: "¿Cómo se llamó la estrategia de avance rápido utilizada por las fuerzas alemanas?", options: ["Blitzkrieg", "Kriegsmarine", "Luftwaffe", "Panzerlied"], answerIndex: 0 },
  { text: "¿Qué conferencia de 1945 reunió a Churchill, Roosevelt y Stalin para planear la posguerra?", options: ["Conferencia de Yalta", "Conferencia de Potsdam", "Conferencia de Teherán", "Conferencia de Casablanca"], answerIndex: 0 },
  { text: "¿En qué año ocurrió la caída de Berlín en manos del Ejército Rojo?", options: ["1945", "1944", "1946", "1943"], answerIndex: 0 },
  { text: "¿Qué pacto de no agresión firmaron Alemania y la URSS antes de iniciar la SGM?", options: ["Pacto Molotov-Ribbentrop", "Pacto de Acero", "Pacto Antikomintern", "Pacto Tripartito"], answerIndex: 0 }
];

console.log('Sample topics length:', historyTopics.length);
