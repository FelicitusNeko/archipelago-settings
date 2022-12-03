import React, { ChangeEvent } from "react";
import Slider from "rc-slider";

import { APNumberSetting } from "../../../objs/settings/APNumberSetting";
import { APWeightedValue } from "../../../objs/settings/APSetting";
import { APSettingNode } from "./APSettingNode";
import { SelectRail } from "../../../defs/core";

export class APNumberSettingNode extends APSettingNode<APNumberSetting> {
  componentDidMount() {
    const { selector } = this.state;
    if (selector === undefined) {
      const { setting } = this.props;
      this.setState({ selector: setting.default });
    }
  }

  /** @override */
  protected onWeightedCheck = ({
    currentTarget,
  }: ChangeEvent<HTMLInputElement>) => {
    const { setting } = this.props;
    const { value } = this.state;
    if (currentTarget.checked) {
      const newValue: APWeightedValue<number>[] = [
        { value: value as number, weight: 50 },
      ];
      this.setState({
        value: newValue,
      });
    } else
      this.setState({
        value: setting.default,
        selector: setting.default,
      });
  };

  /** @override */
  protected renderLinearChoice = () => {
    const { category, setting } = this.props;
    const { name, low, high, value, default: vDefault } = setting;

    // if this is a weighted setting, output nothing; it should output correctly on the next frame
    if (Array.isArray(value)) return null;

    /** An event handler which fires when the value for this setting is changed. */
    const onSettingChange = (newVal: number | number[]) => {
      if (!Array.isArray(newVal))
        this.setState({
          value: newVal,
        });
    };

    // TODO: this should now be a numeric text entry field
    return (
      // Output the value slider for this numeric value.
      <>
        <Slider
          key={`${category}-${name}-val`}
          className="archslider"
          min={low}
          max={high}
          value={(value as number) ?? vDefault}
          onChange={onSettingChange}
          trackStyle={SelectRail}
        />{" "}
        <b>{value}</b>
      </>
    );
  };

  /** @override */
  protected renderWeightedChoice = () => {
    const { category, setting } = this.props;
    const { selector } = this.state;
    const { name, low, high, value, default: vDefault } = setting;

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
          wValue.value.toString(),
          wValue.weight,
          count > 1 && !(typeof wValue.value === "string")
        )
      );

    /** An event handler that fires when the value selector's value changes. */
    const onSettingChange = (newVal: number | number[]) => {
      if (!Array.isArray(newVal))
        this.setState({
          selector: newVal,
        });
    };

    /** An event handler that fires when the "Add value" button is clicked. */
    const onAddWeight = () => {
      // If the specified value is already selected, don't add it again
      if (value.findIndex((i) => i.value === selector) >= 0) return;
      // Otherwise, add the new value
      const newValue: APWeightedValue<number>[] = value
        .slice()
        .concat([
          {
            value: selector as number,
            weight: 50,
          },
        ])
        .sort((a, b) => {
          if (typeof a.value === typeof b.value)
              return a.value - (b.value as number);
          else return typeof a.value === "number" ? -1 : 1;
        });
      this.setState({ value: newValue });
    };

    // TODO: change value selector to numeric text entry field
    return (
      <>
        {weightSliders}
        <Slider
          className="archslider"
          min={low}
          max={high}
          value={(selector ?? vDefault) as number}
          onChange={onSettingChange}
          trackStyle={SelectRail}
        />{" "}
        <b>{selector as number}</b>
        <button
          key={`${category}-${name}-wgtadd`}
          className="emojibutton"
          onClick={onAddWeight}
        >
          ➕
        </button>
      </>
    );
  };
}
