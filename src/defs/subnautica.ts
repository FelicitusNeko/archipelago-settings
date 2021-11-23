import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
  ArchipelagoCategory,
  ArchipelagoItem,
} from "./core";
import subnauticaItems from "./Subnautica/items.json";

interface SubnauticaItem {
  id: number;
  count: number;
  progression: boolean;
  tech_type: string;
  name: string;
}

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

const SubnauticaItems: ArchipelagoItem[] = (
  subnauticaItems as SubnauticaItem[]
).map((i) => {
  const retval: ArchipelagoItem = { name: i.tech_type, max: i.count };
  if (i.name !== i.tech_type) retval.readableName = i.name;
  if (!i.progression) retval.dependsOn = { item_pool: ["standard"] };
  return retval;
});

const SubnauticaCategory: ArchipelagoCategory = {
  category: "Subnautica",
  settings: SubnauticaSettings,
  items: SubnauticaItems,
};

export { SubnauticaCategory };
