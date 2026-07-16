export interface Question {
  id: number;
  text: string;
  options: string[];
  answerIndex: number;
}

export const GAMES_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "¿Cuál fue el primer videojuego de la historia en implementar un sistema de guardado mediante pila (Battery Backup)?",
    options: ["The Legend of Zelda (NES)", "Dragon Quest (NES)", "Metroid (NES)", "Final Fantasy (NES)"],
    answerIndex: 0
  },
  {
    id: 2,
    text: "¿Cómo se llama el chip de coprocesamiento que incluyó el cartucho de Super Mario RPG para realizar cálculos 3D en la SNES?",
    options: ["Super FX", "Super FX 2", "SA-1", "DSP-1"],
    answerIndex: 2
  },
  {
    id: 3,
    text: "¿Cuál es el nombre del virus informático ficticio que destruyó Internet en el lore de la saga .hack?",
    options: ["Pluto's Kiss", "AIDA", "Corbenik", "Skeith"],
    answerIndex: 0
  },
  {
    id: 4,
    text: "¿En qué año y en qué juego de arcade debutó oficialmente el personaje de Donkey Kong?",
    options: ["1980 en Radar Scope", "1981 en Donkey Kong", "1982 en Donkey Kong Jr.", "1981 en Sheriff"],
    answerIndex: 1
  },
  {
    id: 5,
    text: "¿Cuál de los siguientes personajes no era jugable en el 'Resident Evil 1' original de 1996?",
    options: ["Chris Redfield", "Jill Valentine", "Rebecca Chambers", "Albert Wesker"],
    answerIndex: 3
  },
  {
    id: 6,
    text: "¿Qué compositor creó la icónica banda sonora de la trilogía original de 'Donkey Kong Country'?",
    options: ["David Wise", "Koji Kondo", "Nobuo Uematsu", "Yasunori Mitsuda"],
    answerIndex: 0
  },
  {
    id: 7,
    text: "¿Cuál fue el nombre en clave del proyecto que terminó convirtiéndose en la consola Sega Dreamcast?",
    options: ["Katana", "Atlantis", "Mercury", "Venus"],
    answerIndex: 0
  },
  {
    id: 8,
    text: "¿Qué prestigioso estudio de desarrollo creó el shooter en primera persona 'GoldenEye 007' para Nintendo 64?",
    options: ["Retro Studios", "Rare", "id Software", "Factor 5"],
    answerIndex: 1
  },
  {
    id: 9,
    text: "¿En qué juego de rol para la consola PlayStation hizo su primera aparición física el jefe secreto 'Omega Weapon'?",
    options: ["Final Fantasy VII", "Final Fantasy VIII", "Final Fantasy IX", "Final Fantasy Tactics"],
    answerIndex: 1
  },
  {
    id: 10,
    text: "¿Quién es el creador intelectual y diseñador de la influyente saga de simulación 'Metal Gear'?",
    options: ["Hidetaka Miyazaki", "Shinji Mikami", "Hideo Kojima", "Yu Suzuki"],
    answerIndex: 2
  },
  {
    id: 11,
    text: "¿Qué motor gráfico fue utilizado para el desarrollo del 'Half-Life' original lanzado en 1998?",
    options: ["Source", "GoldSrc", "Quake Engine", "Unreal Engine 1"],
    answerIndex: 1
  },
  {
    id: 12,
    text: "¿Cuál de los siguientes jefes de la saga 'Dark Souls' es conocido como el 'Caminante del Abismo'?",
    options: ["Manus", "Artorias", "Sif", "Gwyn"],
    answerIndex: 1
  },
  {
    id: 13,
    text: "¿Cómo se llama el primer coloso que debes enfrentar en 'Shadow of the Colossus'?",
    options: ["Valus", "Quadratus", "Gaius", "Phaedra"],
    answerIndex: 0
  },
  {
    id: 14,
    text: "¿Qué juego de rol táctico de 1998 introdujo el innovador sistema de combate 'Active Time Battle' en cuadrícula 3D?",
    options: ["Tactics Ogre", "Final Fantasy Tactics", "Vagrant Story", "Xenogears"],
    answerIndex: 1
  },
  {
    id: 15,
    text: "¿Cuál es el verdadero nombre biológico de 'Samanosuke Akechi', protagonista de Onimusha?",
    options: ["Hidemitsu Akechi", "Samanosuke Minamoto", "Takeshi Kaneshiro", "Jubei Yagyu"],
    answerIndex: 0
  },
  {
    id: 16,
    text: "¿Qué videojuego introdujo el concepto de 'Karma' o sistema de moralidad visible por primera vez en un RPG de Occidente?",
    options: ["Ultima IV: Quest of the Avatar", "Fallout (1997)", "Planescape: Torment", "Star Wars: KOTOR"],
    answerIndex: 0
  },
  {
    id: 17,
    text: "¿Cuál es el nombre de la corporación minera espacial propietaria de la nave USG Ishimura en 'Dead Space'?",
    options: ["Weyland-Yutani", "C.E.C. (Concordance Extraction Corporation)", "U.A.C.", "Union Aerospace"],
    answerIndex: 1
  },
  {
    id: 18,
    text: "¿Qué juego de terror psicológico para GameCube contaba con un 'medidor de cordura' que alteraba el entorno del jugador?",
    options: ["Eternal Darkness: Sanity's Requiem", "Silent Hill 2", "Fatal Frame", "Rule of Rose"],
    answerIndex: 0
  },
  {
    id: 19,
    text: "¿Qué canción suena durante la mítica escena de introducción de 'Silent Hill' (1999) tocada con mandolina?",
    options: ["Silent Hill Theme", "Tears of...", "Not Tomorrow", "Esperandote"],
    answerIndex: 0
  },
  {
    id: 20,
    text: "¿Quién es el principal antagonista y mente detrás de los eventos de la saga 'Kingdom Hearts'?",
    options: ["Ansem", "Xemnas", "Xehanort", "Maléfica"],
    answerIndex: 2
  },
  {
    id: 21,
    text: "¿Qué mítica espada de la mitología nórdica empuña Siegfried en la saga de lucha 'Soulcalibur'?",
    options: ["Soul Edge", "Soul Calibur", "Requiem", "Gram"],
    answerIndex: 0
  },
  {
    id: 22,
    text: "¿Cómo se llama el archipiélago flotante donde ocurren los hechos de 'BioShock Infinite'?",
    options: ["Rapture", "Columbia", "Olympus", "Sky City"],
    answerIndex: 1
  },
  {
    id: 23,
    text: "¿Qué juego de simulación espacial y comercio lanzado en 1993 sentó las bases para el género en 3D real?",
    options: ["Elite", "Frontier: Elite II", "Wing Commander", "Star Control II"],
    answerIndex: 1
  },
  {
    id: 24,
    text: "¿Cuál es el nombre de la Inteligencia Artificial que controla la instalación de investigación en 'System Shock'?",
    options: ["GLaDOS", "SHODAN", "HAL 9000", "CORTANA"],
    answerIndex: 1
  },
  {
    id: 25,
    text: "¿Qué RPG de BioWare de 2003 permitía al jugador decidir la redención o caída de Darth Revan?",
    options: ["Mass Effect", "Jade Empire", "Neverwinter Nights", "Star Wars: Knights of the Old Republic"],
    answerIndex: 3
  },
  {
    id: 26,
    text: "¿Qué actor dio voz y captura de movimiento al protagonista 'Cole Phelps' en 'L.A. Noire'?",
    options: ["Aaron Staton", "Jon Hamm", "Roger Clark", "Troy Baker"],
    answerIndex: 0
  },
  {
    id: 27,
    text: "¿Qué juego de estrategia en tiempo real de 1997 introdujo tres facciones asimétricas llamadas Terran, Zerg y Protoss?",
    options: ["Command & Conquer", "StarCraft", "Warcraft II", "Total Annihilation"],
    answerIndex: 1
  },
  {
    id: 28,
    text: "¿Cómo se llama el planeta de origen del Jefe Maestro en el universo de 'Halo'?",
    options: ["Reach", "Eridanus II", "Sanghelios", "Earth"],
    answerIndex: 1
  },
  {
    id: 29,
    text: "¿Cuál es la sub-marca o división de Shinra responsable de la creación de los supersoldados SOLDIER en 'Final Fantasy VII'?",
    options: ["Departamento de Desarrollo Urbano", "Departamento de Ciencia y Química", "Departamento de Fuerza Militar", "Administración del Espacio"],
    answerIndex: 1
  },
  {
    id: 30,
    text: "¿Qué prestigioso diseñador creó el concepto mecánico del salto 'Rocket Jump' en la escena competitiva de 'Quake'?",
    options: ["John Carmack", "John Romero", "American McGee", "Dave Taylor"],
    answerIndex: 1
  }
];
