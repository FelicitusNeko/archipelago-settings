import React, { ChangeEvent } from "react";

import { APNumberSetting } from "../../../objs/settings/APNumberSetting";
import { APWeightedValue } from "../../../objs/settings/APSetting";
import { APSettingNode } from "./APSettingNode";

/** @since 1.1.0 */
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
    const onSettingChange = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
      if (!Array.isArray(currentTarget.value))
        this.setState({
          value: Number.parseInt(currentTarget.value),
        });
    };

    return (
      // Output the numeric selector for this numeric value.
      <>
        <input
          key={`${category}-${name}-val`}
          type="number"
          min={low}
          max={high}
          value={(value as number) ?? vDefault}
          onChange={onSettingChange}
        />
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
    const onSettingChange = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
      if (!Array.isArray(currentTarget.value))
        this.setState({
          selector: Number.parseInt(currentTarget.value),
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

    return (
      <>
        {weightSliders}
        <input
          key={`${category}-${name}-val`}
          type="number"
          min={low}
          max={high}
          value={selector ?? vDefault}
          onChange={onSettingChange}
        />
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
