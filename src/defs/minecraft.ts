import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
  ArchipelagoItem,
  DeathLinkOption,
} from "./core";

const MinecraftSettings: ArchipelagoSettingBase[] = [];

/** The collection of settings for Minecraft. */
MinecraftSettings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "advancement_goal",
    readableName: "Advancement goal",
    description:
      "How many advancements are needed for the Ender Dragon to spawn.",
    low: 0,
    high: 92,
    randomable: true,
    default: 40,
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
    high: 40,
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
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "required_bosses",
    readableName: "Boss goal",
    description: "Boss or bosses to defeat to complete the goal.",
    values: {
      none: "None – Get your advancements and win",
      ender_dragon: "Ender Dragon",
      wither: "Wither",
      both: "Both",
    },
    default: "ender_dragon",
  })
);
MinecraftSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "shuffle_structures",
    readableName: "Shuffle structures",
    description:
      "Enable shuffling of villages, outposts, fortresses, bastions, and cities.",
    default: true,
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
    name: "include_unreasonable_advancements",
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
MinecraftSettings.push(DeathLinkOption);

export default MinecraftSettings;

const MinecraftItems: ArchipelagoItem[] = [
  { name: "Archery" },
  { name: "Progressive Resource Crafting" },
  { name: "Brewing" },
  { name: "Enchanting" },
  { name: "Bucket" },
  { name: "Flint and Steel" },
  { name: "Bed" },
  { name: "Bottles" },
  { name: "Shield" },
  { name: "Fishing Rod" },
  { name: "Campfire" },
  { name: "Progressive Weapons" },
  { name: "Progressive Tools" },
  { name: "Progressive Armor" },
  { name: "8 Netherite Scrap" },
  { name: "8 Emeralds" },
  { name: "4 Emeralds" },
  { name: "Channeling Book" },
  { name: "Silk Touch Book" },
  { name: "Sharpness III Book" },
  { name: "Piercing IV Book" },
  { name: "Looting III Book" },
  { name: "4 Diamond Ore" },
  { name: "16 Iron Ore" },
  { name: "500 XP" },
  { name: "100 XP" },
  { name: "50 XP" },
  { name: "3 Ender Pearls" },
  { name: "4 Lapis Lazuli" },
  { name: "16 Porkchops" },
  { name: "8 Gold Ore" },
  { name: "Rotten Flesh" },
  { name: "Single Arrow" },
  { name: "32 Arrows" },
  { name: "Saddle" },
  { name: "Shulker Box" },
  { name: "Dragon Egg Shard" },
  { name: "Spyglass" },
  { name: "Bee Trap (Minecraft)" },
  ...[
    "Village",
    "Pillager Outpost",
    "Nether Fortress",
    "Bastion Remnant",
    "End City",
  ].map((i) => {
    return {
      name: `Structure Compass (${i})`,
      dependsOn: { structure_compasses: [true] },
    } as ArchipelagoItem;
  }),
];

const MinecraftCategory: ArchipelagoCategory = {
  category: "Minecraft",
  settings: MinecraftSettings,
  items: MinecraftItems,
};

export { MinecraftCategory };
