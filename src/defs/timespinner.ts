import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoBooleanSetting,
  ArchipelagoCategory,
  ArchipelagoItem,
  DeathLinkOption,
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
    description:
      "Start with Meyef without having to take a death. Ideal for multiplayer games.",
    default: false,
  })
);
TimespinnerSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "QuickSeed",
    readableName: "Fast mode",
    description:
      "Adds the Talaria Attachment to your starting inventory, allowing Lunais to dash.",
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
TimespinnerSettings.push(DeathLinkOption);

export default TimespinnerSettings;

const TimespinnerItems: ArchipelagoItem[] = [
  // Equipment
  { name: "Eternal Crown" },
  { name: "Security Visor" },
  { name: "Engineer Goggles" },
  { name: "Leather Helmet" },
  { name: "Copper Helmet" },
  { name: "Pointy Hat" },
  { name: "Dragoon Helmet" },
  { name: "Buckle Hat" },
  { name: "Advisor Hat" },
  { name: "Librarian Hat" },
  { name: "Combat Helmet" },
  { name: "Captain's Cap" },
  { name: "Lab Glasses" },
  { name: "Empire Crown" },
  { name: "Viletian Crown" },
  { name: "Sunglasses" },
  { name: "Old Coat" },
  { name: "Trendy Jacket" },
  { name: "Security Vest" },
  { name: "Leather Jerkin" },
  { name: "Copper Breastplate" },
  { name: "Traveler's Cloak" },
  { name: "Dragoon Armor" },
  { name: "Midnight Cloak" },
  { name: "Advisor Robe" },
  { name: "Librarian Robe" },
  { name: "Military Armor" },
  { name: "Captain's Uniform" },
  { name: "Lab Coat" },
  { name: "Empress Robe" },
  { name: "Princess Dress" },
  { name: "Eternal Coat" },
  { name: "Synthetic Plume" },
  { name: "Cheveur Plume" },
  { name: "Metal Wristband" },
  { name: "Nymph Hairband" },
  { name: "Mother o' Pearl" },
  { name: "Bird Statue" },
  { name: "Chaos Stole" },
  { name: "Pendulum" },
  { name: "Chaos Horn" },
  { name: "Filigree Clasp" },
  { name: "Azure Stole" },
  { name: "Ancient Coin" },
  { name: "Shiny Rock" },
  { name: "Galaxy Earrings" },
  { name: "Selen's Bangle" },
  { name: "Glass Pumpkin" },
  { name: "Gilded Egg" },
  // Familiars
  { name: "Meyef", dependsOn: { StartWithMeyef: [false] } },
  { name: "Griffin" },
  { name: "Merchant Crow" },
  { name: "Kobo" },
  { name: "Sprite" },
  { name: "Demon" },
  // Use items
  { name: "Potion", max: 9 },
  { name: "Ether", max: 9 },
  { name: "Sand Vial", max: 9 },
  { name: "Hi-Potion", max: 9 },
  { name: "Hi-Ether", max: 9 },
  { name: "Sand Bottle", max: 9 },
  { name: "Berry Pick-Mi-Up", max: 9 },
  { name: "Berry Pick-Mi-Up+", max: 9 },
  { name: "Mind Refresh", max: 9 },
  { name: "Mind Refresh ULTRA", max: 9 },
  { name: "Antidote", max: 9 },
  { name: "Chaos Rose", max: 9 },
  { name: "Warp Shard", max: 9 },
  { name: "Dream Wisp", max: 9 },
  //{ name: "PlaceHolderItem1" },
  { name: "Lachiemi Sun", max: 9 },
  { name: "Jerky", max: 9 },
  { name: "Biscuit", max: 9 },
  { name: "Fried Cheveur", max: 9 },
  { name: "Sautéed Wyvern Tail", max: 9 },
  { name: "Unagi Roll", max: 9 },
  { name: "Cheveur au Vin", max: 9 },
  { name: "Royal Casserole", max: 9 },
  { name: "Spaghetti", max: 9 },
  { name: "Plump Maggot", max: 9 },
  { name: "Orange Juice", max: 9 },
  { name: "Filigree Tea", max: 9 },
  { name: "Empress Cake", max: 9 },
  { name: "Rotten Tail", max: 9 },
  { name: "Alchemy Tools", max: 9 },
  { name: "Galaxy Stone", max: 9 },
  { name: "Essence Crystal", max: 9 },
  { name: "Gold Ring", max: 9 },
  { name: "Gold Necklace", max: 9 },
  { name: "Herb", max: 9 },
  { name: "Mushroom", max: 9 },
  { name: "Plasma Crystal", max: 9 },
  { name: "Plasma IV Bag", max: 9 },
  { name: "Cheveur Drumstick", max: 9 },
  { name: "Wyvern Tail", max: 9 },
  { name: "Eel Meat", max: 9 },
  { name: "Cheveux Breast", max: 9 },
  { name: "Food Synthesizer", max: 9 },
  { name: "Cheveux Feather", max: 9 },
  { name: "Siren Ink", max: 9 },
  { name: "Plasma Core", max: 9 },
  { name: "Silver Ore", max: 9 },
  { name: "Historical Documents", max: 9 },
  { name: "MapReveal 0" },
  { name: "MapReveal 1" },
  { name: "MapReveal 2" },
  // Relics
  { name: "Timespinner Wheel" },
  { name: "Timespinner Spindle" },
  { name: "Timespinner Gear 1" },
  { name: "Timespinner Gear 2" },
  { name: "Timespinner Gear 3" },
  { name: "Twin Pyramid Key" },
  { name: "Celestial Sash" },
  { name: "Succubus Hairpin" },
  { name: "Talaria Attachment", dependsOn: { QuickSeed: [false] } },
  { name: "Water Mask" },
  { name: "Gas Mask" },
  { name: "Soul Scanner" },
  { name: "Security Keycard A" },
  { name: "Security Keycard B" },
  { name: "Security Keycard C" },
  { name: "Security Keycard D" },
  { name: "Library Keycard V" },
  { name: "Tablet" },
  { name: "Elevator Keycard" },
  { name: "Jewelry Box", dependsOn: { StartWithJewelryBox: [false] } },
  { name: "Goddess Brooch" },
  { name: "Wyrm Brooch" },
  { name: "Greed Brooch" },
  { name: "Eternal Brooch" },
  // Orb Melee
  { name: "Blue Orb" },
  { name: "Blade Orb" },
  { name: "Fire Orb" },
  { name: "Plasma Orb" },
  { name: "Iron Orb" },
  { name: "Ice Orb" },
  { name: "Wind Orb" },
  { name: "Gun Orb" },
  { name: "Umbra Orb" },
  { name: "Empire Orb" },
  { name: "Eye Orb" },
  { name: "Blood Orb" },
  { name: "Forbidden Tome" },
  { name: "Shattered Orb" },
  { name: "Nether Orb" },
  { name: "Radiant Orb" },
  { name: "Aura Blast" },
  { name: "Colossal Blade" },
  { name: "Infernal Flames" },
  { name: "Plasma Geyser" },
  { name: "Colossal Hammer" },
  { name: "Frozen Spires" },
  { name: "Storm Eye" },
  { name: "Arm Cannon" },
  { name: "Dark Flames" },
  { name: "Aura Serpent" },
  { name: "Chaos Blades" },
  { name: "Crimson Vortex" },
  { name: "Djinn Inferno" },
  { name: "Bombardment" },
  { name: "Corruption" },
  { name: "Lightwall" },
  // Orb Passives
  { name: "Bleak Ring" },
  { name: "Scythe Ring" },
  { name: "Pyro Ring" },
  { name: "Royal Ring" },
  { name: "Shield Ring" },
  { name: "Icicle Ring" },
  { name: "Tailwind Ring" },
  { name: "Economizer Ring" },
  { name: "Dusk Ring" },
  { name: "Star of Lachiem" },
  { name: "Oculus Ring" },
  { name: "Sanguine Ring" },
  { name: "Sun Ring" },
  { name: "Silence Ring" },
  { name: "Shadow Seal" },
  { name: "Hope Ring" },
  // Stat boosts
  { name: "Max HP" },
  { name: "Max Aura" },
  { name: "Max Sand" },
];

const TimespinnerCategory: ArchipelagoCategory = {
  category: "Timespinner",
  settings: TimespinnerSettings,
  items: TimespinnerItems,
};

export { TimespinnerCategory };
