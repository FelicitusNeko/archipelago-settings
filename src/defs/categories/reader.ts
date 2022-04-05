//import { APSettingJson } from "../../routes/settingTypes/APBaseSetting";
import { APGameItem, APGameLocation } from "../core";
import { APMetaSetting, APMetaSettingJson } from "../generate";
import { APItemManager } from "../../objs/entities/APItemManager";
import { APLocationManager } from "../../objs/entities/APLocationManager";

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
import roguelegacy from "./011-roguelegacy.json";
import sm64 from "./012-sm64.json";
import raft from "./013-raft.json";
import v from "./014-vvvvvv.json";
import meritous from "./015-meritous.json";
import smz3 from "./016-smz3.json";
import cf from "./017-checksfinder.json";
import idle from "./018-archipidle.json";
import hk from "./019-hollowknight.json";

/**
 * The JSON representation of an Archipelago category.
 * @since 1.0.0
 */
export interface APCategory {
  /** The internal name of the category. */
  category: string | null;
  /** The user-readable name of the category. */
  readableName?: string;
  /** The numeric index of the category. */
  index: number;
  /** The collection of settings for this category. */
  settings: APMetaSetting[];
  /** The collection of defined items for this category. */
  items?: APItemManager;
  /** The collection of defined locations for this category. */
  locations?: APLocationManager;
  /** Settings that have dependencies on them. */
  hasDeps?: string[];
}

interface APCategoryJson {
  /** The internal name of the category. */
  category: string | null;
  /** The user-readable name of the category. */
  readableName?: string;
  /** The numeric index of the category. */
  index: number;
  /** The collection of settings for this category. */
  settings: APMetaSettingJson[];
  /** The collection of defined items for this category. */
  items?: APGameItem[];
  /** The collection of defined locations for this category. */
  locations?: APGameLocation[];
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
  roguelegacy, // 0.2.3
  sm64, // 0.2.4
  raft, // 0.2.4
  v, // 0.2.4
  meritous, // 0.3.0
  smz3, // 0.3.0
  cf, // 0.3.0, no settings
  idle, // 0.3.0, no settings
  hk, // 0.3.1

//] as APCategoryJson[]).sort((a,b) => a.index - b.index);
] as APCategoryJson[]).sort((a,b) => {
  if (!a.category) return -1;
  if (!b.category) return 1;
  return (a.readableName ?? a.category).localeCompare(b.readableName ?? b.category);
});

export { APCategoryData };
