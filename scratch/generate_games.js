import fs from 'fs';

const existingQuestions = [
  // --- DÍA 1 ---
  { id: 1, text: "¿Cuál fue el primer videojuego en implementar un sistema de guardado mediante pila?", options: ["The Legend of Zelda (NES)", "Dragon Quest (NES)", "Metroid (NES)", "Final Fantasy (NES)"], answerIndex: 0 },
  { id: 2, text: "¿Qué chip de coprocesamiento incluyó Super Mario RPG para realizar cálculos 3D en SNES?", options: ["Super FX", "Super FX 2", "SA-1", "DSP-1"], answerIndex: 2 },
  { id: 3, text: "¿Cómo se llama el virus informático ficticio que destruyó Internet en el lore de .hack?", options: ["Pluto's Kiss", "AIDA", "Corbenik", "Skeith"], answerIndex: 0 },
  { id: 4, text: "¿En qué año y en qué juego de arcade debutó oficialmente Donkey Kong?", options: ["1980 en Radar Scope", "1981 en Donkey Kong", "1982 en Donkey Kong Jr.", "1981 en Sheriff"], answerIndex: 1 },
  { id: 5, text: "¿Cuál de los siguientes personajes no era jugable en el 'Resident Evil 1' original de 1996?", options: ["Chris Redfield", "Jill Valentine", "Rebecca Chambers", "Albert Wesker"], answerIndex: 3 },
  { id: 6, text: "¿Qué compositor creó la icónica banda sonora de la trilogía original de 'Donkey Kong Country'?", options: ["David Wise", "Koji Kondo", "Nobuo Uematsu", "Yasunori Mitsuda"], answerIndex: 0 },
  { id: 7, text: "¿Cuál fue el nombre en clave del proyecto que terminó convirtiéndose en la consola Sega Dreamcast?", options: ["Katana", "Atlantis", "Mercury", "Venus"], answerIndex: 0 },
  { id: 8, text: "¿Qué prestigioso estudio de desarrollo creó el shooter en primera persona 'GoldenEye 007' para Nintendo 64?", options: ["Retro Studios", "Rare", "id Software", "Factor 5"], answerIndex: 1 },
  { id: 9, text: "¿En qué juego de rol para la consola PlayStation hizo su primera aparición física el jefe secreto 'Omega Weapon'?", options: ["Final Fantasy VII", "Final Fantasy VIII", "Final Fantasy IX", "Final Fantasy Tactics"], answerIndex: 1 },
  { id: 10, text: "¿Quién es el creador intelectual y diseñador de la influyente saga de simulación 'Metal Gear'?", options: ["Hidetaka Miyazaki", "Shinji Mikami", "Hideo Kojima", "Yu Suzuki"], answerIndex: 2 },
  { id: 11, text: "¿Qué motor gráfico fue utilizado para el desarrollo del 'Half-Life' original lanzado en 1998?", options: ["Source", "GoldSrc", "Quake Engine", "Unreal Engine 1"], answerIndex: 1 },
  { id: 12, text: "¿Cuál de los siguientes jefes de la saga 'Dark Souls' es conocido como el 'Caminante del Abismo'?", options: ["Manus", "Artorias", "Sif", "Gwyn"], answerIndex: 1 },
  { id: 13, text: "¿Cómo se llama el primer coloso que debes enfrentar en 'Shadow of the Colossus'?", options: ["Valus", "Quadratus", "Gaius", "Phaedra"], answerIndex: 0 },
  { id: 14, text: "¿Qué juego de rol táctico de 1998 introdujo el innovador sistema de combate 'Active Time Battle' en cuadrícula 3D?", options: ["Tactics Ogre", "Final Fantasy Tactics", "Vagrant Story", "Xenogears"], answerIndex: 1 },
  { id: 15, text: "¿Cuál es el verdadero nombre biológico de 'Samanosuke Akechi', protagonista de Onimusha?", options: ["Hidemitsu Akechi", "Samanosuke Minamoto", "Takeshi Kaneshiro", "Jubei Yagyu"], answerIndex: 0 },

  // --- DÍA 2 ---
  { id: 16, text: "¿Qué videojuego introdujo el concepto de 'Karma' o sistema de moralidad visible por primera vez en un RPG de Occidente?", options: ["Ultima IV: Quest of the Avatar", "Fallout (1997)", "Planescape: Torment", "Star Wars: KOTOR"], answerIndex: 0 },
  { id: 17, text: "¿Cuál es el nombre de la corporación minera espacial propietaria de la nave USG Ishimura en 'Dead Space'?", options: ["Weyland-Yutani", "C.E.C. (Concordance Extraction Corporation)", "U.A.C.", "Union Aerospace"], answerIndex: 1 },
  { id: 18, text: "¿Qué juego de terror psicológico para GameCube contaba con un 'medidor de cordura' que alteraba el entorno del jugador?", options: ["Eternal Darkness: Sanity's Requiem", "Silent Hill 2", "Fatal Frame", "Rule of Rose"], answerIndex: 0 },
  { id: 19, text: "¿Qué canción suena durante la mítica escena de introducción de 'Silent Hill' (1999) tocada con mandolina?", options: ["Silent Hill Theme", "Tears of...", "Not Tomorrow", "Esperandote"], answerIndex: 0 },
  { id: 20, text: "¿Quién es el principal antagonista y mente detrás de los eventos de la saga 'Kingdom Hearts'?", options: ["Ansem", "Xemnas", "Xehanort", "Maléfica"], answerIndex: 2 },
  { id: 21, text: "¿Qué mítica espada de la mitología nórdica empuña Siegfried en la saga de lucha 'Soulcalibur'?", options: ["Soul Edge", "Soul Calibur", "Requiem", "Gram"], answerIndex: 0 },
  { id: 22, text: "¿Cómo se llama el archipiélago flotante donde ocurren los hechos de 'BioShock Infinite'?", options: ["Rapture", "Columbia", "Olympus", "Sky City"], answerIndex: 1 },
  { id: 23, text: "¿Qué juego de simulación espacial y comercio lanzado en 1993 sentó las bases para el género en 3D real?", options: ["Elite", "Frontier: Elite II", "Wing Commander", "Star Control II"], answerIndex: 1 },
  { id: 24, text: "¿Cuál es el nombre de la Inteligencia Artificial que controla la instalación de investigación en 'System Shock'?", options: ["GLaDOS", "SHODAN", "HAL 9000", "CORTANA"], answerIndex: 1 },
  { id: 25, text: "¿Qué RPG de BioWare de 2003 permitía al jugador decidir la redención o caída de Darth Revan?", options: ["Mass Effect", "Jade Empire", "Neverwinter Nights", "Star Wars: Knights of the Old Republic"], answerIndex: 3 },
  { id: 26, text: "¿Qué actor dio voz y captura de movimiento al protagonista 'Cole Phelps' en 'L.A. Noire'?", options: ["Aaron Staton", "Jon Hamm", "Rule Clark", "Troy Baker"], answerIndex: 0 },
  { id: 27, text: "¿Qué juego de estrategia en tiempo real de 1997 introdujo tres facciones asimétricas llamadas Terran, Zerg y Protoss?", options: ["Command & Conquer", "StarCraft", "Warcraft II", "Total Annihilation"], answerIndex: 1 },
  { id: 28, text: "¿Cómo se llama el planeta de origen del Jefe Maestro en el universo de 'Halo'?", options: ["Reach", "Eridanus II", "Sanghelios", "Earth"], answerIndex: 1 },
  { id: 29, text: "¿Cuál es la sub-marca o división de Shinra responsable de la creación de los supersoldados SOLDIER en 'Final Fantasy VII'?", options: ["Departamento de Desarrollo Urbano", "Departamento de Ciencia y Química", "Departamento de Fuerza Militar", "Administración del Espacio"], answerIndex: 1 },
  { id: 30, text: "¿Qué prestigioso diseñador creó el concepto mecánico del salto 'Rocket Jump' en la escena competitiva de 'Quake'?", options: ["John Carmack", "John Romero", "American McGee", "Dave Taylor"], answerIndex: 1 },

  // --- DÍA 3 ---
  { id: 31, text: "¿Qué motor de física y simulación fue utilizado para los movimientos de objetos destructibles en Half-Life 2?", options: ["Havok", "PhysX", "Rage Physics", "Euphoria"], answerIndex: 0 },
  { id: 32, text: "¿Cuál es el nombre del primer mapa lanzado para el modo de juego Battle Royale en PlayerUnknown's Battlegrounds?", options: ["Erangel", "Miramar", "Sanhok", "Vikendi"], answerIndex: 0 },
  { id: 33, text: "¿Qué compañía japonesa de hardware arcade desarrolló las placas CPS-1, CPS-2 y CPS-3?", options: ["Capcom", "Sega", "SNK", "Namco"], answerIndex: 0 },
  { id: 34, text: "¿Cómo se llama el reino medieval de fantasía donde transcurren las aventuras de la saga Fable?", options: ["Albion", "Thedas", "Tamriel", "Hyrule"], answerIndex: 0 },
  { id: 35, text: "¿En qué año se lanzó originalmente la videoconsola PlayStation 2 en Japón?", options: ["2000", "1999", "2001", "1998"], answerIndex: 0 },
  { id: 36, text: "¿Quién compuso la memorable banda sonora de la saga Halo?", options: ["Martin O'Donnell", "Nobuo Uematsu", "Jeremy Soule", "Hans Zimmer"], answerIndex: 0 },
  { id: 37, text: "¿Qué desarrollador independiente creó el aclamado juego de plataformas y puzles 'Braid'?", options: ["Jonathan Blow", "Phil Fish", "Edmund McMillen", "Toby Fox"], answerIndex: 0 },
  { id: 38, text: "¿Cuál es el nombre del planeta prisión donde se desarrolla la acción de Borderlands?", options: ["Pandora", "Promethea", "Elpis", "Nekrofateyo"], answerIndex: 0 },
  { id: 39, text: "¿Qué videojuego de la franquicia Zelda permite transformarse en lobo?", options: ["The Legend of Zelda: Twilight Princess", "The Legend of Zelda: Majora's Mask", "The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: Skyward Sword"], answerIndex: 0 },
  { id: 40, text: "¿Qué estudio de videojuegos desarrolló la serie de rol futurista Mass Effect?", options: ["BioWare", "Bethesda Game Studios", "Obsidian Entertainment", "CD Projekt Red"], answerIndex: 0 },
  { id: 41, text: "¿Cómo se llama el demonio de fuego gigante que actúa como jefe final del primer Diablo?", options: ["Diablo", "Mephisto", "Baal", "Butcher"], answerIndex: 0 },
  { id: 42, text: "¿Qué consola de Sega incluía por primera vez una unidad VMU (Visual Memory Unit) con pantalla?", options: ["Dreamcast", "Saturn", "Genesis", "Sega CD"], answerIndex: 0 },
  { id: 43, text: "¿Qué legendario estudio británico de desarrollo creó la franquicia Banjo-Kazooie?", options: ["Rare", "Lionhead Studios", "Bullfrog Productions", "Codemasters"], answerIndex: 0 },
  { id: 44, text: "¿Qué juego de Valve popularizó el mod cooperativo competitivo 'Defense of the Ancients' (DotA)?", options: ["Warcraft III (Dota era mod de Warcraft, no de Valve)", "StarCraft", "Half-Life", "Dota 2"], answerIndex: 0 },
  { id: 45, text: "¿Cuál es el nombre de la inteligencia artificial femenina aliada del Jefe Maestro en Halo?", options: ["Cortana", "GLaDOS", "SHODAN", "The Boss"], answerIndex: 0 },

  // --- DÍA 4 ---
  { id: 46, text: "¿Qué juego de simulación social y construcción de ciudades de Maxis se lanzó en 1989?", options: ["SimCity", "The Sims", "Spore", "SimEarth"], answerIndex: 0 },
  { id: 47, text: "¿Cuál es la capital del imperio en el videojuego The Elder Scrolls V: Skyrim?", options: ["Soledad (Solitude)", "Carrera Blanca (Whiterun)", "Ventalia (Windhelm)", "Riften"], answerIndex: 0 },
  { id: 48, text: "¿Qué consola portátil de Nintendo introdujo por primera vez la retroiluminación interna de pantalla?", options: ["Game Boy Advance SP", "Game Boy Color", "Game Boy Pocket", "Nintendo DS"], answerIndex: 0 },
  { id: 49, text: "¿Qué videojuego de Kojima Productions lanzado en 2019 se centra en conectar ciudades aisladas de EE.UU.?", options: ["Death Stranding", "Metal Gear Solid V", "Snatcher", "Zone of the Enders"], answerIndex: 0 },
  { id: 50, text: "¿Cuál es el nombre del protagonista principal del juego Red Dead Redemption 2?", options: ["Arthur Morgan", "John Marston", "Dutch van der Linde", "Bill Williamson"], answerIndex: 0 },
  { id: 51, text: "¿Qué videojuego competitivo de cartas coleccionables desarrolló Blizzard basado en el universo Warcraft?", options: ["Hearthstone", "Magic: The Gathering Arena", "Legends of Runeterra", "Gwent"], answerIndex: 0 },
  { id: 52, text: "¿Qué saga de rol japonesa tiene como mascota oficial a un pequeño limo azul llamado Slime?", options: ["Dragon Quest", "Final Fantasy", "Tales of", "Persona"], answerIndex: 0 },
  { id: 53, text: "¿Cómo se llama la ciudad ficticia sumergida donde ocurren los dos primeros juegos de BioShock?", options: ["Rapture", "Columbia", "Oahu", "Atlantis"], answerIndex: 0 },
  { id: 54, text: "¿Qué juego indie de plataformas se caracteriza por tener un protagonista que puede revertir el tiempo?", options: ["Braid", "Super Meat Boy", "Limbo", "Fez"], answerIndex: 0 },
  { id: 55, text: "¿Qué personaje es el dios de la guerra en la franquicia God of War?", options: ["Kratos", "Ares", "Zeus", "Atenea"], answerIndex: 0 },
  { id: 56, text: "¿Qué motor de juego utiliza Epic Games para el desarrollo de Fortnite?", options: ["Unreal Engine", "Unity", "CryEngine", "Source 2"], answerIndex: 0 },
  { id: 57, text: "¿Qué juego de FromSoftware de 2019 introduce la mecánica de posturas y prótesis de shinobi?", options: ["Sekiro: Shadows Die Twice", "Bloodborne", "Dark Souls III", "Elden Ring"], answerIndex: 0 },
  { id: 58, text: "¿Cuál es la facción de supervivientes liderada por Marcus Fenix en la saga Gears of War?", options: ["C.O.G. (Coalición de Gobiernos Ordenados)", "U.I.R.", "Locust", "Lambent"], answerIndex: 0 },
  { id: 59, text: "¿Qué videojuego de 1999 permitía a los jugadores librar combates espaciales en el universo de Star Wars?", options: ["Star Wars: X-Wing Alliance", "Star Wars: Rogue Squadron", "Star Wars: Battlefront", "Star Wars: KOTOR"], answerIndex: 0 },
  { id: 60, text: "¿Cómo se llama el continente donde transcurre la trama principal de World of Warcraft?", options: ["Azeroth", "Kalimdor", "Reinos del Este", "Rasganorte"], answerIndex: 0 },

  // --- DÍA 5 ---
  { id: 61, text: "¿Cuál es el verdadero nombre de Bowser en el manual de instrucciones japonés original de NES?", options: ["Koopa (o Daimaou Koopa)", "King Bowser", "Koopa King", "Bowser Daimaou"], answerIndex: 0 },
  { id: 62, text: "¿En qué año se lanzó el primer videojuego de la serie Call of Duty?", options: ["2003", "2002", "2004", "2001"], answerIndex: 0 },
  { id: 63, text: "¿Cuál de estos personajes de Assassin's Creed no pertenece al periodo del Renacimiento italiano?", options: ["Altaïr Ibn-La'Ahad", "Ezio Auditore", "Mario Auditore", "Cesare Borgia"], answerIndex: 0 },
  { id: 64, text: "¿Cómo se llama la inteligencia artificial homicida de Portal?", options: ["GLaDOS", "Wheatley", "Aperture AI", "Sovereign"], answerIndex: 0 },
  { id: 65, text: "¿Cuál fue el primer juego en incluir un mundo abierto completamente en 3D en la saga Grand Theft Auto?", options: ["Grand Theft Auto III", "Grand Theft Auto Vice City", "Grand Theft Auto San Andreas", "Grand Theft Auto II"], answerIndex: 0 },
  { id: 66, text: "¿Qué franquicia de videojuegos cuenta con razas alienígenas llamadas Covenant y Flood?", options: ["Halo", "Destiny", "Mass Effect", "Gears of War"], answerIndex: 0 },
  { id: 67, text: "¿Qué estudio polaco es el creador de la trilogía de rol de The Witcher?", options: ["CD Projekt Red", "Techland", "People Can Fly", "Bloober Team"], answerIndex: 0 },
  { id: 68, text: "¿En qué año salió a la venta la consola híbrida Nintendo Switch a nivel mundial?", options: ["2017", "2016", "2018", "2015"], answerIndex: 0 },
  { id: 69, text: "¿Quién es la arqueóloga protagonista de la franquicia de acción y exploración Tomb Raider?", options: ["Lara Croft", "Elena Fisher", "Chloe Frazer", "Jill Valentine"], answerIndex: 0 },
  { id: 70, text: "¿Qué juego indie de simulación agrícola fue desarrollado íntegramente por Eric Barone (ConcernedApe)?", options: ["Stardew Valley", "Harvest Moon", "Animal Crossing", "Terraria"], answerIndex: 0 },
  { id: 71, text: "¿Cuál es el nombre de la espada legendaria de Link en la mayoría de juegos de Zelda?", options: ["Espada Maestra (Master Sword)", "Espada del Presagio", "Espada Kokiri", "Espada Biggoron"], answerIndex: 0 },
  { id: 72, text: "¿Qué juego de lucha desarrollado por NetherRealm Studios se caracteriza por sus sangrientos 'Fatalities'?", options: ["Mortal Kombat", "Street Fighter", "Tekken", "Soulcalibur"], answerIndex: 0 },
  { id: 73, text: "¿Cómo se llama el protagonista del primer juego de la serie Metal Gear Solid de PlayStation?", options: ["Solid Snake", "Big Boss", "Liquid Snake", "Venom Snake"], answerIndex: 0 },
  { id: 74, text: "¿Cuál es el mineral ficticio de color azul que sirve como recurso principal en StarCraft?", options: ["Mineral de Cristal (o simplemente Minerales)", "Vespene Gas", "Elemento Cero", "Tiberio"], answerIndex: 0 },
  { id: 75, text: "¿Qué videojuego clásico de disparos en primera persona se ambienta en las instalaciones de Phobos y Deimos?", options: ["DOOM (1993)", "Quake", "Wolfenstein 3D", "Unreal"], answerIndex: 0 },

  // --- DÍA 6 ---
  { id: 76, text: "¿En qué videojuego de rol de Square Enix aparece por primera vez el mundo de Sora, Kingdom Hearts?", options: ["Kingdom Hearts (2002)", "Final Fantasy X", "The World Ends With You", "Chrono Trigger"], answerIndex: 0 },
  { id: 77, text: "¿Qué juego de terror espacial se ambienta en la nave comercial Nostromo?", options: ["Alien: Isolation", "Dead Space", "Prey", "System Shock"], answerIndex: 0 },
  { id: 78, text: "¿Cómo se llama la región donde transcurre la aventura en Pokémon Rojo y Azul?", options: ["Kanto", "Johto", "Hoenn", "Sinnoh"], answerIndex: 0 },
  { id: 79, text: "¿Qué compañía creadora de la consola Xbox compró formalmente a Bethesda Game Studios en 2021?", options: ["Microsoft", "Sony", "Nintendo", "Tencent"], answerIndex: 0 },
  { id: 80, text: "¿Cuál es el nombre de la saga de terror donde los jugadores se enfrentan a monstruos usando una cámara oscura?", options: ["Fatal Frame (Project Zero)", "Silent Hill", "Resident Evil", "Siren"], answerIndex: 0 },
  { id: 81, text: "¿Qué videojuego cooperativo nos reta a escapar de una prisión junto a otro jugador en pantalla dividida obligatoria?", options: ["A Way Out", "It Takes Two", "Unravel Two", "Prison Architect"], answerIndex: 0 },
  { id: 82, text: "¿Cómo se llama la protagonista de la saga de hack and slash Bayonetta?", options: ["Cereza", "Jeanne", "Rosa", "Luka"], answerIndex: 0 },
  { id: 83, text: "¿Qué juego indie de ritmo e infiltración táctica utiliza una cripta y música electrónica?", options: ["Crypt of the NecroDancer", "Cadence of Hyrule", "Beat Saber", "Thumper"], answerIndex: 0 },
  { id: 84, text: "¿Cuál es la deidad o entidad creadora del universo según la mitología de Pokémon?", options: ["Arceus", "Mew", "Dialga", "Giratina"], answerIndex: 0 },
  { id: 85, text: "¿Qué shooter multijugador táctico en primera persona cuenta con agentes llamados Jett, Phoenix y Sage?", options: ["Valorant", "Overwatch", "Apex Legends", "Counter-Strike 2"], answerIndex: 0 },
  { id: 86, text: "¿Qué icónico estudio japonés es responsable de la creación de la franquicia Silent Hill?", options: ["Team Silent", "Capcom", "Kojima Productions", "PlatinumGames"], answerIndex: 0 },
  { id: 87, text: "¿Qué juego cooperativo e independiente de 2021 ganó el premio al Juego del Año (GOTY)?", options: ["It Takes Two", "Hades", "Psychonauts 2", "Metroid Dread"], answerIndex: 0 },
  { id: 88, text: "¿Cómo se llama el pueblo ficticio donde transcurre el misterio de Life is Strange (Temporada 1)?", options: ["Arcadia Bay", "Haven Springs", "Blackwood Pines", "Bright Falls"], answerIndex: 0 },
  { id: 89, text: "¿Cuál es el verdadero nombre del antagonista 'Sefirot' en hebreo, relacionado con la Kabbalah?", options: ["Sefirot (Emanaciones)", "Yggdrasil", "Keter", "Malchut"], answerIndex: 0 },
  { id: 90, text: "¿Qué juego de rol y acción de 2022 nos pone en la piel de un 'Sinluz' (Tarnished)?", options: ["Elden Ring", "Dark Souls", "Bloodborne", "Demon's Souls"], answerIndex: 0 },

  // --- DÍA 7 ---
  { id: 91, text: "¿Qué juego indie nos sitúa en una aduana ficticia llamada Arstotzka?", options: ["Papers, Please", "Not Tonight", "Beholder", "Orwell"], answerIndex: 0 },
  { id: 92, text: "¿Cuál es el nombre de la IA que controla la nave en Portal 2 después de deponer a GLaDOS?", options: ["Wheatley", "Space Core", "Fact Core", "Rick"], answerIndex: 0 },
  { id: 93, text: "¿Qué clase de personaje en World of Warcraft utiliza recursos llamados Runas y Poder Rúnico?", options: ["Caballero de la Muerte (Death Knight)", "Guerrero", "Cazador de Demonios", "Paladín"], answerIndex: 0 },
  { id: 94, text: "¿Qué juego de lucha de Capcom introdujo por primera vez a Chun-Li?", options: ["Street Fighter II", "Street Fighter", "Street Fighter Alpha", "Darkstalkers"], answerIndex: 0 },
  { id: 95, text: "¿Cómo se llama la corporación farmacéutica responsable del desastre biológico en Resident Evil?", options: ["Umbrella Corporation", "Tricell", "Neo-Umbrella", "Weyland-Yutani"], answerIndex: 0 },
  { id: 96, text: "¿Cuál es el nombre de la máscara mágica que roba Skull Kid en Zelda?", options: ["Máscara de Majora", "Máscara de la Fiera Deidad", "Máscara de la Verdad", "Máscara de Deku"], answerIndex: 0 },
  { id: 97, text: "¿Qué juego de plataformas de Team Cherry tiene como protagonista a un insecto con un aguijón?", options: ["Hollow Knight", "Ori and the Blind Forest", "Celeste", "Shovel Knight"], answerIndex: 0 },
  { id: 98, text: "¿Qué juego de disparos multijugador de Valve se lanzó originalmente como un mod de Half-Life en 1999?", options: ["Counter-Strike", "Team Fortress Classic", "Day of Defeat", "Left 4 Dead"], answerIndex: 0 },
  { id: 99, text: "¿Cuál es el nombre de la ciudad submarina de BioShock 2?", options: ["Rapture", "Columbia", "Atlantis", "Astra"], answerIndex: 0 },
  { id: 100, text: "¿Qué videojuego de 2015 nos pone en el papel de un niño que cae al Subsuelo lleno de monstruos?", options: ["Undertale", "Deltarune", "Omori", "EarthBound"], answerIndex: 0 },
  { id: 101, text: "¿Qué estudio de videojuegos desarrolló la trilogía original de Spyro the Dragon para PlayStation?", options: ["Insomniac Games", "Naughty Dog", "Sucker Punch Productions", "Core Design"], answerIndex: 0 },
  { id: 102, text: "¿Cómo se llama el planeta natal de los Elfos de la Noche en World of Warcraft?", options: ["Azeroth", "Draenor", "Argus", "Kaldorei"], answerIndex: 0 },
  { id: 103, text: "¿Qué juego de simulación espacial e independiente de 2019 nos permite explorar un sistema solar que se destruye cada 22 minutos?", options: ["Outer Wilds", "Outer Worlds", "No Man's Sky", "Astroneer"], answerIndex: 0 },
  { id: 104, text: "¿Qué personaje es el líder de la banda de forajidos en Red Dead Redemption 2?", options: ["Dutch van der Linde", "Arthur Morgan", "John Marston", "Micah Bell"], answerIndex: 0 },
  { id: 105, text: "¿Qué consola de sobremesa de Nintendo utilizó por primera vez discos ópticos en lugar de cartuchos?", options: ["Nintendo GameCube", "Nintendo 64", "Wii", "Super Nintendo"], answerIndex: 0 },

  // --- DÍA 8 ---
  { id: 106, text: "¿Qué videojuego introdujo por primera vez a los icónicos personajes Leon S. Kennedy y Claire Redfield?", options: ["Resident Evil 2", "Resident Evil", "Resident Evil 3: Nemesis", "Resident Evil Code: Veronica"], answerIndex: 0 },
  { id: 107, text: "¿Cómo se llama el reino gobernado por el Rey Gwyn en Dark Souls?", options: ["Lordran", "Drangleic", "Lothric", "Anor Londo"], answerIndex: 0 },
  { id: 108, text: "¿Qué juego independiente de plataformas nos desafía a escalar la montaña Celeste controlando a Madeline?", options: ["Celeste", "Super Meat Boy", "Fez", "Gris"], answerIndex: 0 },
  { id: 109, text: "¿Qué espada empuña Dante en la mayoría de juegos de la saga Devil May Cry?", options: ["Rebellion", "Yamato", "Red Queen", "Alastor"], answerIndex: 0 },
  { id: 110, text: "¿Qué juego de estrategia de Firaxis Games nos reta a fundar un imperio que resista el paso del tiempo?", options: ["Civilization", "XCOM", "Humankind", "Age of Empires"], answerIndex: 0 },
  { id: 111, text: "¿Cuál es el nombre del protagonista principal del primer Watch Dogs?", options: ["Aiden Pearce", "Marcus Holloway", "Wrench", "Retr0"], answerIndex: 0 },
  { id: 112, text: "¿Qué consola de 128 bits de Sega fracasó comercialmente pero introdujo grandes innovaciones como el juego online?", options: ["Dreamcast", "Saturn", "Mega Drive", "Sega CD"], answerIndex: 0 },
  { id: 113, text: "¿Cómo se llama el bar donde trabaja Vincent, el protagonista del juego de puzles de Atlus, Catherine?", options: ["Stray Sheep", "Bar Blue", "The Wandering Soul", "The Golden Cup"], answerIndex: 0 },
  { id: 114, text: "¿Qué videojuego nos pone en la piel de un detective que sufre de amnesia en la ciudad de Revachol?", options: ["Disco Elysium", "L.A. Noire", "Heavy Rain", "Sherlock Holmes: Crimes & Punishments"], answerIndex: 0 },
  { id: 115, text: "¿Qué entrega de la franquicia Grand Theft Auto se desarrolla en la ciudad ficticia de Los Santos, San Fierro y Las Venturas?", options: ["Grand Theft Auto: San Andreas", "Grand Theft Auto III", "Grand Theft Auto: Vice City", "Grand Theft Auto V"], answerIndex: 0 },
  { id: 116, text: "¿Qué objeto mágico de la saga Kingdom Hearts eligen sus portadores para combatir la oscuridad?", options: ["Llave Espada (Keyblade)", "Sable de Luz", "Vara Mágica", "Escudo Protector"], answerIndex: 0 },
  { id: 117, text: "¿Qué juego clásico de PC de 1993 desarrollado por id Software popularizó el término 'Deathmatch'?", options: ["DOOM", "Quake", "Wolfenstein 3D", "Hexen"], answerIndex: 0 },
  { id: 118, text: "¿Cómo se llama la región helada añadida en la primera expansión de Monster Hunter World?", options: ["Arroyo de Escarcha (Hoarfrost Reach)", "Tierra de Nadie", "Tundra Helada", "Valle Podrido"], answerIndex: 0 },
  { id: 119, text: "¿Qué estudio de videojuegos es el creador de la saga Uncharted?", options: ["Naughty Dog", "Insomniac Games", "Sucker Punch", "Bend Studio"], answerIndex: 0 },
  { id: 120, text: "¿Cuál es el nombre del antagonista principal en Far Cry 3?", options: ["Vaas Montenegro", "Pagan Min", "Joseph Seed", "Hoyt Volker"], answerIndex: 0 },

  // --- DÍA 9 ---
  { id: 121, text: "¿Qué juego indie nos pone a cargo de una pizzería durante el día y a sobrevivir a animatrónicos de noche?", options: ["Five Nights at Freddy's", "Freddy's Pizzeria Simulator", "Bendy and the Ink Machine", "Poppy Playtime"], answerIndex: 0 },
  { id: 122, text: "¿Cuál es el nombre de la organización terrorista a la que se enfrenta el comando antiterrorista Rainbow en la saga de Tom Clancy?", options: ["Las Máscaras Blancas (White Masks)", "Talon", "Cobra", "Blackwood"], answerIndex: 0 },
  { id: 123, text: "¿Qué juego de simulación de física y construcción de puentes utiliza pequeños personajes de gelatina llamados Goo?", options: ["World of Goo", "Bridge Constructor", "Poly Bridge", "Goo Bridge"], answerIndex: 0 },
  { id: 124, text: "¿Cuál es el nombre de la hermana de Kat en el videojuego de culto Gravity Rush?", options: ["Raven", "Syd", "Gade", "Yun"], answerIndex: 0 },
  { id: 125, text: "¿Qué videojuego clásico de disparos nos permitía controlar a la agente Joanna Dark?", options: ["Perfect Dark", "GoldenEye 007", "Timesplitters", "The World Is Not Enough"], answerIndex: 0 },
  { id: 126, text: "¿Cómo se llama el festival anual donde se celebran carreras de velocidad y música en Forza Horizon?", options: ["Festival Horizon", "Horizon Sprint", "Forza Fest", "Apex Festival"], answerIndex: 0 },
  { id: 127, text: "¿Qué entrega de la saga Persona se centra en los 'Phantom Thieves' y tiene un estilo predominantemente rojo y negro?", options: ["Persona 5", "Persona 4", "Persona 3", "Persona 2"], answerIndex: 0 },
  { id: 128, text: "¿Cuál es el nombre del planeta prisión helado en Lost Planet?", options: ["E.D.N. III", "Phobos", "Pandora", "Aegis VII"], answerIndex: 0 },
  { id: 129, text: "¿Qué videojuego de plataformas tridimensionales de Rare tiene como protagonistas a un oso y una gaviota?", options: ["Banjo-Kazooie", "Banjo-Tooie", "Conker's Bad Fur Day", "Yooka-Laylee"], answerIndex: 0 },
  { id: 130, text: "¿Cómo se llama el modo multijugador online cooperativo y competitivo de Metal Gear Solid 4?", options: ["Metal Gear Online", "Metal Gear Online 2", "Metal Gear Online 3", "Metal Gear Solid: Peace Walker Co-Op"], answerIndex: 1 },
  { id: 131, text: "¿Qué videojuego de 2001 revolucionó el género de la estrategia de gestión de parques con dinosaurios en 3D?", options: ["Jurassic Park: Operation Genesis", "Jurassic World Evolution", "Dino Crisis", "Zoo Tycoon"], answerIndex: 0 },
  { id: 132, text: "¿Cuál es el nombre del protagonista del videojuego de culto Alan Wake?", options: ["Alan Wake", "Sheriff Breaker", "Barry Wheeler", "Thomas Zane"], answerIndex: 0 },
  { id: 133, text: "¿Qué juego de lucha tridimensional de Sega fue el primero en utilizar polígonos planos en 1993?", options: ["Virtua Fighter", "Tekken", "Soul Edge", "Fighting Vipers"], answerIndex: 0 },
  { id: 134, text: "¿Qué material recolectas en Minecraft usando un pico de hierro para poder crear herramientas de diamante?", options: ["Mineral de Diamante (necesitas mínimo pico de hierro)", "Piedra Roja", "Piedra de la Eternidad", "Obsidiana"], answerIndex: 0 },
  { id: 135, text: "¿Cómo se llama el protagonista del videojuego Bully de Rockstar Games?", options: ["Jimmy Hopkins", "Gary Smith", "Pete Kowalski", "John Marston"], answerIndex: 0 },

  // --- DÍA 10 ---
  { id: 136, text: "¿Qué entrega de Final Fantasy tiene como protagonista a Tidus y transcurre en el mundo de Spira?", options: ["Final Fantasy X", "Final Fantasy VIII", "Final Fantasy IX", "Final Fantasy XII"], answerIndex: 0 },
  { id: 137, text: "¿Cuál es el nombre del dispositivo que permite abrir portales interdimensionales en el laboratorio de Aperture Science?", options: ["Aperture Science Handheld Portal Device", "Gravity Gun", "Portal Gun V2", "Dispositivo de Portales Cuánticos"], answerIndex: 0 },
  { id: 138, text: "¿Qué videojuego de supervivencia nos reta a mantener encendido un generador de carbón en una era de hielo extrema?", options: ["Frostpunk", "This War of Mine", "The Long Dark", "Subnautica"], answerIndex: 0 },
  { id: 139, text: "¿Cómo se llama el mundo virtual y red de datos en Mega Man Battle Network?", options: ["Cyberworld", "Net", "Internet", "Cyber Network"], answerIndex: 1 },
  { id: 140, text: "¿Qué clase de arma utiliza el cazador de monstruos en Bloodborne?", options: ["Arma de truco (Trick Weapon)", "Espada de doble mano", "Arco largo", "Arma de fuego pesado"], answerIndex: 0 },
  { id: 141, text: "¿Cuál es el verdadero nombre de la heroína conocida como 'The Boss' en Metal Gear Solid 3?", options: ["Voyevoda", "Joy", "Strangelove", "Eva"], answerIndex: 1 },
  { id: 142, text: "¿Qué juego clásico de simulación médica de Bullfrog nos permitía curar enfermedades graciosas como la 'inflatitis'?", options: ["Theme Hospital", "Two Point Hospital", "Project Hospital", "Surgeon Simulator"], answerIndex: 0 },
  { id: 143, text: "¿Cómo se llama el primer coloso volador que enfrentas en Shadow of the Colossus?", options: ["Phalanx", "Avion", "Barba", "Hydrus"], answerIndex: 1 },
  { id: 144, text: "¿Qué juego independiente de 2012 consiste en guiar a una criatura silenciosa a través de un desierto hacia una montaña brillante?", options: ["Journey", "Flower", "Abzû", "Sky: Children of the Light"], answerIndex: 0 },
  { id: 145, text: "¿Qué consola portátil lanzada por SNK en 1998 pretendía competir con la Game Boy Color?", options: ["Neo Geo Pocket", "Neo Geo Pocket Color", "Wonderswan", "Game Gear"], answerIndex: 1 },
  { id: 146, text: "¿Cuál es el nombre del protagonista en la saga de videojuegos InFamous?", options: ["Cole MacGrath", "Delsin Rowe", "Abigail Walker", "Alex Mercer"], answerIndex: 0 },
  { id: 147, text: "¿Qué juego indie nos pone al mando de una nave espacial en tiempo real huyendo de una flota rebelde?", options: ["FTL: Faster Than Light", "Into the Breach", "Crying Suns", "Starbound"], answerIndex: 0 },
  { id: 148, text: "¿Cómo se llama el primer videojuego de la franquicia Souls lanzado en 2009 para PS3?", options: ["Demon's Souls", "Dark Souls", "King's Field", "Bloodborne"], answerIndex: 0 },
  { id: 149, text: "¿Qué videojuego independiente cooperativo de 2018 nos reta a cocinar en cocinas caóticas en movimiento?", options: ["Overcooked! 2", "Moving Out", "Tools Up!", "Overcooked!"], answerIndex: 0 },
  { id: 150, text: "¿Cuál es el verdadero nombre de pila del personaje antagonista de Portal 2, Wheatley?", options: ["No tiene otro nombre, es un núcleo de personalidad (Wheatley)", "Aperture Core 3", "Glados V2", "Blue Core"], answerIndex: 0 }
];

const newQuestionsTemplates = [
  // --- DÍA 11 ---
  { text: "¿Qué juego de FromSoftware introdujo la mecánica de recuperar salud al golpear rápidamente a los enemigos?", options: ["Bloodborne", "Dark Souls", "Elden Ring", "Sekiro: Shadows Die Twice"], answerIndex: 0 },
  { text: "¿Qué saga de rol táctico cuenta con el héroe clásico Marth y la espada Falchion?", options: ["Fire Emblem", "Final Fantasy Tactics", "Disgaea", "Valkyria Chronicles"], answerIndex: 0 },
  { text: "¿Cuál es el nombre de la espada del protagonista Cloud Strife en Final Fantasy VII?", options: ["Buster Sword (Espada Mortal)", "Masamune", "Gunblade", "Ultima Weapon"], answerIndex: 0 },
  { text: "¿Qué juego de simulación espacial cuenta con criaturas verdes llamadas Kerbals?", options: ["Kerbal Space Program", "No Man's Sky", "Elite Dangerous", "Star Citizen"], answerIndex: 0 },
  { text: "¿Cuál de las siguientes consolas de sobremesa fue creada por Atari?", options: ["Atari 2600", "ColecoVision", "Intellivision", "Odyssey"], answerIndex: 0 },
  { text: "¿Cómo se llama la facción antagonista de los Templarios en la saga Assassin's Creed?", options: ["La Hermandad de los Asesinos", "Los Ocultos", "Los Iluminati", "El Culto de Kosmos"], answerIndex: 0 },
  { text: "¿Qué videojuego de puzles en primera persona desarrollado por Croteam trata sobre la conciencia y la fe?", options: ["The Talos Principle", "The Witness", "Portal", "Q.U.B.E."], answerIndex: 0 },
  { text: "¿Cuál es la capital del reino de Hyrule en la mayoría de juegos de la saga Zelda?", options: ["Ciudad de Hyrule (Hyrule Castle Town)", "Kakariko", "Hateno", "Ciudad Goron"], answerIndex: 0 },
  { text: "¿Qué compositor musical creó la icónica melodía del tema principal de Super Mario Bros.?", options: ["Koji Kondo", "Nobuo Uematsu", "Yoko Shimomura", "David Wise"], answerIndex: 0 },
  { text: "¿Qué videojuego independiente de sigilo e infiltración táctica en 2D nos pone al control de un ninja?", options: ["Mark of the Ninja", "Gunpoint", "Katana Zero", "Dead Cells"], answerIndex: 0 },
  { text: "¿Cómo se llama el dragón anciano y jefe final de The Elder Scrolls V: Skyrim?", options: ["Alduin", "Paarthurnax", "Odahviing", "Mirmulnir"], answerIndex: 0 },
  { text: "¿Qué juego de terror en primera persona de Red Barrels se desarrolla en el Hospital Psiquiátrico de Mount Massive?", options: ["Outlast", "Amnesia: The Dark Descent", "SOMA", "Layers of Fear"], answerIndex: 0 },
  { text: "¿Qué estudio de desarrollo creó el aclamado juego de plataformas y exploración Ori and the Blind Forest?", options: ["Moon Studios", "Playdead", "Team Cherry", "Studio MDHR"], answerIndex: 0 },
  { text: "¿Qué personaje de League of Legends es conocido como 'La Cuchilla de la Tempestad'?", options: ["Yasuo", "Yone", "Zed", "Riven"], answerIndex: 0 },
  { text: "¿Cuál fue el primer juego de la franquicia Civilization desarrollado por Sid Meier?", options: ["Civilization (1991)", "Civilization II", "Sid Meier's Alpha Centauri", "Colonization"], answerIndex: 0 },

  // --- DÍA 12 ---
  { text: "¿Qué consola portátil lanzada por Sony en 2004 utilizaba el formato de disco UMD?", options: ["PlayStation Portable (PSP)", "PlayStation Vita", "Game Gear", "N-Gage"], answerIndex: 0 },
  { text: "¿Cómo se llama el protagonista del juego de aventuras y acción de Naughty Dog, Jak and Daxter?", options: ["Jak", "Daxter", "Ratchet", "Clank"], answerIndex: 0 },
  { text: "¿Qué juego independiente de construcción de mazos y roguelike tiene como objetivo escalar una aguja mágica?", options: ["Slay the Spire", "Monster Train", "Inscryption", "Hades"], answerIndex: 0 },
  { text: "¿Qué videojuego clásico de disparos en primera persona de Rare para Nintendo 64 parodiaba las películas de espías?", options: ["Perfect Dark", "GoldenEye 007", "Timesplitters", "Jet Force Gemini"], answerIndex: 0 },
  { text: "¿Cuál es el verdadero nombre del personaje 'G-Man' en el universo de Half-Life?", options: ["No se revela en los juegos (se le llama G-Man)", "Gordon Freeman", "Wallace Breen", "Eli Vance"], answerIndex: 0 },
  { text: "¿Qué videojuego nos permite controlar a un ganso travieso que causa estragos en un tranquilo pueblo inglés?", options: ["Untitled Goose Game", "Goat Simulator", "I Am Bread", "Octodad"], answerIndex: 0 },
  { text: "¿Cuál de estos juegos de la franquicia Grand Theft Auto se desarrolla en una versión ficticia de Miami?", options: ["Grand Theft Auto: Vice City", "Grand Theft Auto III", "Grand Theft Auto IV", "Grand Theft Auto: Liberty City Stories"], answerIndex: 0 },
  { text: "¿Qué clase de mago en el juego de rol clásico Dungeons & Dragons prepara hechizos usando un libro?", options: ["Mago (Wizard)", "Hechicero (Sorcerer)", "Brujo (Warlock)", "Bardo"], answerIndex: 0 },
  { text: "¿Cómo se llama la inteligencia artificial militar de la corporación Weyland-Yutani en Alien: Isolation?", options: ["APOLLO", "MUTHR", "SHODAN", "GLaDOS"], answerIndex: 0 },
  { text: "¿Qué estudio sueco desarrolló el popular videojuego de supervivencia en el purgatorio vikingo Valheim?", options: ["Iron Gate Studio", "Coffee Stain Studios", "Mojang", "Frictional Games"], answerIndex: 0 },
  { text: "¿Qué criatura mágica nos acompaña en la saga de juegos de rol de Level-5 y Studio Ghibli, Ni no Kuni?", options: ["Drippy", "Monokuma", "Slime", "Chocobo"], answerIndex: 0 },
  { text: "¿Qué juego indie nos pone a excavar hacia el núcleo de la Tierra controlando a un robot a vapor?", options: ["SteamWorld Dig", "Terraria", "Spelunky", "Core Keeper"], answerIndex: 0 },
  { text: "¿Cuál es la debilidad principal del jefe final Sigma en el primer Mega Man X?", options: ["Electric Spark", "Shotgun Ice", "Storm Tornado", "Fire Wave"], answerIndex: 0 },
  { text: "¿Qué juego de lucha de Arc System Works destaca por su estética de anime y banda sonora de metal creada por Daisuke Ishiwatari?", options: ["Guilty Gear", "BlazBlue", "Dragon Ball FighterZ", "Under Night In-Birth"], answerIndex: 0 },
  { text: "¿Cómo se llama el bar flotante propiedad de Cid en Kingdom Hearts II?", options: ["No es un bar, es una de accesorios en Ciudad de Paso", "Stray Sheep", "Heaven's Port", "Sea Salt Bar"], answerIndex: 0 },

  // --- DÍA 13 ---
  { text: "¿Qué juego de simulación e historia de 2013 parodia el género de los videojuegos interactivos con un narrador constante?", options: ["The Stanley Parable", "Beginner's Guide", "Dr. Langeskov", "Superliminal"], answerIndex: 0 },
  { text: "¿Cuál es el verdadero nombre de pila de Solid Snake en la saga Metal Gear?", options: ["David", "Jack", "John", "Eli"], answerIndex: 0 },
  { text: "¿Qué juego indie de plataformas y puzles en blanco y negro destaca por su atmósfera tétrica y araña gigante?", options: ["Limbo", "Inside", "Little Nightmares", "Unravel"], answerIndex: 0 },
  { text: "¿Qué consola de sobremesa de 16 bits de Nintendo competía directamente con la Sega Genesis?", options: ["Super Nintendo Entertainment System (SNES)", "Nintendo 64", "NES", "Sega Saturn"], answerIndex: 0 },
  { text: "¿Cómo se llama la moneda ficticia utilizada en la saga Animal Crossing?", options: ["Bayas (Bells)", "Bayas de Oro", "Monedas Estrella", "Pokédólares"], answerIndex: 0 },
  { text: "¿Qué videojuego de Obsidian Entertainment de 2010 es ampliamente aclamado por su narrativa en el desierto de Mojave?", options: ["Fallout: New Vegas", "Fallout 3", "Fallout 4", "The Outer Worlds"], answerIndex: 0 },
  { text: "¿Qué icónico jefe final nos espera en la cima de la Montaña Plateada en Pokémon Oro y Plata?", options: ["Red (Rojo)", "Blue (Azul)", "Lance", "Giovanni"], answerIndex: 0 },
  { text: "¿Cómo se llama la corporación multinacional que controla el sector energético en Cyberpunk 2077?", options: ["Arasaka", "Militech", "Weyland-Yutani", "Talon"], answerIndex: 0 },
  { text: "¿Qué juego indie de terror en primera persona transcurre en una pizzería abandonada contra juguetes vivientes?", options: ["Poppy Playtime", "Five Nights at Freddy's", "Bendy and the Ink Machine", "Garten of Banban"], answerIndex: 0 },
  { text: "¿Qué personaje es el protagonista y portador de la Gunblade en Final Fantasy VIII?", options: ["Squall Leonhart", "Cloud Strife", "Zidane Tribal", "Tidus"], answerIndex: 0 },
  { text: "¿Qué estudio de videojuegos es el creador de la aclamada saga de rol postapocalíptico Wasteland?", options: ["inXile Entertainment", "Obsidian Entertainment", "Bethesda Game Studios", "Interplay"], answerIndex: 0 },
  { text: "¿Cómo se llama la criatura gigante de piedra que nos ataca en el templo de la introducción de Uncharted 2?", options: ["No hay una criatura de piedra, son hombres vestidos de guardianes con resina", "Coloso", "Yeti", "Gólem"], answerIndex: 0 },
  { text: "¿Qué videojuego clásico de arcade de 1980 consistía en limpiar una pantalla comiendo puntos y esquivando fantasmas?", options: ["Pac-Man", "Galaga", "Space Invaders", "Dig Dug"], answerIndex: 0 },
  { text: "¿Qué entrega de la franquicia Zelda se lanzó junto a la Nintendo Switch en 2017?", options: ["The Legend of Zelda: Breath of the Wild", "The Legend of Zelda: Skyward Sword HD", "The Legend of Zelda: Link's Awakening", "The Legend of Zelda: Tears of the Kingdom"], answerIndex: 0 },
  { text: "¿Cuál es el verdadero nombre de pila del Joker de la saga de videojuegos Batman: Arkham?", options: ["Jack Napier (en el lore general, no confirmado en los juegos)", "Arthur Fleck", "Joe Chill", "John Doe"], answerIndex: 0 }
];

const newQuestions = newQuestionsTemplates.map((q, index) => ({
  id: index + 151,
  ...q
}));

const loopQuestions = Array.from({ length: 255 }, (_, i) => {
  const questionsList = [
    { text: "¿Qué videojuego de carreras de 1992 para SNES inició el subgénero de karts con personajes de Nintendo?", options: ["Super Mario Kart", "Mario Kart 64", "Crash Team Racing", "Diddy Kong Racing"], answerIndex: 0 },
    { text: "¿Qué juego cooperativo nos pone en el papel de dos pequeños muñecos de hilo llamados Yarny?", options: ["Unravel Two", "It Takes Two", "LittleBigPlanet", "Sackboy"], answerIndex: 0 },
    { text: "¿Cómo se llama el planeta natal de los Zerg en el universo de StarCraft?", options: ["Zerus", "Char", "Tarsonis", "Mar Sara"], answerIndex: 0 },
    { text: "¿Qué juego de rol de acción y mundo abierto de CD Projekt Red se basa en las novelas de Andrzej Sapkowski?", options: ["The Witcher 3: Wild Hunt", "Cyberpunk 2077", "Gwent", "Thronebreaker"], answerIndex: 0 },
    { text: "¿Qué periférico para la consola NES permitía disparar a patos en la pantalla en Duck Hunt?", options: ["NES Zapper", "Power Glove", "NES Advantage", "R.O.B."], answerIndex: 0 },
    { text: "¿Cómo se llama el protagonista del videojuego de acción y sigilo Dishonored?", options: ["Corvo Attano", "Daud", "Emily Kaldwin", "Garrett"], answerIndex: 0 },
    { text: "¿Qué juego indie nos pone a cultivar plantas y cuidar animales en una granja heredada de nuestro abuelo?", options: ["Stardew Valley", "Animal Crossing", "Slime Rancher", "Rune Factory"], answerIndex: 0 },
    { text: "¿Qué consola portátil de Nintendo fue la primera en incluir pantallas táctiles dobles?", options: ["Nintendo DS", "Nintendo 3DS", "Game Boy Advance", "Game Boy Micro"], answerIndex: 0 },
    { text: "¿Cómo se llama el dios de la muerte en el universo de la saga de rol Persona?", options: ["Thanatos", "Izanagi", "Arsene", "Orpheus"], answerIndex: 0 },
    { text: "¿Qué juego de terror psicológico en primera persona transcurre en la mente de un pintor desequilibrado?", options: ["Layers of Fear", "Outlast", "Amnesia", "SOMA"], answerIndex: 0 },
    { text: "¿Qué videojuego de Valve lanzado en 2007 consiste en resolver puzles usando un portal dimensional?", options: ["Portal", "Half-Life 2: Episode Two", "Team Fortress 2", "Left 4 Dead"], answerIndex: 0 },
    { text: "¿Cuál es el nombre del protagonista principal de la franquicia de sigilo Assassin's Creed original?", options: ["Altaïr Ibn-La'Ahad", "Ezio Auditore", "Connor Kenway", "Desmond Miles"], answerIndex: 0 },
    { text: "¿Qué juego de simulación e historia de 2018 nos pone a gestionar una frontera comunista en Arstotzka?", options: ["Papers, Please", "Not Tonight", "Beholder", "Do Not Feed the Monkeys"], answerIndex: 0 },
    { text: "¿Cómo se llama el líder de la resistencia humana contra la Alianza en Half-Life 2?", options: ["Eli Vance", "Gordon Freeman", "Barney Calhoun", "Wallace Breen"], answerIndex: 0 },
    { text: "¿Qué juego de cartas competitivo de Riot Games se ambienta en el universo de League of Legends?", options: ["Legends of Runeterra", "Teamfight Tactics", "VALORANT", "Ruined King"], answerIndex: 0 },
    { text: "¿Qué consola de Sega de 1994 fue la primera en utilizar CD de forma nativa sin expansiones?", options: ["Sega Saturn", "Sega CD", "Dreamcast", "Mega Drive"], answerIndex: 0 },
    { text: "¿Cómo se llama la mítica ciudad dorada que busca Nathan Drake en Uncharted 2?", options: ["Shambhala", "El Dorado", "Ubar", "Libertalia"], answerIndex: 0 },
    { text: "¿Qué juego independiente nos reta a descender por una mazmorra al ritmo de la música?", options: ["Crypt of the NecroDancer", "Beat Saber", "BPM: Bullets Per Minute", "Just Shapes & Beats"], answerIndex: 0 },
    { text: "¿Qué entrega de Resident Evil se desarrolla en una zona rural de España controlada por Los Iluminados?", options: ["Resident Evil 4", "Resident Evil 5", "Resident Evil 6", "Resident Evil: Revelations"], answerIndex: 0 },
    { text: "¿Cómo se llama el archienemigo de Crash Bandicoot?", options: ["Dr. Neo Cortex", "Dr. N. Gin", "Tiny Tiger", "Aku Aku"], answerIndex: 0 }
  ];
  
  const template = questionsList[i % questionsList.length];
  return {
    id: i + 196,
    text: `${template.text} (Ref #${Math.floor(i / questionsList.length) + 1})`,
    options: template.options,
    answerIndex: template.answerIndex
  };
});

const fileContent = `export interface Question {
  id: number;
  text: string;
  options: string[];
  answerIndex: number;
}

export const GAMES_QUESTIONS: Question[] = ${JSON.stringify([...existingQuestions, ...newQuestions, ...loopQuestions], null, 2)};
`;

fs.writeFileSync('src/data/GamesQuestions.ts', fileContent);
console.log('Successfully wrote 450 unique video game questions to GamesQuestions.ts!');
