export interface Question {
  id: number;
  text: string;
  options: string[];
  answerIndex: number;
}

export const OVERWATCH_QUESTIONS: Question[] = [
  // Tank questions
  {
    id: 1,
    text: "¿Cuál es el rol principal de Reinhardt en Overwatch?",
    options: ["Damage", "Tank", "Support", "Flanker"],
    answerIndex: 1
  },
  {
    id: 2,
    text: "¿Cuál es el arma emblemática de Winston?",
    options: ["Cañón de Tesla", "Martillo a reacción", "Garra gancho", "Pistolas de pulso"],
    answerIndex: 0
  },
  {
    id: 3,
    text: "¿Cómo se llama el robot que pilota D.Va?",
    options: ["MEKA", "Bastion", "OR15", "Titan"],
    answerIndex: 0
  },
  {
    id: 4,
    text: "¿Qué habilidad permite a Roadhog atraer enemigos hacia él?",
    options: ["Gancho con cadena", "Inhalador de gas", "Garra magnética", "Salto sísmico"],
    answerIndex: 0
  },
  {
    id: 5,
    text: "¿Qué personaje puede crear barreras de escudo cinéticas gravitacionales?",
    options: ["Sigma", "Orisa", "Winston", "Zarya"],
    answerIndex: 0
  },
  {
    id: 6,
    text: "¿Cómo se llama la habilidad definitiva de Zarya?",
    options: ["Bomba de gravedad", "Brote de gravitones", "Oleada de gravitones", "Golpe gravitacional"],
    answerIndex: 2
  },
  {
    id: 7,
    text: "¿Quién es la líder de los Junkers y reina de Junkertown?",
    options: ["Junker Queen", "Zarya", "Ashe", "Domina"],
    answerIndex: 0
  },
  {
    id: 8,
    text: "¿Cuál es el elemento o rol de Orisa en el juego?",
    options: ["Damage", "Support", "Tank", "Especialista"],
    answerIndex: 2
  },
  {
    id: 9,
    text: "¿Qué tanque tiene un compañero mecánico llamado Wrecking Ball (Hammond)?",
    options: ["Un hámster inteligente", "Un gorila modificado", "Un robot de combate", "Un cyborg"],
    answerIndex: 0
  },
  {
    id: 10,
    text: "¿De qué nacionalidad es el personaje Doomfist?",
    options: ["Nigeriano", "Egipcio", "Brasileño", "Alemán"],
    answerIndex: 0
  },
  // Damage questions
  {
    id: 11,
    text: "¿Qué daño principal inflige Widowmaker con su rifle de francotirador al apuntar?",
    options: ["Disparo continuo", "Disparo cargado de precisión", "Explosión de veneno", "Ráfaga de plasma"],
    answerIndex: 1
  },
  {
    id: 12,
    text: "¿Quién es el hermano mayor de Genji Shimada?",
    options: ["Hanzo", "Zenyatta", "Reaper", "Cassidy"],
    answerIndex: 0
  },
  {
    id: 13,
    text: "¿Cuál es la frase característica de Cassidy al activar su definitiva?",
    options: ["It's high noon", "Justice rains from above", "Die, die, die", "Fire in the hole"],
    answerIndex: 0
  },
  {
    id: 14,
    text: "¿Qué personaje Damage se especializa en hackear enemigos y volverse invisible?",
    options: ["Sombra", "Tracer", "Echo", "Mei"],
    answerIndex: 0
  },
  {
    id: 15,
    text: "¿Cómo viaja Tracer en el tiempo para recuperar salud?",
    options: ["Regresión", "Traslación", "Teletransporte", "Desvanecimiento"],
    answerIndex: 0
  },
  {
    id: 16,
    text: "¿Cuál es el verdadero nombre de Reaper?",
    options: ["Gabriel Reyes", "Jack Morrison", "Cole Cassidy", "Genji Shimada"],
    answerIndex: 0
  },
  {
    id: 17,
    text: "¿De dónde proviene Pharah y su madre Ana?",
    options: ["Egipto", "Irak", "Jordania", "Turquía"],
    answerIndex: 0
  },
  {
    id: 18,
    text: "¿Cuál es la especialidad de Junkrat en combate?",
    options: ["Explosivos y trampas", "Láseres de precisión", "Hielo y congelamiento", "Combate cuerpo a cuerpo"],
    answerIndex: 0
  },
  {
    id: 19,
    text: "¿Qué Damage utiliza torretas centinelas y portales de teletransporte?",
    options: ["Symmetra", "Torbjörn", "Sombra", "Echo"],
    answerIndex: 0
  },
  {
    id: 20,
    text: "¿Qué personaje empuña un martillo para reparar su propia torreta?",
    options: ["Torbjörn", "Bastion", "Reinhardt", "Brigitte"],
    answerIndex: 0
  },
  // Support questions
  {
    id: 21,
    text: "¿Quién cura volando al lado de los aliados usando el Bastón Caduceo?",
    options: ["Mercy", "Moira", "Kiriko", "Juno"],
    answerIndex: 0
  },
  {
    id: 22,
    text: "¿Qué Support tiene un aura pasiva que cura o aumenta la velocidad de movimiento con música?",
    options: ["Lúcio", "Zenyatta", "Baptiste", "Lifeweaver"],
    answerIndex: 0
  },
  {
    id: 23,
    text: "¿Cuál es el proyectil curativo a distancia de Zenyatta?",
    options: ["Orbe de armonía", "Orbe de discordia", "Orbe biótico", "Kunai de curación"],
    answerIndex: 0
  },
  {
    id: 24,
    text: "¿Qué Support utiliza un Ofuda de sanación y puede purificar con el Suzu de protección?",
    options: ["Kiriko", "Ana", "Illari", "Moira"],
    answerIndex: 0
  },
  {
    id: 25,
    text: "¿Cuál es el rifle biótico capaz de curar aliados y dañar enemigos que usa Ana?",
    options: ["Rifle Biótico", "Rifle de Pulso", "Rifle de Riel", "Disparador solar"],
    answerIndex: 0
  },
  {
    id: 26,
    text: "¿Qué científico genético Support utiliza energía biótica morada y amarilla?",
    options: ["Moira", "Sigma", "Mei", "Mercy"],
    answerIndex: 0
  },
  {
    id: 27,
    text: "¿Qué Support de origen peruano utiliza la energía del sol para curar y atacar?",
    options: ["Illari", "Lúcio", "Juno", "Sombra"],
    answerIndex: 0
  },
  {
    id: 28,
    text: "¿Qué habilidad definitiva de Baptiste duplica el daño y la curación de los proyectiles aliados?",
    options: ["Matriz de amplificación", "Campo de inmortalidad", "Línea de curación", "Barrera solar"],
    answerIndex: 0
  },
  {
    id: 29,
    text: "¿Qué Support de Overwatch es capaz de crear plataformas de pétalo y un gran árbol de vida?",
    options: ["Lifeweaver", "Zenyatta", "Juno", "Brigitte"],
    answerIndex: 0
  },
  {
    id: 30,
    text: "¿Qué joven heroína espacial fue introducida recientemente usando propulsores en sus botas?",
    options: ["Juno", "D.Va", "Tracer", "Kiriko"],
    answerIndex: 0
  },
  // Lore and mixed
  {
    id: 31,
    text: "¿Cómo se llama la inteligencia artificial del gorila Winston?",
    options: ["Athena", "Echo", "Sombra", "Snowball"],
    answerIndex: 0
  },
  {
    id: 32,
    text: "¿Qué organización terrorista rivaliza contra Overwatch?",
    options: ["Talon", "Blackwatch", "Null Sector", "Helix Security"],
    answerIndex: 0
  },
  {
    id: 33,
    text: "¿Qué crisis robótica mundial causó la creación de Overwatch?",
    options: ["Crisis Ómnica", "Guerra de Clanes", "Revolución de Null Sector", "Gran Falla"],
    answerIndex: 0
  },
  {
    id: 34,
    text: "¿De qué país procede la campeona de Mecha D.Va?",
    options: ["Corea del Sur", "Japón", "China", "Taiwán"],
    answerIndex: 0
  },
  {
    id: 35,
    text: "¿Quién es el comandante supremo del grupo Null Sector?",
    options: ["Ramattra", "Doomfist", "Sigma", "Bastion"],
    answerIndex: 0
  },
  {
    id: 36,
    text: "¿Cuál es la profesión o rol original de Mei?",
    options: ["Climatóloga", "Ingeniera espacial", "Médico militar", "Soldado de élite"],
    answerIndex: 0
  },
  {
    id: 37,
    text: "¿Cómo se llama el mapa clásico situado en la base lunar?",
    options: ["Base Lunar Horizon", "Ruta 66", "Hanamura", "Gibraltar"],
    answerIndex: 0
  },
  {
    id: 38,
    text: "¿Qué personaje empuña un cañón de riel y se desliza para reposicionarse?",
    options: ["Sojourn", "Soldier: 76", "Ashe", "Juno"],
    answerIndex: 0
  },
  {
    id: 39,
    text: "¿Quién es el archienemigo robot y rebelde de Torbjörn?",
    options: ["Bastion", "Bastion (anteriormente)", "Null Sector / Ramattra", "OR15"],
    answerIndex: 2
  },
  {
    id: 40,
    text: "¿Qué personaje no binario introducido recientemente utiliza un taladro inteligente?",
    options: ["Venture", "Hazard", "Juno", "Junker Queen"],
    answerIndex: 0
  },
  {
    id: 41,
    text: "¿Cómo se llama la pequeña compañera robot voladora de Mei?",
    options: ["Snowball", "Ganímedes", "Bob", "Wrecking Ball"],
    answerIndex: 0
  },
  {
    id: 42,
    text: "¿Quién es el leal mayordomo ómnico de Ashe?",
    options: ["B.O.B.", "Zenyatta", "Ramattra", "Maximilian"],
    answerIndex: 0
  },
  {
    id: 43,
    text: "¿Cómo se llama el pequeño pájaro amarillo amigo de Bastion?",
    options: ["Ganímedes", "Snowball", "Pepe", "Chirpy"],
    answerIndex: 0
  },
  {
    id: 44,
    text: "¿De qué nacionalidad es Lúcio?",
    options: ["Brasileño", "Mexicano", "Colombiano", "Peruano"],
    answerIndex: 0
  },
  {
    id: 45,
    text: "¿Quién lideraba Blackwatch, la división encubierta de Overwatch?",
    options: ["Gabriel Reyes (Reaper)", "Jack Morrison (Soldado: 76)", "Genji", "Cole Cassidy"],
    answerIndex: 0
  }
];
