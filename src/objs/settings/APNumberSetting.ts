import { SettingType } from "../../defs/core";
import {
  APSetting,
  APSettingJson,
  APWeightedValue,
} from "./APSetting";

/**
 * The interface for Archipelago open-ended numeric settings as stored in JSON.
 * @since 1.1.0
 */
export interface APNumberSettingJson extends APSettingJson<number> {
  /**
   * The type of setting. Must be {@link SettingType.Number}.
   * @override
   */
  type: SettingType.Number;
  /** The lowest valid value for this setting, if any. */
  low?: number;
  /** The highest valid value for this setting, if any. */
  high?: number;
}

/**
 * The renderable representation of an Archipelago open-ended number setting.
 * @since 1.1.0
 */
export class APNumberSetting extends APSetting<number> {
  private readonly _low?: number;
  private readonly _high?: number;

  constructor(
    category: string | null,
    settingData: APNumberSettingJson,
    initialValue?: string
  ) {
    super(category, settingData, initialValue);

    this._low = settingData.low;
    this._high = settingData.high;
  }

  /** The lowest valid value for this setting, if any. */
  get low() {
    return this._low;
  }
  /** The highest valid value for this setting, if any. */
  get high() {
    return this._high;
  }

  /** @override */
  get yamlValue() {
    const { value } = this;
    if (Array.isArray(value)) {
      const valueOut: Record<string, number> = {};
      for (const wValue of value)
        valueOut[wValue.value.toString()] = wValue.weight;

      return valueOut;
    } else return value;
  }
  /** @override */
  set yamlValue(value) {
    if (typeof value === "object") {
      const wValues: APWeightedValue<number>[] = [];
      for (const wValue of Object.entries(value))
        wValues.push({
          value: Number.parseInt(wValue[0]),
          weight: wValue[1],
        });
      // assume this is never "randomable"
      this.value = wValues.sort((a, b) => {
        if (typeof a.value === typeof b.value) {
          if (typeof a.value === "number") return a.value - (b.value as number);
          else throw new Error("Unexpected string in APNumberSetting");
        } else return typeof a.value === "number" ? -1 : 1;
      });
    } else this.value = value;
  }
}
