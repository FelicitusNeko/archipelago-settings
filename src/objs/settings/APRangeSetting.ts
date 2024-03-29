import { SettingType } from "../../defs/core";
import {
  APSetting,
  APSettingJson,
  APWeightableValue,
  APWeightedValue,
} from "./APSetting";

const randomOrder = ["random", "random-low", "random-middle", "random-high"];

/**
 * The interface for Archipelago range-bound numeric settings as stored in JSON.
 * @since 1.1.0
 */
export interface APRangeSettingJson extends APSettingJson<number | string> {
  /**
   * The type of setting. Must be {@link SettingType.Range}.
   * @override
   */
  type: SettingType.Range;
  /** The lowest valid value for this setting. */
  low: number;
  /** The highest valid value for this setting. */
  high: number;
  /**
   * If specified, the slider for this setting will skip this many numbers between values.
   * @optional
   */
  step?: number;
  /** If specified, any aliases which can be translated to a numeric value. */
  aliases?: Map<string, number>;
}

/**
 * The renderable representation of an Archipelago numeric setting bound to a range.
 * @since 1.1.0
 */
export class APRangeSetting extends APSetting<number | string> {
  private readonly _low: number;
  private readonly _high: number;
  private readonly _step?: number;
  private readonly _aliases?: Map<string, number>;

  constructor(
    category: string | null,
    settingData: APRangeSettingJson,
    initialValue?: string
  ) {
    super(category, settingData, initialValue);

    this._low = settingData.low;
    this._high = settingData.high;
    this._step = settingData.step;
    this._aliases = settingData.aliases;
    // eslint-disable-next-line no-self-assign
    this.value = this.value;
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

      // assume Range to always be "randomable"
      const missingRandoms = randomOrder.filter(
        (i) => !wValues.map((ii) => ii.value.toString()).includes(i)
      );
      wValues.push(
        ...missingRandoms.map((i) => {
          return { value: i, weight: 0 };
        })
      );

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

  /** @override */
  validateData(value: APWeightableValue<number | string>) {
    if (this.low === this.high) return value;
    const validAliases = this._aliases ? [...Object.keys(this._aliases)] : [];
    const isValid = (vvalue: number | string) => {
      console.debug(vvalue, typeof vvalue);
      if (vvalue === null) return false;
      if (typeof vvalue === "number") return vvalue >= this.low && vvalue <= this.high;
      // this line is a broad assumption, but probably correct most of the time
      // TODO: check to make sure any range values here are still valid
      else if (typeof vvalue === "string" && vvalue.startsWith("random")) return true;
      else return validAliases.includes(vvalue);
    }
    if (Array.isArray(value)) {
      const filtered = value.filter(i => isValid(i.value));
      return filtered.length ? filtered : this.default;
    } else return isValid(value) ? value : this.default;
  }
}
