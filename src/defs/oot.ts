import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
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
      "How many dungeons will be replaced by their Master Quest variants. Which dungeons are random.",
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

const OoTCategory: ArchipelagoCategory = {
  category: "Ocarina of Time",
  readableName: "The Legend of Zelda: Ocarina of Time",
  settings: OoTSettings,
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
