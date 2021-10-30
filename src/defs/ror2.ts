import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
} from "./core";

const ROR2Settings: ArchipelagoSettingBase[] = [];

ROR2Settings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "total_locations",
    readableName: "Total locations",
    description: "How many location checks will be added to the playthrough.",
    low: 10,
    high: 100,
    randomable: true,
    default: 20,
  })
);
ROR2Settings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "start_with_revive",
    readableName: "Dio's Best Friend",
    description: "Start with Dio's Best Friend, for one extra life.",
    default: true,
  })
);
ROR2Settings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "total_revivals",
    readableName: "Total DBFs in pool",
    description:
      "How many Dio's Best Friends (extra lives) are in the multiworld pool.",
    low: 0,
    high: 10,
    randomable: true,
    default: 4,
  })
);
ROR2Settings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "item_pickup_step",
    readableName: "Item pickup step",
    description:
      "How many item pickups are required before the next one triggers an AP check.",
    low: 0,
    high: 5,
    randomable: true,
    default: 2,
  })
);
ROR2Settings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "enable_lunar",
    readableName: "Lunar items",
    description: "Adds Lunar items to multiworld pool.",
    default: true,
  })
);
ROR2Settings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "item_pool_presets",
    readableName: "Use item pool presets",
    description:
      "Whether to use a preset item pool distribution. If disabled, you'll be able to set item types manually.",
    default: true,
  })
);
ROR2Settings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "item_weights",
    readableName: "Item pool preset",
    description: "The set of weights to be used in this run.",
    values: {
      default: "Default",
      new: "New – Proposed preset to replace the current default in the future",
      uncommon: "Lots of uncommons",
      legendary: "Lots of legendaries",
      lunartic: "Oops! All Lunar Items",
      chaos: "Chaos – Mostly totally random, lower weights for rare stuff",
      no_scraps: "No scrap items",
      even: "Even chance for everything",
      scraps_only: "Only scrap items",
    },
    default: "default",
    dependsOn: {
      item_pool_presets: [true],
    },
  })
);

const genWeightOpts = [
  ["green_scrap", "Green Scraps", 16],
  ["red_scrap", "Red Scraps", 4],
  ["yellow_scrap", "Yellow Scraps", 1],
  ["white_scrap", "White Scraps", 32],
  ["common_item", "Common items", 64],
  ["uncommon_item", "Uncommon items", 32],
  ["legendary_item", "Legendary items", 8],
  ["boss_item", "Boss items", 4],
  ["lunar_item", "Lunar items", 16],
  ["equipment", "Equipment items", 32],
];

for (const weightSet of genWeightOpts)
  ROR2Settings.push(
    Object.seal<ArchipelagoNumericSetting>({
      type: SettingType.Numeric,
      name: weightSet[0] as string,
      readableName: weightSet[1] as string,
      description: `The weight of ${
        weightSet[1] as string
      } in the multiworld pool.`,
      low: 0,
      high: 100,
      default: weightSet[2] as number,
      randomable: true,
      dependsOn: {
        item_pool_presets: [false],
      },
    })
  );

export default ROR2Settings;
