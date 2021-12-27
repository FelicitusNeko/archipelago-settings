import { ChangeEvent, ReactNode } from "react";

import { SettingType } from "../../defs/core";
import {
  APBaseSetting,
  APSettingJson,
  APSettingProps,
  APWeightedSetting,
} from "./APBaseSetting";

import "./switch.css";

const positiveValues = ["true", "on"];

export interface APBooleanSettingJson extends APSettingJson<boolean> {
  type: SettingType.Boolean;
}

export class APBooleanSetting extends APBaseSetting<boolean> {
  constructor(props: APSettingProps, settingData: APBooleanSettingJson) {
    super(props, settingData);

    this.state = {
      weighted: false,
      value: this.default,
    };
  }

  /** @override */
  get yamlValue() {
    const { value } = this.state;
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
      const wValues: APWeightedSetting<boolean>[] = [];
      for (const wValue of Object.entries(value))
        wValues.push({
          value: positiveValues.includes(wValue[0]),
          weight: wValue[1],
        });
      this.value = wValues;
    } else this.value = value;
  }

  protected onWeightedCheck({
    currentTarget,
  }: ChangeEvent<HTMLInputElement>): void {
    const { value } = this.state;
    if (currentTarget.checked)
      this.setState({
        weighted: true,
        value: [
          {
            value: true,
            weight: (value as boolean) ? 50 : 0,
          },
          {
            value: false,
            weight: !(value as boolean) ? 50 : 0,
          },
        ],
      });
    else this.setState({ weighted: false, value: this.default });
  }

  protected renderLinearChoice(): ReactNode {
    // if this is a weighted setting, output nothing; it should output correctly on the next frame
    const { value } = this.state;

    // if this is a weighted setting, output nothing; it should output correctly on the next frame
    if (Array.isArray(value)) return null;

    /** An event handler which fires when the value for this setting is changed. */
    const onSettingChange: React.ChangeEventHandler<HTMLInputElement> = ({
      currentTarget,
    }) => {
      this.setState({ value: currentTarget.checked });
    };

    // Output the value toggle
    return (
      <label className="switch" title="Option toggle">
        <input
          className="switch-input"
          type="checkbox"
          name={this.name}
          checked={value as boolean}
          onChange={onSettingChange}
        />
        <span className="switch-label" data-on="On" data-off="Off"></span>
        <span className="switch-handle"></span>
      </label>
    );
  }

  protected renderWeightedChoice(): ReactNode {
    // if this is a weighted setting, output nothing; it should output correctly on the next frame
    const { value } = this.state;

    // if this is not a weighted setting, output nothing; it should output correctly on the next frame
    if (!Array.isArray(value)) return null;

    // super easy; there are only ever two possible weights for this, so always output just those two
    return (
      <>
        {value.map((i) =>
          this.outputWeightedValue(
            i.value,
            i.value ? "On" : "Off",
            i.weight,
            false
          )
        )}
      </>
    );
  }
}
