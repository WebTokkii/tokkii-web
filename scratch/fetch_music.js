import fs from 'fs';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const songsList = [
  // 1. VIDEO GAME SOUNDTRACKS
  { name: "Super Mario Bros. - Overworld Theme", search: "Super Mario Bros Overworld Theme piano cover" },
  { name: "The Legend of Zelda - Main Theme", search: "The Legend of Zelda Main Theme orchestral cover" },
  { name: "Tetris - Korobeiniki (Theme A)", search: "Tetris Korobeiniki Theme A accordion cover" },
  { name: "Minecraft - Sweden", search: "Minecraft Sweden piano cover" },
  { name: "Halo - Mjolnir Mix (Main Theme)", search: "Halo Mjolnir Mix guitar cover" },
  { name: "The Elder Scrolls V: Skyrim - Dragonborn", search: "Skyrim Dragonborn Theme orchestral cover" },
  { name: "Undertale - Megalovania", search: "Undertale Megalovania metal cover" },
  { name: "Portal - Still Alive", search: "Portal Still Alive acoustic cover" },
  { name: "Pokemon Red & Blue - Title Theme", search: "Pokemon Red Blue Title Theme chiptune cover" },
  { name: "Final Fantasy VII - Aerith's Theme", search: "Final Fantasy VII Aeriths Theme piano cover" },
  { name: "Chrono Trigger - Wind Scene", search: "Chrono Trigger Wind Scene acoustic cover" },
  { name: "Grand Theft Auto: San Andreas - Main Theme", search: "GTA San Andreas Theme synthwave cover" },
  { name: "Doom (1993) - At Doom's Gate", search: "Doom At Dooms Gate metal cover" },
  { name: "Undertale - Fallen Down", search: "Undertale Fallen Down piano cover" },
  { name: "The Legend of Zelda: Ocarina of Time - Gerudo Valley", search: "Zelda Gerudo Valley acoustic guitar cover" },
  { name: "Cuphead - Don't Deal With the Devil", search: "Cuphead Dont Deal With the Devil big band cover" },
  { name: "Wii Sports - Theme", search: "Wii Sports Theme jazz band cover" },
  { name: "Kingdom Hearts - Dearly Beloved", search: "Kingdom Hearts Dearly Beloved piano cover" },
  { name: "Nier: Automata - Weight of the World", search: "Nier Automata Weight of the World acoustic cover" },
  { name: "Cyberpunk 2077 - Never Fade Away", search: "Cyberpunk 2077 Never Fade Away violin cover" },
  { name: "League of Legends - Legends Never Die", search: "Legends Never Die orchestral instrumental cover" },
  { name: "Assassin's Creed II - Ezio's Family", search: "Assassins Creed Ezios Family orchestral cover" },
  { name: "Civilization IV - Baba Yetu", search: "Civilization IV Baba Yetu instrumental cover" },
  { name: "Persona 5 - Last Surprise", search: "Persona 5 Last Surprise jazz cover" },
  { name: "Shadow of the Colossus - The Opened Way", search: "Shadow of the Colossus The Opened Way orchestral cover" },
  { name: "Silent Hill 2 - Theme of Laura", search: "Silent Hill 2 Theme of Laura rock cover" },
  { name: "Plants vs. Zombies - Loonboon", search: "Plants vs Zombies Loonboon piano cover" },
  { name: "Fallout 4 - Main Theme", search: "Fallout 4 Main Theme piano cover" },
  { name: "The Witcher 3 - Silver for Monsters", search: "Witcher 3 Silver for Monsters metal cover" },
  { name: "Pac-Man - Classic Theme", search: "Pac Man theme chiptune cover" },
  { name: "Angry Birds - Theme", search: "Angry Birds Theme piano cover" },
  { name: "Metal Gear Solid 3 - Snake Eater", search: "Metal Gear Solid Snake Eater instrumental brass cover" },
  { name: "Super Smash Bros. Brawl - Main Theme", search: "Super Smash Bros Brawl Theme orchestral cover" },
  { name: "Genshin Impact - Main Theme", search: "Genshin Impact Main Theme violin cover" },
  { name: "Stardew Valley - Overture", search: "Stardew Valley Overture acoustic cover" },
  { name: "Elder Scrolls III: Morrowind - Call of Magic", search: "Morrowind Call of Magic orchestral cover" },
  { name: "Hollow Knight - Dirtmouth Theme", search: "Hollow Knight Dirtmouth piano cover" },
  { name: "Hades - In The Blood", search: "Hades In The Blood acoustic cover" },
  { name: "Red Dead Redemption 2 - Unshaken", search: "Red Dead Redemption 2 Unshaken instrumental cover" },
  { name: "God of War (2018) - Main Theme", search: "God of War 2018 Main Theme orchestral cover" },
  { name: "World of Warcraft - Legends of Azeroth", search: "World of Warcraft Legends of Azeroth orchestral cover" },
  { name: "Grand Theft Auto IV - Soviet Connection", search: "GTA IV Soviet Connection accordion cover" },
  { name: "Castlevania - Vampire Killer", search: "Castlevania Vampire Killer guitar cover" },
  { name: "Street Fighter II - Guile's Theme", search: "Guiles Theme rock cover" },
  { name: "Sonic the Hedgehog - Green Hill Zone", search: "Sonic Green Hill Zone piano cover" },
  { name: "Mega Man 2 - Dr. Wily's Castle", search: "Mega Man Wily Castle metal cover" },
  { name: "Outer Wilds - Main Theme", search: "Outer Wilds Main Theme banjo guitar cover" },
  { name: "Among Us - Main Theme", search: "Among Us Theme synthwave cover" },
  { name: "Elden Ring - Main Theme", search: "Elden Ring Theme orchestral cover" },
  { name: "Deus Ex - Main Theme", search: "Deus Ex Main Theme cover" },

  // 2. MOVIES, ANIME & TV THEMES
  { name: "Star Wars - The Imperial March", search: "Star Wars Imperial March orchestral cover" },
  { name: "Pirates of the Caribbean - He's a Pirate", search: "Pirates of the Caribbean Hes a Pirate violin cover" },
  { name: "Harry Potter - Hedwig's Theme", search: "Harry Potter Hedwigs Theme piano cover" },
  { name: "Lord of the Rings - Concerning Hobbits", search: "Lord of the Rings Concerning Hobbits whistle flute cover" },
  { name: "Game of Thrones - Main Title", search: "Game of Thrones Theme cello orchestral cover" },
  { name: "Naruto - Sadness and Sorrow", search: "Naruto Sadness and Sorrow flute piano cover" },
  { name: "Dragon Ball Z - Cha-La Head-Cha-La", search: "Cha La Head Cha La metal guitar cover" },
  { name: "Attack on Titan - Guren no Yumiya", search: "Attack on Titan Guren no Yumiya piano cover" },
  { name: "Demon Slayer - Gurenge", search: "Demon Slayer Gurenge violin cover" },
  { name: "Neon Genesis Evangelion - A Cruel Angel's Thesis", search: "Cruel Angels Thesis metal guitar cover" },
  { name: "Interstellar - Cornfield Chase", search: "Interstellar Cornfield Chase organ piano cover" },
  { name: "Titanic - My Heart Will Go On", search: "Titanic My Heart Will Go On flute cover" },
  { name: "The Avengers - Main Theme", search: "The Avengers Theme brass orchestral cover" },
  { name: "Indiana Jones - Raiders March", search: "Indiana Jones Raiders March orchestral cover" },
  { name: "Jurassic Park - Main Theme", search: "Jurassic Park Theme orchestral cover" },
  { name: "Naruto Shippuden - Blue Bird", search: "Naruto Blue Bird piano cover" },
  { name: "One Piece - We Are!", search: "One Piece We Are acoustic guitar cover" },
  { name: "My Neighbor Totoro - Path of the Wind", search: "Totoro Path of the Wind piano cover" },
  { name: "Spirited Away - One Summer's Day", search: "Spirited Away One Summers Day piano cover" },
  { name: "The Godfather - Love Theme", search: "The Godfather Love Theme accordion guitar cover" },
  { name: "Back to the Future - Main Theme", search: "Back to the Future Theme orchestral cover" },
  { name: "Ghostbusters - Theme Song", search: "Ghostbusters Theme retro cover" },
  { name: "Sherlock - Opening Title", search: "Sherlock Theme violin cover" },
  { name: "Doctor Who - Theme", search: "Doctor Who Theme synthesizer cover" },
  { name: "Inception - Time", search: "Inception Time piano orchestral cover" },
  { name: "The Lion King - Circle of Life", search: "Lion King Circle of Life instrumental cover" },
  { name: "Gladiator - Now We Are Free", search: "Gladiator Now We Are Free violin cover" },
  { name: "Star Wars - Duel of the Fates", search: "Star Wars Duel of the Fates orchestral cover" },
  { name: "Naruto - Silhouette", search: "Naruto Silhouette piano cover" },
  { name: "Fullmetal Alchemist: Brotherhood - Again", search: "Fullmetal Alchemist Again violin cover" },
  { name: "Tokyo Ghoul - Unravel", search: "Tokyo Ghoul Unravel piano cover" },
  { name: "Dragon Ball GT - Dan Dan Kokoro Hikareteku", search: "Dan Dan Kokoro Hikareteku guitar cover" },
  { name: "Death Note - L's Theme", search: "Death Note Ls Theme guitar piano cover" },
  { name: "Hunter x Hunter - Departure!", search: "Hunter x Hunter Departure guitar cover" },
  { name: "JoJo's Bizarre Adventure - Giorno's Theme", search: "Giornos Theme piano saxophone cover" },
  { name: "Sailor Moon - Moonlight Densetsu", search: "Moonlight Densetsu piano cover" },
  { name: "Howl's Moving Castle - Merry-Go-Round of Life", search: "Howls Moving Castle Merry Go Round of Life violin piano" },
  { name: "Princess Mononoke - Ashitaka and San", search: "Princess Mononoke Ashitaka and San piano cover" },
  { name: "Stranger Things - Main Theme", search: "Stranger Things Theme synthwave cover" },
  { name: "The Pink Panther - Theme", search: "The Pink Panther Theme saxophone cover" },
  { name: "Mission: Impossible - Theme", search: "Mission Impossible Theme jazz cover" },
  { name: "Spider-Man (1960s) - Theme", search: "Spider Man 1960s Theme rock cover" },
  { name: "The Simpsons - Opening Theme", search: "The Simpsons Theme xylophone brass cover" },
  { name: "Star Trek - Main Theme", search: "Star Trek Theme orchestral cover" },
  { name: "Cowboy Bebop - Tank!", search: "Cowboy Bebop Tank big band cover" },
  { name: "Shingeki no Kyojin - Shinzou wo Sasageyo", search: "Shinzou wo Sasageyo piano cover" },
  { name: "Pulp Fiction - Misirlou", search: "Pulp Fiction Misirlou guitar cover" },
  { name: "The Matrix - Clubbed to Death", search: "The Matrix Clubbed to Death piano strings cover" },
  { name: "Batman (1989) - Theme", search: "Batman 1989 Theme orchestral cover" },
  { name: "Breaking Bad - Main Title Theme", search: "Breaking Bad Theme dobro slide guitar cover" },

  // 3. POP & ROCK WORLDWIDE HITS
  { name: "Michael Jackson - Billie Jean", search: "Billie Jean acoustic cover loop" },
  { name: "Queen - Bohemian Rhapsody", search: "Bohemian Rhapsody piano cover" },
  { name: "Nirvana - Smells Like Teen Spirit", search: "Smells Like Teen Spirit classical strings cover" },
  { name: "The Beatles - Yesterday", search: "The Beatles Yesterday acoustic guitar cover" },
  { name: "Coldplay - Viva La Vida", search: "Coldplay Viva La Vida violin loop cover" },
  { name: "Daft Punk - Get Lucky", search: "Daft Punk Get Lucky piano cover" },
  { name: "Ed Sheeran - Shape of You", search: "Shape of You marimba cover" },
  { name: "Billie Eilish - Bad Guy", search: "Billie Eilish Bad Guy jazz double bass cover" },
  { name: "Adele - Rolling in the Deep", search: "Adele Rolling in the Deep cello violin cover" },
  { name: "Bruno Mars - Uptown Funk", search: "Bruno Mars Uptown Funk brass band cover" },
  { name: "Eagles - Hotel California", search: "Hotel California acoustic fingerstyle guitar cover" },
  { name: "Guns N' Roses - Sweet Child O' Mine", search: "Sweet Child O Mine classical guitar cover" },
  { name: "Bon Jovi - Livin' on a Prayer", search: "Livin on a Prayer piano cover" },
  { name: "AC/DC - Back In Black", search: "Back In Black cello cover" },
  { name: "Linkin Park - In The End", search: "Linkin Park In The End piano cover" },
  { name: "A-ha - Take On Me", search: "Take On Me acoustic guitar cover" },
  { name: "Rick Astley - Never Gonna Give You Up", search: "Never Gonna Give You Up 8 bit chiptune cover" },
  { name: "Luis Fonsi ft. Daddy Yankee - Despacito", search: "Despacito harp violin cover" },
  { name: "Shakira - Waka Waka", search: "Shakira Waka Waka acoustic cover" },
  { name: "Eminem - Lose Yourself", search: "Eminem Lose Yourself piano cover" },
  { name: "ABBA - Dancing Queen", search: "ABBA Dancing Queen piano cover" },
  { name: "Led Zeppelin - Stairway to Heaven", search: "Stairway to Heaven classical guitar cover" },
  { name: "Pink Floyd - Another Brick in the Wall", search: "Another Brick in the Wall acoustic cover" },
  { name: "David Bowie - Space Oddity", search: "David Bowie Space Oddity piano cover" },
  { name: "Rihanna - Umbrella", search: "Rihanna Umbrella acoustic cover" },
  { name: "Beyonce - Single Ladies", search: "Single Ladies brass cover" },
  { name: "Lady Gaga - Bad Romance", search: "Lady Gaga Bad Romance piano cover" },
  { name: "Katy Perry - Roar", search: "Katy Perry Roar acoustic cover" },
  { name: "Taylor Swift - Shake It Off", search: "Shake It Off brass band cover" },
  { name: "Justin Bieber - Baby", search: "Justin Bieber Baby piano cover" },
  { name: "Sia - Chandelier", search: "Sia Chandelier violin cello cover" },
  { name: "Imagine Dragons - Radioactive", search: "Imagine Dragons Radioactive orchestral cover" },
  { name: "The Weeknd - Blinding Lights", search: "The Weeknd Blinding Lights 80s synth cover" },
  { name: "Dua Lipa - Levitating", search: "Dua Lipa Levitating funk bass cover" },
  { name: "Olivia Rodrigo - Drivers License", search: "Olivia Rodrigo Drivers License piano cover" },
  { name: "Harry Styles - As It Was", search: "Harry Styles As It Was acoustic cover" },
  { name: "Miley Cyrus - Flowers", search: "Miley Cyrus Flowers piano cover" },
  { name: "Maroon 5 - Sugar", search: "Maroon 5 Sugar acoustic cover" },
  { name: "One Direction - What Makes You Beautiful", search: "What Makes You Beautiful piano cover" },
  { name: "Avicii - Wake Me Up", search: "Avicii Wake Me Up acoustic country cover" },
  { name: "Calvin Harris - Summer", search: "Calvin Harris Summer piano cover" },
  { name: "Gotye - Somebody That I Used To Know", search: "Somebody That I Used To Know xylophone cover" },
  { name: "Pharrell Williams - Happy", search: "Pharrell Williams Happy brass band cover" },
  { name: "John Legend - All of Me", search: "John Legend All of Me cello violin cover" },
  { name: "Sam Smith - Stay With Me", search: "Sam Smith Stay With Me piano cover" },
  { name: "Hozier - Take Me To Church", search: "Take Me To Church piano strings cover" },
  { name: "Passenger - Let Her Go", search: "Passenger Let Her Go acoustic guitar cover" },
  { name: "Bastille - Pompeii", search: "Bastille Pompeii acoustic cover" },
  { name: "Lorde - Royals", search: "Lorde Royals cello cover" },
  { name: "OneRepublic - Counting Stars", search: "OneRepublic Counting Stars harp violin cover" }
];

async function searchYouTube(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();
    const regex = /"videoId":"([^"]+)"/g;
    let match;
    const ids = [];
    while ((match = regex.exec(html)) !== null && ids.length < 5) {
      if (!ids.includes(match[1])) {
        ids.push(match[1]);
      }
    }
    return ids[0] || null;
  } catch (error) {
    console.error(`Error searching YouTube for: ${query}`, error);
    return null;
  }
}

async function run() {
  console.log(`Starting music extraction for ${songsList.length} tracks...`);
  const results = [];
  
  for (let i = 0; i < songsList.length; i++) {
    const song = songsList[i];
    console.log(`[${i+1}/${songsList.length}] Searching cover for: ${song.name}...`);
    
    const videoId = await searchYouTube(song.search);
    await sleep(250); // Delay to avoid blocking
    
    if (videoId) {
      // Find 3 incorrect song names from the list
      const pool = songsList.filter(s => s.name !== song.name);
      const incorrects = [];
      
      while (incorrects.length < 3 && pool.length > 0) {
        const randIdx = Math.floor(Math.random() * pool.length);
        const wrongSong = pool.splice(randIdx, 1)[0];
        incorrects.push(wrongSong.name);
      }
      
      const options = [song.name, ...incorrects];
      // Shuffle options
      for (let s = options.length - 1; s > 0; s--) {
        const r = Math.floor(Math.random() * (s + 1));
        const tmp = options[s];
        options[s] = options[r];
        options[r] = tmp;
      }
      
      results.push({
        id: i + 1,
        youtubeId: videoId,
        options: options,
        answerIndex: options.indexOf(song.name)
      });
    } else {
      console.log(`WARNING: Video ID not found for ${song.name}`);
    }
  }

  const fileContent = `// Archivo generado automáticamente con éxitos e instrumental covers de YouTube
export interface AudioQuestion {
  id: number;
  youtubeId: string;
  options: string[];
  answerIndex: number;
}

export const MUSIC_HITS_QUESTIONS: AudioQuestion[] = ${JSON.stringify(results, null, 2)};
`;

  // Write to Web
  fs.writeFileSync('e:/Imágenes/Tokkii/Web/src/data/MusicHitsQuestions.ts', fileContent);
  // Write to Builder
  fs.writeFileSync('E:/Imágenes/Tokkii/Builder_Tokkii/src/data/MusicHitsQuestions.ts', fileContent);
  
  console.log(`Done! Extracted ${results.length} questions.`);
}

run();
