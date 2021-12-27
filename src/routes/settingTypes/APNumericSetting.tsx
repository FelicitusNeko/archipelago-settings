import { ChangeEvent, ReactNode } from "react";
import Slider from "rc-slider";

import { SelectRail, SettingType } from "../../defs/core";
import {
  APBaseSetting,
  APSettingJson,
  APSettingProps,
  APWeightedSetting,
} from "./APBaseSetting";

const randomOrder = ["random", "random-low", "random-mid", "random-high"];

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
   * Optional. If specified, the slider for this setting will skip this many numbers between values.
   */
  step?: number;
  /** @override */
  default: number;
  /**
   * Whether the setting can be randomized. If so, and if the setting is weighted, "random", "random-low", and
   * "random-high" are added as options.
   */
  randomable?: boolean;
}

/**
 * The renderable representation of an Archipelago numeric setting.
 * @since 1.0.0
 */
 export class APNumericSetting extends APBaseSetting<number | string> {
  private readonly _low: number;
  private readonly _high: number;
  private readonly _step?: number;
  private readonly _randomable: boolean;

  constructor(props: APSettingProps, settingData: APNumericSettingJson) {
    super(props, settingData);

    this._low = settingData.low;
    this._high = settingData.high;
    this._step = settingData.step;
    this._randomable = settingData.randomable ?? false;

    this.state = {
      weighted: false,
      value: settingData.default,
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
      const wValues: APWeightedSetting<number | string>[] = [];
      for (const wValue of Object.entries(value))
        wValues.push({
          value: wValue[0],
          weight: wValue[1],
        });
      this.value = wValues;
    } else this.value = value;
  }

  /** @override */
  protected onWeightedCheck({
    currentTarget,
  }: ChangeEvent<HTMLInputElement>): void {
    const { value } = this.state;
    if (currentTarget.checked) {
      const newValue: APWeightedSetting<number | string>[] = [
        { value: value as number | string, weight: 50 },
      ];
      if (this._randomable)
        newValue.push(
          ...randomOrder.map((i) => {
            return { value: i, weight: 0 };
          })
        );
      this.setState({
        weighted: true,
        value: newValue,
        selector: this.default,
      });
    } else
      this.setState({
        weighted: false,
        value: this.default,
      });
  }

  /** @override */
  protected renderLinearChoice(): ReactNode {
    const { category } = this.props;
    const { value } = this.state;
    const {
      name,
      _low: low,
      _high: high,
      _step: step,
      default: vDefault,
    } = this;

    // if this is a weighted setting, output nothing; it should output correctly on the next frame
    if (Array.isArray(value)) return null;

    /** An event handler which fires when the value for this setting is changed. */
    const onSettingChange = (newVal: number) => {
      this.setState({
        value: newVal,
      });
    };

    return (
      // Output the value slider for this numeric value.
      <>
        <Slider
          key={`${category}-${name}-val`}
          className="archslider"
          min={low}
          max={high}
          step={step}
          value={(value as number) ?? vDefault}
          onChange={onSettingChange}
          trackStyle={SelectRail}
        />{" "}
        <b>{value}</b>
      </>
    );
  }

  /** @override */
  protected renderWeightedChoice(): ReactNode {
    const { category } = this.props;
    const { value, selector } = this.state;
    const {
      name,
      _low: low,
      _high: high,
      _step: step,
      default: vDefault,
    } = this;

    // if this is not a weighted setting, output nothing; it should output correctly on the next frame
    if (!Array.isArray(value)) return null;

    /** How many selected weights there are. */
    const count = value.filter((i) => typeof i.value === "number").length;
    /** The collection of weighted value sliders. */
    const weightSliders: React.ReactNode[] = [];

    // Create weighted value sliders for selected values
    for (const wValue of value)
      weightSliders.push(
        this.outputWeightedValue(
          wValue.value,
          typeof wValue.value === "number"
            ? wValue.value.toString()
            : wValue.value.replace("-", " "),
          wValue.weight,
          count > 1 && !(typeof wValue.value === "string")
        )
      );

    /** An event handler that fires when the value selector's value changes. */
    const onSettingChange = (newVal: number) => {
      this.setState({
        selector: newVal,
      });
    };

    /** An event handler that fires when the "Add value" button is clicked. */
    const onAddWeight = () => {
      // If the specified value is already selected, don't add it again
      if (value.findIndex((i) => i.value === selector) >= 0) return;
      // Otherwise, add the new value
      const newValue: APWeightedSetting<number | string>[] = value
        .slice()
        .concat([
          {
            value: selector as number,
            weight: 50,
          },
        ])
        .sort((a, b) => {
          if (typeof a.value === typeof b.value) {
            if (typeof a.value === "number")
              return a.value - (b.value as number);
            else
              return (
                randomOrder.findIndex((i) => i === a.value) -
                randomOrder.findIndex((i) => i === b.value)
              );
          } else return typeof a.value === "number" ? -1 : 1;
        });
      this.setState({ value: newValue });
    };

    return (
      <>
        {weightSliders}
        <Slider
          className="archslider"
          min={low}
          max={high}
          step={step}
          value={(selector ?? vDefault) as number}
          onChange={onSettingChange}
          trackStyle={SelectRail}
        />{" "}
        <b>{selector}</b>
        <button
          key={`${category}-${name}-wgtadd`}
          className="emojibutton"
          onClick={onAddWeight}
        >
          ➕
        </button>
      </>
    );
  }
}
