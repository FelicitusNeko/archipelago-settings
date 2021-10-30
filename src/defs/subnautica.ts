import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
} from "./core";

const SubnauticaSettings: ArchipelagoSettingBase[] = [];

SubnauticaSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "item_pool",
    readableName: "Item pool",
    description: "Whether to include all items or only valuables to the multiworld item pool.",
    values: {
      standard: 'All treasures',
      valuable: 'Valuables only',
    },
    default: "standard",
  })
);

export default SubnauticaSettings;