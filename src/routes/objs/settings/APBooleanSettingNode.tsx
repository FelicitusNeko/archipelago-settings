import React, { ChangeEvent } from "react";

import { APBooleanSetting } from "../../../objs/settings/APBooleanSetting";
import { APSettingNode } from "./APSettingNode";

export class APBooleanSettingNode extends APSettingNode<APBooleanSetting> {
  protected onWeightedCheck = ({
    currentTarget,
  }: ChangeEvent<HTMLInputElement>) => {
    const { setting } = this.props;
    const { value } = this.state;
    if (currentTarget.checked)
      this.setState({
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
    else this.setState({ value: setting.default });
  };

  protected renderLinearChoice = () => {
    // if this is a weighted setting, output nothing; it should output correctly on the next frame
    const { setting } = this.props;
    const { value } = setting;

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
          name={setting.name}
          checked={value as boolean}
          onChange={onSettingChange}
        />
        <span className="switch-label" data-on="On" data-off="Off"></span>
        <span className="switch-handle"></span>
      </label>
    );
  };

  protected renderWeightedChoice = () => {
    // if this is a weighted setting, output nothing; it should output correctly on the next frame
    const { value } = this.props.setting;

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
  };
}
