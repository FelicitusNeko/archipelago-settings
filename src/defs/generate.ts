import {
  APGameItem,
  APGameLocation,
  APSavedSettings,
  EntityType,
  SettingType,
} from "./core";
import { APCategoryData, APCategory } from "./categories/reader";

import {
  APStringSetting,
  APStringSettingJson,
} from "../objs/settings/APStringSetting";
import {
  APNumericSetting,
  APNumericSettingJson,
} from "../objs/settings/APNumericSetting";
import {
  APBooleanSetting,
  APBooleanSettingJson,
} from "../objs/settings/APBooleanSetting";
import { APItemManager } from "../objs/entities/APItemManager";
import { APLocationManager } from "../objs/entities/APLocationManager";
import { gunzipSync } from "zlib";

export type APMetaSetting =
  | APStringSetting
  | APNumericSetting
  | APBooleanSetting;
export type APMetaSettingJson =
  | APStringSettingJson
  | APNumericSettingJson
  | APBooleanSettingJson;

export type APMetaManager = APItemManager | APLocationManager;

interface LttPSprite {
  file: string;
  name: string;
  author: string;
}

const lttpSprites: LttPSprite[] = require("./LttP/sprites.json");

const LttPSpriteValue: Record<string, string> = Object.fromEntries([
  ["none", "LttP Link (Nintendo)"],
  ...lttpSprites.map(({ file, name, author }) => [file, `${name} (${author})`]),
]);

const gameList: [string, string][] = APCategoryData.filter(
  (i) => i.category !== null
).map((i) => [i.category, i.readableName ?? i.category] as [string, string]);
let gameListUsed = false;

const storedData = (() => {
  // Attempt to retrieve settings from local storage
  /** The stringified collection of saved settings. */
  const savedSettingsStr = (() => {
    const store = localStorage.getItem("savedSettingsV2");
    if (!store || store[0] === "{") return store;
    else return gunzipSync(Buffer.from(store, "base64")).toString();
  })();

  if (savedSettingsStr)
    // There are saved settings; load them in
    return JSON.parse(savedSettingsStr) as APSavedSettings;
})();

const [storedName, storedDesc] = (() => {
  return storedData
    ? [storedData.playerName, storedData.description]
    : [undefined, undefined];
})();
export { storedName, storedDesc };

const DeathLinkDefaults: APBooleanSettingJson = {
  type: SettingType.DeathLink,
  name: "death_link",
  readableName: "DeathLink",
  description: "If one DeathLinked player dies, all of them do.",
  default: false,
};

const APCategoryList: APCategory[] = APCategoryData.map((i) => {
  const savedCategory = storedData
    ? storedData.categories.find((ii) => i.category === ii.category)
    : undefined;
  const hasDeps = new Set<string>();
  const retval: APCategory = {
    category: i.category,
    readableName: i.readableName,
    index: i.index,
    notice: i.notice,
    settings: i.settings
      .filter((i) => i.disabled !== true)
      .map((setting) => {
        if (setting.dependsOn)
          Object.keys(setting.dependsOn).forEach((i) => hasDeps.add(i));

        switch (setting.type) {
          case SettingType.String:
            return new APStringSetting(
              i.category,
              setting as APStringSettingJson,
              savedCategory ? savedCategory.settings[setting.name] : undefined
            );
          case SettingType.Numeric:
            return new APNumericSetting(
              i.category,
              setting as APNumericSettingJson,
              savedCategory ? savedCategory.settings[setting.name] : undefined
            );
          case SettingType.Boolean:
            return new APBooleanSetting(
              i.category,
              setting as APBooleanSettingJson,
              savedCategory ? savedCategory.settings[setting.name] : undefined
            );
          case SettingType.DeathLink:
            return new APBooleanSetting(
              i.category,
              Object.assign<
                any,
                APBooleanSettingJson,
                Partial<APBooleanSettingJson>
              >({}, DeathLinkDefaults, setting),
              savedCategory ? savedCategory.settings[setting.name] : undefined
            );
          case SettingType.Games: {
            if (i.category !== null)
              throw new Error(
                "Game list type can only be used in global category"
              );
            if (gameListUsed)
              throw new Error(
                "Game list type has already been used (check null.json)"
              );
            gameListUsed = true;

            const stringJson = setting as APStringSettingJson;
            stringJson.values = Object.fromEntries(gameList);
            const lowestIndex = Math.min(
              ...APCategoryData.filter((i) => i.category !== null).map(
                (i) => i.index
              )
            );
            stringJson.default = APCategoryData.find(
              (i) => i.index === lowestIndex
            )!.category!;
            return new APStringSetting(
              i.category,
              stringJson,
              savedCategory ? savedCategory.settings[setting.name] : undefined
            );
          }
          case SettingType.Character: {
            const stringJson = setting as APStringSettingJson;
            switch (i.category) {
              case "A Link to the Past":
                stringJson.values = LttPSpriteValue;
                break;
              default:
                throw new Error(
                  `Game "${i.category}" does not have a known list of character sprites/models`
                );
            }
            stringJson.default = Object.keys(stringJson.values)[0];
            return new APStringSetting(
              i.category,
              stringJson,
              savedCategory ? savedCategory.settings[setting.name] : undefined
            );
          }
          default:
            throw new Error(`Unknown setting type`);
        }
      }),
    hasDeps: [...hasDeps],
  };

  if (i.items) {
    retval.items = new APItemManager(
      i.items.map((i) =>
        Object.assign<APGameItem, Partial<APGameItem>>(i, {
          type: EntityType.Item,
        })
      )
    );
    if (savedCategory && savedCategory.items)
      retval.items.yamlValue = savedCategory.items;
  }
  if (i.locations) {
    retval.locations = new APLocationManager(
      i.locations.map((i) =>
        Object.assign<APGameLocation, Partial<APGameLocation>>(i, {
          type: EntityType.Location,
        })
      )
    );
    if (savedCategory && savedCategory.locations)
      retval.locations.yamlValue = savedCategory.locations;
  }
  return retval;
});
export { APCategoryList };

const GameSetting = APCategoryList[0].settings.find(
  (i) => i.type === SettingType.Games
) as APStringSetting;
if (GameSetting === undefined)
  throw new Error("No game selection setting found");
export { GameSetting };
