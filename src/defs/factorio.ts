import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
  DeathLinkOption,
} from "./core";

/** The collection of settings for Factorio. */
const FactorioSettings: ArchipelagoSettingBase[] = [];

// TODO: all of those hidden settings under "world gen" and "starting items"

FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "max_science_pack",
    readableName: "Maximum science pack",
    description: "The level of science pack required to reach your goal.",
    values: {
      automation_science_pack: "Automation",
      logistic_science_pack: "Logistic",
      military_science_pack: "Military",
      chemical_science_pack: "Chemical",
      production_science_pack: "Production",
      utility_science_pack: "Utility",
      space_science_pack: "Space",
    },
    default: "space_science_pack",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "goal",
    readableName: "Goal",
    description: "Goal required to complete the game.",
    values: {
      rocket: "Rocket",
      satellite: "Satellite",
    },
    default: "rocket",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "tech_tree_layout",
    readableName: "Tech tree layout",
    description: "How technology trees are laid out.",
    values: {
      single: "Single",
      small_diamonds: "Small diamonds",
      medium_diamonds: "Medium diamonds",
      large_diamonds: "Large diamonds",
      small_pyramids: "Small pyramids",
      medium_pyramids: "Medium pyramids",
      large_pyramids: "Large pyramids",
      small_funnels: "Small funnels",
      medium_funnels: "Medium funnels",
      large_funnels: "Large funnels",
      trees: "Trees",
      choices: "Choices",
    },
    default: "single",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "tech_cost",
    readableName: "Technology cost scale",
    description: "How expensive technologies get.",
    values: {
      very_easy: "Very easy",
      easy: "Easy",
      kind: "Kind",
      normal: "Normal",
      hard: "Hard",
      very_hard: "Very hard",
      insane: "Unreasonable",
    },
    default: "normal",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "silo",
    readableName: "Rocket silo",
    description:
      "This option can randomize the recipe to create the silo, or alternatively auto-spawn it.",
    values: {
      vanilla: "Vanilla",
      randomize_recipe: "Randomize recipe",
      spawn: "Auto-spawn",
    },
    default: "vanilla",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "satellite",
    readableName: "Satellite",
    description:
      "This option can randomize the recipe to create the satellite.",
    values: {
      vanilla: "Vanilla",
      randomize_recipe: "Randomize recipe",
    },
    default: "vanilla",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "free_samples",
    readableName: "Free samples",
    description: "Whether you receive free items with technologies.",
    values: {
      none: "Off",
      single_craft: "Single craft",
      half_stack: "Half a stack",
      stack: "Full stack",
    },
    default: "stack",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "tech_tree_information",
    readableName: "Tech tree information",
    description: "What information will be displayed in the tech tree",
    values: {
      none: "None",
      advancement: "Advancement",
      full: "Full",
    },
    default: "full",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "recipe_time",
    readableName: "Recipe time",
    description:
      'Randomize the amount of time it will take to craft things. This affects all crafting types. "New" options ignore the original time.',
    values: {
      vanilla: "Vanilla",
      fast: "Fast – .25× to 1× speed",
      normal: "Normal – .5× to 2× speed",
      slow: "Slow – 1× to 4× speed",
      chaos: "Chaos – .25× to 4× speed",
      new_fast: "New fast – .25 to 2 seconds",
      new_normal: "New normal: – .25 to 10 seconds",
      new_slow: "New slow – 5 to 10 seconds",
    },
    default: "vanilla",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "recipe_ingredients",
    readableName: "Recipe ingredients",
    description:
      "Randomize ingredients for rocket and science pack, or rocket only.",
    values: {
      rocket: "Rocket only",
      science_pack: "Rocket and science pack",
    },
    default: "rocket",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "imported_blueprints",
    readableName: "Imported blueprints",
    description: "[not documented]",
    default: true,
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "progressive",
    readableName: "Progressive technologies",
    description: "[not documented]",
    values: {
      off: "Off",
      grouped_random: "Randomize groups",
      on: "On",
    },
    default: "on",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "evolution_traps",
    readableName: "Evolution traps",
    description:
      "When these are researched, they will also progress enemy evolution.",
    low: 0,
    high: 4,
    randomable: true,
    default: 0,
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "evolution_trap_increase",
    readableName: "Evolution trap increase",
    description:
      "When an evolution trap is researched, the percentage by which enemy evolution will be boosted.",
    low: 1,
    high: 100,
    default: 10,
    dependsOn: {
      evolution_traps: [1, 2, 3, 4],
    },
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "attack_traps",
    readableName: "Attack traps",
    description:
      "Adds a trigger to certain items which will cause the enemy to attack your base when the item is received.",
    low: 0,
    high: 4,
    randomable: true,
    default: 0,
  })
);
FactorioSettings.push(DeathLinkOption);

export default FactorioSettings;

// TODO: find a definitive list of items for Factorio

const FactorioCategory: ArchipelagoCategory = {
  category: "Factorio",
  settings: FactorioSettings,
};

export { FactorioCategory };

//------------======================

/*
FactorioSettings.push(
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
FactorioSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "",
    readableName: "",
    description: "",
    values: {},
    default: "",
  })
);
FactorioSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "",
    readableName: "",
    description: "",
    default: true,
  })
);
*/
