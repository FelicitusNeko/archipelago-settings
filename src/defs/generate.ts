import { SettingType } from "./core";
import { APCategoryData, APCategoryJson } from "./categories/reader";
import { APBaseSetting } from "../routes/settingTypes/APBaseSetting";
import {
  APBooleanSetting,
  APBooleanSettingJson,
} from "../routes/settingTypes/APBooleanSetting";
import {
  APNumericSetting,
  APNumericSettingJson,
} from "../routes/settingTypes/APNumericSetting";
import {
  APStringSetting,
  APStringSettingJson,
} from "../routes/settingTypes/APStringSetting";

import lttpsprites from "./LttP/sprites.json";

interface LTTPSprite {
  file: string;
  name: string;
  author: string;
}

const spritevalue: Record<string, string> = {
  none: "LttP Link (Nintendo)",
};
for (const { file, name, author } of lttpsprites as LTTPSprite[])
  spritevalue[file] = `${name} (${author})`;

const gameList: [string, string][] = APCategoryData.filter(
  (i) => i.category !== null
).map((i) => [i.category, i.readableName ?? i.category] as [string, string]);

const APCategoryList: APCategoryJson<APBaseSetting<any>>[] = APCategoryData.map(
  (i) => {
    console.debug(i);
    const retval: APCategoryJson<APBaseSetting<any>> = {
      category: i.category,
      readableName: i.readableName,
      index: i.index,
      settings: i.settings.map((setting) => {
        switch (setting.type) {
          case SettingType.String:
            return new APStringSetting(
              { category: i.category },
              setting as APStringSettingJson
            );
          case SettingType.Numeric:
            return new APNumericSetting(
              { category: i.category },
              setting as APNumericSettingJson
            );
          case SettingType.Boolean:
            return new APBooleanSetting(
              { category: i.category },
              setting as APBooleanSettingJson
            );
          case SettingType.Games: {
            const stringJson = setting as APStringSettingJson;
            stringJson.type = SettingType.String;
            stringJson.values = Object.fromEntries(gameList);
            return new APStringSetting({ category: i.category }, stringJson);
          }
          case SettingType.LttPSprite: {
            const stringJson = setting as APStringSettingJson;
            stringJson.type = SettingType.String;
            stringJson.values = spritevalue;
            return new APStringSetting({ category: i.category }, stringJson);
          }
          default:
            throw new Error(`Unknown setting type: ${setting.type}`)
        }
      }),
      items: i.items,
      locations: i.locations,
    };

    return retval;
  }
);

export { APCategoryList };
