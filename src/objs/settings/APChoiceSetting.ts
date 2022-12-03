import { SettingType } from "../../defs/core";
import {
  APSetting,
  APSettingJson,
  APWeightedValue,
} from "./APSetting";

export interface APChoiceValue {
  name: string;
  readableName?: string;
  description?: string;
  aliases?: string[];
}

/**
 * The interface for Archipelago string-based settings as stored in JSON.
 * @since 1.0.0
 */
export interface APChoiceSettingJson extends APSettingJson<string> {
  /**
   * The type of setting. Must be {@link SettingType.Choice}.
   * @override
   */
  type: SettingType.Choice | SettingType.Games | SettingType.Character;
  /** The list of valid values. The key should be the internal value name, and the value should be the user-readable description. */
  values: APChoiceValue[];
}

/**
 * The renderable representation of an Archipelago string-based setting.
 * @since 1.0.0
 */
export class APChoiceSetting extends APSetting<string> {
  /** The list of valid values and their descriptions. */
  private readonly _values: APChoiceValue[];

  constructor(
    category: string | null,
    settingData: APChoiceSettingJson,
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
