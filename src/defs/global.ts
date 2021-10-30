import {
  ArchipelagoBooleanSetting,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  SettingType,
} from "./core";

const GlobalSettings: ArchipelagoSettingBase[] = [];
GlobalSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "game",
    readableName: "Game",
    description: "Determines which game you'll be playing.",
    values: {
      "A Link to the Past": "The Legend of Zelda: A Link to the Past",
      "Ocarina of Time": "The Legend of Zelda: Ocarina of Time",
      Timespinner: "Timespinner",
      Factorio: "Factorio",
      Subnautica: "Subnautica",
      "Risk of Rain 2": "Risk of Rain 2",
      "Slay the Spire": "Slay the Spire",
      Minecraft: "Minecraft",
    },
    default: "A Link to the Past",
  })
);
GlobalSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "accessibility",
    readableName: "Item accessibility",
    description: "How much the game expects you to do checks and get items.",
    values: {
      locations:
        "All locations – You can go everywhere, and so, all checks are eventually accessible",
      items:
        "All items – All progression items are accessible, but all locations won't be",
      none: "Beatable – The only guarantee is that you'll have the bare necessity to beat the game",
    },
    default: "locations",
  })
);
GlobalSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "progression_balancing",
    readableName: "Progression balancing",
    description:
      "The more players have this off, the more likely BK/DQ mode is to happen for people who have this off even if everyone's playing at an even tick.",
    default: true,
  })
);

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

export default GlobalSettings;
