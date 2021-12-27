import { APSettingJson } from "../../routes/settingTypes/APBaseSetting";
import { ArchipelagoItem, ArchipelagoLocation } from "../core";

// afaik there really isn't any better way to do this with create-react-app
import root from "./null.json";
import lttp from "./000-lttp.json";
import factorio from "./001-factorio.json";
import minecraft from "./002-minecraft.json";
import subnautica from "./003-subnautica.json";
import sts from "./004-sts.json";
import ror2 from "./005-ror2.json";
import oot from "./006-oot.json";
import timespin from "./007-timespin.json";
import smetroid from "./008-sm.json";
import evermore from "./009-soe.json";
import ff1 from "./010-ff1.json";

/** The JSON representation of an Archipelago category. */
export interface APCategoryJson<T> {
  /** The internal name of the category. */
  category: string | null;
  /** The user-readable name of the category. */
  readableName?: string;
  /** The numeric index of the category. */
  index: number;
  /** The collection of settings for this category. */
  settings: T[];
  /**
   * The collection of defined items for this category.
   * @since 0.9.4
   */
  items?: ArchipelagoItem[];
  /**
   * The collection of defined locations for this category.
   * @since 0.9.4
   */
  locations?: ArchipelagoLocation[];
}

const APCategoryData = ([
  root, // global settings
  lttp, // inaugural
  factorio, // 0.0.2
  minecraft, // 0.1.0
  subnautica, // 0.1.5
  sts, // 0.1.7
  ror2, // 0.1.7
  oot, // 0.1.7
  timespin, // 0.1.9
  smetroid, // 0.2.0
  evermore, // 0.2.0
  ff1, // 0.2.1, no real support (must go to FFR website)
] as APCategoryJson<APSettingJson<any>>[]).sort((a,b) => a.index - b.index);

export { APCategoryData };
