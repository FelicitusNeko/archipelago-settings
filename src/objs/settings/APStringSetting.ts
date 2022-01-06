import { SettingType } from "../../defs/core";
import {
  APSetting,
  APSettingJson,
  APWeightedValue,
} from "./APSetting";

/**
 * The interface for Archipelago string-based settings as stored in JSON.
 * @since 1.0.0
 */
export interface APStringSettingJson extends APSettingJson<string> {
  /**
   * The type of setting. Must be {@link SettingType.String}.
   * @override
   */
  type: SettingType.String | SettingType.Games | SettingType.Character;
  /** The list of valid values. The key should be the internal value name, and the value should be the user-readable description. */
  values: Record<string, string | string[]>;
}

/**
 * The renderable representation of an Archipelago string-based setting.
 * @since 1.0.0
 */
export class APStringSetting extends APSetting<string> {
  /** The list of valid values and their descriptions. */
  private readonly _values: Record<string, string | string[]>;

  constructor(
    category: string | null,
    settingData: APStringSettingJson,
    initialValue?: string
  ) {
    super(category, settingData, initialValue);

    this._values = settingData.values;
  }

  /** The list of valid values and their descriptions. */
  get values() {
    return this._values;
  }

  /** @override */
  get yamlValue() {
    const { value } = this;
    if (Array.isArray(value)) {
      const valueOut: Record<string, number> = {};
      for (const wValue of value) valueOut[wValue.value] = wValue.weight;

      return valueOut;
    } else return value;
  }
  /** @override */
  set yamlValue(value) {
    // TODO: sanity checking
    if (typeof value === "object") {
      const wValues: APWeightedValue<string>[] = [];
      for (const wValue of Object.entries(value))
        wValues.push({
          value: wValue[0],
          weight: wValue[1],
        });
      this.value = wValues;
    } else this.value = value;
  }
}
