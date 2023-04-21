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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const APUniversalSettings: APCategoryJson = require("./_universal.json");
//APUniversalSettings.settings.forEach(i => i.readableName = `🌐 ${i.readableName ?? i.name}`)
APUniversalSettings.settings.forEach((i) => {
  i.isUniversal = true;
});

const APCategoryData: APCategoryJson[] = [
  require("./_root.json"), // global settings
  require("./000-A Link to the Past.json"), // inaugural
  require("./001-Factorio.json"), // 0.0.2
  require("./002-Minecraft.json"), // 0.1.0
  require("./003-Subnautica.json"), // 0.1.5
  require("./004-Slay the Spire.json"), // 0.1.7
  require("./005-Risk of Rain 2.json"), // 0.1.7
  require("./006-Ocarina of Time.json"), // 0.1.7
  require("./007-Timespinner.json"), // 0.1.9
  require("./008-Super Metroid.json"), // 0.2.0
  require("./009-Secret of Evermore.json"), // 0.2.1
  require("./010-Final Fantasy.json"), // 0.2.1
  require("./011-Rogue Legacy.json"), // 0.2.3
  require("./012-Super Mario 64.json"), // 0.2.4
  require("./013-Raft.json"), // 0.2.4
  require("./014-VVVVVV.json"), // 0.2.4
  require("./015-Meritous.json"), // 0.3.0
  require("./016-SMZ3.json"), // 0.3.0
  require("./017-ChecksFinder.json"), // 0.3.0
  require("./018-ArchipIDLE.json"), // 0.3.0
  require("./019-Hollow Knight.json"), // 0.3.1
  require("./020-The Witness.json"), // 0.3.2
  require("./021-Sonic Adventure 2 Battle.json"), // 0.3.2
  require("./022-Starcraft 2 Wings of Liberty.json"), // 0.3.2
  require("./023-Dark Souls III.json"), // 0.3.4
  require("./024-Donkey Kong Country 3.json"), // 0.3.4
  require("./025-Super Mario World.json"), // 0.3.6
  require("./026-Pokemon Red and Blue.json"), // 0.3.6
  require("./027-Zillion.json"), // 0.3.6
  require("./028-Hylics 2.json"), // 0.3.6
  require("./029-Overcooked 2.json"), // 0.3.6
  // require("./030-Sudoku.json"), // 0.3.6, you don't submit a YAML for this
  require('./031-Lufia II Ancient Cave.json'), // 0.3.6
  require('./032-Clique.json'), // 0.4.0
  require('./033-Stardew Valley.json'), // 0.4.0
  require('./034-Links Awakening DX.json'), // 0.4.0
  require('./035-Kingdom Hearts 2.json'), // 0.4.0
  require('./036-Adventure.json'), // 0.4.0
  require('./037-Blasphemous.json'), // 0.4.0
  require('./038-The Messenger.json'), // 0.4.0
  require('./039-Wargroove.json'), // 0.4.0
  require('./040-The Legend of Zelda.json'), // 0.4.0
]
  .map((i: APCategoryJson) => {
    // only bring out ArchipIDLE in April
    // haha its funy geddit
    if (new Date().getMonth() === 3 && i.category === "ArchipIDLE")
      i.disabled = false;
    i.settings = i.settings.concat(APUniversalSettings.settings);
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

// console.debug(
//   APCategoryData.map((i) => i.readableName ?? i.category ?? "Globals")
// );

export { APUniversalSettings, APCategoryData };
