import {
  ArchipelagoBooleanSetting,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  SettingType,
  ArchipelagoCategory,
} from "./core";

import { LttPCategory } from "./lttp";
import { OoTCategory } from "./oot";
import { TimespinnerCategory } from "./timespinner";
import { FactorioCategory } from "./factorio";
import { SubnauticaCategory } from "./subnautica";
import { ROR2Category } from "./ror2";
import { StSCategory } from "./sts";
import { MinecraftCategory } from "./minecraft";
import { SMCategory } from "./sm";
import { SoECategory } from "./soe";
import { FF1Category } from "./ff1";

/** The list of categories (e.g. games) currently available to the settings tool, not including global settings. */
const PartialCategoryList: ArchipelagoCategory[] = [
  // DO NOT MOVE LTTP FROM THE FIRST SPOT; it is required to be first for Berserker import compatibility
  LttPCategory, // inaugural
  FactorioCategory, // 0.0.2
  //HollowKnightCategory, // 0.0.2, currently disabled
  MinecraftCategory, // 0.1.0
  SubnauticaCategory, // 0.1.5
  StSCategory, // 0.1.7
  ROR2Category, // 0.1.7
  OoTCategory, // 0.1.7
  TimespinnerCategory, // 0.1.9
  SMCategory, // 0.2.0
  SoECategory, // 0.2.0
  FF1Category, // 0.2.1, no real support (must go to FFR website)
  //OriBFCategory, // not currently implemented
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
