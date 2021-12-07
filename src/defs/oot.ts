import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
  ArchipelagoItem,
  DeathLinkOption,
  ArchipelagoLocation,
} from "./core";

/** The collection of settings for The Legend of Zelda: Ocarina of Time. */
const OoTSettings: ArchipelagoSettingBase[] = [];

const colorOptionsPeople: Record<string, string> = {
  random_choice: "Random from the list",
  kokiri_green: "Kokiri Green",
  goron_red: "Goron Red",
  zora_blue: "Zora Blue",
  black: "Black",
  white: "White",
  azure_blue: "Azure Blue",
  vivid_cyan: "Vivid Cyan",
  light_red: "Light Red",
  fuschia: "Fuschia",
  purple: "Purple",
  majora_purple: "Majora Purple",
  twitch_purple: "Twitch Purple",
  purple_heart: "Purple Heart",
  persian_rose: "Persian Rose",
  dirty_yellow: "Dirty Yellow",
  blush_pink: "Blush Pink",
  hot_pink: "Hot Pink",
  rose_pink: "Rose Pink",
  orange: "Orange",
  gray: "Gray",
  gold: "Gold",
  silver: "Silver",
  beige: "Beige",
  teal: "Teal",
  blood_red: "Blood Red",
  blood_orange: "Blood Orange",
  royal_blue: "Royal Blue",
  sonic_blue: "Sonic Blue",
  nes_green: "NES Green",
  dark_green: "Dark Green",
  lumen: "Lumen",
  completely_random: "Completely random – may be off the list",
};
const colorOptionsGauntlets: Record<string, string> = {
  random_choice: "Random from the list",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  black: "Black",
  green: "Green",
  blue: "Blue",
  red: "Red",
  sky_blue: "Sky Blue",
  pink: "Pink",
  magenta: "Magenta",
  orange: "Orange",
  lime: "Lime",
  purple: "Purple",
  completely_random: "Completely random – may be off the list",
};
const colorOptionsNaviInner: Record<string, string> = {
  random_choice: "Random from the list",
  rainbow: "Rainbow",
  gold: "Gold",
  white: "White",
  green: "Green",
  light_blue: "Light Blue",
  yellow: "Yellow",
  red: "Red",
  magenta: "Magenta",
  black: "Black",
  tatl: "Tatl",
  tael: "Tael",
  fi: "Fi",
  ciela: "Ciela",
  epona: "Epona",
  ezlo: "Ezlo",
  king_of_red_lions: "King of Red Lions",
  linebeck: "Linebeck",
  loftwing: "Loftwing",
  midna: "Midna",
  phantom_zelda: "Phantom Zelda",
  completely_random: "Completely random – may be off the list",
};
const colorOptionsNaviOuter: Record<string, string> = Object.assign(
  { match_inner: "Same as inner color" },
  colorOptionsNaviInner
);
const colorOptionsTrailsInner: Record<string, string> = {
  random_choice: "Random from the list",
  rainbow: "Rainbow",
  white: "White",
  red: "Red",
  yellow: "Yellow",
  green: "Green",
  blue: "Blue",
  cyan: "Cyan",
  magenta: "Magenta",
  orange: "Orange",
  gold: "Gold",
  purple: "Purple",
  pink: "Pink",
  completely_random: "Completely random – may be off the list",
};
const colorOptionsTrailsOuter: Record<string, string> = Object.assign(
  { match_inner: "Same as inner color" },
  colorOptionsTrailsInner
);
const colorOptionsButtons: Record<string, string> = {
  random_choice: "Random from the list",
  n64_blue: "N64 Blue",
  n64_green: "N64 Green",
  n64_red: "N64 Red",
  gamecube_green: "GameCube Green",
  gamecube_red: "GameCube Red",
  gamecube_grey: "GameCube Grey",
  yellow: "Yellow",
  black: "Black",
  white: "White",
  magenta: "Magenta",
  ruby: "Ruby",
  sapphire: "Sapphire",
  lime: "Lime",
  cyan: "Cyan",
  purple: "Purple",
  orange: "Orange",
  completely_random: "Completely random – may be off the list",
};
const sfxOptionsNavi: Record<string, string> = {
  none: "None",
  default: "Default",
  random_choice: "Random from the list",
  random_ear_safe: "Random ear-safe sound",
  bark: "Bark",
  business_scrub: "Business Scrub",
  carrot_refill: "Carrot refill",
  cluck: "Cluck",
  cockadoodledoo: "Cucco crowing",
  dusk_howl: "Dusk howl",
  exploding_crate: "Exploding crate",
  explosion: "Explosion",
  great_fairy: "Great Fairy",
  guay: "Guay",
  low_health: "Low health",
  recover_health: "Recover health",
  horse_neigh: "Horse neigh",
  shattering_ice: "Shattering ice",
  moo: "Moo",
  mweep: "Mweep",
  navi_hello: 'Navi: "Hello?"',
  notification: "Notification",
  poe: "Poe",
  shattering_pot: "Shattering pot",
  redead_scream: "ReDead scream",
  ribbit: "Ribbit",
  ruto_giggle: "Ruto giggle",
  skulltula: "Skulltula",
  soft_beep: "Soft beep",
  tambourine: "Tambourine",
  timer: "Timer",
  adult_zelda_gasp: "Adult Zelda gasping",
  completely_random: "Completely random – may be off the list",
};
const sfxOptionsLowHP: Record<string, string> = {
  none: "None",
  default: "Default",
  random_choice: "Random from the list",
  random_ear_safe: "Random ear-safe sound",
  bark: "Bark",
  bomb_bounce: "Bomb bounce",
  bongo_bongo_low: "Bongo bongo low",
  bow_twang: "Bow twang",
  business_scrub: "Business Scrub",
  carrot_refill: "Carrot refill",
  cluck: "Cluck",
  drawbridge_set: "Drawbridge set",
  guay: "Guay",
  recover_health: "Recover health",
  horse_trot: "Horse trot",
  iron_boots: "Iron boots",
  moo: "Moo",
  mweep: "Mweep",
  navi_hey: 'Navi: "Hey!"',
  navi_random: "Random Navi",
  notification: "Notification",
  shattering_pot: "Shattering pot",
  ribbit: "Ribbit",
  silver_rupee: "Silver Rupee",
  soft_beep: "Soft beep",
  tambourine: "Tambourine",
  timer: "Timer",
  adult_zelda_gasp: "Adult Zelda gasping",
  completely_random: "Completely random – may be off the list",
};
const sfxOptionsMenu: Record<string, string> = {
  none: "None",
  default: "Default",
  random_choice: "Random from the list",
  random_ear_safe: "Random ear-safe sound",
  bark: "Bark",
  bomb_bounce: "Bomb bounce",
  bongo_bongo_high: "Bongo bongo high",
  bongo_bongo_low: "Bongo bongo low",
  bottle_cork: "Bottle cork",
  bow_twang: "Bow twang",
  bubble_laugh: "Bubble laugh",
  carrot_refill: "Carrot refill",
  change_item: "Change item",
  child_pant: "Child pant",
  cluck: "Cluck",
  deku_baba: "Deku baba",
  drawbridge_set: "Drawbridge set",
  dusk_howl: "Dusk howl",
  fanfare_light: "Fanfare light",
  fanfare_medium: "Fanfare medium",
  field_shrub: "Field shrub",
  flare_dancer_startled: "Flare dancer startled",
  ganondorf_teh: 'Ganondorf: "Teh!"',
  gohma_larva_croak: "Gohma larva croak",
  gold_skull_token: "Gold Skull Token",
  goron_wake: "Goron wake",
  guay: "Guay",
  gunshot: "Gunshot",
  low_health: "Low health",
  recover_health: "Recover health",
  hammer_bonk: "Hammer bonk",
  horse_trot: "Horse trot",
  iron_boots: "Iron boots",
  iron_knuckle: "Iron knuckle",
  moo: "Moo",
  mweep: "Mweep",
  notification: "Notification",
  phantom_ganon_laugh: "Phantom Ganon laugh",
  plant_explode: "Plant explode",
  shattering_pot: "Shattering pot",
  redead_moan: "ReDead moan",
  ribbit: "Ribbit",
  rupee: "Rupee",
  silver_rupee: "Silver Rupee",
  ruto_crash: "Ruto crash",
  ruto_lift: "Ruto lift",
  ruto_thrown: "Ruto thrown",
  scrub_emerge: "Scrub emerge",
  shabom_bounce: "Shabom bounce",
  shabom_pop: "Shabom pop",
  shellblade: "Shellblade",
  skulltula: "Skulltula",
  soft_beep: "Soft beep",
  spit_nut: "Spit nut",
  talon_hmm: 'Talon: "Hmm..."',
  talon_snore: "Talon snore",
  talon_wtf: 'Talon: "!?"',
  tambourine: "Tambourine",
  target_enemy: "Target enemy",
  target_neutral: "Target neutral",
  thunder: "Thunder",
  timer: "Timer",
  adult_zelda_gasp: "Adult Zelda gasping",
  completely_random: "Completely random – may be off the list",
};

OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "logic_rules",
    readableName: "Logic rules",
    description: "What placement logic is to be used to generate the world.",
    values: {
      glitchless: "No glitches",
      glitched: "Glitches required",
      no_logic: "Screw it, put everything anywhere (beware!)",
    },
    default: "glitchless",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "logic_no_night_tokens_without_suns_song",
    readableName: "Sun's Song for Skulltulas",
    description: "Nighttime Skulltulas will logically require Sun's Song.",
    default: false,
  })
);

//------------====================== STARTING WORLD STATE
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "open_forest",
    readableName: "Open Kokiri Forest",
    description:
      "Set the state of Kokiri Forest and the path to the Deku Tree.",
    values: {
      open: "Open",
      closed_deku: "Open Forest, closed Deku",
      closed: "Closed",
    },
    default: "open",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "open_kakariko",
    readableName: "Open Kakariko Village",
    description: "Set the state of the Kakariko Village gate.",
    values: {
      open: "Open",
      zelda: "Zelda",
      closed: "Closed",
    },
    default: "open",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "open_door_of_time",
    readableName: "Open Door of Time",
    description: "Open the Door of Time by default, without the Song of Time.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "zora_fountain",
    readableName: "Zora Fountain",
    description:
      "Set the state of King Zora, blocking the way to Zora's Fountain.",
    values: {
      open: "Open",
      adult: "Adult",
      closed: "Closed",
    },
    default: "closed",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "gerudo_fortress",
    readableName: "Gerudo Fortress",
    description: "Set the requirements to access Gerudo Fortress.",
    values: {
      normal: "Normal",
      fast: "Fast",
      open: "Open",
    },
    default: "fast",
  })
);

//------------====================== RAINBOW BRIDGE
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "bridge",
    readableName: "Rainbow Bridge",
    description: "Set the requirements for Rainbow Bridge.",
    values: {
      open: "Open",
      vanilla: "Vanilla",
      stones: "Spiritual Stones",
      medallions: "Medallions",
      dungeons: "Dungeons",
      tokens: "Skulltula Tokens",
    },
    default: "medallions",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "bridge_stones",
    readableName: "Bridge Stones",
    description:
      "Set the number of Spiritual Stones required for the Rainbow Bridge.",
    low: 0,
    high: 3,
    randomable: true,
    default: 3,
    dependsOn: {
      bridge: ["stones"],
    },
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "bridge_medallions",
    readableName: "Bridge Medallions",
    description:
      "Set the number of medallions required for the Rainbow Bridge.",
    low: 0,
    high: 6,
    randomable: true,
    default: 6,
    dependsOn: {
      bridge: ["medallions"],
    },
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "bridge_rewards",
    readableName: "Bridge Dungeon Rewards",
    description:
      "Set the number of dungeon rewards required for the Rainbow Bridge.",
    low: 0,
    high: 9,
    randomable: true,
    default: 9,
    dependsOn: {
      bridge: ["dungeons"],
    },
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "bridge_tokens",
    readableName: "Bridge Skulltula Tokens",
    description:
      "Set the number of Gold Skulltula Tokens required for the Rainbow Bridge.",
    low: 0,
    high: 100,
    randomable: true,
    default: 40,
    dependsOn: {
      bridge: ["tokens"],
    },
  })
);

OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "trials",
    readableName: "Ganon's Castle Trials",
    description: "Set the number of required trials in Ganon's Castle.",
    low: 0,
    high: 6,
    randomable: true,
    default: 0,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "starting_age",
    readableName: "Starting age",
    description: "Set the age Link will start as.",
    values: {
      child: "Child",
      adult: "Adult",
    },
    default: "child",
  })
);

//------------====================== TRIFORCE HUNT
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "triforce_hunt",
    readableName: "Triforce Hunt",
    description:
      "Gather pieces of the Triforce scattered across the world to complete the game.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "triforce_goal",
    readableName: "Triforce Goal",
    description: "The number of Triforce pieces required to complete the goal.",
    low: 1,
    high: 100,
    randomable: true,
    default: 20,
    dependsOn: {
      triforce_hunt: [true],
    },
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "extra_triforce_percentage",
    readableName: "Triforce available – percentage",
    description:
      "The percentage of the Triforce piece goal to add to the multiworld pool as extras.",
    low: 0,
    high: 100,
    default: 50,
    dependsOn: {
      triforce_hunt: [true],
    },
  })
);

OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "bombchus_in_logic",
    readableName: "Bombchus in logic",
    description:
      "Bombchus are properly considered in logic. The first pack has 20 Bombchus, Kokiri Shop and Bazaar sell refills, and getting them opens up bowling minigame.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "mq_dungeons",
    readableName: "Master Quest Dungeons",
    description:
      "How many dungeons will be replaced by their Master Quest variants. Which dungeons is random.",
    low: 0,
    high: 12,
    randomable: true,
    default: 0,
  })
);

//------------====================== DUNGEON ITEMS
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shuffle_mapcompass",
    readableName: "Map & Compass Shuffle",
    description: "Determine where maps and compasses will be located.",
    values: {
      remove: "Remove",
      startwith: "Start with them",
      vanilla: "Vanilla",
      dungeon: "Within proper dungeon",
      any_dungeon: "Any dungeon",
      overworld: "In the overworld",
      keysanity: "Keysanity – add them to the multiworld pool",
    },
    default: "startwith",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shuffle_smallkeys",
    readableName: "Small Key Shuffle",
    description: "Determine where small keys will be located.",
    values: {
      remove: "Remove",
      vanilla: "Vanilla",
      dungeon: "Within proper dungeon",
      any_dungeon: "Any dungeon",
      overworld: "In the overworld",
      keysanity: "Keysanity – add them to the multiworld pool",
    },
    default: "dungeon",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shuffle_fortresskeys",
    readableName: "Fortress Key Shuffle",
    description: "Determine where fortress keys will be located.",
    values: {
      vanilla: "Vanilla",
      any_dungeon: "Any dungeon",
      overworld: "In the overworld",
      keysanity: "Keysanity – add them to the multiworld pool",
    },
    default: "vanilla",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shuffle_bosskeys",
    readableName: "Boss Key Shuffle",
    description:
      "Deterine where boss keys will be located, excluding Ganon's Castle.",
    values: {
      remove: "Remove",
      vanilla: "Vanilla",
      dungeon: "Within proper dungeon",
      any_dungeon: "Any dungeon",
      overworld: "In the overworld",
      keysanity: "Keysanity – add them to the multiworld pool",
    },
    default: "dungeon",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shuffle_ganon_bosskey",
    readableName: "Ganon's Boss Key Shuffle",
    description:
      "Determine where the boss key for Ganon's Castle will be located.",
    values: {
      remove: "Remove",
      vanilla: "Vanilla",
      dungeon: "Within Ganon's Castle",
      any_dungeon: "Any dungeon",
      overworld: "In the overworld",
      keysanity: "Keysanity – add it to the multiworld pool",
      on_lacs: "On Light Arrow Cutscene",
    },
    default: "remove",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "enhance_map_compass",
    readableName: "Enhanced Map & Compass",
    description:
      "If enabled, the map will identify whether a dungeon is vanilla or Master Quest, and the compass will reveal the dungeon reward.",
    default: false,
  })
);

//------------====================== LIGHT ARROW CUTSCENE
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "lacs_condition",
    readableName: "Light Arrow Cutscene requirement",
    description:
      "Set the requirement for the Light Arrow Cutscene at the Temple of Time.",
    values: {
      vanilla: "Vanilla",
      stones: "Spiritual Stones",
      medallions: "Medallions",
      dungeons: "Dungeons",
      tokens: "Skulltula Tokens",
    },
    default: "vanilla",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "lacs_stones",
    readableName: "LACS Stones",
    description:
      "Set the number of Spiritual Stones required for the Light Arrow Cutscene.",
    low: 0,
    high: 3,
    randomable: true,
    default: 3,
    dependsOn: {
      lacs_condition: ["stones"],
    },
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "lacs_medallions",
    readableName: "LACS Medallions",
    description:
      "Set the number of medallions required for the Light Arrow Cutscene.",
    low: 0,
    high: 6,
    randomable: true,
    default: 6,
    dependsOn: {
      lacs_condition: ["medallions"],
    },
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "lacs_rewards",
    readableName: "LACS Dungeon Rewards",
    description:
      "Set the number of dungeon rewards required for the Light Arrow Cutscene.",
    low: 0,
    high: 9,
    randomable: true,
    default: 9,
    dependsOn: {
      lacs_condition: ["dungeons"],
    },
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "lacs_tokens",
    readableName: "LACS Skulltula Tokens",
    description:
      "Set the number of Gold Skulltula Tokens required for the Light Arrow Cutscene.",
    low: 0,
    high: 100,
    randomable: true,
    default: 40,
    dependsOn: {
      lacs_condition: ["tokens"],
    },
  })
);

//------------====================== ENTRANCE SHUFFLE
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shuffle_interior_entrances",
    readableName: "Entrance shuffle – interiors",
    description:
      'Shuffles interior entrances. "Simple" shuffles houses and Great Fairies; "Full" includes Windmill, Link\'s House, Temple of Time, and Kak potion shop.',
    values: {
      off: "Off",
      simple: "Simple",
      on: "Full",
    },
    default: "off",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_grotto_entrances",
    readableName: "Entrance shuffle – grotto",
    description: "Shuffles grotto and grave entrances.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_dungeon_entrances",
    readableName: "Entrance shuffle – dungeons",
    description:
      "Shuffles dungeon entrances, excluding Ganon's Castle. Opens Deku, Fire and BotW to both ages.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_overworld_entrances",
    readableName: "Entrance shuffle – overworld",
    description: "Shuffles overworld loading zones.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "warp_songs",
    readableName: "Entrance shuffle – warp songs",
    description: "Randomizes warp song destinations.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "decouple_entrances",
    readableName: "Decouple entrances",
    description: "Decouple entrances when shuffling them. Also adds the one-way entrance from Gerudo Valley to Lake Hylia if overworld is shuffled.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "mix_entrance_pools",
    readableName: "Mix entrance pools",
    description: "Shuffles entrances into a mixed pool instead of separate ones.",
    values: {
      off: 'Off',
      indoor: 'Indoor – Keeps overworld entrances separate',
      all: 'All'
    },
    default: "off",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "",
    readableName: "",
    description: "",
    values: {},
    default: "",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "owl_drops",
    readableName: "Owl drops",
    description:
      "Randomizes owl drops from Lake Hylia or Death Mountain Trail as child.",
    default: false,
  })
);

OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shuffle_song_items",
    readableName: "Shuffle Song Items",
    description: "Set where songs can appear.",
    values: {
      song: "Song",
      dungeon: "Dungeon",
      any: "Any",
    },
    default: "song",
  })
);

OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shopsanity",
    readableName: "Shopsanity",
    description: "Randomize shop contents.",
    values: {
      off: "Off",
      fixed_number:
        "User-defined number of shuffled items per shop (configure below)",
      random_number: "Random number of shuffled items per shop",
    },
    default: "off",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "shop_slots",
    readableName: "Shopsanity slots",
    description:
      "Number of items per shop to be shuffled into the multiworld pool.",
    low: 0,
    high: 4,
    randomable: true,
    default: 0,
    dependsOn: {
      shopsanity: ["fixed_number"],
    },
  })
);

OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "tokensanity",
    readableName: "Tokensanity",
    description:
      "Shuffle token rewards from Gold Skulltulas into the multiworld pool.",
    values: {
      off: "Off",
      dungeons: "Dungeon locations",
      overworld: "Overworld locations",
      all: "All of them",
    },
    default: "off",
  })
);

OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shuffle_scrubs",
    readableName: "Scrub Shuffle",
    description: "Shuffle items sold by Business Scrubs, and set the prices.",
    values: {
      off: "Off",
      low: "On, low prices",
      regular: "On, regular prices",
      random_prices: "On, random prices",
    },
    default: "off",
  })
);

OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_cows",
    readableName: "Shuffle Cows",
    description: "Cows give items when Epona's Song is played.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_kokiri_sword",
    readableName: "Shuffle Kokiri Sword",
    description: "Whether the Kokiri Sword is shuffled into the pool.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_ocarinas",
    readableName: "Shuffle Ocarinas",
    description:
      "Whether the Fairy Ocarina and Ocarina of Time are shuffled into the pool.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_weird_egg",
    readableName: "Shuffle Weird Egg",
    description: "Whether Malon's Weird Egg is shuffled into the pool.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_gerudo_card",
    readableName: "Shuffle Gerudo Card",
    description:
      "Whether the Gerudo Membership Card is shuffled into the pool.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_beans",
    readableName: "Shuffle Beans",
    description:
      "Whether the Bean Salesman's bean pack is shuffled into the pool. The Bean Salesman will sell a random item from the pool for 60rs.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_medigoron_carpet_salesman",
    readableName: "Shuffle Medigoron & Carpet Salesman",
    description:
      "Shuffle the items sold by Medigoron and the Carpet Salesman at Hanted Wasteland.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "skip_child_zelda",
    readableName: "Skip Child Zelda",
    description:
      "Start with Zelda's Letter and the item at Zelda's Lullaby. Starting Child Zelda events will be skipped.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "no_escape_sequence",
    readableName: "Skip escape sequence",
    description:
      "Skip the tower collapse sequence between the fights with Ganondorf and Ganon.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "no_guard_stealth",
    readableName: "Skip stealth sequence",
    description: "The crawlspace into Hyrule Castle skips to Zelda.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "no_epona_race",
    readableName: "Skip Epona Race",
    description: "Epona can always be summoned with Epona's Song.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "skip_some_minigame_phases",
    readableName: "Skip some minigame phases",
    description:
      "Dampe Race and Horeseback Archery give both rewards if the second condition is met on the first try.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "complete_mask_quest",
    readableName: "Skip Mask Quest",
    description:
      "All masks are immediately available to borrow from the Happy Mask Shop.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "useful_cutscenes",
    readableName: "Unskip useful cutscenes",
    description:
      "Reenables the Poe cutscene in Forest Temple, Darunia in Fire Temple, and Twinrova introduction. Mostly useful for glitched.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fast_chests",
    readableName: "Fast chests",
    description:
      "All chest animations are short. If disabled, big items will have the long animation to them.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "free_scarecrow",
    readableName: "Quick Pierre",
    description:
      "Pulling out the Ocarina while near a scarecrow spot summons Pierre without playing the song.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fast_bunny_hood",
    readableName: "Fast Bunny Hood",
    description: "Bunny Hood lets you move 1.5× faster, like in Majora's Mask.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "chicken_count",
    readableName: "Anju's Cucco",
    description: "How many Cucco Anju wants for an item in the past.",
    low: 0,
    high: 7,
    randomable: true,
    default: 7,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "correct_chest_sizes",
    readableName: "Big items, big chests",
    description: "Progression items will always be in big chests.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "hints",
    readableName: "Hints",
    description: "Gossip Stones can give hints about item locations.",
    values: {
      none: "None",
      mask: "Mask",
      agony: "Agony",
      always: "Always",
    },
    default: "always",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "misc_hints",
    readableName: "Miscellaneous hints",
    description: "Controls whether the Temple of Time altar gives dungeon prize info and whether Ganondorf hints the Light Arrows.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "hint_dist",
    readableName: "Hint distribution",
    description:
      "Choose the hint distribution to use. Affects the frequency of strong hints, which items are always hinted, etc.",
    values: {
      balanced: "Balanced",
      ddr: "DDR",
      league: "League",
      mw2: "MW2",
      scrubs: "Scrubs",
      strong: "Strong",
      tournament: "Tournament",
      useless: "Useless",
      very_strong: "Very strong",
      async: "Async",
    },
    default: "balanced",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "text_shuffle",
    readableName: "Text shuffle",
    description: "Randomize text in the game for the lulz.",
    values: {
      none: "None",
      except_hints: "Don't randomize hints",
      complete: "Everything",
    },
    default: "none",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "damage_multiplier",
    readableName: "Damage multiplier",
    description: "The amount of damage taken by Link.",
    values: {
      half: "Half as much as usual",
      normal: "Normal",
      double: "Twice as much as usual",
      quadruple: "Four times more than usual",
      ohko: "Daredevil – Link dies from any hit",
    },
    default: "normal",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "no_collectible_hearts",
    readableName: "No heart drops",
    description: "Enemies and objects will not drop heart refills.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "starting_tod",
    readableName: "Starting time",
    description: "What time of day the game starts on.",
    values: {
      default: "Default",
      sunrise: "Sunrise",
      morning: "Morning",
      noon: "Noon",
      afternoon: "Afternoon",
      sunset: "Sunset",
      evening: "Evening",
      midnight: "Midnight",
      witching_hour: "Witching hour",
    },
    default: "default",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "start_with_consumables",
    readableName: "Sticks & Nuts",
    description: "Start with a full complement of Deku Sticks and Nuts.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "start_with_rupees",
    readableName: "Miserly",
    description:
      "Start with a full rupee wallet. New wallets will also be full of rupees.",
    default: false,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "item_pool_values",
    readableName: "Item pool values",
    description: "Change the number of items available in the game.",
    values: {
      plentiful: "Plentiful",
      balanced: "Balanced",
      scarce: "Scarce",
      minimal: "Minimal",
    },
    default: "balanced",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "junk_ice_traps",
    readableName: "Junk ice traps",
    description: "Add ice traps to the item pool.",
    values: {
      off: "Off",
      normal: "Normal",
      on: "On",
      mayhem: "Winter Mayhem",
      onslaught: "Sub-Zero's Onslaught!!",
    },
    default: "normal",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "ice_trap_appearance",
    readableName: "Ice trap appearance",
    description: "Changes the appearance of ice traps as freestanding items.",
    values: {
      major_only: "Major only",
      junk_only: "Junk only",
      anything: "Anything",
    },
    default: "major_only",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "logic_earliest_adult_trade",
    readableName: "Earliest adult trade",
    description: "Earliest item that can appear in the adult trade sequence.",
    values: {
      pocket_egg: "Pocket Egg",
      pocket_cucco: "Pocket Cucco",
      cojiro: "Cojiro",
      odd_mushroom: "Odd Mushroom",
      poachers_saw: "Poacher's Saw",
      broken_sword: "Broken Sword",
      prescription: "Prescription",
      eyeball_frog: "Eyeball Frog",
      eyedrops: "Eyedrops",
      claim_check: "Claim Check",
    },
    default: "prescription",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "logic_latest_adult_trade",
    readableName: "Latest adult trade",
    description: "Latest item that can appear in the adult trade sequence.",
    values: {
      pocket_egg: "Pocket Egg",
      pocket_cucco: "Pocket Cucco",
      cojiro: "Cojiro",
      odd_mushroom: "Odd Mushroom",
      poachers_saw: "Poacher's Saw",
      broken_sword: "Broken Sword",
      prescription: "Prescription",
      eyeball_frog: "Eyeball Frog",
      eyedrops: "Eyedrops",
      claim_check: "Claim Check",
    },
    default: "claim_check",
  })
);
OoTSettings.push(DeathLinkOption);

//------------====================== PERSONALIZATION
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "default_targeting",
    readableName: "Default targeting",
    description: "Preselects the default targeting option.",
    values: {
      hold: "Hold",
      switch: "Switch",
    },
    default: "hold",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "display_dpad",
    readableName: "Display D-pad",
    description:
      "Show D-pad icon on HUD for quick actions (Ocarina, Hover Boots, Iron Boots).",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "correct_model_colors",
    readableName: "Correct model colors",
    description: "Make in-game models match their HUD element colors.",
    default: true,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "background_music",
    readableName: "Music",
    description:
      "Randomize or disable background music. If you are streaming and turning this off to play your own music, please be mindful of licensing.",
    values: {
      normal: "On",
      randomized: "Randomized",
      off: "Off",
    },
    default: "normal",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "fanfares",
    readableName: "Fanfares",
    description: "Randomize or disable item fanfares.",
    values: {
      normal: "On",
      randomized: "Randomized",
      off: "Off",
    },
    default: "normal",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "ocarina_fanfares",
    readableName: "Ocarina fanfares",
    description:
      "Enable Ocarina songs as fanfares. These are longer than usual fanfares.",
    default: true,
    dependsOn: {
      fanfares: ["randomized"],
    },
  })
);

const colorSetPeople = [
  ["Kokiri", "kokiri_green"],
  ["Goron", "goron_red"],
  ["Zora", "zora_blue"],
];
for (const colorDef of colorSetPeople)
  OoTSettings.push(
    Object.seal<ArchipelagoStringSetting>({
      type: SettingType.String,
      name: `${colorDef[0].toLowerCase()}_color`,
      readableName: `${colorDef[0]} color`,
      description: `Set the color of the ${colorDef[0]} people.`,
      values: colorOptionsPeople,
      default: colorDef[1],
    })
  );

const colorSetGauntlets = [
  ["Silver Gauntlets", "silver"],
  ["Golden Gauntlets", "gold"],
];
for (const colorDef of colorSetGauntlets)
  OoTSettings.push(
    Object.seal<ArchipelagoStringSetting>({
      type: SettingType.String,
      name: `${colorDef[0].toLowerCase().replace(/\s/g, "_")}_color`,
      readableName: `${colorDef[0]} color`,
      description: `Set the color of the ${colorDef[0]}.`,
      values: colorOptionsGauntlets,
      default: colorDef[1],
    })
  );

OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "mirror_shield_frame_color",
    readableName: "Mirror Shield color",
    description: "Set the color of the Mirror Shield.",
    values: {
      random_choice: "Random from the list",
      red: "Red",
      green: "Green",
      blue: "Blue",
      yellow: "Yellow",
      cyan: "Cyan",
      magenta: "Magenta",
      orange: "Orange",
      gold: "Gold",
      purple: "Purple",
      pink: "Pink",
      completely_random: "Completely random – may be off the list",
    },
    default: "red",
  })
);

const colorSetNavi = [
  ["default", "white"],
  ["enemy", "yellow"],
  ["NPC", "light_blue"],
  ["prop", "green"],
];
for (const colorDef of colorSetNavi)
  for (const colorLoc of ["inner", "outer"])
    OoTSettings.push(
      Object.seal<ArchipelagoStringSetting>({
        type: SettingType.String,
        name: `navi_color_${colorDef[0].toLowerCase()}_${colorLoc}`,
        readableName: `Navi's ${colorLoc} ${colorDef[0]} color`,
        description: `Set Navi's ${colorLoc} ${colorDef[0]} color.`,
        values:
          colorLoc === "inner" ? colorOptionsNaviInner : colorOptionsNaviOuter,
        default: colorLoc === "inner" ? colorDef[1] : "match_inner",
      })
    );

OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "sword_trail_duration",
    readableName: "Sword trail duration",
    description: "Set the duration for sword trails.",
    low: 4,
    high: 20,
    randomable: true,
    default: 4,
  })
);

const colorSetTrails = [
  ["Sword", "white"],
  ["Bombchu", "red"],
  ["Boomerang", "yellow"],
];
for (const colorDef of colorSetTrails)
  for (const colorLoc of ["inner", "outer"])
    OoTSettings.push(
      Object.seal<ArchipelagoStringSetting>({
        type: SettingType.String,
        name: `${colorDef[0].toLowerCase()}_trail_color_${colorLoc}`,
        readableName: `${colorDef[0]}'s ${colorLoc} trail color`,
        description: `Set the ${colorLoc} trail color for the ${colorDef[0]}.`,
        values:
          colorLoc === "inner"
            ? colorOptionsTrailsInner
            : colorOptionsTrailsOuter,
        default: colorLoc === "inner" ? colorDef[1] : "match_inner",
      })
    );

OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "heart_color",
    readableName: "Heart color",
    description: "Set the color for hearts.",
    values: {
      random_choice: "Random from the list",
      red: "Red",
      green: "Green",
      blue: "Blue",
      yellow: "Yellow",
      completely_random: "Completely random – may be off the list",
    },
    default: "red",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "magic_color",
    readableName: "Magic color",
    description: "Set the color for magic.",
    values: {
      random_choice: "Random from the list",
      green: "Green",
      red: "Red",
      blue: "Blue",
      purple: "Purple",
      pink: "Pink",
      yellow: "Yellow",
      white: "White",
      completely_random: "Completely random – may be off the list",
    },
    default: "red",
  })
);

const colorSetButtons = [
  ["A", "n64_blue"],
  ["B", "n64_green"],
  ["C", "yellow"],
  ["Start", "n64_red"],
];
for (const colorDef of colorSetButtons)
  OoTSettings.push(
    Object.seal<ArchipelagoStringSetting>({
      type: SettingType.String,
      name: `${colorDef[0].toLowerCase()}_button_color`,
      readableName: `${colorDef[0]} button color`,
      description: `Set the color of the ${colorDef[0]} button.`,
      values: colorOptionsButtons,
      default: colorDef[1],
    })
  );

const sfxSetNavi = ["Navi overworld", "Navi enemy"];
for (const sfxDef of sfxSetNavi)
  OoTSettings.push(
    Object.seal<ArchipelagoStringSetting>({
      type: SettingType.String,
      name: `sfx_${sfxDef.toLowerCase().replace(/\s/g, "_")}`,
      readableName: `${sfxDef} SFX`,
      description: `Set the SFX for "${sfxDef}".`,
      values: sfxOptionsNavi,
      default: "default",
    })
  );

OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: `sfx_low_hp`,
    readableName: `Low HP SFX`,
    description: `Set the SFX for "Low HP".`,
    values: sfxOptionsLowHP,
    default: "default",
  })
);

const sfxSetMenu = ["cursor", "select"];
for (const sfxDef of sfxSetMenu)
  OoTSettings.push(
    Object.seal<ArchipelagoStringSetting>({
      type: SettingType.String,
      name: `sfx_menu_${sfxDef.toLowerCase()}`,
      readableName: `Menu ${sfxDef} SFX`,
      description: `Set the SFX for "Menu ${sfxDef}".`,
      values: sfxOptionsMenu,
      default: "default",
    })
  );

OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: `sfx_nightfall`,
    readableName: `Nightfall SFX`,
    description: `Set the SFX for "Nightfall".`,
    values: {
      none: "None",
      default: "Default",
      random_choice: "Random from the list",
      random_ear_safe: "Random ear-safe sound",
      cockadoodledoo: "Cucco crowing",
      gold_skull_token: "Gold Skull Token",
      great_fairy: "Great Fairy",
      moo: "Moo",
      mweep: "Mweep",
      redead_moan: "ReDead moan",
      talon_snore: "Talon snore",
      thunder: "Thunder",
      completely_random: "Completely random – may be off the list",
    },
    default: "default",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: `sfx_horse_neigh`,
    readableName: `Horse Neigh SFX`,
    description: `Set the SFX for "Horse Neigh".`,
    values: {
      none: "None",
      default: "Default",
      random_choice: "Random from the list",
      random_ear_safe: "Random ear-safe sound",
      armos: "Armos",
      child_scream: "Child scream",
      great_fairy: "Great Fairy",
      moo: "Moo",
      mweep: "Mweep",
      redead_scream: "ReDead scream",
      ruto_wiggle: "Ruto wiggle",
      stalchild_attack: "Stalchild attack",
      adult_zelda_gasp: "Adult Zelda gasping",
      completely_random: "Completely random – may be off the list",
    },
    default: "default",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: `sfx_hover_boots`,
    readableName: `Hover Boots SFX`,
    description: `Set the SFX for "Hover Boots".`,
    values: {
      none: "None",
      default: "Default",
      random_choice: "Random from the list",
      random_ear_safe: "Random ear-safe sound",
      bark: "Bark",
      cartoon_fall: "Cartoon fall",
      flare_dancer_laugh: "Flare dancer laugh",
      mweep: "Mweep",
      shabom_pop: "Shabom pop",
      tambourine: "Tambourine",
      completely_random: "Completely random – may be off the list",
    },
    default: "default",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: `sfx_ocarina`,
    readableName: `Ocarina SFX`,
    description: `Set the SFX for "Ocarina".`,
    values: {
      ocarina: "Ocarina",
      malon: "Malon",
      whistle: "Whistle",
      harp: "Harp",
      grind_organ: "Grind organ",
      flute: "Flute",
    },
    default: "ocarina",
  })
);

export default OoTSettings;

// NOTE: this list does not include dungeon items; their locations can be determined by existing options
// If people want/need to be more granular, they can edit the YAML manually

/*
pocket_egg: "Pocket Egg",
pocket_cucco: "Pocket Cucco",
cojiro: "Cojiro",
odd_mushroom: "Odd Mushroom",
poachers_saw: "Poacher's Saw",
broken_sword: "Broken Sword",
prescription: "Prescription",
eyeball_frog: "Eyeball Frog",
eyedrops: "Eyedrops",
claim_check: "Claim Check",
*/

const OoTItems: ArchipelagoItem[] = [
  { name: "Boomerang" },
  { name: "Lens of Truth" },
  { name: "Megaton Hammer" },
  { name: "Rutos Letter", readableName: "Ruto's Letter" },
  { name: "Magic Bean" },
  { name: "Skull Mask" },
  { name: "Spooky Mask" },
  { name: "Keaton Mask" },
  { name: "Bunny Hood" },
  { name: "Mask of Truth" },
  { name: "Goron Mask" },
  { name: "Zora Mask" },
  { name: "Gerudo Mask" },
  { name: "Pocket Egg" },
  { name: "Pocket Cucco" },
  { name: "Cojiro" },
  { name: "Odd Mushroom" },
  { name: "Odd Potion", readableName: "Odd Poultice" },
  { name: "Poachers Saw", readableName: "Poacher's Saw" },
  { name: "Giants Knife", readableName: "Giant's Knife" },
  { name: "Broken Sword" },
  { name: "Prescription" },
  { name: "Eyeball Frog" },
  { name: "Eyedrops", readableName: "World's Finest Eye Drops" },
  { name: "Claim Check" },
  { name: "Kokiri Sword" },
  { name: "Biggoron Sword" },
  { name: "Deku Shield" },
  { name: "Hylian Shield" },
  { name: "Mirror Shield" },
  { name: "Goron Tunic" },
  { name: "Zora Tunic" },
  { name: "Iron Boots" },
  { name: "Hover Boots" },
  { name: "Stone of Agony" },
  { name: "Gerudo Membership Card" },
  { name: "Heart Container" },
  { name: "Heart Container (Boss)", readableName: "Boss Heart Container" },
  { name: "Piece of Heart" },
  { name: "Piece of Heart (Treasure Chest Game)" },
  { name: "Recovery Heart" },
  { name: "Weird Egg" },
  { name: "Milk" },
  { name: "Fire Arrows" },
  { name: "Ice Arrows" },
  { name: "Light Arrows" },
  { name: "Gold Skulltula Token" },
  { name: "Dins Fire", readableName: "Din's Fire" },
  { name: "Nayrus Love", readableName: "Nayru's Love" },
  { name: "Farores Wind", readableName: "Farore's Wind" },
  { name: "Arrows (5)" },
  { name: "Arrows (10)" },
  { name: "Arrows (30)" },
  { name: "Rupee (1)" },
  { name: "Rupees (5)" },
  { name: "Rupees (20)" },
  { name: "Rupees (50)" },
  { name: "Rupees (200)" },
  { name: "Rupee (Treasure Chest Game)" },
  { name: "Deku Stick (1)" },
  { name: "Deku Nuts (5)" },
  { name: "Deku Nuts (10)" },
  { name: "Deku Seeds (30)" },
  { name: "Bombs (5)" },
  { name: "Bombs (10)" },
  { name: "Bombs (20)" },
  { name: "Bombchus (5)" },
  { name: "Bombchus (10)" },
  { name: "Bombchus (20)" },
  { name: "Ice Trap" },
  { name: "Progressive Hookshot" },
  { name: "Progressive Strength Upgrade" },
  { name: "Bomb Bag" },
  { name: "Bow" },
  { name: "Slingshot" },
  { name: "Progressive Wallet" },
  { name: "Progressive Scale" },
  { name: "Deku Nut Capacity" },
  { name: "Deku Stick Capacity" },
  { name: "Bombchus" },
  { name: "Magic Mirror" },
  { name: "Ocarina" },
  { name: "Bottle" },
  ...[
    "Milk",
    "Red Potion",
    "Green Potion",
    "Blue Potion",
    "Fairy",
    "Fish",
    "Blue Fire",
    "Bugs",
    "Big Poe",
    "Poe",
  ].map((i) => ({ name: `Bottle with ${i}` } as ArchipelagoItem)),
  { name: "Double Defense" },
  { name: "Magic Bean Pack" },
  { name: "Triforce Piece", dependsOn: { triforce_hunt: [true] } },
  {
    name: "Zeldas Letter",
    readableName: "Zelda's Letter",
    dependsOn: { skip_child_zelda: [false] },
  },
  // Songs
  { name: "Minuet of Forest" },
  { name: "Bolero of Fire" },
  { name: "Serenade of Water" },
  { name: "Requiem of Spirit" },
  { name: "Nocturne of Shadow" },
  { name: "Prelude of Light" },
  { name: "Zeldas Lullaby", readableName: "Zelda's Lullaby" },
  { name: "Eponas Song", readableName: "Epona's Song" },
  { name: "Sarias Song", readableName: "Saria's Song" },
  { name: "Suns Song", readableName: "Sun's Song" },
  { name: "Song of Time" },
  { name: "Song of Storms" },
];

const OoTLocations: ArchipelagoLocation[] = [
  { name: "Song from Impa" },
  { name: "Song from Malon" },
  { name: "Song from Saria" },
  { name: "Song from Composers Grave" },
  { name: "Song from Ocarina of Time" },
  { name: "Song from Windmill" },
  { name: "Sheik in Forest" },
  { name: "Sheik in Crater" },
  { name: "Sheik in Ice Cavern" },
  { name: "Sheik at Colossus" },
  { name: "Sheik in Kakariko" },
  { name: "Sheik at Temple" },
  { name: "KF Midos Top Left Chest" },
  { name: "KF Midos Top Right Chest" },
  { name: "KF Midos Bottom Left Chest" },
  { name: "KF Midos Bottom Right Chest" },
  { name: "KF Kokiri Sword Chest" },
  { name: "KF Storms Grotto Chest" },
  { name: "KF Links House Cow" },
  { name: "KF GS Know It All House" },
  { name: "KF GS Bean Patch" },
  { name: "KF GS House of Twins" },
  { name: "KF Shop Item 1" },
  { name: "KF Shop Item 2" },
  { name: "KF Shop Item 3" },
  { name: "KF Shop Item 4" },
  { name: "KF Shop Item 5" },
  { name: "KF Shop Item 6" },
  { name: "KF Shop Item 7" },
  { name: "KF Shop Item 8" },
  { name: "LW Gift from Saria" },
  { name: "LW Ocarina Memory Game" },
  { name: "LW Target in Woods" },
  { name: "LW Near Shortcuts Grotto Chest" },
  { name: "Deku Theater Skull Mask" },
  { name: "Deku Theater Mask of Truth" },
  { name: "LW Skull Kid" },
  { name: "LW Deku Scrub Near Bridge" },
  { name: "LW Deku Scrub Near Deku Theater Left" },
  { name: "LW Deku Scrub Near Deku Theater Right" },
  { name: "LW Deku Scrub Grotto Front" },
  { name: "LW Deku Scrub Grotto Rear" },
  { name: "LW GS Bean Patch Near Bridge" },
  { name: "LW GS Bean Patch Near Theater" },
  { name: "LW GS Above Theater" },
  { name: "SFM Wolfos Grotto Chest" },
  { name: "SFM Deku Scrub Grotto Front" },
  { name: "SFM Deku Scrub Grotto Rear" },
  { name: "SFM GS" },
  { name: "HF Ocarina of Time Item" },
  { name: "HF Near Market Grotto Chest" },
  { name: "HF Tektite Grotto Freestanding PoH" },
  { name: "HF Southeast Grotto Chest" },
  { name: "HF Open Grotto Chest" },
  { name: "HF Deku Scrub Grotto" },
  { name: "HF Cow Grotto Cow" },
  { name: "HF GS Cow Grotto" },
  { name: "HF GS Near Kak Grotto" },
  { name: "Market Shooting Gallery Reward" },
  { name: "Market Bombchu Bowling First Prize" },
  { name: "Market Bombchu Bowling Second Prize" },
  { name: "Market Lost Dog" },
  { name: "Market Treasure Chest Game Reward" },
  { name: "Market 10 Big Poes" },
  { name: "Market GS Guard House" },
  { name: "Market Bazaar Item 1" },
  { name: "Market Bazaar Item 2" },
  { name: "Market Bazaar Item 3" },
  { name: "Market Bazaar Item 4" },
  { name: "Market Bazaar Item 5" },
  { name: "Market Bazaar Item 6" },
  { name: "Market Bazaar Item 7" },
  { name: "Market Bazaar Item 8" },
  { name: "Market Potion Shop Item 1" },
  { name: "Market Potion Shop Item 2" },
  { name: "Market Potion Shop Item 3" },
  { name: "Market Potion Shop Item 4" },
  { name: "Market Potion Shop Item 5" },
  { name: "Market Potion Shop Item 6" },
  { name: "Market Potion Shop Item 7" },
  { name: "Market Potion Shop Item 8" },
  { name: "Market Bombchu Shop Item 1" },
  { name: "Market Bombchu Shop Item 2" },
  { name: "Market Bombchu Shop Item 3" },
  { name: "Market Bombchu Shop Item 4" },
  { name: "Market Bombchu Shop Item 5" },
  { name: "Market Bombchu Shop Item 6" },
  { name: "Market Bombchu Shop Item 7" },
  { name: "Market Bombchu Shop Item 8" },
  { name: "ToT Light Arrows Cutscene" },
  { name: "HC Malon Egg" },
  { name: "HC Zeldas Letter" },
  { name: "HC Great Fairy Reward" },
  { name: "HC GS Tree" },
  { name: "HC GS Storms Grotto" },
  { name: "LLR Talons Chickens" },
  { name: "LLR Freestanding PoH" },
  { name: "LLR Deku Scrub Grotto Left" },
  { name: "LLR Deku Scrub Grotto Center" },
  { name: "LLR Deku Scrub Grotto Right" },
  { name: "LLR Stables Left Cow" },
  { name: "LLR Stables Right Cow" },
  { name: "LLR Tower Left Cow" },
  { name: "LLR Tower Right Cow" },
  { name: "LLR GS House Window" },
  { name: "LLR GS Tree" },
  { name: "LLR GS Rain Shed" },
  { name: "LLR GS Back Wall" },
  { name: "Kak Anju as Child" },
  { name: "Kak Anju as Adult" },
  { name: "Kak Impas House Freestanding PoH" },
  { name: "Kak Windmill Freestanding PoH" },
  { name: "Kak Man on Roof" },
  { name: "Kak Open Grotto Chest" },
  { name: "Kak Redead Grotto Chest" },
  { name: "Kak Shooting Gallery Reward" },
  { name: "Kak 10 Gold Skulltula Reward" },
  { name: "Kak 20 Gold Skulltula Reward" },
  { name: "Kak 30 Gold Skulltula Reward" },
  { name: "Kak 40 Gold Skulltula Reward" },
  { name: "Kak 50 Gold Skulltula Reward" },
  { name: "Kak Impas House Cow" },
  { name: "Kak GS Tree" },
  { name: "Kak GS Guards House" },
  { name: "Kak GS Watchtower" },
  { name: "Kak GS Skulltula House" },
  { name: "Kak GS House Under Construction" },
  { name: "Kak GS Above Impas House" },
  { name: "Kak Bazaar Item 1" },
  { name: "Kak Bazaar Item 2" },
  { name: "Kak Bazaar Item 3" },
  { name: "Kak Bazaar Item 4" },
  { name: "Kak Bazaar Item 5" },
  { name: "Kak Bazaar Item 6" },
  { name: "Kak Bazaar Item 7" },
  { name: "Kak Bazaar Item 8" },
  { name: "Kak Potion Shop Item 1" },
  { name: "Kak Potion Shop Item 2" },
  { name: "Kak Potion Shop Item 3" },
  { name: "Kak Potion Shop Item 4" },
  { name: "Kak Potion Shop Item 5" },
  { name: "Kak Potion Shop Item 6" },
  { name: "Kak Potion Shop Item 7" },
  { name: "Kak Potion Shop Item 8" },
  { name: "Graveyard Shield Grave Chest" },
  { name: "Graveyard Heart Piece Grave Chest" },
  { name: "Graveyard Composers Grave Chest" },
  { name: "Graveyard Freestanding PoH" },
  { name: "Graveyard Dampe Gravedigging Tour" },
  { name: "Graveyard Hookshot Chest" },
  { name: "Graveyard Dampe Race Freestanding PoH" },
  { name: "Graveyard GS Bean Patch" },
  { name: "Graveyard GS Wall" },
  { name: "DMT Freestanding PoH" },
  { name: "DMT Chest" },
  { name: "DMT Storms Grotto Chest" },
  { name: "DMT Great Fairy Reward" },
  { name: "DMT Biggoron" },
  { name: "DMT Cow Grotto Cow" },
  { name: "DMT GS Near Kak" },
  { name: "DMT GS Bean Patch" },
  { name: "DMT GS Above Dodongos Cavern" },
  { name: "DMT GS Falling Rocks Path" },
  { name: "GC Darunias Joy" },
  { name: "GC Pot Freestanding PoH" },
  { name: "GC Rolling Goron as Child" },
  { name: "GC Rolling Goron as Adult" },
  { name: "GC Medigoron" },
  { name: "GC Maze Left Chest" },
  { name: "GC Maze Right Chest" },
  { name: "GC Maze Center Chest" },
  { name: "GC Deku Scrub Grotto Left" },
  { name: "GC Deku Scrub Grotto Center" },
  { name: "GC Deku Scrub Grotto Right" },
  { name: "GC GS Center Platform" },
  { name: "GC GS Boulder Maze" },
  { name: "GC Shop Item 1" },
  { name: "GC Shop Item 2" },
  { name: "GC Shop Item 3" },
  { name: "GC Shop Item 4" },
  { name: "GC Shop Item 5" },
  { name: "GC Shop Item 6" },
  { name: "GC Shop Item 7" },
  { name: "GC Shop Item 8" },
  { name: "DMC Volcano Freestanding PoH" },
  { name: "DMC Wall Freestanding PoH" },
  { name: "DMC Upper Grotto Chest" },
  { name: "DMC Great Fairy Reward" },
  { name: "DMC Deku Scrub" },
  { name: "DMC Deku Scrub Grotto Left" },
  { name: "DMC Deku Scrub Grotto Center" },
  { name: "DMC Deku Scrub Grotto Right" },
  { name: "DMC GS Crate" },
  { name: "DMC GS Bean Patch" },
  { name: "ZR Magic Bean Salesman" },
  { name: "ZR Open Grotto Chest" },
  { name: "ZR Frogs in the Rain" },
  { name: "ZR Frogs Ocarina Game" },
  { name: "ZR Near Open Grotto Freestanding PoH" },
  { name: "ZR Near Domain Freestanding PoH" },
  { name: "ZR Deku Scrub Grotto Front" },
  { name: "ZR Deku Scrub Grotto Rear" },
  { name: "ZR GS Tree" },
  { name: "ZR GS Ladder" },
  { name: "ZR GS Near Raised Grottos" },
  { name: "ZR GS Above Bridge" },
  { name: "ZD Diving Minigame" },
  { name: "ZD Chest" },
  { name: "ZD King Zora Thawed" },
  { name: "ZD GS Frozen Waterfall" },
  { name: "ZD Shop Item 1" },
  { name: "ZD Shop Item 2" },
  { name: "ZD Shop Item 3" },
  { name: "ZD Shop Item 4" },
  { name: "ZD Shop Item 5" },
  { name: "ZD Shop Item 6" },
  { name: "ZD Shop Item 7" },
  { name: "ZD Shop Item 8" },
  { name: "ZF Great Fairy Reward" },
  { name: "ZF Iceberg Freestanding PoH" },
  { name: "ZF Bottom Freestanding PoH" },
  { name: "ZF GS Above the Log" },
  { name: "ZF GS Tree" },
  { name: "ZF GS Hidden Cave" },
  { name: "LH Underwater Item" },
  { name: "LH Child Fishing" },
  { name: "LH Adult Fishing" },
  { name: "LH Lab Dive" },
  { name: "LH Freestanding PoH" },
  { name: "LH Sun" },
  { name: "LH Deku Scrub Grotto Left" },
  { name: "LH Deku Scrub Grotto Center" },
  { name: "LH Deku Scrub Grotto Right" },
  { name: "LH GS Bean Patch" },
  { name: "LH GS Lab Wall" },
  { name: "LH GS Small Island" },
  { name: "LH GS Lab Crate" },
  { name: "LH GS Tree" },
  { name: "GV Crate Freestanding PoH" },
  { name: "GV Waterfall Freestanding PoH" },
  { name: "GV Chest" },
  { name: "GV Deku Scrub Grotto Front" },
  { name: "GV Deku Scrub Grotto Rear" },
  { name: "GV Cow" },
  { name: "GV GS Small Bridge" },
  { name: "GV GS Bean Patch" },
  { name: "GV GS Behind Tent" },
  { name: "GV GS Pillar" },
  { name: "GF North F1 Carpenter" },
  { name: "GF North F2 Carpenter" },
  { name: "GF South F1 Carpenter" },
  { name: "GF South F2 Carpenter" },
  { name: "GF Gerudo Membership Card" },
  { name: "GF Chest" },
  { name: "GF HBA 1000 Points" },
  { name: "GF HBA 1500 Points" },
  { name: "GF GS Top Floor" },
  { name: "GF GS Archery Range" },
  { name: "Wasteland Bombchu Salesman" },
  { name: "Wasteland Chest" },
  { name: "Wasteland GS" },
  { name: "Colossus Great Fairy Reward" },
  { name: "Colossus Freestanding PoH" },
  { name: "Colossus Deku Scrub Grotto Front" },
  { name: "Colossus Deku Scrub Grotto Rear" },
  { name: "Colossus GS Bean Patch" },
  { name: "Colossus GS Tree" },
  { name: "Colossus GS Hill" },
  { name: "OGC Great Fairy Reward" },
  { name: "OGC GS" },
  { name: "Deku Tree Map Chest" },
  { name: "Deku Tree Slingshot Room Side Chest" },
  { name: "Deku Tree Slingshot Chest" },
  { name: "Deku Tree Compass Chest" },
  { name: "Deku Tree Compass Room Side Chest" },
  { name: "Deku Tree Basement Chest" },
  { name: "Deku Tree GS Compass Room" },
  { name: "Deku Tree GS Basement Vines" },
  { name: "Deku Tree GS Basement Gate" },
  { name: "Deku Tree GS Basement Back Room" },
  { name: "Deku Tree MQ Map Chest" },
  { name: "Deku Tree MQ Slingshot Chest" },
  { name: "Deku Tree MQ Slingshot Room Back Chest" },
  { name: "Deku Tree MQ Compass Chest" },
  { name: "Deku Tree MQ Basement Chest" },
  { name: "Deku Tree MQ Before Spinning Log Chest" },
  { name: "Deku Tree MQ After Spinning Log Chest" },
  { name: "Deku Tree MQ Deku Scrub" },
  { name: "Deku Tree MQ GS Lobby" },
  { name: "Deku Tree MQ GS Compass Room" },
  { name: "Deku Tree MQ GS Basement Graves Room" },
  { name: "Deku Tree MQ GS Basement Back Room" },
  { name: "Deku Tree Queen Gohma Heart" },
  { name: "Dodongos Cavern Map Chest" },
  { name: "Dodongos Cavern Compass Chest" },
  { name: "Dodongos Cavern Bomb Flower Platform Chest" },
  { name: "Dodongos Cavern Bomb Bag Chest" },
  { name: "Dodongos Cavern End of Bridge Chest" },
  { name: "Dodongos Cavern Deku Scrub Side Room Near Dodongos" },
  { name: "Dodongos Cavern Deku Scrub Lobby" },
  { name: "Dodongos Cavern Deku Scrub Near Bomb Bag Left" },
  { name: "Dodongos Cavern Deku Scrub Near Bomb Bag Right" },
  { name: "Dodongos Cavern GS Side Room Near Lower Lizalfos" },
  { name: "Dodongos Cavern GS Scarecrow" },
  { name: "Dodongos Cavern GS Alcove Above Stairs" },
  { name: "Dodongos Cavern GS Vines Above Stairs" },
  { name: "Dodongos Cavern GS Back Room" },
  { name: "Dodongos Cavern MQ Map Chest" },
  { name: "Dodongos Cavern MQ Bomb Bag Chest" },
  { name: "Dodongos Cavern MQ Torch Puzzle Room Chest" },
  { name: "Dodongos Cavern MQ Larvae Room Chest" },
  { name: "Dodongos Cavern MQ Compass Chest" },
  { name: "Dodongos Cavern MQ Under Grave Chest" },
  { name: "Dodongos Cavern MQ Deku Scrub Lobby Front" },
  { name: "Dodongos Cavern MQ Deku Scrub Lobby Rear" },
  { name: "Dodongos Cavern MQ Deku Scrub Side Room Near Lower Lizalfos" },
  { name: "Dodongos Cavern MQ Deku Scrub Staircase" },
  { name: "Dodongos Cavern MQ GS Scrub Room" },
  { name: "Dodongos Cavern MQ GS Larvae Room" },
  { name: "Dodongos Cavern MQ GS Lizalfos Room" },
  { name: "Dodongos Cavern MQ GS Song of Time Block Room" },
  { name: "Dodongos Cavern MQ GS Back Area" },
  { name: "Dodongos Cavern Boss Room Chest" },
  { name: "Dodongos Cavern King Dodongo Heart" },
  { name: "Jabu Jabus Belly Boomerang Chest" },
  { name: "Jabu Jabus Belly Map Chest" },
  { name: "Jabu Jabus Belly Compass Chest" },
  { name: "Jabu Jabus Belly Deku Scrub" },
  { name: "Jabu Jabus Belly GS Water Switch Room" },
  { name: "Jabu Jabus Belly GS Lobby Basement Lower" },
  { name: "Jabu Jabus Belly GS Lobby Basement Upper" },
  { name: "Jabu Jabus Belly GS Near Boss" },
  { name: "Jabu Jabus Belly MQ Map Chest" },
  { name: "Jabu Jabus Belly MQ First Room Side Chest" },
  { name: "Jabu Jabus Belly MQ Second Room Lower Chest" },
  { name: "Jabu Jabus Belly MQ Compass Chest" },
  { name: "Jabu Jabus Belly MQ Basement Near Switches Chest" },
  { name: "Jabu Jabus Belly MQ Basement Near Vines Chest" },
  { name: "Jabu Jabus Belly MQ Boomerang Room Small Chest" },
  { name: "Jabu Jabus Belly MQ Boomerang Chest" },
  { name: "Jabu Jabus Belly MQ Falling Like Like Room Chest" },
  { name: "Jabu Jabus Belly MQ Second Room Upper Chest" },
  { name: "Jabu Jabus Belly MQ Near Boss Chest" },
  { name: "Jabu Jabus Belly MQ Cow" },
  { name: "Jabu Jabus Belly MQ GS Boomerang Chest Room" },
  { name: "Jabu Jabus Belly MQ GS Tailpasaran Room" },
  { name: "Jabu Jabus Belly MQ GS Invisible Enemies Room" },
  { name: "Jabu Jabus Belly MQ GS Near Boss" },
  { name: "Jabu Jabus Belly Barinade Heart" },
  { name: "Bottom of the Well Front Left Fake Wall Chest" },
  { name: "Bottom of the Well Front Center Bombable Chest" },
  { name: "Bottom of the Well Back Left Bombable Chest" },
  { name: "Bottom of the Well Underwater Left Chest" },
  { name: "Bottom of the Well Freestanding Key" },
  { name: "Bottom of the Well Compass Chest" },
  { name: "Bottom of the Well Center Skulltula Chest" },
  { name: "Bottom of the Well Right Bottom Fake Wall Chest" },
  { name: "Bottom of the Well Fire Keese Chest" },
  { name: "Bottom of the Well Like Like Chest" },
  { name: "Bottom of the Well Map Chest" },
  { name: "Bottom of the Well Underwater Front Chest" },
  { name: "Bottom of the Well Invisible Chest" },
  { name: "Bottom of the Well Lens of Truth Chest" },
  { name: "Bottom of the Well GS West Inner Room" },
  { name: "Bottom of the Well GS East Inner Room" },
  { name: "Bottom of the Well GS Like Like Cage" },
  { name: "Bottom of the Well MQ Map Chest" },
  { name: "Bottom of the Well MQ East Inner Room Freestanding Key" },
  { name: "Bottom of the Well MQ Compass Chest" },
  { name: "Bottom of the Well MQ Dead Hand Freestanding Key" },
  { name: "Bottom of the Well MQ Lens of Truth Chest" },
  { name: "Bottom of the Well MQ GS Coffin Room" },
  { name: "Bottom of the Well MQ GS West Inner Room" },
  { name: "Bottom of the Well MQ GS Basement" },
  { name: "Forest Temple First Room Chest" },
  { name: "Forest Temple First Stalfos Chest" },
  { name: "Forest Temple Raised Island Courtyard Chest" },
  { name: "Forest Temple Map Chest" },
  { name: "Forest Temple Well Chest" },
  { name: "Forest Temple Eye Switch Chest" },
  { name: "Forest Temple Boss Key Chest" },
  { name: "Forest Temple Floormaster Chest" },
  { name: "Forest Temple Red Poe Chest" },
  { name: "Forest Temple Bow Chest" },
  { name: "Forest Temple Blue Poe Chest" },
  { name: "Forest Temple Falling Ceiling Room Chest" },
  { name: "Forest Temple Basement Chest" },
  { name: "Forest Temple GS First Room" },
  { name: "Forest Temple GS Lobby" },
  { name: "Forest Temple GS Raised Island Courtyard" },
  { name: "Forest Temple GS Level Island Courtyard" },
  { name: "Forest Temple GS Basement" },
  { name: "Forest Temple MQ First Room Chest" },
  { name: "Forest Temple MQ Wolfos Chest" },
  { name: "Forest Temple MQ Well Chest" },
  { name: "Forest Temple MQ Raised Island Courtyard Lower Chest" },
  { name: "Forest Temple MQ Raised Island Courtyard Upper Chest" },
  { name: "Forest Temple MQ Boss Key Chest" },
  { name: "Forest Temple MQ Redead Chest" },
  { name: "Forest Temple MQ Map Chest" },
  { name: "Forest Temple MQ Bow Chest" },
  { name: "Forest Temple MQ Compass Chest" },
  { name: "Forest Temple MQ Falling Ceiling Room Chest" },
  { name: "Forest Temple MQ Basement Chest" },
  { name: "Forest Temple MQ GS First Hallway" },
  { name: "Forest Temple MQ GS Raised Island Courtyard" },
  { name: "Forest Temple MQ GS Level Island Courtyard" },
  { name: "Forest Temple MQ GS Well" },
  { name: "Forest Temple MQ GS Block Push Room" },
  { name: "Forest Temple Phantom Ganon Heart" },
  { name: "Fire Temple Near Boss Chest" },
  { name: "Fire Temple Flare Dancer Chest" },
  { name: "Fire Temple Boss Key Chest" },
  { name: "Fire Temple Big Lava Room Lower Open Door Chest" },
  { name: "Fire Temple Big Lava Room Blocked Door Chest" },
  { name: "Fire Temple Boulder Maze Lower Chest" },
  { name: "Fire Temple Boulder Maze Side Room Chest" },
  { name: "Fire Temple Map Chest" },
  { name: "Fire Temple Boulder Maze Shortcut Chest" },
  { name: "Fire Temple Boulder Maze Upper Chest" },
  { name: "Fire Temple Scarecrow Chest" },
  { name: "Fire Temple Compass Chest" },
  { name: "Fire Temple Megaton Hammer Chest" },
  { name: "Fire Temple Highest Goron Chest" },
  { name: "Fire Temple GS Boss Key Loop" },
  { name: "Fire Temple GS Song of Time Room" },
  { name: "Fire Temple GS Boulder Maze" },
  { name: "Fire Temple GS Scarecrow Climb" },
  { name: "Fire Temple GS Scarecrow Top" },
  { name: "Fire Temple MQ Map Room Side Chest" },
  { name: "Fire Temple MQ Megaton Hammer Chest" },
  { name: "Fire Temple MQ Map Chest" },
  { name: "Fire Temple MQ Near Boss Chest" },
  { name: "Fire Temple MQ Big Lava Room Blocked Door Chest" },
  { name: "Fire Temple MQ Boss Key Chest" },
  { name: "Fire Temple MQ Lizalfos Maze Side Room Chest" },
  { name: "Fire Temple MQ Compass Chest" },
  { name: "Fire Temple MQ Lizalfos Maze Upper Chest" },
  { name: "Fire Temple MQ Lizalfos Maze Lower Chest" },
  { name: "Fire Temple MQ Freestanding Key" },
  { name: "Fire Temple MQ Chest On Fire" },
  { name: "Fire Temple MQ GS Big Lava Room Open Door" },
  { name: "Fire Temple MQ GS Skull On Fire" },
  { name: "Fire Temple MQ GS Fire Wall Maze Center" },
  { name: "Fire Temple MQ GS Fire Wall Maze Side Room" },
  { name: "Fire Temple MQ GS Above Fire Wall Maze" },
  { name: "Fire Temple Volvagia Heart" },
  { name: "Water Temple Compass Chest" },
  { name: "Water Temple Map Chest" },
  { name: "Water Temple Cracked Wall Chest" },
  { name: "Water Temple Torches Chest" },
  { name: "Water Temple Boss Key Chest" },
  { name: "Water Temple Central Pillar Chest" },
  { name: "Water Temple Central Bow Target Chest" },
  { name: "Water Temple Longshot Chest" },
  { name: "Water Temple River Chest" },
  { name: "Water Temple Dragon Chest" },
  { name: "Water Temple GS Behind Gate" },
  { name: "Water Temple GS Near Boss Key Chest" },
  { name: "Water Temple GS Central Pillar" },
  { name: "Water Temple GS Falling Platform Room" },
  { name: "Water Temple GS River" },
  { name: "Water Temple MQ Longshot Chest" },
  { name: "Water Temple MQ Map Chest" },
  { name: "Water Temple MQ Compass Chest" },
  { name: "Water Temple MQ Central Pillar Chest" },
  { name: "Water Temple MQ Boss Key Chest" },
  { name: "Water Temple MQ Freestanding Key" },
  { name: "Water Temple MQ GS Lizalfos Hallway" },
  { name: "Water Temple MQ GS Before Upper Water Switch" },
  { name: "Water Temple MQ GS River" },
  { name: "Water Temple MQ GS Freestanding Key Area" },
  { name: "Water Temple MQ GS Triple Wall Torch" },
  { name: "Water Temple Morpha Heart" },
  { name: "Shadow Temple Map Chest" },
  { name: "Shadow Temple Hover Boots Chest" },
  { name: "Shadow Temple Compass Chest" },
  { name: "Shadow Temple Early Silver Rupee Chest" },
  { name: "Shadow Temple Invisible Blades Visible Chest" },
  { name: "Shadow Temple Invisible Blades Invisible Chest" },
  { name: "Shadow Temple Falling Spikes Lower Chest" },
  { name: "Shadow Temple Falling Spikes Upper Chest" },
  { name: "Shadow Temple Falling Spikes Switch Chest" },
  { name: "Shadow Temple Invisible Spikes Chest" },
  { name: "Shadow Temple Freestanding Key" },
  { name: "Shadow Temple Wind Hint Chest" },
  { name: "Shadow Temple After Wind Enemy Chest" },
  { name: "Shadow Temple After Wind Hidden Chest" },
  { name: "Shadow Temple Spike Walls Left Chest" },
  { name: "Shadow Temple Boss Key Chest" },
  { name: "Shadow Temple Invisible Floormaster Chest" },
  { name: "Shadow Temple GS Like Like Room" },
  { name: "Shadow Temple GS Falling Spikes Room" },
  { name: "Shadow Temple GS Single Giant Pot" },
  { name: "Shadow Temple GS Near Ship" },
  { name: "Shadow Temple GS Triple Giant Pot" },
  { name: "Shadow Temple MQ Early Gibdos Chest" },
  { name: "Shadow Temple MQ Map Chest" },
  { name: "Shadow Temple MQ Near Ship Invisible Chest" },
  { name: "Shadow Temple MQ Compass Chest" },
  { name: "Shadow Temple MQ Hover Boots Chest" },
  { name: "Shadow Temple MQ Invisible Blades Invisible Chest" },
  { name: "Shadow Temple MQ Invisible Blades Visible Chest" },
  { name: "Shadow Temple MQ Beamos Silver Rupees Chest" },
  { name: "Shadow Temple MQ Falling Spikes Lower Chest" },
  { name: "Shadow Temple MQ Falling Spikes Upper Chest" },
  { name: "Shadow Temple MQ Falling Spikes Switch Chest" },
  { name: "Shadow Temple MQ Invisible Spikes Chest" },
  { name: "Shadow Temple MQ Stalfos Room Chest" },
  { name: "Shadow Temple MQ Wind Hint Chest" },
  { name: "Shadow Temple MQ After Wind Hidden Chest" },
  { name: "Shadow Temple MQ After Wind Enemy Chest" },
  { name: "Shadow Temple MQ Boss Key Chest" },
  { name: "Shadow Temple MQ Spike Walls Left Chest" },
  { name: "Shadow Temple MQ Freestanding Key" },
  { name: "Shadow Temple MQ Bomb Flower Chest" },
  { name: "Shadow Temple MQ GS Falling Spikes Room" },
  { name: "Shadow Temple MQ GS Wind Hint Room" },
  { name: "Shadow Temple MQ GS After Wind" },
  { name: "Shadow Temple MQ GS After Ship" },
  { name: "Shadow Temple MQ GS Near Boss" },
  { name: "Shadow Temple Bongo Bongo Heart" },
  { name: "Spirit Temple Child Bridge Chest" },
  { name: "Spirit Temple Child Early Torches Chest" },
  { name: "Spirit Temple Child Climb North Chest" },
  { name: "Spirit Temple Child Climb East Chest" },
  { name: "Spirit Temple Map Chest" },
  { name: "Spirit Temple Sun Block Room Chest" },
  { name: "Spirit Temple MQ Entrance Front Left Chest" },
  { name: "Spirit Temple MQ Entrance Back Right Chest" },
  { name: "Spirit Temple MQ Entrance Front Right Chest" },
  { name: "Spirit Temple MQ Entrance Back Left Chest" },
  { name: "Spirit Temple MQ Map Chest" },
  { name: "Spirit Temple MQ Map Room Enemy Chest" },
  { name: "Spirit Temple MQ Child Climb North Chest" },
  { name: "Spirit Temple MQ Child Climb South Chest" },
  { name: "Spirit Temple MQ Compass Chest" },
  { name: "Spirit Temple MQ Silver Block Hallway Chest" },
  { name: "Spirit Temple MQ Sun Block Room Chest" },
  { name: "Spirit Temple Silver Gauntlets Chest" },
  { name: "Spirit Temple Compass Chest" },
  { name: "Spirit Temple Early Adult Right Chest" },
  { name: "Spirit Temple First Mirror Left Chest" },
  { name: "Spirit Temple First Mirror Right Chest" },
  { name: "Spirit Temple Statue Room Northeast Chest" },
  { name: "Spirit Temple Statue Room Hand Chest" },
  { name: "Spirit Temple Near Four Armos Chest" },
  { name: "Spirit Temple Hallway Right Invisible Chest" },
  { name: "Spirit Temple Hallway Left Invisible Chest" },
  { name: "Spirit Temple MQ Child Hammer Switch Chest" },
  { name: "Spirit Temple MQ Statue Room Lullaby Chest" },
  { name: "Spirit Temple MQ Statue Room Invisible Chest" },
  { name: "Spirit Temple MQ Leever Room Chest" },
  { name: "Spirit Temple MQ Symphony Room Chest" },
  { name: "Spirit Temple MQ Beamos Room Chest" },
  { name: "Spirit Temple MQ Chest Switch Chest" },
  { name: "Spirit Temple MQ Boss Key Chest" },
  { name: "Spirit Temple Mirror Shield Chest" },
  { name: "Spirit Temple Boss Key Chest" },
  { name: "Spirit Temple Topmost Chest" },
  { name: "Spirit Temple MQ Mirror Puzzle Invisible Chest" },
  { name: "Spirit Temple GS Metal Fence" },
  { name: "Spirit Temple GS Sun on Floor Room" },
  { name: "Spirit Temple GS Hall After Sun Block Room" },
  { name: "Spirit Temple GS Lobby" },
  { name: "Spirit Temple GS Boulder Room" },
  { name: "Spirit Temple MQ GS Sun Block Room" },
  { name: "Spirit Temple MQ GS Leever Room" },
  { name: "Spirit Temple MQ GS Symphony Room" },
  { name: "Spirit Temple MQ GS Nine Thrones Room West" },
  { name: "Spirit Temple MQ GS Nine Thrones Room North" },
  { name: "Spirit Temple Twinrova Heart" },
  { name: "Ice Cavern Map Chest" },
  { name: "Ice Cavern Compass Chest" },
  { name: "Ice Cavern Freestanding PoH" },
  { name: "Ice Cavern Iron Boots Chest" },
  { name: "Ice Cavern GS Spinning Scythe Room" },
  { name: "Ice Cavern GS Heart Piece Room" },
  { name: "Ice Cavern GS Push Block Room" },
  { name: "Ice Cavern MQ Map Chest" },
  { name: "Ice Cavern MQ Compass Chest" },
  { name: "Ice Cavern MQ Freestanding PoH" },
  { name: "Ice Cavern MQ Iron Boots Chest" },
  { name: "Ice Cavern MQ GS Red Ice" },
  { name: "Ice Cavern MQ GS Ice Block" },
  { name: "Ice Cavern MQ GS Scarecrow" },
  { name: "Gerudo Training Grounds Lobby Left Chest" },
  { name: "Gerudo Training Grounds Lobby Right Chest" },
  { name: "Gerudo Training Grounds Stalfos Chest" },
  { name: "Gerudo Training Grounds Before Heavy Block Chest" },
  { name: "Gerudo Training Grounds Heavy Block First Chest" },
  { name: "Gerudo Training Grounds Heavy Block Second Chest" },
  { name: "Gerudo Training Grounds Heavy Block Third Chest" },
  { name: "Gerudo Training Grounds Heavy Block Fourth Chest" },
  { name: "Gerudo Training Grounds Eye Statue Chest" },
  { name: "Gerudo Training Grounds Near Scarecrow Chest" },
  { name: "Gerudo Training Grounds Hammer Room Clear Chest" },
  { name: "Gerudo Training Grounds Hammer Room Switch Chest" },
  { name: "Gerudo Training Grounds Freestanding Key" },
  { name: "Gerudo Training Grounds Maze Right Central Chest" },
  { name: "Gerudo Training Grounds Maze Right Side Chest" },
  { name: "Gerudo Training Grounds Underwater Silver Rupee Chest" },
  { name: "Gerudo Training Grounds Beamos Chest" },
  { name: "Gerudo Training Grounds Hidden Ceiling Chest" },
  { name: "Gerudo Training Grounds Maze Path First Chest" },
  { name: "Gerudo Training Grounds Maze Path Second Chest" },
  { name: "Gerudo Training Grounds Maze Path Third Chest" },
  { name: "Gerudo Training Grounds Maze Path Final Chest" },
  { name: "Gerudo Training Grounds MQ Lobby Left Chest" },
  { name: "Gerudo Training Grounds MQ Lobby Right Chest" },
  { name: "Gerudo Training Grounds MQ First Iron Knuckle Chest" },
  { name: "Gerudo Training Grounds MQ Before Heavy Block Chest" },
  { name: "Gerudo Training Grounds MQ Heavy Block Chest" },
  { name: "Gerudo Training Grounds MQ Eye Statue Chest" },
  { name: "Gerudo Training Grounds MQ Ice Arrows Chest" },
  { name: "Gerudo Training Grounds MQ Second Iron Knuckle Chest" },
  { name: "Gerudo Training Grounds MQ Flame Circle Chest" },
  { name: "Gerudo Training Grounds MQ Maze Right Central Chest" },
  { name: "Gerudo Training Grounds MQ Maze Right Side Chest" },
  { name: "Gerudo Training Grounds MQ Underwater Silver Rupee Chest" },
  { name: "Gerudo Training Grounds MQ Dinolfos Chest" },
  { name: "Gerudo Training Grounds MQ Hidden Ceiling Chest" },
  { name: "Gerudo Training Grounds MQ Maze Path First Chest" },
  { name: "Gerudo Training Grounds MQ Maze Path Third Chest" },
  { name: "Gerudo Training Grounds MQ Maze Path Second Chest" },
  { name: "Ganons Castle Forest Trial Chest" },
  { name: "Ganons Castle Water Trial Left Chest" },
  { name: "Ganons Castle Water Trial Right Chest" },
  { name: "Ganons Castle Shadow Trial Front Chest" },
  { name: "Ganons Castle Shadow Trial Golden Gauntlets Chest" },
  { name: "Ganons Castle Light Trial First Left Chest" },
  { name: "Ganons Castle Light Trial Second Left Chest" },
  { name: "Ganons Castle Light Trial Third Left Chest" },
  { name: "Ganons Castle Light Trial First Right Chest" },
  { name: "Ganons Castle Light Trial Second Right Chest" },
  { name: "Ganons Castle Light Trial Third Right Chest" },
  { name: "Ganons Castle Light Trial Invisible Enemies Chest" },
  { name: "Ganons Castle Light Trial Lullaby Chest" },
  { name: "Ganons Castle Spirit Trial Crystal Switch Chest" },
  { name: "Ganons Castle Spirit Trial Invisible Chest" },
  { name: "Ganons Castle Deku Scrub Left" },
  { name: "Ganons Castle Deku Scrub Center-Left" },
  { name: "Ganons Castle Deku Scrub Center-Right" },
  { name: "Ganons Castle Deku Scrub Right" },
  { name: "Ganons Castle MQ Forest Trial Freestanding Key" },
  { name: "Ganons Castle MQ Forest Trial Eye Switch Chest" },
  { name: "Ganons Castle MQ Forest Trial Frozen Eye Switch Chest" },
  { name: "Ganons Castle MQ Water Trial Chest" },
  { name: "Ganons Castle MQ Shadow Trial Bomb Flower Chest" },
  { name: "Ganons Castle MQ Shadow Trial Eye Switch Chest" },
  { name: "Ganons Castle MQ Light Trial Lullaby Chest" },
  { name: "Ganons Castle MQ Spirit Trial First Chest" },
  { name: "Ganons Castle MQ Spirit Trial Invisible Chest" },
  { name: "Ganons Castle MQ Spirit Trial Sun Front Left Chest" },
  { name: "Ganons Castle MQ Spirit Trial Sun Back Left Chest" },
  { name: "Ganons Castle MQ Spirit Trial Sun Back Right Chest" },
  { name: "Ganons Castle MQ Spirit Trial Golden Gauntlets Chest" },
  { name: "Ganons Castle MQ Deku Scrub Left" },
  { name: "Ganons Castle MQ Deku Scrub Center-Left" },
  { name: "Ganons Castle MQ Deku Scrub Center" },
  { name: "Ganons Castle MQ Deku Scrub Center-Right" },
  { name: "Ganons Castle MQ Deku Scrub Right" },
  { name: "Ganons Tower Boss Key Chest" },
]

const OoTCategory: ArchipelagoCategory = {
  category: "Ocarina of Time",
  readableName: "The Legend of Zelda: Ocarina of Time",
  settings: OoTSettings,
  items: OoTItems,
  locations: OoTLocations,
};

export { OoTCategory };

//------------======================

/*
OoTSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "",
    readableName: "",
    description: "",
    low: 0,
    high: 0,
    default: 0,
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "",
    readableName: "",
    description: "",
    values: {},
    default: "",
  })
);
OoTSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "",
    readableName: "",
    description: "",
    default: true,
  })
);
*/
