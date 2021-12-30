import React, { ChangeEvent, useState, useEffect } from "react";
import Slider from "rc-slider";

import {
  ArchipelagoDependency,
  SettingType,
  WeightRail,
} from "../../defs/core";
import "./Setting.css";

/**
 * The definition for a weighted setting. Its chance of being selected is based on its weight value.
 * @since 1.0.0
 */
export interface APWeightedSetting<T> {
  /** The value of the setting. */
  value: T;
  /** The weighted chance of this setting being selected. */
  weight: number;
}

/**
 * The base interface for Archipelago settings as stored in JSON.
 * @since 1.0.0
 */
export interface APSettingJson<T> {
  /** The type of setting. */
  type: SettingType;
  /** The internal name for the setting. */
  name: string;
  /** The user-readable name for the setting. */
  readableName: string;
  /** The description of the setting, for user reference. */
  description: string;
  /** The default value of the setting. */
  default: T;
  /** The dependencies for this setting. The key should be the internal name, and the values should indicate when this setting becomes available. */
  dependsOn?: ArchipelagoDependency;

  // for LttP and really nothing else
  /** When importing from Berserker YAMLs, interpret this Berserker setting as its new Archipelago setting. */
  legacyName?: string;
  /**
   * When importing from Berserker YAMLs, interpret these Berserker values (keys) as their corresponding Archipelago values (values).
   * If the Berserker value no longer exists in Archipelago, the value here should be null.
   */
  legacyValues?: Record<string, string | null>; // null if the setting no longer exists
}

// /** The properties for this setting. */
// export interface APSettingProps {
//   /** The category for this setting. */
//   category: string | null;
// }
// /** The state object for this setting. */
// interface APSettingState<T> {
//   /** Whether this setting is weighted. */
//   weighted: boolean;
// }
/**
 * The renderable representation of an Archipelago setting.
 * @abstract
 * @since 1.0.0
 */
export abstract class APBaseSetting<T> {
  /** The category to which this setting belongs. */
  private readonly _category: string | null;
  /** The type of setting. */
  private readonly _type: SettingType;
  /** The internal name for the setting. */
  private readonly _name: string;
  /** The user-readable name for the setting. */
  private readonly _readableName?: string;
  /** The description of the setting, for user reference. */
  private readonly _description: string;
  /** The default value of the setting. */
  private readonly _default: T;
  /** The dependencies for this setting. The key should be the internal name, and the values should indicate when this setting becomes available. */
  private readonly _dependsOn?: ArchipelagoDependency;
  /** When importing from Berserker YAMLs, interpret this Berserker setting as its new Archipelago setting. */
  private readonly _legacyName?: string;
  /**
   * When importing from Berserker YAMLs, interpret these Berserker values (keys) as their corresponding Archipelago values (values).
   * If the Berserker value no longer exists in Archipelago, the value here should be null.
   */
  private readonly _legacyValues?: Record<string, string | null>;

  /** The value for this setting. */
  private _value: T | APWeightedSetting<T>[];
  /** The value of the weight selector for this setting, if it applies. */
  private _selector?: T;

  private _valueSetter?: React.Dispatch<
    React.SetStateAction<T | APWeightedSetting<T>[]>
  >;

  constructor(
    category: string | null,
    settingData: APSettingJson<T>,
    initialValue?: T | APWeightedSetting<T>[]
  ) {
    //super(props);

    this._category = category;
    this._type = settingData.type;
    this._name = settingData.name;
    this._readableName = settingData.readableName;
    this._description = settingData.description;
    this._default = settingData.default;
    this._dependsOn = settingData.dependsOn;
    this._legacyName = settingData.legacyName;
    this._legacyValues = settingData.legacyValues;

    this._value = initialValue ?? this._default;
  }

  /** The category to which this setting belongs. */
  get category() {
    return this._category;
  }
  /** The type of setting. */
  get type() {
    return this._type;
  }
  /** The internal name for the setting. */
  get name() {
    return this._name;
  }
  /** The user-readable name for the setting. */
  get readableName() {
    return this._readableName ?? this._name;
  }
  /** The description of the setting, for user reference. */
  get description() {
    return this._description;
  }
  /** The default value of the setting. */
  get default() {
    return this._default;
  }
  /** The dependencies for this setting. The key should be the internal name, and the values should indicate when this setting becomes available. */
  get dependsOn(): Readonly<ArchipelagoDependency> | undefined {
    return this._dependsOn;
  }
  /** When importing from Berserker YAMLs, interpret this Berserker setting as its new Archipelago setting. */
  get legacyName() {
    return this._legacyName;
  }
  /**
   * When importing from Berserker YAMLs, interpret these Berserker values (keys) as their corresponding Archipelago values (values).
   * If the Berserker value no longer exists in Archipelago, the value here should be null.
   */
  get legacyValues(): Readonly<Record<string, string | null>> | undefined {
    return this._legacyValues;
  }

  /** The value for this setting. */
  get value() {
    return this._value;
  }
  set value(value) {
    if (this._valueSetter) this._valueSetter(value);
    else this._value = value;
  }

  /** The JSON-encoded representation for this setting. */
  get storageValue() {
    return JSON.stringify(this._value);
  }
  set storageValue(jsonStr: string) {
    if (this._valueSetter) this._valueSetter(JSON.parse(jsonStr));
    this._value = JSON.parse(jsonStr);
  }

  /** The YAML-encoded representation for this setting. */
  abstract get yamlValue(): T | Record<string, number>;
  abstract set yamlValue(value);

  protected get valueSetter() {
    return this._valueSetter;
  }

  protected get selector() {
    return this._selector;
  }
  protected set selector(value) {
    this._selector = value;
  }

  /** Resets this setting to its default unweighted value. */
  protected onDefault = () => {
    this.value = this._default;
  }

  /** Outputs a slider for a weighted value, within the context of {@link onWeightedCheck}. */
  protected outputWeightedValue(
    valueName: T,
    displayName: string,
    weight: number,
    deletable?: boolean
  ) {
    // const { category } = this.props;
    // const { value } = this.state;
    const { category, value } = this;

    if (!Array.isArray(value)) return null;

    /** An event handler which fires when the value for the weight is changed. */
    const onWeightChange = (newVal: number) => {
      const wValue = value.find((i) => i.value === valueName);
      if (wValue) wValue.weight = newVal;
      this.value = [...value];
    };

    /** An event handler which fires when the delete button on a weight is clicked. */
    const onDeleteWeight = () => {
      // If the weight is not deletable, do nothing
      if (!deletable) return;
      // Remove the value
      this.value = [...value.filter((i) => i.value !== valueName)];
    };

    // If "deletable" was not defined, assume it to be true
    if (deletable === undefined) deletable = true;
    return (
      <>
        <Slider
          key={`${category}-wgtsld-${this.name}-${valueName}`}
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
            key={`${category}-${this.name}-wgtdel`}
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

  render() {
    const { _value: value } = this;
    const weighted = Array.isArray(value);

    const TestComponent: React.FC = () => {
      const [value, setValue] = useState(this._value);

      useEffect(() => {
        this._valueSetter = setValue;
        return () => {
          this._valueSetter = undefined;
        };
      }, []);

      return (
        <>
          <div className="setting">
            <b>{this._readableName ?? this._name}</b>{" "}
            <label className="switch switch-weight" title="Weighted toggle">
              <input
                className="switch-input"
                type="checkbox"
                checked={weighted}
                onChange={this.onWeightedCheck}
              />
              <span
                className="switch-label"
                data-on="Wgt"
                data-off="Std"
              ></span>
              <span className="switch-handle"></span>
            </label>{" "}
            {value === this._default ? null : (
              <button
                className="revert emojibutton"
                title="Revert to default"
                onClick={this.onDefault}
              >
                🔄
              </button>
            )}
            <br />
            {this._description}
            <br />
            {(weighted ? this.renderWeightedChoice : this.renderLinearChoice)()}
          </div>
          <hr style={{ borderColor: "blue" }} />
        </>
      );
    };

    return <TestComponent />;
  }

  /** Renders the interface for this setting. */
  // render() {
  //   if (!this.state) return null;
  //   const { weighted, value } = this.state;

  //   return (
  //     <>
  //       <div className="setting">
  //         <b>{this._readableName ?? this._name}</b>{" "}
  //         <label className="switch switch-weight" title="Weighted toggle">
  //           <input
  //             className="switch-input"
  //             type="checkbox"
  //             checked={weighted}
  //             onChange={this.onWeightedCheck}
  //           />
  //           <span className="switch-label" data-on="Wgt" data-off="Std"></span>
  //           <span className="switch-handle"></span>
  //         </label>{" "}
  //         {value === this._default ? null : (
  //           <button
  //             className="revert emojibutton"
  //             title="Revert to default"
  //             onClick={this.onDefault}
  //           >
  //             🔄
  //           </button>
  //         )}
  //         <br />
  //         {this._description}
  //         <br />
  //         {(weighted ? this.renderWeightedChoice : this.renderLinearChoice)()}
  //       </div>
  //       <hr style={{ borderColor: "blue" }} />
  //     </>
  //   );
  // }
}
