import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
} from "./core";

const SoESettings: ArchipelagoSettingBase[] = [];

SoESettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "difficulty",
    readableName: "Difficulty",
    description: "Changes relative spell cost and other things.",
    values: {
      easy: 'Easy',
      normal: 'Normal',
      hard: 'Hard',
      chaos: 'Chaos',
    },
    default: "normal",
  })
);
SoESettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "money_modifier",
    readableName: "Money modifier",
    description: "Percentage by which money drops will be modified.",
    randomable: true,
    low: 1,
    high: 2500,
    default: 200,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "exp_modifier",
    readableName: "Experience modifier",
    description: "Percentage by which experience gains will be modified.",
    randomable: true,
    low: 1,
    high: 2500,
    default: 200,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fix_sequence",
    readableName: "Fix sequence breaks",
    description: "Fixes some sequence breaks.",
    default: true,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fix_cheats",
    readableName: "Fix cheats",
    description: "Fixes cheats left in by the developers (excluding Desert Skip).",
    default: true,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fix_infinite_ammo",
    readableName: "Fix Infinite Ammo",
    description: "Fixes the Infinite Ammo glitch.",
    default: false,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fix_atlas_glitch",
    readableName: "Fix Atlas glitch",
    description: "Fixes the bug where Atlas causes stats to underflow.",
    default: false,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "fix_wings_glitch",
    readableName: "Fix Wings glitch",
    description: "Fixes Wings making you invincible in some areas.",
    default: false,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shorter_dialogs",
    readableName: "Reduce dialog",
    description: "Cuts out some of the in-game dialog.",
    default: false,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "short_boss_rush",
    readableName: "Short Boss Rush",
    description: "If enabled, the Boss Rush will start at Magmar, and HP will be cut in half.",
    default: false,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "ingredienizer",
    readableName: "Ingredienizer",
    description: "Shuffles or randomizes spell ingredients",
    values: {
      off: "Off",
      on: "On – Shuffled",
      chaos: "Chaos – Randomized",
    },
    default: "on",
  })
);
SoESettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "sniffamizer",
    readableName: "Sniffamizer",
    description: "Shuffles or randomizes drops in sniff locations.",
    values: {
      off: "Off",
      on: "On – Shuffled",
      chaos: "Chaos – Randomized",
    },
    default: "on",
  })
);
SoESettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "callbeadamizer",
    readableName: "Callbeadamizer",
    description: "Shuffles Call Bead characters or spells.",
    values: {
      off: "Off",
      on: "On – Shuffled",
      chaos: "Chaos – Randomized",
    },
    default: "on",
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "musicmizer",
    readableName: "Musicmizer",
    description: "Randomizes music for some rooms.",
    default: true,
  })
);
SoESettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "doggomizer",
    readableName: "Doggomizer",
    description: "Randomize the dog in certain situations.",
    values: {
      off: "Off",
      on: "On – Shuffled every act",
      chaos: "Chaos – Randomized every screen",
      pupdunk: "Pupdunk – Everypupper everywhere!"
    },
    default: "off",
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "turdo_mode",
    readableName: "Turdo Mode",
    description: "Replaces offensive spells by Turd Balls with varying strength, and weakens weapons.",
    default: false,
  })
);

export default SoESettings;

// TODO: find an item list for Secret of Evermore, if one exists
//const SoEItems: ArchipelagoItem[] = [{ name: "" }];

const SoECategory: ArchipelagoCategory = {
  category: "Secret of Evermore",
  settings: SoESettings,
  //items: SoEItems,
};

export { SoECategory };

//------------======================

/*
SoESettings.push(
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
SoESettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "",
    readableName: "",
    description: "",
    values: {},
    default: "",
  })
);
SoESettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "",
    readableName: "",
    description: "",
    default: true,
  })
);
*/
