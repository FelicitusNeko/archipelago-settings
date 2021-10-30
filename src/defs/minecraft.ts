import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
} from "./core";

const MinecraftSettings: ArchipelagoSettingBase[] = [];

MinecraftSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "advancement_goal",
    readableName: "Advancement goal",
    description:
      "How many advancements are needed for the Ender Dragon to spawn.",
    low: 0,
    high: 87,
    randomable: true,
    default: 50,
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "egg_shards_required",
    readableName: "Egg Shards required",
    description:
      "How many Dragon Egg Shards are needed to spawn the Ender Dragon.",
    low: 0,
    high: 30,
    default: 0,
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "egg_shards_available",
    readableName: "Egg Shards available",
    description: "How many Dragon Egg Shards are added to the multiworld pool.",
    low: 0,
    high: 30,
    default: 0,
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_structures",
    readableName: "Shuffle structures",
    description:
      "Enable shuffling of villages, outposts, fortresses, bastions, and cities.",
    default: false,
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "structure_compasses",
    readableName: "Structure Compasses",
    description:
      "Adds Compasses to the multiworld pool that point to the nearest structure.",
    default: true,
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "bee_traps",
    readableName: "Beemizer",
    description:
      "Replace this percentage of junk items with bee traps. These will spawn angry bees around every player in the Minecraft multiworld.",
    low: 0,
    high: 100,
    randomable: true,
    default: 0,
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "combat_difficulty",
    readableName: "Combat difficulty",
    description:
      "Modifies the level of items logically required to explore dangerous dungeons and fight bosses.",
    values: {
      easy: "Easy",
      normal: "Normal",
      hard: "Hard",
    },
    default: "normal",
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "include_hard_advancements",
    readableName: "Include hard advancements",
    description: "Include certain RNG-reliant or tedious advancements.",
    default: false,
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "include_insane_advancements",
    readableName: "Include unreasonable advancements",
    description:
      'Include the advancements "How Did We Get Here?" and "Adventuring Time". Please don\'t chase these.',
    default: false,
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "include_postgame_advancements",
    readableName: "Include postgame advancements",
    description:
      "Include advancements only accessible after defeating the Ender Dragon.",
    default: false,
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "send_defeated_mobs",
    readableName: "Super Minecraft 35",
    description:
      "Send defeated mobs to other people in the Minecraft multiworld.",
    default: false,
  })
);

export default MinecraftSettings;
