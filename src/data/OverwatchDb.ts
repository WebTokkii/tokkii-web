export interface Character {
  id: string;
  name: string;
  element: 'Tank' | 'Damage' | 'Support';
  weapon: 'Overwatch' | 'Talon' | 'Neutral';
  rarity: 4 | 5;
  imgUrl: string;
}

export const OVERWATCH_CHARACTERS: Character[] = [
  {
    "id": "ana",
    "name": "Ana",
    "element": "Support",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/3/3d/Icon-Ana.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "anran",
    "name": "Anran",
    "element": "Damage",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/07/Icon-Anran.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "ashe",
    "name": "Ashe",
    "element": "Damage",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/b/be/Icon-Ashe.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "baptiste",
    "name": "Baptiste",
    "element": "Support",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/f/fb/Icon-Baptiste.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "bastion",
    "name": "Bastion",
    "element": "Damage",
    "weapon": "Neutral",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/51/Icon-Bastion.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "brigitte",
    "name": "Brigitte",
    "element": "Support",
    "weapon": "Overwatch",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a6/Icon-Brigitte.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "cassidy",
    "name": "Cassidy",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/05/Icon-Cassidy.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "dva",
    "name": "D.Va",
    "element": "Tank",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/19/Icon-D.Va.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "domina",
    "name": "Domina",
    "element": "Tank",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/76/Icon-Domina.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "doomfist",
    "name": "Doomfist",
    "element": "Tank",
    "weapon": "Talon",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a1/Icon-Doomfist.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "echo",
    "name": "Echo",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/d/d6/Icon-Echo.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "emre",
    "name": "Emre",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/3/34/Icon-Emre.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "freja",
    "name": "Freja",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/04/Icon-Freja.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "genji",
    "name": "Genji",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/1c/Icon-Genji.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "hanzo",
    "name": "Hanzo",
    "element": "Damage",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/71/Icon-Hanzo.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "hazard",
    "name": "Hazard",
    "element": "Tank",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/54/Icon-Hazard.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "illari",
    "name": "Illari",
    "element": "Support",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/86/Icon-Illari.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "jetpack_cat",
    "name": "Jetpack Cat",
    "element": "Support",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/12/Icon-Jetpack_Cat.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "junker_queen",
    "name": "Junker Queen",
    "element": "Tank",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/2b/Icon-Junker_Queen.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "junkrat",
    "name": "Junkrat",
    "element": "Damage",
    "weapon": "Neutral",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/9/99/Icon-Junkrat.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "juno",
    "name": "Juno",
    "element": "Support",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/c7/Icon-Juno.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "kiriko",
    "name": "Kiriko",
    "element": "Support",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/ca/Icon-kiriko.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "lifeweaver",
    "name": "Lifeweaver",
    "element": "Support",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/86/Icon-Lifeweaver.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "lucio",
    "name": "Lúcio",
    "element": "Support",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/51/Icon-L%C3%BAcio.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "mauga",
    "name": "Mauga",
    "element": "Tank",
    "weapon": "Talon",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/3/39/Icon-Mauga.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "mei",
    "name": "Mei",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/9/99/Icon-Mei.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "mercy",
    "name": "Mercy",
    "element": "Support",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/03/Icon-Mercy.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "mizuki",
    "name": "Mizuki",
    "element": "Support",
    "weapon": "Talon",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/3/36/Icon-Mizuki.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "moira",
    "name": "Moira",
    "element": "Support",
    "weapon": "Talon",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/55/Icon-Moira.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "orisa",
    "name": "Orisa",
    "element": "Tank",
    "weapon": "Neutral",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/11/Icon-Orisa.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "pharah",
    "name": "Pharah",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/29/Icon-Pharah.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "ramattra",
    "name": "Ramattra",
    "element": "Tank",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/6/6f/Icon-Ramattra.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "reaper",
    "name": "Reaper",
    "element": "Damage",
    "weapon": "Talon",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a9/Icon-Reaper.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "reinhardt",
    "name": "Reinhardt",
    "element": "Tank",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/83/Icon-Reinhardt.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "roadhog",
    "name": "Roadhog",
    "element": "Tank",
    "weapon": "Neutral",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/16/Icon-Roadhog.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "shion",
    "name": "Shion",
    "element": "Damage",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/74/Icon-Shion.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "sierra",
    "name": "Sierra",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/3/32/Icon-Sierra.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "sigma",
    "name": "Sigma",
    "element": "Tank",
    "weapon": "Talon",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/e/e0/Icon-Sigma.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "sojourn",
    "name": "Sojourn",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/e/e0/Icon-Sojourn.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "soldier_76",
    "name": "Soldier: 76",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/2b/Icon-Soldier_76.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "sombra",
    "name": "Sombra",
    "element": "Damage",
    "weapon": "Talon",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/70/Icon-Sombra.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "symmetra",
    "name": "Symmetra",
    "element": "Damage",
    "weapon": "Neutral",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/06/Icon-Symmetra.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "torbjorn",
    "name": "Torbjörn",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/ca/Icon-Torbj%C3%B6rn.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "tracer",
    "name": "Tracer",
    "element": "Damage",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/29/Icon-Tracer.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "venture",
    "name": "Venture",
    "element": "Damage",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a0/Icon-Venture.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "widowmaker",
    "name": "Widowmaker",
    "element": "Damage",
    "weapon": "Talon",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/54/Icon-Widowmaker.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "winston",
    "name": "Winston",
    "element": "Tank",
    "weapon": "Overwatch",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/f/f8/Icon-Winston.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "wrecking_ball",
    "name": "Wrecking Ball",
    "element": "Tank",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/ca/Icon-Wrecking_Ball.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "wuyang",
    "name": "Wuyang",
    "element": "Support",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/6/6c/Icon-Wuyang.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "zarya",
    "name": "Zarya",
    "element": "Tank",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/75/Icon-Zarya.png/revision/latest/scale-to-width-down/256"
  },
  {
    "id": "zenyatta",
    "name": "Zenyatta",
    "element": "Support",
    "weapon": "Neutral",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/overwatch_gamepedia/images/f/f7/Icon-Zenyatta.png/revision/latest/scale-to-width-down/256"
  }
];
