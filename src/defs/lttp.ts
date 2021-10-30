import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
} from "./core";
import lttpsprites from "./lttp-sprites.json";

interface LTTPSprite {
  file: string;
  name: string;
  author: string;
}

const LttPSettings: ArchipelagoSettingBase[] = [];

const palettes: Record<string, string> = {
  default: "Vanilla",
  good: "Random within reason",
  classic: "Decent color scheme",
  grayscale: "Grayscale",
  negative: "Negative – The exact inverse of vanilla",
  blackout: "All black (good luck)",
  dizzy: "Dizzy – Full random but keep saturation and lightness",
  sick: "Sick – Full random but keep lightness",
  puke: "Puke – Completely random without regard to anything",
};

//------------====================== CORE SETTINGS
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "goals",
    readableName: "Goal",
    description: "Define your end goal for the game.",
    values: {
      ganon: "Defeat Ganon and GT Agahnim",
      crystals: "Defeat Ganon",
      bosses: "Oops! All Dungeons",
      pedestal: "Pull the Pedestal",
      ganon_pedestal: "Pull the Pedestal and defeat Ganon",
      triforce_hunt: "Find the Triforce Pieces",
      local_triforce_hunt: "Find the Triforce Pieces in your own world",
      ganon_triforce_hunt: "Find the Triforce Pieces and defeat Ganon",
      local_ganon_triforce_hunt:
        "Find the Triforce Pieces in your own world and defeat Ganon",
      ice_rod_hunt:
        "Start with everything and find the single hidden item in the world",
    },
    default: "ganon",

    legacyValues: {
      fast_ganon: "crystals",
      dungeons: "bosses",
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "mode",
    readableName: "Starting mode",
    description: "Define your starting point and base world.",
    values: {
      standard: "Standard opening",
      open: "Open world - skip the opening",
      inverted: "Inverted mode - start from Dark World",
    },
    default: "open",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "crystals_needed_for_gt",
    readableName: "Crystals needed for Ganon's Tower",
    description:
      "How many crystals are required to access the Ganon's Tower entrance.",
    low: 0,
    high: 7,
    default: 7,
    randomable: true,

    legacyName: "tower_open",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "crystals_needed_for_ganon",
    readableName: "Crystals needed for Ganon",
    description:
      "How many crystals are required to defeat Ganon, if that is the goal. Irrelevant if it is not.",
    low: 0,
    high: 7,
    default: 7,
    randomable: true,
    dependsOn: {
      goals: ["ganon", "crystals"],
    },

    legacyName: "ganon_open",
  })
);

//------------====================== TRIFORCE HUNT
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "triforce_pieces_required",
    readableName: "Triforce pieces required",
    description:
      "How many Triforce pieces will be required to complete your goal.",
    low: 1,
    high: 90,
    default: 20,
    dependsOn: {
      goal: [
        "triforce_hunt",
        "local_triforce_hunt",
        "ganon_triforce_hunt",
        "local_ganon_triforce_hunt",
      ],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "triforce_pieces_mode",
    readableName: "Triforce Hunt mode",
    description:
      "This will determine how many extra Triforce Pieces, if any, there will be during your Triforce Hunt.",
    values: {
      extra: "The required number plus an extra amount",
      percentage: "A certain percentage over the required number",
      available: "A set number of Triforce pieces",
    },
    default: "extra",
    dependsOn: {
      goal: [
        "triforce_hunt",
        "local_triforce_hunt",
        "ganon_triforce_hunt",
        "local_ganon_triforce_hunt",
      ],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "triforce_pieces_extra",
    readableName: "Extra Triforce pieces",
    description:
      "How many Triforce pieces will be available over the required amount.",
    low: 0,
    high: 89,
    default: 10,
    dependsOn: {
      goal: [
        "triforce_hunt",
        "local_triforce_hunt",
        "ganon_triforce_hunt",
        "local_ganon_triforce_hunt",
      ],
      triforce_pieces_mode: ["extra"],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "triforce_pieces_percentage",
    readableName: "Triforce pieces – percentage",
    description:
      "What percentage of Triforce pieces over the required amount will be available. For instance, 20 pieces at 150% would result in 30 pieces in the game.",
    low: 100,
    high: 999,
    default: 125,
    dependsOn: {
      goal: [
        "triforce_hunt",
        "local_triforce_hunt",
        "ganon_triforce_hunt",
        "local_ganon_triforce_hunt",
      ],
      triforce_pieces_mode: ["percentage"],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "triforce_pieces_available",
    readableName: "Triforce pieces available",
    description:
      "How many Triforce pieces will be available in the game, total. May not be lower than triforce_pieces_required.",
    low: 0,
    high: 100,
    default: 30,
    dependsOn: {
      goal: [
        "triforce_hunt",
        "local_triforce_hunt",
        "ganon_triforce_hunt",
        "local_ganon_triforce_hunt",
      ],
      triforce_pieces_mode: ["available"],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "triforcehud",
    readableName: "Triforce HUD Visibility",
    description:
      "Whether to hide the Triforce HUD display to start with during a Triforce Hunt",
    values: {
      normal: "Normal",
      hide_goal:
        "Hide the display until you pick up a Triforce piece or talk to Murahdahla",
      hide_required: "Hide the goal number until you've talked to Murahdahla",
      hide_both: "Both of the above",
    },
    default: "normal",
    dependsOn: {
      goal: [
        "triforce_hunt",
        "local_triforce_hunt",
        "ganon_triforce_hunt",
        "local_ganon_triforce_hunt",
      ],
    },
  })
);

//------------====================== TIMER
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "timer",
    readableName: "Timer",
    description:
      "Set the timer option for the game. If set, the compass treasure counter will be disabled.",
    values: {
      none: "No timer",
      display: "Chrono – counts up",
      timed: "Race chrono – counts up, collect clocks to bring it down",
      timed_countdown: "Timer – counts down, collect clocks to push it up",
      timed_ohko:
        "Death clock – counts down; if it hits 0, one-hit KO mode is on",
      ohko: "Daredevil – Screw the timer! Just gimme OHKO mode!",
    },
    default: "none",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "countdown_start_time",
    readableName: "Countdown start time",
    description:
      "In countdown timer modes, the time in minutes the clock starts at.",
    low: 1,
    high: 600,
    default: 10,
    dependsOn: {
      timer: ["timed", "timed_countdown", "timed_ohko"],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "red_clock_time",
    readableName: "Red clock time",
    description:
      "The amount of minutes awarded or subtracted by red clocks. Should be the lowest, but not required.",
    low: -60,
    high: 60,
    default: -2,
    dependsOn: {
      timer: ["timed", "timed_countdown", "timed_ohko"],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "blue_clock_time",
    readableName: "Blue clock time",
    description:
      "The amount of minutes awarded or subtracted by blue clocks. Should be the middle value, but not required.",
    low: -60,
    high: 60,
    default: 2,
    dependsOn: {
      timer: ["timed", "timed_countdown", "timed_ohko"],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "green_clock_time",
    readableName: "Green clock time",
    description:
      "The amount of minutes awarded or subtracted by green clocks. Should be the highest, but not required.",
    low: -60,
    high: 60,
    default: 4,
    dependsOn: {
      timer: ["timed", "timed_countdown", "timed_ohko"],
    },
  })
);

//------------====================== WORLD SHUFFLE
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "entrance_shuffle",
    readableName: "Entrance shuffle",
    description:
      "Affects how overworld entrances are arranged. Supercedes door shuffle.",
    values: {
      none: "Off",
      dungeonssimple: "Easy dungeon shuffle",
      dungeonsfull: "Dungeon shuffle",
      simple: "Basic – a little mixed up",
      restricted: "Restricted – connectors will stay the same",
      full: "Full",
      crossed: "Crossed – connectors can cross over Light/Dark World",
      insanity: "Insanity – Connector exits are also shuffled (beware!)",
    },
    default: "none",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "door_shuffle",
    readableName: "Door shuffle",
    description:
      "Shuffles supertiles within dungeons. Superceded by entrance shuffle.",
    values: {
      vanilla: "Off",
      basic: "Basic – dungeons keep to themselves",
      crossed: "Crossed – dungeons get mixed up",
    },
    default: "vanilla",
    dependsOn: {
      entrance_shuffle: ["off"],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "intensity",
    readableName: "Door shuffle intensity",
    description: "How much of an effect Door Shuffle will have on the game.",
    low: 1,
    high: 3,
    default: 1,
    dependsOn: {
      entrance_shuffle: ["off"],
      door_shuffle: ["basic", "crossed"],
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "boss_shuffle",
    readableName: "Boss shuffle",
    description: "Whether and how bosses will be shuffled.",
    values: {
      none: "Off",
      basic: "Simple – Shuffle all bosses except GT (one each)",
      full: "Full – Shuffle all bosses including GT",
      chaos: "Random",
      singularity: "Singularity – Spawn one boss as much as possible",
    },
    default: "none",

    legacyValues: {
      simple: "basic",
      random: "chaos",
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "misery_mire_medallion",
    readableName: "Misery Mire entry medallion",
    description: "Which medallion is required to access Misery Mire entrance.",
    values: {
      ether: "Ether (vanilla)",
      bombos: "Bombos",
      quake: "Quake",
      random: "Random",
    },
    default: "random",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "turtle_rock_medallion",
    readableName: "Turtle Rock entry medallion",
    description:
      "Which medallion is required to access Turtle Rock Main entrance.",
    values: {
      ether: "Ether",
      bombos: "Bombos",
      quake: "Quake (vanilla)",
      random: "Random",
    },
    default: "random",
  })
);

//------------====================== DUNGEON ITEMS
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "bigkey_shuffle",
    readableName: "Big key shuffle",
    description: "How big keys will be shuffled.",
    values: {
      original_dungeon: "Keep them to their own dungeons",
      own_dungeons: "Put them in any dungeon",
      own_world: "Put them anywhere in your world",
      any_world: "Put them in anyone's world",
      different_world: "Put them in any world but yours",
    },
    default: "original_dungeon",

    legacyValues: {
      on: "any_world",
      off: "original_dungeon",
      true: 'any_world',
      false: 'original_dungeon',
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "smallkey_shuffle",
    readableName: "Small key shuffle",
    description: "How small keys will be shuffled.",
    values: {
      original_dungeon: "Keep them to their own dungeons",
      own_dungeons: "Put them in any dungeon",
      own_world: "Put them anywhere in your world",
      any_world: "Put them in anyone's world",
      different_world: "Put them in any world but yours",
      universal: "Universal – any world, usable in any dungeon",
    },
    default: "original_dungeon",

    legacyValues: {
      on: "any_world",
      off: "original_dungeon",
      true: 'any_world',
      false: 'original_dungeon',
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "compass_shuffle",
    readableName: "Compass shuffle",
    description: "How compasses will be shuffled.",
    values: {
      original_dungeon: "Keep them to their own dungeons",
      own_dungeons: "Put them in any dungeon",
      own_world: "Put them anywhere in your world",
      any_world: "Put them in anyone's world",
      different_world: "Put them in any world but yours",
    },
    default: "original_dungeon",

    legacyValues: {
      on: "any_world",
      off: "original_dungeon",
      true: 'any_world',
      false: 'original_dungeon',
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "map_shuffle",
    readableName: "Map shuffle",
    description: "How maps will be shuffled.",
    values: {
      original_dungeon: "Keep them to their own dungeons",
      own_dungeons: "Put them in any dungeon",
      own_world: "Put them anywhere in your world",
      any_world: "Put them in anyone's world",
      different_world: "Put them in any world but yours",
    },
    default: "original_dungeon",

    legacyValues: {
      on: "any_world",
      off: "original_dungeon",
      true: 'any_world',
      false: 'original_dungeon',
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "dungeon_counters",
    readableName: "Dungeon counters",
    description:
      "Determines when to show an on-screen counter for dungeon items.",
    values: {
      on: "Always on",
      pickup: "With compass",
      default: "With compass if shuffled",
      off: "Always off",
    },
    default: "default",
  })
);

//------------====================== DIFFICULTY
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "item_pool",
    readableName: "Item pool",
    description: "Affects what items will be available in the item pool.",
    values: {
      easy: "Easy – Adds extras of progressive items and bottles",
      normal: "Normal",
      hard: "Hard – 14 hearts, L2 mail, L3 sword, L2 shield, no silvers unless swordless",
      expert:
        "Expert – 8 hearts, L1 mail, L2 sword, L1 shield, no silvers unless swordless",
    },
    default: "normal",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "item_functionality",
    readableName: "Item functionality",
    description:
      "Affects how useful your items are, and how you're expected to use them.",
    values: {
      easy: "Easy – Use medallions anywhere, hammer can sub for Master Sword for Ganon and monoliths",
      normal: "Normal",
      hard: "Hard – Less potion healing, can't catch faeries, 2× Magic Cape mana cost, no Cane of Byrna invul, no Boomerang stun, no silvers except Ganon",
      expert:
        "Expert – Hard mode, but even less potion healing and no Hookshot stun either",
    },
    default: "normal",
  })
);

//------------====================== PLACEMENT LOGIC
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "glitches_required",
    readableName: "Require glitch use",
    description:
      "Whether progression may be locked behind checks that are out of logic.",
    values: {
      none: "Off",
      minor_glitches: "May require some of the easier glitches",
      overworld_glitches: "May require harder overworld glitches",
      no_logic: "Fuck it, put everything anywhere (beware!)",
    },
    default: "none",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "glitch_boots",
    readableName: "Glitch boots",
    description:
      "If you're in a logic mode where you're expected to have Pegasus boots to glitch around, get those to start with.",
    default: true,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "dark_room_logic",
    readableName: "Dark room logic",
    description:
      "Whether a light source should be required to traverse dark rooms.",
    values: {
      lamp: "Expect that you'll have a lamp for those",
      torches: "A Fire Rod will do to light up braziers",
      none: "Eyes like a cat, baby",
    },
    default: "lamp",
  })
);

//------------====================== MISCELLANEOUS
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "progressive",
    readableName: "Progressive items",
    description:
      "If progressive items are on, you will always receive the next sword, shield, or mail upgrade. If not, you could get Gold Sword first, for instance.",
    values: {
      off: "Off",
      grouped_random:
        "Grouped random – some groups may be while others may not",
      on: "On",
    },
    default: "on",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "swordless",
    readableName: "Swordless mode",
    description:
      "Whether you're expected to clear the game without using the sword. This changes a lot of things and makes the game A LOT harder, understandably.",
    default: false,

    legacyName: "weapons",
    legacyValues: {
      swordless: "true",
      vanilla: "false",
      assured: "false",
      randomized: "false",
    },
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "retro",
    readableName: "Retro mode",
    description:
      "This requires you to buy a quiver and pay rupees to shoot arrows, and adds Take Any caves to the game.",
    default: false,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "hints",
    readableName: "In-game hint system",
    description:
      "Whether hints about important/expensive items or difficult locations show up in the in-game hint system.",
    default: true,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "restrict_dungeon_item_on_boss",
    readableName: "Restrict dungeon items on boss",
    description:
      "Whether the boss reward can be things like maps or compasses. Turn on if you don't want that.",
    default: true,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "killable_thieves",
    readableName: "Killable thieves",
    description:
      "Normally, the harmless but annoying thieves can only be knocked away. Turn on if you want to kill the fuckers.",
    default: false,
  })
);

//------------====================== ENEMIZER
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "enemy_shuffle",
    readableName: "Enemizer",
    description:
      "Shuffle enemy positions. This does not include Hyrule Castle.",
    default: false,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "enemy_damage",
    readableName: "Enemy damage",
    description: "Affects the amount of damage enemies inflict.",
    values: {
      default: "Vanilla",
      shuffled: "Shuffle – general same number of hard hitters",
      chaos: "Full random",
    },
    default: "default",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "enemy_health",
    readableName: "Enemy health",
    description: "Affects the amount of health enemies have.",
    values: {
      easy: "Easy",
      default: "Normal",
      hard: "Hard",
      expert: "Expert",
    },
    default: "default",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "beemizer",
    readableName: "Beemizer",
    description:
      "Removes garbage treasures like small rupees, bombs, and arrows, and replace with bee traps. 25% of trash per level.",
    low: 0,
    high: 4,
    default: 0,
  })
);

//------------====================== INCIDENTALS
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "key_drop_shuffle",
    readableName: "Key drop shuffle",
    description:
      "Whether enemies that usually drop small keys will be shuffled.",
    default: false,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "pot_shuffle",
    readableName: "Pot shuffle",
    description:
      "Whether keys and buttons under pots will be shuffled within their supertiles.",
    default: false,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "bush_shuffle",
    readableName: "Bush shuffle",
    description: "Whether enemies and traps are hiding under different bushes.",
    default: false,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "tile_shuffle",
    readableName: "Tile shuffle",
    description: "Whether trap tile rooms will come out in different patterns.",
    default: false,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shuffle_prizes",
    readableName: "Prize shuffle",
    description:
      "Whether certain events will yield different item drops than normal.",
    values: {
      none: "Off",
      g: "General prize shuffle – killing enemies and the like",
      b: "Bonk prize shuffle – bonking trees, stacks, etc.",
      bg: "Both",
    },
    default: "none",
  })
);

//------------====================== SHOPS
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shop_shuffle",
    readableName: "Shop shuffle",
    description:
      'Whether certain aspects of the shop will be randomized. Please note that "exotic prices" options are experimental and may crash the game.',
    values: {
      none: "Off",
      g: "Pool shuffle – Shuffles vanilla inventory",
      f: "Random shuffle – Whole new inventory",
      p: "Price shuffle",
      u: "Capacity upgrades – Adds those to general item pool",
      gp: "Pool and prices",
      fp: "Full shuffle – Random and prices",
      ufp: "Full shuffle including capacity",
      wfp: "Full shuffle including potion shop",
      ufpw: "Absolutely everything",
      P: "Exotic price shuffle – sometimes pay in bombs, arrows, and hearts",
      gP: "Pool and exotic prices",
      fP: "Full exotic shuffle",
      ufP: "Full exotic shuffle including capacity",
      wfP: "Full exotic shuffle including potion shop",
      ufPw: "Absolutely everything with exotic",
    },
    default: "none",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "shop_item_slots",
    readableName: "Shop item slots (aka Capitalism mode)",
    description:
      "How many collectible/dungeon items will show up in shops. For each one, a 50rp. collectible is added to the item pool.",
    low: 0,
    high: 30,
    default: 0,
    randomable: true,

    legacyName: "shop_shuffle_slots",
  })
);

//------------====================== PERSONALIZATION
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "ow_palettes",
    readableName: "Overworld palettes",
    description: "How the overworld will look.",
    values: palettes,
    default: "default",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "uw_palettes",
    readableName: "Underworld palettes",
    description: "How dungeons and caves will look.",
    values: palettes,
    default: "default",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "hud_palettes",
    readableName: "HUD palettes",
    description: "How the HUD will look.",
    values: palettes,
    default: "default",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "sword_palettes",
    readableName: "Sword palettes",
    description: "How your swords will look.",
    values: palettes,
    default: "default",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "shield_palettes",
    readableName: "Shield palettes",
    description: "How your shields will look.",
    values: palettes,
    default: "default",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "link_palettes",
    readableName: "Link palette",
    description:
      "How Link will look. Yes, this is apparently an option. Unknown if it works with alternate sprites.",
    values: palettes,
    default: "default",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "heartbeep",
    readableName: "Low health beep frequency",
    description: "How frequently the game will beep at you for low health.",
    values: {
      double: "Two times faster than usual",
      normal: "Normal",
      half: "Two times slower than usual",
      quarter: "Four times slower than usual",
      off: "Not at all",
      random: "Random from the above",
    },
    default: "normal",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "heartcolor",
    readableName: "Heart color",
    description:
      "The color of hearts in the HUD. This is based on palette positions, so colors may change if HUD palettes are shuffled.",
    values: {
      red: "Red",
      blue: "Blue",
      green: "Green",
      yellow: "Yellow",
      random: "Random from the above",
    },
    default: "red",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "menuspeed",
    readableName: "Menu speed",
    description:
      "How quickly the pause menu will slide in and out when you press Start.",
    values: {
      half: "Two times slower than usual",
      normal: "Normal",
      double: "Two times faster than usual",
      triple: "Three times faster than usual",
      quadruple: "Four times faster than usual",
      instant: "Instantly",
      random: "Random from the above",
    },
    default: "normal",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "quickswap",
    readableName: "Quick swap",
    description:
      "Whether you can use the L and R buttons to cycle through use items.",
    default: true,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "reduceflashing",
    readableName: "Reduce flashing",
    description:
      "Games of this era had a lot of blinking lights that could possibly trigger seizures. This will remove most of them. Essential if you're streaming.",
    default: true,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "music",
    readableName: "Music",
    description:
      "Whether to play music. If disabled, this also turns off MSU-1 patches. If you're streaming and turning this off to play your own music, please be mindful of licensing.",
    default: true,

    legacyName: "disablemusic",
    legacyValues: {
      true: "false",
      false: "true",
      off: "true",
      on: "false",
    },
  })
);

const spritevalue: Record<string, string> = {
  none: "LttP Link (Nintendo)",
};
for (const sprite of lttpsprites as LTTPSprite[])
  spritevalue[sprite.file] = `${sprite.name} (${sprite.author})`;

LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "sprite",
    readableName: "Sprite",
    description:
      "Your hero's sprite. Sorry there are no pictures; this is being done in a very hacky way to begin with. ZSPR files are hard.",
    values: spritevalue,
    default: "none",
  })
);

export default LttPSettings;
