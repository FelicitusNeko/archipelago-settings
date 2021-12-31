import Slider from "rc-slider";
import React, { ChangeEvent } from "react";
import { WeightRail } from "../../defs/core";

import { APMetaSetting } from "../../defs/generate";
import { APSetting, APWeightableValue } from "../../objs/APSetting";

type GenericOf<T> = T extends APSetting<infer X> ? X : never;

/** The properties for this setting. */
export interface APSettingProps<T extends APMetaSetting> {
  /** The category for this setting. */
  category: string | null;
  /** The setting definition and value for this setting. */
  setting: T;
}
/** The state object for this setting. */
interface APSettingState<T> {
  /** The current value of this setting. */
  value: APWeightableValue<T>;
  /** The current location of the selector for this setting, if one is used. */
  selector?: T;
}
export abstract class APSettingNode<
  TSetting extends APMetaSetting
> extends React.Component<
  APSettingProps<TSetting>,
  APSettingState<GenericOf<TSetting>>
> {
  constructor(props: APSettingProps<TSetting>) {
    super(props);
    this.state = {
      value: props.setting.value as APWeightableValue<GenericOf<TSetting>>
    }
  }

  /** Resets this setting to its default unweighted value. */
  protected onDefault() {
    const { setting } = this.props;
    this.setState({
      value: setting.default as GenericOf<TSetting>,
    });
  }

  /** Outputs a slider for a weighted value, within the context of {@link onWeightedCheck}. */
  protected outputWeightedValue(
    valueName: GenericOf<TSetting>,
    displayName: string,
    weight: number,
    deletable?: boolean
  ) {
    const { category, setting } = this.props;
    const { value } = this.state;

    if (!Array.isArray(value)) return null;

    /** An event handler which fires when the value for the weight is changed. */
    const onWeightChange = (newVal: number) => {
      const wValue = value.find((i) => i.value === valueName);
      if (wValue) wValue.weight = newVal;
      this.setState({
        value: [...value],
      });
    };

    /** An event handler which fires when the delete button on a weight is clicked. */
    const onDeleteWeight = () => {
      // If the weight is not deletable, do nothing
      if (!deletable) return;
      // Remove the value
      this.setState({
        value: [...value.filter((i) => i.value !== valueName)],
      });
    };

    // If "deletable" was not defined, assume it to be true
    if (deletable === undefined) deletable = true;
    return (
      <>
        <Slider
          key={`${category}-wgtsld-${setting.name}-${valueName}`}
          className="archslider"
          min={0}
          max={100}
          value={weight}
          trackStyle={WeightRail}
          onChange={onWeightChange}
        />
        <b>{displayName}</b>: {weight}{" "}
        {deletable ? (
          // Only display the delete button if the weight is designated as deletable
          <button
            key={`${category}-${setting.name}-wgtdel`}
            className="emojibutton"
            onClick={onDeleteWeight}
          >
            ❌
          </button>
        ) : null}
        <br />
      </>
    );
  }

  /** Toggles the weighted state of this setting. */
  protected abstract onWeightedCheck(e: ChangeEvent<HTMLInputElement>): void;

  /** Renders the selector for a single choice setting. */
  protected abstract renderLinearChoice(): React.ReactNode;
  /** Renders the selector for a linear choice setting. */
  protected abstract renderWeightedChoice(): React.ReactNode;

  /** Renders the interface for this setting. */
  render() {
    if (!this.state) return null;
    const { setting } = this.props;
    const { value } = this.state;
    const weighted = APSetting.isWeighted(value);

    return (
      <>
        <div className="setting">
          <b>{setting.readableName}</b>{" "}
          <label className="switch switch-weight" title="Weighted toggle">
            <input
              className="switch-input"
              type="checkbox"
              checked={weighted}
              onChange={this.onWeightedCheck}
            />
            <span className="switch-label" data-on="Wgt" data-off="Std"></span>
            <span className="switch-handle"></span>
          </label>{" "}
          {value === setting.default ? null : (
            <button
              className="revert emojibutton"
              title="Revert to default"
              onClick={this.onDefault}
            >
              🔄
            </button>
          )}
          <br />
          {setting.description}
          <br />
          {(weighted ? this.renderWeightedChoice : this.renderLinearChoice)()}
        </div>
        <hr style={{ borderColor: "blue" }} />
      </>
    );
  }
}
