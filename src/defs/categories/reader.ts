//import { APSettingJson } from "../../routes/settingTypes/APBaseSetting";
import { APGameItem, APGameLocation } from "../core";
import { APMetaSetting, APMetaSettingJson } from "../generate";
import { APItemManager } from "../../objs/entities/APItemManager";
import { APLocationManager } from "../../objs/entities/APLocationManager";

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
  /**
   * A Markdown-formatted notice to display at the top of the page.
   * @since 1.0.7
   */
  notice?: string;
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
  /** Whether this game is disabled. If so, it will not appear in the list. */
  disabled: boolean;
  /**
   * A Markdown-formatted notice to display at the top of the page.
   * @since 1.0.7
   */
   notice?: string;
  /** The collection of settings for this category. */
  settings: APMetaSettingJson[];
  /** The collection of defined items for this category. */
  items?: APGameItem[];
  /** The collection of defined locations for this category. */
  locations?: APGameLocation[];
}

const APCategoryData: APCategoryJson[] = [
  require("./null.json"), // global settings
  require("./000-lttp.json"), // inaugural
  require("./001-factorio.json"), // 0.0.2
  require("./002-minecraft.json"), // 0.1.0
  require("./003-subnautica.json"), // 0.1.5
  require("./004-sts.json"), // 0.1.7
  require("./005-ror2.json"), // 0.1.7
  require("./006-oot.json"), // 0.1.7
  require("./007-timespin.json"), // 0.1.9
  require("./008-sm.json"), // 0.2.0
  require("./009-soe.json"), // 0.2.1
  require("./010-ff1.json"), // 0.2.1, no real support (must go to FFR website)
  require("./011-roguelegacy.json"), // 0.2.3
  require("./012-sm64.json"), // 0.2.4
  require("./013-raft.json"), // 0.2.4
  require("./014-vvvvvv.json"), // 0.2.4
  require("./015-meritous.json"), // 0.3.0
  require("./016-smz3.json"), // 0.3.0
  require("./017-checksfinder.json"), // 0.3.0, no settings
  require("./018-archipidle.json"), // 0.3.0, no settings, only enabled in April
  require("./019-hollowknight.json"), // 0.3.1
  require("./020-witness.json"), // 0.3.2
  require("./021-sa2b.json"), // 0.3.2
  require("./022-starcraft2.json"), // 0.3.2
  require("./023-darksouls3.json"), // 0.3.4
  require("./024-dkc3.json"), // 0.3.4
]
  .map((i) => {
    // only bring out ArchipIDLE in April
    // haha its funy geddit
    if (new Date().getMonth() === 3 && i.category === "ArchipIDLE")
      i.disabled = false;
    return i;
  })
  .filter((i) => i.disabled !== true)
  //.sort((a,b) => a.index - b.index);
  .sort((a, b) => {
    if (!a.category) return -1;
    if (!b.category) return 1;
    return (a.readableName ?? a.category).localeCompare(
      b.readableName ?? b.category
    );
  });

console.debug(
  APCategoryData.map((i) => i.readableName ?? i.category ?? "Globals")
);

export { APCategoryData };
