import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoCategory,
} from "./core";

const FF1Settings: ArchipelagoSettingBase[] = [];

FF1Settings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "nosettings",
    readableName: "Settings aren't here",
    description:
      "Currently, Archipelago has no built-in support for settings for Final Fantasy. You'll have to generate your settings file at the Final Fantasy Randomizer website.",
    values: {
      no1: "Dang",
      no2: "That sucks",
      no3: "Oh well",
      no4: "I want to speak to your manager",
    },
    default: "no1",
  })
);

export default FF1Settings;

const FF1Category: ArchipelagoCategory = {
  category: "Final Fantasy",
  settings: FF1Settings,
};

export { FF1Category };

//------------======================

/*
Settings.push(
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
Settings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "",
    readableName: "",
    description: "",
    values: {},
    default: "",
  })
);
Settings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "",
    readableName: "",
    description: "",
    default: true,
  })
);
*/
