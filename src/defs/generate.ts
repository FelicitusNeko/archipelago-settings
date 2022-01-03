import { SettingType } from "./core";
import { APCategoryData, APCategory } from "./categories/reader";

import lttpSprites from "./LttP/sprites.json";
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

const LttPSpriteValue: Record<string, string> = Object.fromEntries([
  ["none", "LttP Link (Nintendo)"],
  ...(lttpSprites as LttPSprite[]).map(({ file, name, author }) => [
    file,
    `${name} (${author})`,
  ]),
]);

const gameList: [string, string][] = APCategoryData.filter(
  (i) => i.category !== null
).map((i) => [i.category, i.readableName ?? i.category] as [string, string]);
let gameListUsed = false;

const APCategoryList: APCategory[] = APCategoryData.map((i) => {
  const retval: APCategory = {
    category: i.category,
    readableName: i.readableName,
    index: i.index,
    settings: i.settings.map((setting) => {
      switch (setting.type) {
        case SettingType.String:
          return new APStringSetting(
            i.category,
            setting as APStringSettingJson
          );
        case SettingType.Numeric:
          return new APNumericSetting(
            i.category,
            setting as APNumericSettingJson
          );
        case SettingType.Boolean:
          return new APBooleanSetting(
            i.category,
            setting as APBooleanSettingJson
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
          stringJson.default = gameList[0][0];
          return new APStringSetting(i.category, stringJson);
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
          return new APStringSetting(i.category, stringJson);
        }
        default:
          throw new Error(`Unknown setting type: ${setting.type}`);
      }
    }),
    items: i.items,
    locations: i.locations,
  };

  return retval;
});
export { APCategoryList };

const GameSetting = APCategoryList[0].settings.find(
  (i) => i.type === SettingType.Games
) as APStringSetting;
if (GameSetting === undefined)
  throw new Error("No game selection setting found");
export { GameSetting };
