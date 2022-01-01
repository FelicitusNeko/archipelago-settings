import { ChangeEvent } from "react";
import Slider from "rc-slider";

import { APNumericSetting } from "../../objs/APNumericSetting";
import { APWeightedValue } from "../../objs/APSetting";
import { APSettingNode } from "./APSettingNode";
import { SelectRail } from "../../defs/core";

const randomOrder = ["random", "random-low", "random-middle", "random-high"];

type APNumericType = number | string;
export class APNumericSettingNode extends APSettingNode<APNumericSetting> {
  /** @override */
  protected onWeightedCheck = ({
    currentTarget,
  }: ChangeEvent<HTMLInputElement>) => {
    const { setting } = this.props;
    const { value } = this.state;
    if (currentTarget.checked) {
      const newValue: APWeightedValue<APNumericType>[] = [
        { value: value as number | string, weight: 50 },
      ];
      if (setting.randomable)
        newValue.push(
          ...randomOrder.map((i) => {
            return { value: i, weight: 0 };
          })
        );
      this.setState({
        value: newValue,
        selector: setting.default,
      });
    } else
      this.setState({
        value: setting.default,
      });
  };

  /** @override */
  protected renderLinearChoice = () => {
    const { category, setting } = this.props;
    const { name, low, high, step, value, default: vDefault } = setting;

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
  };

  /** @override */
  protected renderWeightedChoice = () => {
    const { category, setting } = this.props;
    const { selector } = this.state;
    const { name, low, high, step, value, default: vDefault } = setting;

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
      const newValue: APWeightedValue<APNumericType>[] = value
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
  };
}
