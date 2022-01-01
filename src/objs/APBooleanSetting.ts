import { SettingType } from "../defs/core";
import { APSetting, APSettingJson, APWeightedValue } from "./APSetting";

const truthy = ["true", "on"];

export interface APBooleanSettingJson extends APSettingJson<boolean> {
  type: SettingType.Boolean;
}

export class APBooleanSetting extends APSetting<boolean> {
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
      const wValues: APWeightedValue<boolean>[] = [];
      for (const wValue of Object.entries(value))
        wValues.push({
          value: truthy.includes(wValue[0]),
          weight: wValue[1],
        });
      this.value = wValues;
    } else if (typeof value === "string") this.value = truthy.includes(value);
    else this.value = value;
  }
}
