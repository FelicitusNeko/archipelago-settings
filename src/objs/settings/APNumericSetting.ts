import { SettingType } from "../../defs/core";
import {
  APSetting,
  APSettingJson,
  APWeightedValue,
} from "./APSetting";

const randomOrder = ["random", "random-low", "random-middle", "random-high"];

/**
 * The interface for Archipelago numeric settings as stored in JSON.
 * @since 1.0.0
 */
export interface APNumericSettingJson extends APSettingJson<number | string> {
  /**
   * The type of setting. Must be {@link SettingType.Numeric}.
   * @override
   */
  type: SettingType.Numeric;
  /** The lowest valid value for this setting. */
  low: number;
  /** The highest valid value for this setting. */
  high: number;
  /**
   * If specified, the slider for this setting will skip this many numbers between values.
   * @optional
   */
  step?: number;
  /** @override */
  default: number;
  /**
   * Whether the setting can be randomized. If so, and if the setting is weighted, "random", "random-low",
   * "random-mid", and "random-high" are added as options.
   */
  randomable?: boolean;
}

/**
 * The renderable representation of an Archipelago numeric setting.
 * @since 1.0.0
 */
export class APNumericSetting extends APSetting<number | string> {
  private readonly _low: number;
  private readonly _high: number;
  private readonly _step?: number;
  private readonly _randomable: boolean;

  constructor(
    category: string | null,
    settingData: APNumericSettingJson,
    initialValue?: string
  ) {
    super(category, settingData, initialValue);

    this._low = settingData.low;
    this._high = settingData.high;
    this._step = settingData.step;
    this._randomable = settingData.randomable ?? false;
  }

  /** The lowest valid value for this setting. */
  get low() {
    return this._low;
  }
  /** The highest valid value for this setting. */
  get high() {
    return this._high;
  }
  /**
   * If specified, the slider for this setting will skip this many numbers between values.
   * @optional
   */
  get step() {
    return this._step;
  }
  /**
   * Whether the setting can be randomized. If so, and if the setting is weighted, "random", "random-low", and
   * "random-high" are added as options.
   */
  get randomable() {
    return this._randomable;
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
      const wValues: APWeightedValue<number | string>[] = [];
      for (const wValue of Object.entries(value))
        wValues.push({
          value: wValue[0],
          weight: wValue[1],
        });
      if (this._randomable) {
        const missingRandoms = randomOrder.filter(
          (i) => !wValues.map((ii) => ii.value.toString()).includes(i)
        );
        wValues.push(
          ...missingRandoms.map((i) => {
            return { value: i, weight: 0 };
          })
        );
      }
      this.value = wValues.sort((a, b) => {
        if (typeof a.value === typeof b.value) {
          if (typeof a.value === "number") return a.value - (b.value as number);
          else
            return (
              randomOrder.indexOf(a.value) -
              randomOrder.indexOf(b.value as string)
            );
        } else return typeof a.value === "number" ? -1 : 1;
      });
    } else this.value = value;
  }
}
