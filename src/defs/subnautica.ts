import {
  SettingType,
  ArchipelagoStringSetting,
  ArchipelagoSettingBase,
  ArchipelagoCategory,
  ArchipelagoItem,
  ArchipelagoLocation,
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

const SubnauticaLocations: ArchipelagoLocation[] = [
  { name: "Blood Kelp Trench Wreck - Outside Databox" },
  { name: "Blood Kelp Trench Wreck - Inside Databox" },
  { name: "Blood Kelp Trench Wreck - PDA" },
  { name: "Bulb Zone West Wreck - Outside Databox" },
  { name: "Bulb Zone West Wreck - Under Databox" },
  { name: "Bulb Zone West Wreck - Inside Databox" },
  { name: "Bulb Zone West Wreck - PDA" },
  { name: "Bulb Zone East Wreck - Databox" },
  { name: "Dunes North Wreck - Outside Databox" },
  { name: "Dunes North Wreck - Office Databox" },
  { name: "Dunes North Wreck - PDA" },
  { name: "Dunes North Wreck - Cargo Databox" },
  { name: "Dunes West Wreck - Databox" },
  { name: "Dunes East Wreck - Outside Databox" },
  { name: "Dunes East Wreck - Inside Databox" },
  { name: "Grand Reef North Wreck - Outside Databox" },
  { name: "Grand Reef North Wreck - Elevator Databox" },
  { name: "Grand Reef North Wreck - Bottom Databox" },
  { name: "Grand Reef North Wreck - Hangar PDA" },
  { name: "Grand Reef South Wreck - Trench Databox" },
  { name: "Grand Reef South Wreck - Comms Databox" },
  { name: "Grand Reef South Wreck - Outside Databox" },
  { name: "Grand Reef South Wreck - PDA" },
  { name: "Grassy Plateaus South Wreck - Databox" },
  { name: "Grassy Plateaus South Wreck - PDA" },
  { name: "Grassy Plateaus East Wreck - Breach Databox" },
  { name: "Grassy Plateaus East Wreck - Hangar Databox" },
  { name: "Grassy Plateaus West Wreck - Locker PDA" },
  { name: "Grassy Plateaus West Wreck - Data Terminal" },
  { name: "Grassy Plateaus West Wreck - Databox" },
  { name: "Safe Shallows Wreck - PDA" },
  { name: "Kelp Forest Wreck - Databox" },
  { name: "Kelp Forest Wreck - PDA" },
  { name: "Mountains West Wreck - Outside Databox" },
  { name: "Mountains West Wreck - Data Terminal" },
  { name: "Mountains West Wreck - Hangar Databox" },
  { name: "Mountains West Wreck - Office Databox" },
  { name: "Mountains East Wreck - Comms Databox" },
  { name: "Mountains East Wreck - Outside Databox" },
  { name: "Northwestern Mushroom Forest Wreck - Cargo Databox" },
  { name: "Northwestern Mushroom Forest Wreck - Office Databox" },
  { name: "Northwestern Mushroom Forest Wreck - PDA" },
  { name: "Sea Treader's Path Wreck - Outside Databox" },
  { name: "Sea Treader's Path Wreck - Hangar Databox" },
  { name: "Sea Treader's Path Wreck - Lobby Databox" },
  { name: "Sea Treader's Path Wreck - PDA" },
  { name: "Sparse Reef Wreck - Locker Databox" },
  { name: "Sparse Reef Wreck - Outside Databox" },
  { name: "Sparse Reef Wreck - Lab Databox" },
  { name: "Underwater Islands Wreck - Outside Databox" },
  { name: "Underwater Islands Wreck - Hangar Databox" },
  { name: "Underwater Islands Wreck - Data Terminal" },
  { name: "Underwater Islands Wreck - Cable Databox" },
  { name: "Underwater Islands Wreck - Pipes Databox 1" },
  { name: "Underwater Islands Wreck - Pipes Databox 2" },
  { name: "Degasi Seabase - Deep Grand Reef - Bedroom Databox" },
  { name: "Degasi Seabase - Deep Grand Reef - Observatory Databox" },
  { name: "Degasi Seabase - Deep Grand Reef - Bedroom PDA" },
  { name: "Degasi Seabase - Deep Grand Reef - Outside PDA" },
  { name: "Degasi Seabase - Deep Grand Reef - Observatory PDA" },
  { name: "Degasi Seabase - Deep Grand Reef - Lab PDA" },
  { name: "Floating Island - Lake PDA" },
  { name: "Degasi Seabase - Floating Island - Databox" },
  { name: "Degasi Seabase - Floating Island - Room PDA" },
  { name: "Degasi Seabase - Floating Island - Green Wall PDA" },
  { name: "Degasi Seabase - Floating Island - Corridor PDA" },
  { name: "Degasi Seabase - Floating Island - North Observatory PDA" },
  { name: "Degasi Seabase - Floating Island - South Observatory PDA" },
  { name: "Jellyshroom Cave - PDA" },
  { name: "Degasi Seabase - Jellyshroom Cave - Bedroom Databox" },
  { name: "Degasi Seabase - Jellyshroom Cave - Detached PDA" },
  { name: "Degasi Seabase - Jellyshroom Cave - Office PDA" },
  { name: "Degasi Seabase - Jellyshroom Cave - Locker PDA" },
  { name: "Degasi Seabase - Jellyshroom Cave - Bedroom PDA" },
  { name: "Degasi Seabase - Jellyshroom Cave - Observatory PDA" },
  { name: "Lifepod 2 - Databox" },
  { name: "Lifepod 2 - PDA" },
  { name: "Lifepod 3 - Databox" },
  { name: "Lifepod 3 - PDA" },
  { name: "Lifepod 4 - Databox" },
  { name: "Lifepod 4 - PDA" },
  { name: "Lifepod 6 - Databox" },
  { name: "Lifepod 6 - Inside PDA" },
  { name: "Lifepod 6 - Outside PDA" },
  { name: "Lifepod 7 - PDA" },
  { name: "Lifepod 12 - Databox" },
  { name: "Lifepod 12 - PDA" },
  { name: "Lifepod 13 - Databox" },
  { name: "Lifepod 13 - PDA" },
  { name: "Lifepod 17 - PDA" },
  { name: "Lifepod 19 - Databox" },
  { name: "Lifepod 19 - Outside PDA" },
  { name: "Lifepod 19 - Inside PDA" },
  { name: "Aurora Seamoth Bay - Upgrade Console" },
  { name: "Aurora Drive Room - Upgrade Console" },
  { name: "Aurora Prawn Suit Bay - Upgrade Console" },
  { name: "Aurora - Office PDA" },
  { name: "Aurora - Corridor PDA" },
  { name: "Aurora - Cargo Bay PDA" },
  { name: "Aurora - Seamoth Bay PDA" },
  { name: "Aurora - Medkit Locker PDA" },
  { name: "Aurora - Locker PDA" },
  { name: "Aurora - Canteen PDA" },
  { name: "Aurora - Cabin 4 PDA" },
  { name: "Aurora - Cabin 7 PDA" },
  { name: "Aurora - Cabin 1 PDA" },
  { name: "Aurora - Captain PDA" },
  { name: "Aurora - Ring PDA" },
  { name: "Aurora - Lab PDA" },
  { name: "Aurora - Office Data Terminal" },
  { name: "Aurora - Captain Data Terminal" },
  { name: "Aurora - Battery Room Data Terminal" },
  { name: "Aurora - Lab Data Terminal" },
  { name: "Quarantine Enforcement Platform's - Upper Alien Data Terminal" },
  { name: "Quarantine Enforcement Platform's - Mid Alien Data Terminal" },
  { name: "Dunes Sanctuary - Alien Data Terminal" },
  { name: "Deep Sparse Reef Sanctuary - Alien Data Terminal" },
  { name: "Northern Blood Kelp Zone Sanctuary - Alien Data Terminal" },
  { name: "Lost River Laboratory Cache - Alien Data Terminal" },
  { name: "Disease Research Facility - Upper Alien Data Terminal" },
  { name: "Disease Research Facility - Mid Alien Data Terminal" },
  { name: "Disease Research Facility - Lower Alien Data Terminal" },
  { name: "Alien Thermal Plant - Entrance Alien Data Terminal" },
  { name: "Alien Thermal Plant - Green Alien Data Terminal" },
  { name: "Alien Thermal Plant - Yellow Alien Data Terminal" },
  { name: "Primary Containment Facility's Antechamber - Alien Data Terminal" },
  { name: "Primary Containment Facility's Egg Laboratory - Alien Data Terminal" },
  { name: "Primary Containment Facility's Pipe Room - Alien Data Terminal" },
  { name: "Grassy Plateaus West Wreck - Beam PDA" },
  { name: "Floating Island - Cave Entrance PDA" },
]

const SubnauticaCategory: ArchipelagoCategory = {
  category: "Subnautica",
  settings: SubnauticaSettings,
  items: SubnauticaItems,
  locations: SubnauticaLocations,
};

export { SubnauticaCategory };
