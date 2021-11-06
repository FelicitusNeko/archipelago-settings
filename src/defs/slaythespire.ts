import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
} from "./core";

/** The collection of settings for Slay the Spire. */
const SlayTheSpireSettings: ArchipelagoSettingBase[] = [];

SlayTheSpireSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "character",
    readableName: "Character",
    description: "Which character you will be playing as.",
    values: {
      ironclad: "Ironclad",
      silent: "Silent",
      defect: "Defect",
      watcher: "Watcher",
    },
    default: "ironclad",
  })
);
SlayTheSpireSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "ascension",
    readableName: "Ascension",
    description: "Which ascension you'll be playing on.",
    low: 0,
    high: 20,
    randomable: true,
    default: 0,
  })
);
SlayTheSpireSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "heart_run",
    readableName: "Heart run",
    description:
      "If enabled, you'll need to collect the three keys and defeat the Heart in order to complete the game.",
    default: true,
  })
);

export default SlayTheSpireSettings;

const SlayTheSpireCategory: ArchipelagoCategory = {
  category: "Slay the Spire",
  settings: SlayTheSpireSettings,
};

export { SlayTheSpireCategory };
