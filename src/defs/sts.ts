import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
  ArchipelagoItem,
  ArchipelagoLocation,
} from "./core";

/** The collection of settings for Slay the Spire. */
const StSSettings: ArchipelagoSettingBase[] = [];

StSSettings.push(
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
StSSettings.push(
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
StSSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "heart_run",
    readableName: "Heart run",
    description:
      "If enabled, you'll need to collect the three keys and defeat the Heart in order to complete the game.",
    default: true,
  })
);

export default StSSettings;

const StSItems: ArchipelagoItem[] = [
  { name: "Card Draw", max: 15 },
  { name: "Rare Card Draw", max: 3 },
  { name: "Relic", max: 10 },
  { name: "Boss Relic", max: 3 },
];

const StSLocations: ArchipelagoLocation[] = [
  { name: "Card Draw 1" },
  { name: "Card Draw 2" },
  { name: "Card Draw 3" },
  { name: "Card Draw 4" },
  { name: "Card Draw 5" },
  { name: "Card Draw 6" },
  { name: "Card Draw 7" },
  { name: "Card Draw 8" },
  { name: "Card Draw 9" },
  { name: "Card Draw 10" },
  { name: "Card Draw 11" },
  { name: "Card Draw 12" },
  { name: "Card Draw 13" },
  { name: "Card Draw 14" },
  { name: "Card Draw 15" },
  { name: "Relic 1" },
  { name: "Relic 2" },
  { name: "Relic 3" },
  { name: "Relic 4" },
  { name: "Relic 5" },
  { name: "Relic 6" },
  { name: "Relic 7" },
  { name: "Relic 8" },
  { name: "Relic 9" },
  { name: "Relic 10" },
  { name: "Rare Card Draw 1" },
  { name: "Rare Card Draw 2" },
  { name: "Rare Card Draw 3" },
  { name: "Boss Relic 1" },
  { name: "Boss Relic 2" },
  { name: "Boss Relic 3" },
]

const StSCategory: ArchipelagoCategory = {
  category: "Slay the Spire",
  settings: StSSettings,
  items: StSItems,
  locations: StSLocations
};

export { StSCategory };
