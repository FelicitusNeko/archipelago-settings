import {
  ArchipelagoBooleanSetting,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  SettingType,
  ArchipelagoCategory,
} from "./core";

import LttPSettings from "../defs/lttp";
import OoTSettings from "../defs/oot";
import TimespinnerSettings from "../defs/timespinner";
import FactorioSettings from "../defs/factorio";
import SubnauticaSettings from "../defs/subnautica";
import ROR2Settings from "../defs/ror2";
import SlayTheSpireSettings from "../defs/slaythespire";
import MinecraftSettings from "../defs/minecraft";

/** The list of categories (e.g. games) currently available to the settings tool, not including global settings. */
const PartialCategoryList: ArchipelagoCategory[] = [
  // DO NOT MOVE LTTP FROM THE FIRST SPOT; it is required to be first for Berserker import compatibility
  {
    category: "A Link to the Past",
    readableName: "The Legend of Zelda: A Link to the Past",
    settings: LttPSettings,
  },
  {
    category: "Ocarina of Time",
    readableName: "The Legend of Zelda: Ocarina of Time",
    settings: OoTSettings,
  },
  { category: "Timespinner", settings: TimespinnerSettings },
  { category: "Factorio", settings: FactorioSettings },
  { category: "Subnautica", settings: SubnauticaSettings },
  { category: "Risk of Rain 2", settings: ROR2Settings },
  { category: "Slay the Spire", settings: SlayTheSpireSettings },
  { category: "Minecraft", settings: MinecraftSettings },
];

/** The global settings applicable to all Archipelago games. */
const GlobalSettings: ArchipelagoSettingBase[] = [];
GlobalSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "game",
    readableName: "Game",
    description: "Determines which game you'll be playing.",
    values: (() => {
      const retval: Record<string, string> = {};
      for (const { category, readableName } of PartialCategoryList)
        if (category) retval[category] = readableName ?? category;
      return retval;
    })(),
    default: PartialCategoryList[0].category!,
  })
);
GlobalSettings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "accessibility",
    readableName: "Item accessibility",
    description: "How much the game expects you to do checks and get items.",
    values: {
      locations:
        "All locations – You can go everywhere, and so, all checks are eventually accessible",
      items:
        "All items – All progression items are accessible, but all locations won't be",
      none: "Beatable – The only guarantee is that you'll have the bare necessity to beat the game",
    },
    default: "locations",
  })
);
GlobalSettings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "progression_balancing",
    readableName: "Progression balancing",
    description:
      "The more players have this off, the more likely BK/DQ mode is to happen for people who have this off even if everyone's playing at an even tick.",
    default: true,
  })
);

export default GlobalSettings;

/** The list of categories (e.g. games) currently available to the settings tool. */
const CategoryList: ArchipelagoCategory[] = PartialCategoryList.slice();
CategoryList.unshift({ category: null, settings: GlobalSettings });
export { CategoryList };

//------------======================

/*
Settings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "",
    readableName: "",
    description: "",
    low: 0,
    high: 0,
    default: 0,
  })
);
Settings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "",
    readableName: "",
    description: "",
    values: {},
    default: "",
  })
);
Settings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "",
    readableName: "",
    description: "",
    default: true,
  })
);
*/
