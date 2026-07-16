export interface Character {
  id: string;
  name: string;
  element: 'Anemo' | 'Geo' | 'Electro' | 'Dendro' | 'Hydro' | 'Pyro' | 'Cryo';
  weapon: 'Sword' | 'Claymore' | 'Polearm' | 'Bow' | 'Catalyst';
  rarity: 4 | 5;
  imgUrl: string;
}

export const GENSHIN_CHARACTERS: Character[] = [
  {
    "id": "aino",
    "name": "Aino",
    "element": "Hydro",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png/revision/latest/scale-to-width-down/256?cb=20250910025341"
  },
  {
    "id": "albedo",
    "name": "Albedo",
    "element": "Geo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/30/Albedo_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304040635"
  },
  {
    "id": "alhaitham",
    "name": "Alhaitham",
    "element": "Dendro",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/2c/Alhaitham_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215091456"
  },
  {
    "id": "aloy",
    "name": "Aloy",
    "element": "Cryo",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/e/e5/Aloy_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215091525"
  },
  {
    "id": "alyosha",
    "name": "Alyosha",
    "element": "Electro",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "/alyosha.png"
  },
  {
    "id": "amber",
    "name": "Amber",
    "element": "Pyro",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/7/75/Amber_Icon.png/revision/latest/scale-to-width-down/256?cb=20210213161233"
  },
  {
    "id": "aratakiitto",
    "name": "Arataki Itto",
    "element": "Geo",
    "weapon": "Claymore",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/7/7b/Arataki_Itto_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215091612"
  },
  {
    "id": "arlecchino",
    "name": "Arlecchino",
    "element": "Pyro",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/9/9a/Arlecchino_Icon.png/revision/latest/scale-to-width-down/256?cb=20240424041749"
  },
  {
    "id": "baizhu",
    "name": "Baizhu",
    "element": "Dendro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/c/cb/Baizhu_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215091730"
  },
  {
    "id": "barbara",
    "name": "Barbara",
    "element": "Hydro",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/6/6a/Barbara_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215091800"
  },
  {
    "id": "beidou",
    "name": "Beidou",
    "element": "Electro",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/e/e1/Beidou_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215091828"
  },
  {
    "id": "bennett",
    "name": "Bennett",
    "element": "Pyro",
    "weapon": "Sword",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/7/79/Bennett_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215091856"
  },
  {
    "id": "candace",
    "name": "Candace",
    "element": "Hydro",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/dd/Candace_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092140"
  },
  {
    "id": "charlotte",
    "name": "Charlotte",
    "element": "Cryo",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/d2/Charlotte_Icon.png/revision/latest/scale-to-width-down/256?cb=20231108030544"
  },
  {
    "id": "chasca",
    "name": "Chasca",
    "element": "Anemo",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/0/03/Chasca_Icon.png/revision/latest/scale-to-width-down/256?cb=20241120025626"
  },
  {
    "id": "chevreuse",
    "name": "Chevreuse",
    "element": "Pyro",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/8/8a/Chevreuse_Icon.png/revision/latest/scale-to-width-down/256?cb=20231225195348"
  },
  {
    "id": "chiori",
    "name": "Chiori",
    "element": "Geo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/8/88/Chiori_Icon.png/revision/latest/scale-to-width-down/256?cb=20240313015540"
  },
  {
    "id": "chongyun",
    "name": "Chongyun",
    "element": "Cryo",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/35/Chongyun_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092204"
  },
  {
    "id": "citlali",
    "name": "Citlali",
    "element": "Cryo",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/dd/Citlali_Icon.png/revision/latest/scale-to-width-down/256?cb=20241130080542"
  },
  {
    "id": "clorinde",
    "name": "Clorinde",
    "element": "Electro",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/5b/Clorinde_Icon.png/revision/latest/scale-to-width-down/256?cb=20240605020849"
  },
  {
    "id": "collei",
    "name": "Collei",
    "element": "Dendro",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/a2/Collei_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092218"
  },
  {
    "id": "columbina",
    "name": "Columbina",
    "element": "Hydro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/35/Columbina_Icon.png/revision/latest/scale-to-width-down/256?cb=20260114031143"
  },
  {
    "id": "cyno",
    "name": "Cyno",
    "element": "Electro",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/31/Cyno_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092240"
  },
  {
    "id": "dahlia",
    "name": "Dahlia",
    "element": "Hydro",
    "weapon": "Sword",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/6/6d/Dahlia_Icon.png/revision/latest/scale-to-width-down/256?cb=20250618025425"
  },
  {
    "id": "dehya",
    "name": "Dehya",
    "element": "Pyro",
    "weapon": "Claymore",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/3f/Dehya_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092328"
  },
  {
    "id": "diluc",
    "name": "Diluc",
    "element": "Pyro",
    "weapon": "Claymore",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/3d/Diluc_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092341"
  },
  {
    "id": "diona",
    "name": "Diona",
    "element": "Cryo",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/4/40/Diona_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304040712"
  },
  {
    "id": "dori",
    "name": "Dori",
    "element": "Electro",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/54/Dori_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092725"
  },
  {
    "id": "durin",
    "name": "Durin",
    "element": "Pyro",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/ba/Durin_Icon.png/revision/latest/scale-to-width-down/256?cb=20251203043105"
  },
  {
    "id": "emilie",
    "name": "Emilie",
    "element": "Dendro",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/aa/Emilie_Icon.png/revision/latest/scale-to-width-down/256?cb=20240806102359"
  },
  {
    "id": "escoffier",
    "name": "Escoffier",
    "element": "Cryo",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/2a/Escoffier_Icon.png/revision/latest/scale-to-width-down/256?cb=20250507052556"
  },
  {
    "id": "eula",
    "name": "Eula",
    "element": "Cryo",
    "weapon": "Claymore",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/af/Eula_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092858"
  },
  {
    "id": "faruzan",
    "name": "Faruzan",
    "element": "Anemo",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/b2/Faruzan_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092917"
  },
  {
    "id": "fischl",
    "name": "Fischl",
    "element": "Electro",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/9/9a/Fischl_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215092945"
  },
  {
    "id": "flins",
    "name": "Flins",
    "element": "Electro",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/af/Flins_Icon.png/revision/latest/scale-to-width-down/256?cb=20250910175819"
  },
  {
    "id": "freminet",
    "name": "Freminet",
    "element": "Cryo",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/e/ee/Freminet_Icon.png/revision/latest/scale-to-width-down/256?cb=20231215093001"
  },
  {
    "id": "furina",
    "name": "Furina",
    "element": "Hydro",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/e/e6/Furina_Icon.png/revision/latest/scale-to-width-down/256?cb=20231108030656"
  },
  {
    "id": "gaming",
    "name": "Gaming",
    "element": "Pyro",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/7/77/Gaming_Icon.png/revision/latest/scale-to-width-down/256?cb=20240131020313"
  },
  {
    "id": "ganyu",
    "name": "Ganyu",
    "element": "Cryo",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/7/79/Ganyu_Icon.png/revision/latest/scale-to-width-down/256?cb=20230519012425"
  },
  {
    "id": "gorou",
    "name": "Gorou",
    "element": "Geo",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/f/fe/Gorou_Icon.png/revision/latest/scale-to-width-down/256?cb=20211126224331"
  },
  {
    "id": "hutao",
    "name": "Hu Tao",
    "element": "Pyro",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/e/e9/Hu_Tao_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304040745"
  },
  {
    "id": "iansan",
    "name": "Iansan",
    "element": "Electro",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/38/Iansan_Icon.png/revision/latest/scale-to-width-down/256?cb=20250326014900"
  },
  {
    "id": "ifa",
    "name": "Ifa",
    "element": "Anemo",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/5f/Ifa_Icon.png/revision/latest/scale-to-width-down/256?cb=20250507052606"
  },
  {
    "id": "illuga",
    "name": "Illuga",
    "element": "Geo",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/9/96/Illuga_Icon.png/revision/latest/scale-to-width-down/256?cb=20260114054020"
  },
  {
    "id": "ineffa",
    "name": "Ineffa",
    "element": "Electro",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/0/0b/Ineffa_Icon.png/revision/latest/scale-to-width-down/256?cb=20250730030204"
  },
  {
    "id": "jahoda",
    "name": "Jahoda",
    "element": "Anemo",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/bf/Jahoda_Icon.png/revision/latest/scale-to-width-down/256?cb=20250911004842"
  },
  {
    "id": "jean",
    "name": "Jean",
    "element": "Anemo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/6/64/Jean_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304040810"
  },
  {
    "id": "kachina",
    "name": "Kachina",
    "element": "Geo",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/1/1a/Kachina_Icon.png/revision/latest/scale-to-width-down/256?cb=20240828030247"
  },
  {
    "id": "kaedeharakazuha",
    "name": "Kaedehara Kazuha",
    "element": "Anemo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/e/e3/Kaedehara_Kazuha_Icon.png/revision/latest/scale-to-width-down/256?cb=20210623063513"
  },
  {
    "id": "kaeya",
    "name": "Kaeya",
    "element": "Cryo",
    "weapon": "Sword",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/b6/Kaeya_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304040842"
  },
  {
    "id": "kamisatoayaka",
    "name": "Kamisato Ayaka",
    "element": "Cryo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/51/Kamisato_Ayaka_Icon.png/revision/latest/scale-to-width-down/256?cb=20211221231648"
  },
  {
    "id": "kamisatoayato",
    "name": "Kamisato Ayato",
    "element": "Hydro",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/27/Kamisato_Ayato_Icon.png/revision/latest/scale-to-width-down/256?cb=20220601033710"
  },
  {
    "id": "kaveh",
    "name": "Kaveh",
    "element": "Dendro",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/1/1f/Kaveh_Icon.png/revision/latest/scale-to-width-down/256?cb=20230502113258"
  },
  {
    "id": "keqing",
    "name": "Keqing",
    "element": "Electro",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/52/Keqing_Icon.png/revision/latest/scale-to-width-down/256?cb=20210213162751"
  },
  {
    "id": "kinich",
    "name": "Kinich",
    "element": "Dendro",
    "weapon": "Claymore",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/9/9a/Kinich_Icon.png/revision/latest/scale-to-width-down/256?cb=20240917123836"
  },
  {
    "id": "kirara",
    "name": "Kirara",
    "element": "Dendro",
    "weapon": "Sword",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/b6/Kirara_Icon.png/revision/latest/scale-to-width-down/256?cb=20230718042457"
  },
  {
    "id": "klee",
    "name": "Klee",
    "element": "Pyro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/9/9c/Klee_Icon.png/revision/latest/scale-to-width-down/256?cb=20210214011911"
  },
  {
    "id": "kujousara",
    "name": "Kujou Sara",
    "element": "Electro",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/df/Kujou_Sara_Icon.png/revision/latest/scale-to-width-down/256?cb=20220210040844"
  },
  {
    "id": "kukishinobu",
    "name": "Kuki Shinobu",
    "element": "Electro",
    "weapon": "Sword",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/b3/Kuki_Shinobu_Icon.png/revision/latest/scale-to-width-down/256?cb=20220605061801"
  },
  {
    "id": "lanyan",
    "name": "Lan Yan",
    "element": "Anemo",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/e/e6/Lan_Yan_Icon.png/revision/latest/scale-to-width-down/256?cb=20250128195304"
  },
  {
    "id": "lauma",
    "name": "Lauma",
    "element": "Dendro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/27/Lauma_Icon.png/revision/latest/scale-to-width-down/256?cb=20250910024154"
  },
  {
    "id": "layla",
    "name": "Layla",
    "element": "Cryo",
    "weapon": "Sword",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/1/1a/Layla_Icon.png/revision/latest/scale-to-width-down/256?cb=20221118140544"
  },
  {
    "id": "linnea",
    "name": "Linnea",
    "element": "Geo",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/a9/Linnea_Icon.png/revision/latest/scale-to-width-down/256?cb=20260408075838"
  },
  {
    "id": "lisa",
    "name": "Lisa",
    "element": "Electro",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/6/65/Lisa_Icon.png/revision/latest/scale-to-width-down/256?cb=20240711205456"
  },
  {
    "id": "lohen",
    "name": "Lohen",
    "element": "Cryo",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/8/86/Lohen_Icon.png/revision/latest/scale-to-width-down/256?cb=20260521150129"
  },
  {
    "id": "lynette",
    "name": "Lynette",
    "element": "Anemo",
    "weapon": "Sword",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/ad/Lynette_Icon.png/revision/latest/scale-to-width-down/256?cb=20230816051019"
  },
  {
    "id": "lyney",
    "name": "Lyney",
    "element": "Pyro",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/b2/Lyney_Icon.png/revision/latest/scale-to-width-down/256?cb=20230816045203"
  },
  {
    "id": "mavuika",
    "name": "Mavuika",
    "element": "Pyro",
    "weapon": "Claymore",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/da/Mavuika_Icon.png/revision/latest/scale-to-width-down/256?cb=20250101070636"
  },
  {
    "id": "mika",
    "name": "Mika",
    "element": "Cryo",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/dd/Mika_Icon.png/revision/latest/scale-to-width-down/256?cb=20230321101835"
  },
  {
    "id": "mona",
    "name": "Mona",
    "element": "Hydro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/4/41/Mona_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304040909"
  },
  {
    "id": "mualani",
    "name": "Mualani",
    "element": "Hydro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/0/0b/Mualani_Icon.png/revision/latest/scale-to-width-down/256?cb=20240828030235"
  },
  {
    "id": "nahida",
    "name": "Nahida",
    "element": "Dendro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/f/f9/Nahida_Icon.png/revision/latest/scale-to-width-down/256?cb=20221102030809"
  },
  {
    "id": "navia",
    "name": "Navia",
    "element": "Geo",
    "weapon": "Claymore",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/c/c0/Navia_Icon.png/revision/latest/scale-to-width-down/256?cb=20231220022117"
  },
  {
    "id": "nefer",
    "name": "Nefer",
    "element": "Dendro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/5b/Nefer_Icon.png/revision/latest/scale-to-width-down/256?cb=20250911005040"
  },
  {
    "id": "neuvillette",
    "name": "Neuvillette",
    "element": "Hydro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/21/Neuvillette_Icon.png/revision/latest/scale-to-width-down/256?cb=20240711205454"
  },
  {
    "id": "nicole",
    "name": "Nicole",
    "element": "Pyro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/a0/Nicole_Icon.png/revision/latest/scale-to-width-down/256?cb=20260120013342"
  },
  {
    "id": "nilou",
    "name": "Nilou",
    "element": "Hydro",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/58/Nilou_Icon.png/revision/latest/scale-to-width-down/256?cb=20221014102540"
  },
  {
    "id": "ningguang",
    "name": "Ningguang",
    "element": "Geo",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/e/e0/Ningguang_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304040948"
  },
  {
    "id": "noelle",
    "name": "Noelle",
    "element": "Geo",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/8/8e/Noelle_Icon.png/revision/latest/scale-to-width-down/256?cb=20210214011929"
  },
  {
    "id": "odette",
    "name": "Odette",
    "element": "Cryo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "/odette.png"
  },
  {
    "id": "ororon",
    "name": "Ororon",
    "element": "Electro",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/5e/Ororon_Icon.png/revision/latest/scale-to-width-down/256?cb=20241014100711"
  },
  {
    "id": "prune",
    "name": "Prune",
    "element": "Anemo",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/9/99/Prune_Icon.png/revision/latest/scale-to-width-down/256?cb=20260520083549"
  },
  {
    "id": "qiqi",
    "name": "Qiqi",
    "element": "Cryo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/b3/Qiqi_Icon.png/revision/latest/scale-to-width-down/256?cb=20220316020612"
  },
  {
    "id": "raidenshogun",
    "name": "Raiden Shogun",
    "element": "Electro",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/24/Raiden_Shogun_Icon.png/revision/latest/scale-to-width-down/256?cb=20240717072843"
  },
  {
    "id": "razor",
    "name": "Razor",
    "element": "Electro",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/b8/Razor_Icon.png/revision/latest/scale-to-width-down/256?cb=20210214011936"
  },
  {
    "id": "rosaria",
    "name": "Rosaria",
    "element": "Cryo",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/35/Rosaria_Icon.png/revision/latest/scale-to-width-down/256?cb=20220601032845"
  },
  {
    "id": "sandrone",
    "name": "Sandrone",
    "element": "Cryo",
    "weapon": "Claymore",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/c/c8/Sandrone_Icon.png/revision/latest/scale-to-width-down/256?cb=20260701024112"
  },
  {
    "id": "sangonomiyakokomi",
    "name": "Sangonomiya Kokomi",
    "element": "Hydro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/f/ff/Sangonomiya_Kokomi_Icon.png/revision/latest/scale-to-width-down/256?cb=20210921103819"
  },
  {
    "id": "sayu",
    "name": "Sayu",
    "element": "Anemo",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/22/Sayu_Icon.png/revision/latest/scale-to-width-down/256?cb=20210810101044"
  },
  {
    "id": "sethos",
    "name": "Sethos",
    "element": "Electro",
    "weapon": "Bow",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/9/90/Sethos_Icon.png/revision/latest/scale-to-width-down/256?cb=20240605020859"
  },
  {
    "id": "shenhe",
    "name": "Shenhe",
    "element": "Cryo",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/af/Shenhe_Icon.png/revision/latest/scale-to-width-down/256?cb=20220210034241"
  },
  {
    "id": "shikanoinheizou",
    "name": "Shikanoin Heizou",
    "element": "Anemo",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/20/Shikanoin_Heizou_Icon.png/revision/latest/scale-to-width-down/256?cb=20240711205453"
  },
  {
    "id": "sigewinne",
    "name": "Sigewinne",
    "element": "Hydro",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/37/Sigewinne_Icon.png/revision/latest/scale-to-width-down/256?cb=20240625101835"
  },
  {
    "id": "skirk",
    "name": "Skirk",
    "element": "Cryo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/0/03/Skirk_Icon.png/revision/latest/scale-to-width-down/256?cb=20250618025127"
  },
  {
    "id": "sucrose",
    "name": "Sucrose",
    "element": "Anemo",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/0/0e/Sucrose_Icon.png/revision/latest/scale-to-width-down/256?cb=20210213163209"
  },
  {
    "id": "tartaglia",
    "name": "Tartaglia",
    "element": "Hydro",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/8/85/Tartaglia_Icon.png/revision/latest/scale-to-width-down/256?cb=20210213163935"
  },
  {
    "id": "thoma",
    "name": "Thoma",
    "element": "Pyro",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/5b/Thoma_Icon.png/revision/latest/scale-to-width-down/256?cb=20211014011046"
  },
  {
    "id": "tighnari",
    "name": "Tighnari",
    "element": "Dendro",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/8/87/Tighnari_Icon.png/revision/latest/scale-to-width-down/256?cb=20220824024817"
  },
  {
    "id": "aether",
    "name": "Traveler (Aether)",
    "element": "Anemo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "/aether.png"
  },
  {
    "id": "lumine",
    "name": "Traveler (Lumine)",
    "element": "Anemo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "/lumine.png"
  },
  {
    "id": "varesa",
    "name": "Varesa",
    "element": "Electro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/dd/Varesa_Icon.png/revision/latest/scale-to-width-down/256?cb=20250326014831"
  },
  {
    "id": "varka",
    "name": "Varka",
    "element": "Anemo",
    "weapon": "Claymore",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/9/98/Varka_Icon.png/revision/latest/scale-to-width-down/256?cb=20260119061922"
  },
  {
    "id": "venti",
    "name": "Venti",
    "element": "Anemo",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/f/f1/Venti_Icon.png/revision/latest/scale-to-width-down/256?cb=20210214011949"
  },
  {
    "id": "wanderer",
    "name": "Wanderer",
    "element": "Anemo",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/f/f8/Wanderer_Icon.png/revision/latest/scale-to-width-down/256?cb=20221207034209"
  },
  {
    "id": "wriothesley",
    "name": "Wriothesley",
    "element": "Cryo",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/bb/Wriothesley_Icon.png/revision/latest/scale-to-width-down/256?cb=20231017103145"
  },
  {
    "id": "xiangling",
    "name": "Xiangling",
    "element": "Pyro",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/3/39/Xiangling_Icon.png/revision/latest/scale-to-width-down/256?cb=20210214011301"
  },
  {
    "id": "xianyun",
    "name": "Xianyun",
    "element": "Anemo",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/d3/Xianyun_Icon.png/revision/latest/scale-to-width-down/256?cb=20240131020302"
  },
  {
    "id": "xiao",
    "name": "Xiao",
    "element": "Anemo",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/f/fd/Xiao_Icon.png/revision/latest/scale-to-width-down/256?cb=20210214012045"
  },
  {
    "id": "xilonen",
    "name": "Xilonen",
    "element": "Geo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/ab/Xilonen_Icon.png/revision/latest/scale-to-width-down/256?cb=20241009015637"
  },
  {
    "id": "xingqiu",
    "name": "Xingqiu",
    "element": "Hydro",
    "weapon": "Sword",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/d4/Xingqiu_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304041029"
  },
  {
    "id": "xinyan",
    "name": "Xinyan",
    "element": "Pyro",
    "weapon": "Claymore",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/24/Xinyan_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304041110"
  },
  {
    "id": "yaemiko",
    "name": "Yae Miko",
    "element": "Electro",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/b/ba/Yae_Miko_Icon.png/revision/latest/scale-to-width-down/256?cb=20220216025931"
  },
  {
    "id": "yanfei",
    "name": "Yanfei",
    "element": "Pyro",
    "weapon": "Catalyst",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/5/54/Yanfei_Icon.png/revision/latest/scale-to-width-down/256?cb=20260304041151"
  },
  {
    "id": "yaoyao",
    "name": "Yaoyao",
    "element": "Dendro",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/8/83/Yaoyao_Icon.png/revision/latest/scale-to-width-down/256?cb=20230123150446"
  },
  {
    "id": "yelan",
    "name": "Yelan",
    "element": "Hydro",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/d/d3/Yelan_Icon.png/revision/latest/scale-to-width-down/256?cb=20240711205454"
  },
  {
    "id": "yoimiya",
    "name": "Yoimiya",
    "element": "Pyro",
    "weapon": "Bow",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/8/88/Yoimiya_Icon.png/revision/latest/scale-to-width-down/256?cb=20220214235604"
  },
  {
    "id": "yumemizukimizuki",
    "name": "Yumemizuki Mizuki",
    "element": "Anemo",
    "weapon": "Catalyst",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/f/f6/Yumemizuki_Mizuki_Icon.png/revision/latest/scale-to-width-down/256?cb=20250212014631"
  },
  {
    "id": "yunjin",
    "name": "Yun Jin",
    "element": "Geo",
    "weapon": "Polearm",
    "rarity": 4,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/9/9c/Yun_Jin_Icon.png/revision/latest/scale-to-width-down/256?cb=20220316025919"
  },
  {
    "id": "zhongli",
    "name": "Zhongli",
    "element": "Geo",
    "weapon": "Polearm",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/a/a6/Zhongli_Icon.png/revision/latest/scale-to-width-down/256?cb=20240711205450"
  },
  {
    "id": "zibai",
    "name": "Zibai",
    "element": "Geo",
    "weapon": "Sword",
    "rarity": 5,
    "imgUrl": "https://static.wikia.nocookie.net/gensin-impact/images/2/22/Zibai_Icon.png/revision/latest/scale-to-width-down/256?cb=20260203100351"
  }
];
