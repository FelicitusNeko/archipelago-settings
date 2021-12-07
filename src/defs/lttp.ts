import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
  ArchipelagoItem,
  DeathLinkOption,
  ArchipelagoLocation,
} from "./core";
import lttpsprites from "./LttP/sprites.json";

interface LTTPSprite {
  file: string;
  name: string;
  author: string;
}

/** The collection of settings for The Legend of Zelda: A Link to the Past. */
const LttPSettings: ArchipelagoSettingBase[] = [];

//------------====================== CORE SETTINGS
LttPSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "goals",
    readableName: "Goal",
    description: "Define your end goal for the game.",
    values: {
      ganon:
        "Ganon – Find the crystals, defeat Agahnim in Ganon's Tower, then defeat Ganon",
      crystals: "Fast Ganon – Find the crystals, then defeat Ganon",
      bosses: "Oops! All Dungeons – Clear every dungeon, then defeat Ganon",
      pedestal:
        "Pedestal – Get the three Medallions, then pull the Master Sword from its pedestal",
      ganon_pedestal:
        "Pedestal Ganon – Get the Medallions, check the Master Sword pedestal, then defeat Ganon",
      triforce_hunt:
        "Triforce Hunt – Find the Triforce Pieces, then find Murahdahla",
      local_triforce_hunt:
        "Local Triforce Hunt – Find the Triforce Pieces in your own world, then find Murahdahla",
      ganon_triforce_hunt:
        "Ganon's Triforce Hunt – Find the Triforce Pieces, then defeat Ganon",
      local_ganon_triforce_hunt:
        "Ganon's Local Triforce Hunt – Find the Triforce Pieces in your own world, then defeat Ganon",
      ice_rod_hunt:
        "Ice Rod Hunt – Start with everything but the Ice Rod; find it, defeat Trinexx at Turtle Rock, then find Murahdahla",
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
      open: "Open world – skip the opening",
      inverted: "Inverted mode – start from Dark World",
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
      goals: [
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
      goals: [
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
      goals: [
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
    high: 400,
    step: 5,
    default: 125,
    dependsOn: {
      goals: [
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
      goals: [
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
        "Hide goal – Hide the display until you pick up a Triforce piece or talk to Murahdahla",
      hide_required:
        "Hide required – Hide the goal number until you've talked to Murahdahla",
      hide_both: "Both of the above",
    },
    default: "normal",
    dependsOn: {
      goals: [
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
      "Set the timer option for the game. If set, the compass treasure counter will be disabled. One-hit KO lives here.",
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
    low: 5,
    high: 600,
    step: 5,
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
      simple: "Basic – A little mixed up",
      restricted: "Restricted – Connectors will stay the same",
      full: "Full",
      crossed: "Crossed – Connectors can cross over Light/Dark World",
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
      true: "any_world",
      false: "original_dungeon",
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
      true: "any_world",
      false: "original_dungeon",
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
      true: "any_world",
      false: "original_dungeon",
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
      true: "any_world",
      false: "original_dungeon",
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
      minor_glitches: "Minor – May require some of the easier glitches",
      overworld_glitches: "Overworld – May require harder overworld glitches",
      hybrid_major_glitches:
        "Hybrid major – Requires some pretty intense glitch use, but nothing extreme",
      no_logic: "No logic – Screw it, put everything anywhere (beware!)",
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
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "hints",
    readableName: "In-game hint system",
    description:
      "Whether hints about important/expensive items or difficult locations show up in the in-game hint system.",
    values: {
      off: "Off",
      vendors:
        "Vendors – No hint tiles, but Bottle Vendor and King Zora will tell you what they're selling",
      on: "On",
      full: "Full-on – Every hint is good; no trolls",
    },
    default: "on",
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "restrict_dungeon_item_on_boss",
    readableName: "Restrict dungeon items on boss",
    description:
      "If enabled, the boss reward will never be a dungeon item such as a map or compass.",
    default: true,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "killable_thieves",
    readableName: "Killable thieves",
    description:
      "Normally, the harmless but annoying thieves can only be knocked away. Turn on if you want to kill the jerks.",
    default: false,
  })
);
LttPSettings.push(DeathLinkOption);

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
    name: "beemizer_total_chance",
    readableName: "Beemizer",
    description:
      "Percentage of garbage treasures like small rupees, bombs, and arrows, to be replaced with bees or bee traps.",
    low: 0,
    high: 100,
    default: 0,
  })
);
LttPSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "beemizer_trap_chance",
    readableName: "Beemizer trap chance",
    description:
      "Percentage of bee checks which will become bee traps instead of single bees.",
    low: 0,
    high: 100,
    default: 60,
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
      g: "General prize shuffle – Prizes for killing enemies and the like",
      b: "Bonk prize shuffle – Prizes for bonking trees, stacks, etc.",
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
      P: "Exotic price shuffle – Sometimes pay in bombs, arrows, and hearts",
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
for (const { file, name, author } of lttpsprites as LTTPSprite[])
  spritevalue[file] = `${name} (${author})`;

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

// NOTE: this list does not include dungeon items; their locations can be determined by existing options
// If people want/need to be more granular, they can edit the YAML manually
const LttPItems: ArchipelagoItem[] = [
  {
    name: "Progressive Bow",
    dependsOn: { progressive: ["on", "grouped_random"] },
  },
  {
    name: "Progressive Bow (Alt)",
    dependsOn: { progressive: ["on", "grouped_random"] },
  },
  { name: "Bow", dependsOn: { progressive: ["off", "grouped_random"] } },
  {
    name: "Silver Bow",
    dependsOn: {
      progressive: ["off", "grouped_random"],
      item_pool: ["easy", "normal"],
    },
  },
  { name: "Silver Arrows", dependsOn: { retro: [true] } },
  { name: "Blue Boomerang" },
  { name: "Red Boomerang" },
  { name: "Hookshot" },
  { name: "Mushroom" },
  { name: "Magic Powder" },
  { name: "Fire Rod" },
  { name: "Ice Rod" },
  { name: "Bombos" },
  { name: "Ether" },
  { name: "Quake" },
  { name: "Lamp" },
  { name: "Hammer" },
  { name: "Flute" },
  { name: "Shovel" },
  { name: "Bug Catching Net" },
  { name: "Book of Mudora" },
  { name: "Bottle" },
  { name: "Bottle (Red Potion)" },
  { name: "Bottle (Green Potion)" },
  { name: "Bottle (Blue Potion)" },
  {
    name: "Bottle (Fairy)",
    dependsOn: { item_functionality: ["easy", "normal"] },
  },
  { name: "Bottle (Bee)" },
  { name: "Bottle (Good Bee)" },
  { name: "Cane of Somaria" },
  { name: "Cane of Byrna" },
  { name: "Cape" },
  { name: "Magic Mirror" },
  {
    name: "Progressive Sword",
    dependsOn: { progressive: ["on", "grouped_random"] },
    max: 4,
  },
  {
    name: "Fighter Sword",
    dependsOn: { progressive: ["off", "grouped_random"] },
  },
  {
    name: "Master Sword",
    dependsOn: { progressive: ["off", "grouped_random"] },
  },
  {
    name: "Tempered Sword",
    dependsOn: {
      progressive: ["off", "grouped_random"],
      item_pool: ["easy", "normal", "hard"],
    },
  },
  {
    name: "Golden Sword",
    dependsOn: {
      progressive: ["off", "grouped_random"],
      item_pool: ["easy", "normal"],
    },
  },
  {
    name: "Progressive Shield",
    dependsOn: { progressive: ["on", "grouped_random"] },
    max: 3,
  },
  {
    name: "Blue Shield",
    dependsOn: { progressive: ["off", "grouped_random"] },
  },
  {
    name: "Red Shield",
    dependsOn: {
      progressive: ["off", "grouped_random"],
      item_pool: ["easy", "normal", "hard"],
    },
  },
  {
    name: "Mirror Shield",
    dependsOn: {
      progressive: ["off", "grouped_random"],
      item_pool: ["easy", "normal"],
    },
  },
  {
    name: "Progressive Mail",
    dependsOn: { progressive: ["on", "grouped_random"] },
    max: 2,
  },
  { name: "Blue Mail", dependsOn: { progressive: ["off", "grouped_random"] } },
  { name: "Red Mail", dependsOn: { progressive: ["off", "grouped_random"] } },
  {
    name: "Progressive Glove",
    dependsOn: { progressive: ["on", "grouped_random"] },
  },
  {
    name: "Power Glove",
    dependsOn: { progressive: ["off", "grouped_random"] },
  },
  {
    name: "Titans Mitts",
    readableName: "Titan's Mitts",
    dependsOn: { progressive: ["off", "grouped_random"] },
  },
  { name: "Flippers" },
  { name: "Pegasus Boots" },
  { name: "Moon Pearl" },
  { name: "Magic Upgrade (1/2)", max: 2 },
  {
    name: "Magic Upgrade (1/4)",
    //dependsOn: { progressive: ["off", "grouped_random"], item_pool: ["easy"] },
  },
  {
    name: "Sanctuary Heart Container",
    dependsOn: { item_pool: ["easy", "normal"] },
  },
  { name: "Boss Heart Container", max: 10 },
  { name: "Piece of Heart", max: 24 },
  { name: "Single Arrow", max: 70 },
  { name: "Arrows (10)", max: 10 },
  { name: "Single Bomb", max: 50 },
  { name: "Bombs (3)", max: 50 },
  { name: "Bombs (10)", max: 10 },
  { name: "Rupee (1)", max: 99 },
  { name: "Rupees (5)", max: 99 },
  { name: "Rupees (20)", max: 99 },
  { name: "Rupees (50)", max: 99 },
  { name: "Rupees (100)", max: 99 },
  { name: "Rupees (300)", max: 34 },
  { name: "Green Clock", max: 0 },
  { name: "Blue Clock", max: 0 },
  { name: "Red Clock", max: 0 },
  { name: "Rupoor", max: 0 },
  {
    name: "Arrow Upgrade (+5)",
    //dependsOn: { shop_shuffle: ["u", "ufp", "ufpw", "ufP", "ufPw"] },
    max: 6,
  },
  {
    name: "Arrow Upgrade (+10)",
    //dependsOn: { shop_shuffle: ["u", "ufp", "ufpw", "ufP", "ufPw"] },
  },
  {
    name: "Bomb Upgrade (+5)",
    //dependsOn: { shop_shuffle: ["u", "ufp", "ufpw", "ufP", "ufPw"] },
    max: 6,
  },
  {
    name: "Bomb Upgrade (+10)",
    //dependsOn: { shop_shuffle: ["u", "ufp", "ufpw", "ufP", "ufPw"] },
  },
  { name: "Triforce Piece", max: 0 },
  {
    name: "Small Key (Universal)",
    dependsOn: { smallkey_shuffle: ["universal"] },
    max: 10,
  },
  { name: "Nothing", dependsOn: { goal: ["ice_rod_hunt"] }, max: 0 },
  { name: "Bee", max: 0 }, // TODO: fix deps
  { name: "Bee Trap", max: 0 },
  //{name: ''},
];

const LttPLocations: ArchipelagoLocation[] = [
  { name: "Sewers - Dark Cross" },
  { name: "Secret Passage" },
  { name: "Hyrule Castle - Boomerang Chest" },
  { name: "Eastern Palace - Compass Chest" },
  { name: "King's Tomb" },
  { name: "Eastern Palace - Big Chest" },
  { name: "Pyramid Fairy - Left" },
  { name: "Pyramid Fairy - Right" },
  { name: "Swamp Palace - Map Chest" },
  { name: "Swamp Palace - Big Chest" },
  { name: "Floodgate Chest" },
  { name: "Desert Palace - Big Chest" },
  { name: "Skull Woods - Compass Chest" },
  { name: "Ice Palace - Freezor Chest" },
  { name: "Skull Woods - Big Chest" },
  { name: "Skull Woods - Map Chest" },
  { name: "Skull Woods - Big Key Chest" },
  { name: "Skull Woods - Pot Prison" },
  { name: "Ice Palace - Big Key Chest" },
  { name: "Ice Palace - Big Chest" },
  { name: "Tower of Hera - Map Chest" },
  { name: "Waterfall Fairy - Left" },
  { name: "Eastern Palace - Cannonball Chest" },
  { name: "Desert Palace - Map Chest" },
  { name: "Eastern Palace - Big Key Chest" },
  { name: "Link's House" },
  { name: "Spiral Cave" },
  { name: "Desert Palace - Big Key Chest" },
  { name: "Mimic Cave" },
  { name: "Skull Woods - Pinball Room" },
  { name: "Desert Palace - Compass Chest" },
  { name: "Kakariko Tavern" },
  { name: "Waterfall Fairy - Right" },
  { name: "Ice Palace - Compass Chest" },
  { name: "Misery Mire - Spike Chest" },
  { name: "Ice Palace - Map Chest" },
  { name: "Ice Palace - Spike Room" },
  { name: "Ice Palace - Iced T Room" },
  { name: "Tower of Hera - Big Key Chest" },
  { name: "Chicken House" },
  { name: "Brewery" },
  { name: "C-Shaped House" },
  { name: "Aginah's Cave" },
  { name: "Eastern Palace - Map Chest" },
  { name: "Tower of Hera - Big Chest" },
  { name: "Tower of Hera - Compass Chest" },
  { name: "Skull Woods - Bridge Room" },
  { name: "Thieves' Town - Map Chest" },
  { name: "Thieves' Town - Big Key Chest" },
  { name: "Thieves' Town - Compass Chest" },
  { name: "Thieves' Town - Ambush Chest" },
  { name: "Thieves' Town - Attic" },
  { name: "Thieves' Town - Big Chest" },
  { name: "Thieves' Town - Blind's Cell" },
  { name: "Turtle Rock - Chain Chomps" },
  { name: "Turtle Rock - Big Chest" },
  { name: "Turtle Rock - Roller Room - Left" },
  { name: "Turtle Rock - Roller Room - Right" },
  { name: "Turtle Rock - Compass Chest" },
  { name: "Turtle Rock - Big Key Chest" },
  { name: "Turtle Rock - Eye Bridge - Top Right" },
  { name: "Turtle Rock - Eye Bridge - Top Left" },
  { name: "Turtle Rock - Eye Bridge - Bottom Right" },
  { name: "Turtle Rock - Eye Bridge - Bottom Left" },
  { name: "Turtle Rock - Crystaroller Room" },
  { name: "Palace of Darkness - Big Key Chest" },
  { name: "Palace of Darkness - The Arena - Ledge" },
  { name: "Palace of Darkness - The Arena - Bridge" },
  { name: "Palace of Darkness - Big Chest" },
  { name: "Palace of Darkness - Compass Chest" },
  { name: "Palace of Darkness - Harmless Hellway" },
  { name: "Palace of Darkness - Stalfos Basement" },
  { name: "Palace of Darkness - Dark Basement - Left" },
  { name: "Palace of Darkness - Dark Basement - Right" },
  { name: "Palace of Darkness - Map Chest" },
  { name: "Palace of Darkness - Dark Maze - Top" },
  { name: "Palace of Darkness - Dark Maze - Bottom" },
  { name: "Palace of Darkness - Shooter Room" },
  { name: "Misery Mire - Main Lobby" },
  { name: "Misery Mire - Bridge Chest" },
  { name: "Misery Mire - Compass Chest" },
  { name: "Misery Mire - Big Chest" },
  { name: "Misery Mire - Map Chest" },
  { name: "Misery Mire - Big Key Chest" },
  { name: "Mire Shed - Left" },
  { name: "Mire Shed - Right" },
  { name: "Sanctuary" },
  { name: "Superbunny Cave - Top" },
  { name: "Superbunny Cave - Bottom" },
  { name: "Sahasrahla's Hut - Left" },
  { name: "Sahasrahla's Hut - Middle" },
  { name: "Sahasrahla's Hut - Right" },
  { name: "Spike Cave" },
  { name: "Kakariko Well - Top" },
  { name: "Kakariko Well - Left" },
  { name: "Kakariko Well - Middle" },
  { name: "Kakariko Well - Right" },
  { name: "Kakariko Well - Bottom" },
  { name: "Swamp Palace - Entrance" },
  { name: "Swamp Palace - Compass Chest" },
  { name: "Swamp Palace - West Chest" },
  { name: "Swamp Palace - Big Key Chest" },
  { name: "Swamp Palace - Flooded Room - Left" },
  { name: "Swamp Palace - Flooded Room - Right" },
  { name: "Swamp Palace - Waterfall Room" },
  { name: "Castle Tower - Dark Maze" },
  { name: "Castle Tower - Room 03" },
  { name: "Ganons Tower - DMs Room - Top Left" },
  { name: "Ganons Tower - DMs Room - Top Right" },
  { name: "Ganons Tower - DMs Room - Bottom Left" },
  { name: "Ganons Tower - DMs Room - Bottom Right" },
  { name: "Ganons Tower - Randomizer Room - Top Left" },
  { name: "Ganons Tower - Randomizer Room - Top Right" },
  { name: "Ganons Tower - Randomizer Room - Bottom Left" },
  { name: "Ganons Tower - Randomizer Room - Bottom Right" },
  { name: "Ganons Tower - Firesnake Room" },
  { name: "Ganons Tower - Map Chest" },
  { name: "Ganons Tower - Big Chest" },
  { name: "Ganons Tower - Hope Room - Left" },
  { name: "Ganons Tower - Hope Room - Right" },
  { name: "Ganons Tower - Bob's Chest" },
  { name: "Ganons Tower - Tile Room" },
  { name: "Ganons Tower - Compass Room - Top Left" },
  { name: "Ganons Tower - Compass Room - Top Right" },
  { name: "Ganons Tower - Compass Room - Bottom Left" },
  { name: "Ganons Tower - Compass Room - Bottom Right" },
  { name: "Ganons Tower - Big Key Chest" },
  { name: "Ganons Tower - Big Key Room - Left" },
  { name: "Ganons Tower - Big Key Room - Right" },
  { name: "Ganons Tower - Mini Helmasaur Room - Left" },
  { name: "Ganons Tower - Mini Helmasaur Room - Right" },
  { name: "Ganons Tower - Pre-Moldorm Chest" },
  { name: "Ganons Tower - Validation Chest" },
  { name: "Hyrule Castle - Zelda's Chest" },
  { name: "Hyrule Castle - Map Chest" },
  { name: "Blind's Hideout - Top" },
  { name: "Blind's Hideout - Left" },
  { name: "Blind's Hideout - Right" },
  { name: "Blind's Hideout - Far Left" },
  { name: "Blind's Hideout - Far Right" },
  { name: "Hype Cave - Top" },
  { name: "Hype Cave - Middle Right" },
  { name: "Hype Cave - Middle Left" },
  { name: "Hype Cave - Bottom" },
  { name: "Paradox Cave Lower - Far Left" },
  { name: "Paradox Cave Lower - Left" },
  { name: "Paradox Cave Lower - Right" },
  { name: "Paradox Cave Lower - Far Right" },
  { name: "Paradox Cave Lower - Middle" },
  { name: "Paradox Cave Upper - Left" },
  { name: "Paradox Cave Upper - Right" },
  { name: "Bonk Rock Cave" },
  { name: "Mini Moldorm Cave - Far Left" },
  { name: "Mini Moldorm Cave - Left" },
  { name: "Mini Moldorm Cave - Right" },
  { name: "Mini Moldorm Cave - Far Right" },
  { name: "Ice Rod Cave" },
  { name: "Hookshot Cave - Top Right" },
  { name: "Hookshot Cave - Top Left" },
  { name: "Hookshot Cave - Bottom Left" },
  { name: "Hookshot Cave - Bottom Right" },
  { name: "Sewers - Secret Room - Left" },
  { name: "Sewers - Secret Room - Middle" },
  { name: "Sewers - Secret Room - Right" },
  { name: "Chest Game" },
  { name: "Master Sword Pedestal" },
  { name: "Link's Uncle" },
  { name: "Bottle Merchant" },
  { name: "Sahasrahla" },
  { name: "Stumpy" },
  { name: "Sick Kid" },
  { name: "Purple Chest" },
  { name: "Hobo" },
  { name: "Catfish" },
  { name: "King Zora" },
  { name: "Old Man" },
  { name: "Ice Palace - Jelly Key Drop" },
  { name: "Turtle Rock - Pokey 2 Key Drop" },
  { name: "Swamp Palace - Waterway Pot Key" },
  { name: "Hyrule Castle - Key Rat Key Drop" },
  { name: "Swamp Palace - Trench 2 Pot Key" },
  { name: "Swamp Palace - Hookshot Pot Key" },
  { name: "Swamp Palace - Trench 1 Pot Key" },
  { name: "Swamp Palace - Pot Row Pot Key" },
  { name: "Skull Woods - Spike Corner Key Drop" },
  { name: "Ganons Tower - Mini Helmasaur Key Drop" },
  { name: "Ice Palace - Conveyor Key Drop" },
  { name: "Ice Palace - Hammer Block Key Drop" },
  { name: "Desert Palace - Desert Tiles 2 Pot Key" },
  { name: "Desert Palace - Beamos Hall Pot Key" },
  { name: "Skull Woods - West Lobby Pot Key" },
  { name: "Desert Palace - Desert Tiles 1 Pot Key" },
  { name: "Hyrule Castle - Boomerang Guard Key Drop" },
  { name: "Hyrule Castle - Map Guard Key Drop" },
  { name: "Ganons Tower - Conveyor Star Pits Pot Key" },
  { name: "Hyrule Castle - Big Key Drop" },
  { name: "Ganons Tower - Conveyor Cross Pot Key" },
  { name: "Ganons Tower - Double Switch Pot Key" },
  { name: "Ice Palace - Many Pots Pot Key" },
  { name: "Eastern Palace - Dark Eyegore Key Drop" },
  { name: "Misery Mire - Fishbone Pot Key" },
  { name: "Thieves' Town - Spike Switch Pot Key" },
  { name: "Castle Tower - Circle of Pots Key Drop" },
  { name: "Misery Mire - Spikes Pot Key" },
  { name: "Turtle Rock - Pokey 1 Key Drop" },
  { name: "Eastern Palace - Dark Square Pot Key" },
  { name: "Thieves' Town - Hallway Pot Key" },
  { name: "Castle Tower - Dark Archer Key Drop" },
  { name: "Misery Mire - Conveyor Crystal Key Drop" },
  { name: "Lost Woods Hideout" },
  { name: "Lumberjack Tree" },
  { name: "Spectacle Rock Cave" },
  { name: "Cave 45" },
  { name: "Graveyard Cave" },
  { name: "Checkerboard Cave" },
  { name: "Peg Cave" },
  { name: "Mini Moldorm Cave - Generous Guy" },
  { name: "Hype Cave - Generous Guy" },
  { name: "Library" },
  { name: "Mushroom" },
  { name: "Potion Shop" },
  { name: "Magic Bat" },
  { name: "Ether Tablet" },
  { name: "Bombos Tablet" },
  { name: "Blacksmith" },
  { name: "Spectacle Rock" },
  { name: "Floating Island" },
  { name: "Maze Race" },
  { name: "Desert Ledge" },
  { name: "Lake Hylia Island" },
  { name: "Sunken Treasure" },
  { name: "Bumper Cave Ledge" },
  { name: "Pyramid" },
  { name: "Digging Game" },
  { name: "Zora's Ledge" },
  { name: "Flute Spot" },
  { name: "Eastern Palace - Boss" },
  { name: "Desert Palace - Boss" },
  { name: "Tower of Hera - Boss" },
  { name: "Palace of Darkness - Boss" },
  { name: "Swamp Palace - Boss" },
  { name: "Skull Woods - Boss" },
  { name: "Thieves' Town - Boss" },
  { name: "Ice Palace - Boss" },
  { name: "Misery Mire - Boss" },
  { name: "Turtle Rock - Boss" },
  { name: "Desert Palace - Torch" },
  { name: "Ganons Tower - Bob's Torch" },
  { name: "Tower of Hera - Basement Cage" },
  { name: "Cave Shop (Dark Death Mountain) Left" },
  { name: "Cave Shop (Dark Death Mountain) Center" },
  { name: "Cave Shop (Dark Death Mountain) Right" },
  { name: "Red Shield Shop Left" },
  { name: "Red Shield Shop Center" },
  { name: "Red Shield Shop Right" },
  { name: "Dark Lake Hylia Shop Left" },
  { name: "Dark Lake Hylia Shop Center" },
  { name: "Dark Lake Hylia Shop Right" },
  { name: "Dark World Lumberjack Shop Left" },
  { name: "Dark World Lumberjack Shop Center" },
  { name: "Dark World Lumberjack Shop Right" },
  { name: "Village of Outcasts Shop Left" },
  { name: "Village of Outcasts Shop Center" },
  { name: "Village of Outcasts Shop Right" },
  { name: "Dark World Potion Shop Left" },
  { name: "Dark World Potion Shop Center" },
  { name: "Dark World Potion Shop Right" },
  { name: "Light World Death Mountain Shop Left" },
  { name: "Light World Death Mountain Shop Center" },
  { name: "Light World Death Mountain Shop Right" },
  { name: "Kakariko Shop Left" },
  { name: "Kakariko Shop Center" },
  { name: "Kakariko Shop Right" },
  { name: "Cave Shop (Lake Hylia) Left" },
  { name: "Cave Shop (Lake Hylia) Center" },
  { name: "Cave Shop (Lake Hylia) Right" },
  { name: "Potion Shop Left" },
  { name: "Potion Shop Center" },
  { name: "Potion Shop Right" },
  { name: "Capacity Upgrade Left" },
  { name: "Capacity Upgrade Center" },
  { name: "Capacity Upgrade Right" },
  { name: "Old Man Sword Cave" },
  { name: "Take-Any #1" },
  { name: "Take-Any #2" },
  { name: "Take-Any #3" },
  { name: "Take-Any #4" },
];

const LttPCategory: ArchipelagoCategory = {
  category: "A Link to the Past",
  readableName: "The Legend of Zelda: A Link to the Past",
  settings: LttPSettings,
  items: LttPItems,
  locations: LttPLocations,
};

export { LttPCategory };
