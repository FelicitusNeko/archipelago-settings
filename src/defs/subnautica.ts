import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
} from "./core";

/** The collection of settings for Subnautica. */
const SubnauticaSettings: ArchipelagoSettingBase[] = [];

SubnauticaSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "item_pool",
    readableName: "Item pool",
    description:
      "Whether to include all items or only valuables to the multiworld item pool.",
    values: {
      standard: "All treasures",
      valuable:
        "Valuables only – Everything else is sent to you immediately, and valuables are duplicated",
    },
    default: "standard",
  })
);

export default SubnauticaSettings;
