import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
  ArchipelagoItem,
  ArchipelagoLocation,
} from "./core";

const SMSettings: ArchipelagoSettingBase[] = [];

SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "start_inventory_removes_from_pool",
    readableName: "Start Inventory removes from pool",
    description: "Removes starting inventory from the multiworld pool.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "preset",
    readableName: "Preset",
    description:
      "The preset is used by the Randomizer to know which techniques are available to reach the items locations.",
    values: {
      newbie:
        "Newbie – New to randomizers, but completed Super Metroid 100% and knows basic techniques (Wall Jump, Shinespark, Mid-air Morph)",
      casual:
        "Casual – Occasional rando player. No hell runs or suitless Maridia, some easy to learn tricks in logic.",
      regular:
        "Regular – Plays rando regularly. Knows tricks that are not too hard and open up the game.",
      veteran:
        "Veteran – Experienced rando player. Harder everything, some tougher tricks in logic.",
      expert:
        "Expert – Knows almost all tricks: full suitless Maridia, Lower Norfair hell runs, hi-jumpless Lava Dive (mania difficulty only)",
      master: "Master – Everything on hardest, all tricks known.",
      samus: "Samus",
      season_races: "Season races",
      smrat2021:
        "SMRAT 2021 – Settings used for Super Metroid Randomizer Accessible Tournament 2021",
      solution: "Solution",
      // TODO: implement custom presets
      //custom: "Custom",
      //varia_custom: "Varia Custom",
    },
    default: "regular",
  })
);
SMSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "start_location",
    readableName: "Starting location",
    description: "Where Samus will begin the game.",
    values: {
      ceres: "Ceres Station (vanilla)",
      landing_site: "Samus' jumpship (Zebes start)",
      gauntlet_top: "Top of the Gauntlet",
      green_brinstar_elevator: "Green Brinstar elevator",
      big_pink: "Big Pink",
      etecoons_supers: "Etecoon's Supers",
      wrecked_ship_main: "Wrecked Ship Main",
      firefleas_top: "Top of Firefleas",
      business_center: "Business Center",
      bubble_mountain: "Bubble Mountain",
      mama_turtle: "Mama Turtle",
      watering_hole: "Watering Hole",
      aqueduct: "Aqueduct",
      red_brinstar_elevator: "Red Brinstar elevator",
      golden_four: "Golden Four",
    },
    default: "landing_site",
  })
);
SMSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "death_link",
    readableName: "DeathLink",
    description: "If one DeathLinked player dies, all of them do.",
    values: {
      disable: "Off",
      enable: "On",
      enable_survive:
        "Reserve save – If you have any energy in Reserve Tanks, you will survive.",
    },
    default: "disable",
  })
);
SMSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "max_difficulty",
    readableName: "Maximum difficulty",
    description:
      "Depending on the perceived difficulties of the techniques, bosses, hell runs etc. from the preset, it will prevent the Randomizer from placing an item in a location too difficult to reach with the current items.",
    values: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      harder: "Harder",
      hardcore: "Hardcore",
      mania: "Mania",
      infinity: "∞",
    },
    default: "hardcore",
  })
);
SMSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "morph_placement",
    readableName: "Morph Ball placement",
    description: "Influences where the randomizer will place Morphing Ball.",
    values: {
      early: "Early Morph Ball",
      normal: "Anytime",
    },
    default: "early",
  })
);
// SMSettings.push(
//   Object.seal<ArchipelagoBooleanSetting>({
//     type: SettingType.Boolean,
//     name: "suits_restriction",
//     readableName: "Suits restriction",
//     description:
//       "Prevent Gravity or Varia suits to be placed early in the game (Crateria/Blue Brinstar). Using a non-standard start location will force this setting off.",
//     default: true,
//     dependsOn: {
//       start_location: ["ceres", "landing_site"],
//     },
//   })
// );
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "strict_minors",
    readableName: "Strict Minors distribution",
    description:
      "Instead of using the Minors proportions as probabilities, enforce a strict distribution to match the proportions as exactly as possible.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "missile_qty",
    readableName: "Missiles weight",
    description:
      "For each minor types, the higher the number the higher the probability of choosing it when placing a minor.",
    randomable: true,
    low: 10,
    high: 90,
    default: 30,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "super_qty",
    readableName: "Super Missiles weight",
    description:
      "For each minor types, the higher the number the higher the probability of choosing it when placing a minor.",
    randomable: true,
    low: 10,
    high: 90,
    default: 20,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "power_bomb_qty",
    readableName: "Power Bombs weight",
    description:
      "For each minor types, the higher the number the higher the probability of choosing it when placing a minor.",
    randomable: true,
    low: 10,
    high: 90,
    default: 10,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "minor_qty",
    readableName: "Percentage of minors available",
    description:
      "From 7%: minimum number of minors required to finish the game to 100%: all minors locations contain a minor (vanilla like).",
    randomable: true,
    low: 7,
    high: 100,
    default: 100,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "energy_qty",
    readableName: "Energy/Reserve Tanks",
    description: "Choose how many Energy/Reserve Tanks will be available.",
    values: {
      ultra_sparse:
        "Ultra Sparse – 0-1 tanks; Mother Brain's Rainbow Beam only does 20 damage instead of 300",
      sparse: "Sparse – 4-6 tanks",
      medium: "Medium – 8-12 tanks",
      vanilla: "Vanilla",
    },
    default: "vanilla",
  })
);
SMSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "area_randomization",
    readableName: "Areas Randomizer",
    description:
      "Randomize areas together using bidirectional access portals. Check the VARIA website for the full list of what this entails. Use caution, as this can cause softlocks.",
    values: {
      off: "Off",
      light:
        "Light – Keep the same number of transitions between areas as in vanilla",
      on: "Full",
    },
    default: "off",
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "area_layout",
    readableName: "Additional layout patches for easier navigation",
    description:
      "Some layout tweaks to make your life easier in Areas Randomizer.",
    default: false,
    dependsOn: {
      area_randomization: ["light", "on"],
    },
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "doors_colors_rando",
    readableName: "Door color rando",
    description:
      "Randomizes the colors of red, green, and yellow doors. Also adds four new type of doors which require Ice/Wave/Spazer/Plasma beams to open them.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "allow_grey_doors",
    readableName: "Allow grey doors",
    description: "Generates grey doors, which are permanently locked.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "boss_randomization",
    readableName: "Bosses Randomization",
    description:
      "Randomize Golden 4 bosses access doors (Kraid, Phantoon, Draygon, Ridley) using bidirectional access portals (the same access portals as in Areas randomization).",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fun_combat",
    readableName: "Super Fun Combat",
    description:
      "Forces removal of Plasma Beam and Screw Attack, if the preset and settings allow it. In addition, can randomly remove Spazer and Wave from the Combat set.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fun_movement",
    readableName: "Super Fun Movement",
    description:
      "Forces removal of Space Jump if the preset allows it. In addition, can randomly remove Hi Jump, Grapple, Spring, Speed, and/or Bombs from the Movement set.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fun_suits",
    readableName: "Suitless",
    description:
      "If the preset and seed layout allow it, will force removal of at least one suit upgrade.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "layout_patches",
    readableName: "Anti-softlock layout patches",
    description:
      "Include the anti-softlock layout patches. Disable at your own softlocking risk! Using a non-standard start location will force this setting on.",
    default: true,
    dependsOn: {
      area_randomization: ["light", "on"],
    },
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "varia_tweaks",
    readableName: "VARIA Tweaks",
    description:
      "Include minor tweaks for the game to behave 'as it should' in a randomizer context. Using a non-standard start location will force this setting on.",
    default: false,
    dependsOn: {
      area_randomization: ["light", "on"],
    },
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "nerfed_charge",
    readableName: "Start with Nerfed Charge Beam",
    description:
      "Samus begins with a starter Charge Beam that works at ⅓ capacity. Once the Charge Beam item has been collected, it does full damage and special attacks are back to normal.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "gravity_behaviour",
    readableName: "Suits Properties",
    description: "Modifies the properties of the Varia and Gravity suits.",
    values: {
      balanced:
        "Balanced – Removes Gravity environmental protection, doubles Varia's",
      progressive:
        "Progressive – Gravity has 50% heat protection, each suit gives 50% more enemy/environment protection",
      vanilla: "Vanilla",
    },
    default: "balanced",
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "elevators_doors_speed",
    readableName: "Accelerate doors and elevators transitions",
    description: "Accelerate doors and elevators transitions.",
    default: true,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "spin_jump_restart",
    readableName: "Respin",
    description:
      "Allows Samus to start spinning in mid air after jumping or falling.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "infinite_space_jump",
    readableName: "Infinite Space Jump",
    description:
      "Space jumps can be done quicker and at any time in air, water or lava, even after falling long distances.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "refill_before_save",
    readableName: "Refill before save",
    description: "Refill energy and ammo when saving.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "hud",
    readableName: "VARIA HUD",
    description:
      "Displays the current area name and the number of remaining items of selected item split in the HUD for the current area.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "animals",
    readableName: "Save the Animals Surprise",
    description:
      "Replace saving the animals in the escape sequence by a random surprise.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "no_music",
    readableName: "Disable music",
    description:
      "Whether to disable music. If disabled, this also turns off MSU-1 patches. If you're streaming and turning this off to play your own music, please be mindful of licensing.",
    default: false,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "random_music",
    readableName: "Random music",
    description: "Randomize the background music.",
    default: false,
  })
);

// TODO: custom_preset, varia_custom_preset
// https://randommetroidsolver.pythonanywhere.com/presets

export default SMSettings;

const SMItems: ArchipelagoItem[] = [
  { name: "Energy Tank", max: 14 },
  { name: "Reserve Tank", max: 4 },
  { name: "Missile", max: 50 },
  { name: "Super Missile", max: 30 },
  { name: "Power Bomb", max: 20 },
  { name: "Bomb" },
  { name: "Charge Beam" },
  { name: "Ice Beam" },
  { name: "Hi-Jump Boots" },
  { name: "Speed Booster" },
  { name: "Wave Beam" },
  { name: "Spazer" },
  { name: "Spring Ball" },
  { name: "Plasma Beam" },
  { name: "Varia Suit" },
  { name: "Gravity Suit" },
  { name: "Grappling Beam" },
  { name: "Morph Ball" },
  { name: "X-Ray Scope" },
  { name: "Space Jump" },
  { name: "Screw Attack" },
  { name: "Nothing", max: 0 },
  { name: "No Energy", max: 0 },
];

const SMLocations: ArchipelagoLocation[] = [
  { name: "Power Bomb (Crateria surface)" },
  { name: "Missile (outside Wrecked Ship bottom)" },
  { name: "Missile (outside Wrecked Ship top)" },
  { name: "Missile (outside Wrecked Ship middle)" },
  { name: "Missile (Crateria moat)" },
  { name: "Energy Tank, Gauntlet" },
  { name: "Missile (Crateria bottom)" },
  { name: "Bomb" },
  { name: "Energy Tank, Terminator" },
  { name: "Missile (Crateria gauntlet right)" },
  { name: "Missile (Crateria gauntlet left)" },
  { name: "Super Missile (Crateria)" },
  { name: "Missile (Crateria middle)" },
  { name: "Power Bomb (green Brinstar bottom)" },
  { name: "Super Missile (pink Brinstar)" },
  { name: "Missile (green Brinstar below super missile)" },
  { name: "Super Missile (green Brinstar top)" },
  { name: "Reserve Tank, Brinstar" },
  { name: "Missile (green Brinstar behind missile)" },
  { name: "Missile (green Brinstar behind reserve tank)" },
  { name: "Missile (pink Brinstar top)" },
  { name: "Missile (pink Brinstar bottom)" },
  { name: "Charge Beam" },
  { name: "Power Bomb (pink Brinstar)" },
  { name: "Missile (green Brinstar pipe)" },
  { name: "Morphing Ball" },
  { name: "Power Bomb (blue Brinstar)" },
  { name: "Missile (blue Brinstar middle)" },
  { name: "Energy Tank, Brinstar Ceiling" },
  { name: "Energy Tank, Etecoons" },
  { name: "Super Missile (green Brinstar bottom)" },
  { name: "Energy Tank, Waterway" },
  { name: "Missile (blue Brinstar bottom)" },
  { name: "Energy Tank, Brinstar Gate" },
  { name: "Missile (blue Brinstar top)" },
  { name: "Missile (blue Brinstar behind missile)" },
  { name: "X-Ray Scope" },
  { name: "Power Bomb (red Brinstar sidehopper room)" },
  { name: "Power Bomb (red Brinstar spike room)" },
  { name: "Missile (red Brinstar spike room)" },
  { name: "Spazer" },
  { name: "Energy Tank, Kraid" },
  { name: "Missile (Kraid)" },
  { name: "Varia Suit" },
  { name: "Missile (lava room)" },
  { name: "Ice Beam" },
  { name: "Missile (below Ice Beam)" },
  { name: "Energy Tank, Crocomire" },
  { name: "Hi-Jump Boots" },
  { name: "Missile (above Crocomire)" },
  { name: "Missile (Hi-Jump Boots)" },
  { name: "Energy Tank (Hi-Jump Boots)" },
  { name: "Power Bomb (Crocomire)" },
  { name: "Missile (below Crocomire)" },
  { name: "Missile (Grapple Beam)" },
  { name: "Grapple Beam" },
  { name: "Reserve Tank, Norfair" },
  { name: "Missile (Norfair Reserve Tank)" },
  { name: "Missile (bubble Norfair green door)" },
  { name: "Missile (bubble Norfair)" },
  { name: "Missile (Speed Booster)" },
  { name: "Speed Booster" },
  { name: "Missile (Wave Beam)" },
  { name: "Wave Beam" },
  { name: "Missile (Gold Torizo)" },
  { name: "Super Missile (Gold Torizo)" },
  { name: "Missile (Mickey Mouse room)" },
  { name: "Missile (lower Norfair above fire flea room)" },
  { name: "Power Bomb (lower Norfair above fire flea room)" },
  { name: "Power Bomb (Power Bombs of shame)" },
  { name: "Missile (lower Norfair near Wave Beam)" },
  { name: "Energy Tank, Ridley" },
  { name: "Screw Attack" },
  { name: "Energy Tank, Firefleas" },
  { name: "Missile (Wrecked Ship middle)" },
  { name: "Reserve Tank, Wrecked Ship" },
  { name: "Missile (Gravity Suit)" },
  { name: "Missile (Wrecked Ship top)" },
  { name: "Energy Tank, Wrecked Ship" },
  { name: "Super Missile (Wrecked Ship left)" },
  { name: "Right Super, Wrecked Ship" },
  { name: "Gravity Suit" },
  { name: "Missile (green Maridia shinespark)" },
  { name: "Super Missile (green Maridia)" },
  { name: "Energy Tank, Mama turtle" },
  { name: "Missile (green Maridia tatori)" },
  { name: "Super Missile (yellow Maridia)" },
  { name: "Missile (yellow Maridia super missile)" },
  { name: "Missile (yellow Maridia false wall)" },
  { name: "Plasma Beam" },
  { name: "Missile (left Maridia sand pit room)" },
  { name: "Reserve Tank, Maridia" },
  { name: "Missile (right Maridia sand pit room)" },
  { name: "Power Bomb (right Maridia sand pit room)" },
  { name: "Missile (pink Maridia)" },
  { name: "Super Missile (pink Maridia)" },
  { name: "Spring Ball" },
  { name: "Missile (Draygon)" },
  { name: "Energy Tank, Botwoon" },
  { name: "Space Jump" },
  { name: "Kraid" },
  { name: "Ridley" },
  { name: "Phantoon" },
  { name: "Draygon" },
  { name: "Mother Brain" },
]

const SMCategory: ArchipelagoCategory = {
  category: "Super Metroid",
  settings: SMSettings,
  items: SMItems,
  locations: SMLocations,
};

export { SMCategory };

//------------======================

/*
SMSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "",
    readableName: "",
    description: "",
    randomable: true,
    low: 0,
    high: 0,
    default: 0,
  })
);
SMSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "",
    readableName: "",
    description: "",
    values: {},
    default: "",
  })
);
SMSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "",
    readableName: "",
    description: "",
    default: true,
  })
);
*/
