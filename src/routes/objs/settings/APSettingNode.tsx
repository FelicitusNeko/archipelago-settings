import React, { ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { WeightRail } from "../../../defs/core";
import { APMetaSetting } from "../../../defs/generate";
import {
  APSetting,
  APWeightableValue,
  APWeightedValue,
} from "../../../objs/settings/APSetting";

import "../Setting.css";
import "../switch.css";

/**
 * The type of setting def used by the given setting object.
 * @since 1.0.0
 */
export type SettingValueType<T = APMetaSetting> = T extends APSetting<infer X>
  ? X
  : never;

/**
 * The properties for this setting.
 * @since 1.0.0
 */
export interface APSettingProps<T extends APMetaSetting> {
  /** The category for this setting. */
  category: string | null;
  /** The setting definition and value for this setting. */
  setting: T;
  /** The event callback to call when the value is changed. */
  save: () => void;
}
/** The state object for this setting. */
interface APSettingState<T> {
  /** The current value of this setting. */
  value: APWeightableValue<T>;
  /** The current location of the selector for this setting, if one is used. */
  selector?: T;
}
/**
 * The renderable representation of a setting.
 * @abstract
 * @since 1.0.0
 */
export abstract class APSettingNode<
  TSetting extends APMetaSetting
> extends React.Component<
  APSettingProps<TSetting>,
  APSettingState<SettingValueType<TSetting>>
> {
  constructor(props: APSettingProps<TSetting>) {
    super(props);

    this.state = {
      value: props.setting.value as APWeightableValue<
        SettingValueType<TSetting>
      >,
    };
  }

  componentDidUpdate(
    _prevProps: APSettingProps<TSetting>,
    prevState: APSettingState<SettingValueType<TSetting>>
  ) {
    const { value: stateValue } = this.state;
    const { value: propValue } = this.props.setting;
    if (stateValue !== propValue) {
      if (stateValue !== prevState.value) {
        const { setting, save } = this.props;
        // HACK: this doesn't work as a direct assignment for some reason
        setting.value = stateValue as
          | string
          | number
          | boolean
          | APWeightedValue<string>[]
          | APWeightedValue<string | number>[]
          | APWeightedValue<boolean>[];
        save();
        this.forceUpdate();
      } else
        this.setState({
          value: propValue as APWeightableValue<SettingValueType<TSetting>>,
        });
    }
  }

  /** Resets this setting to its default unweighted value. */
  protected onDefault = () => {
    const { setting } = this.props;
    this.setState({
      value: setting.default as SettingValueType<TSetting>,
    });
  };

  /** Outputs a slider for a weighted value, within the context of {@link onWeightedCheck}. */
  protected outputWeightedValue = (
    valueName: SettingValueType<TSetting>,
    displayName: string,
    weight: number,
    deletable?: boolean
  ) => {
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
      <div
        key={`wgtsld-${category}-${setting.name}-${valueName}`}
        style={{margin: 0, padding: 0}}
      >
        <Slider
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
      </div>
    );
  };

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
    const { value } = setting;
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
          <ReactMarkdown children={setting.description} />
          {(weighted ? this.renderWeightedChoice : this.renderLinearChoice)()}
        </div>
      </>
    );
  }
}
