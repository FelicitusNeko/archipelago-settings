import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoBooleanSetting,
} from "./core";

/** The collection of settings for Timespinner. */
const TimespinnerSettings: ArchipelagoSettingBase[] = [];

TimespinnerSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "StartWithJewelryBox",
    readableName: "Start with Jewelry Box",
    description: "Whether you start with the Jewelry Box unlocked.",
    default: false,
  })
);
TimespinnerSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "DownloadableItems",
    readableName: "Downloadable items",
    description:
      "If enabled, you'll be able to download items at terminals using the Tablet.",
    default: false,
  })
);
TimespinnerSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "FacebookMode",
    readableName: "Facebook mode",
    description:
      "Enables the use of Oculus VR devices to find weak spots in walls and floors.",
    default: false,
  })
);
TimespinnerSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "StartWithMeyef",
    readableName: "Start with Meyef",
    description: "Allows the use of Meyef. Ideal for multiplayer games.",
    default: false,
  })
);
TimespinnerSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "QuickSeed",
    readableName: "Fast mode",
    description: "Adds the Talaria attachment to your starting inventory.",
    default: false,
  })
);
TimespinnerSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "SpecificKeycards",
    readableName: "Restricted keycards",
    description:
      "If enabled, keycards will only unlock their corresponding doors.",
    default: false,
  })
);
TimespinnerSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "Inverted",
    readableName: "Inverted mode",
    description: "Whether the game will start in the past.",
    default: false,
  })
);

export default TimespinnerSettings;
