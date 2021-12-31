import { SettingType } from "./core";
import { APCategoryData, APCategoryJson } from "./categories/reader";

import lttpSprites from "./LttP/sprites.json";
import { APStringSetting, APStringSettingJson } from "../objs/APStringSetting";
import {
  APNumericSetting,
  APNumericSettingJson,
} from "../objs/APNumericSetting";
import {
  APBooleanSetting,
  APBooleanSettingJson,
} from "../objs/APBooleanSetting";

export type APMetaSetting = APStringSetting | APNumericSetting | APBooleanSetting;
export type APMetaSettingJson =
  | APStringSettingJson
  | APNumericSettingJson
  | APBooleanSettingJson;

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

const APCategoryList: APCategoryJson<APMetaSetting>[] = APCategoryData.map(
  (i) => {
    const retval: APCategoryJson<APMetaSetting> = {
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
  }
);

export { APCategoryList };
