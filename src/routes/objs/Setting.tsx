import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import {
  ArchipelagoNumericSetting,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  SelectRail,
  SettingChangeEvent,
  SettingType,
  SettingValue,
  WeightedSetting,
  WeightRail,
} from "../../defs/core";
import "./Setting.css";
import "./switch.css";

type SettingSelectorFunc = (setting: ArchipelagoSettingBase) => React.ReactNode;

/** Properties for {@link Setting}. */
interface SettingProps {
  /** The category to which this setting belongs. If undefined, this is a global setting. */
  category?: string;
  /** The setting data to interpret. */
  setting: ArchipelagoSettingBase;
  /** The current value for this setting. */
  value: SettingValue;
  /** The event callback to call when the value is changed. */
  onChange: SettingChangeEvent;
}
/**
 * The user interface to allow the user to modify the value of a setting.
 * @returns The ReactNode content for this setting.
 */
const Setting: React.FC<SettingProps> = ({
  category,
  setting,
  value,
  onChange,
}) => {
  const [weighted, setWeighted] = useState(false);
  const [addWeightString, setAddWeightString] = useState<string | undefined>();
  const [addWeightNumber, setAddWeightNumber] = useState(0);
  const { readableName, description } = setting;

  const weights = weighted ? (value as WeightedSetting) : null;

  // Set weighted state
  useEffect(() => {
    setWeighted(typeof value === "object");
  }, [value]);

  // prevent blank addWeightString on load
  useEffect(() => {
    if (
      typeof value === "object" &&
      setting.type === SettingType.String &&
      !addWeightString
    ) {
      updateAddWeightString(
        Object.keys((setting as ArchipelagoStringSetting).values),
        Object.keys(value)
      );
    }
  }, [setting, value, addWeightString]);

  /**
   * Update the value of {@link addWeightString} based on what values have weights currently attributed to them.
   * @param {string[]} fullList The full list of valid values for this setting.
   * @param {string[]} curList The current list of selected values.
   */
  const updateAddWeightString = (fullList: string[], curList: string[]) => {
    const filterList = fullList.filter((i) => !curList.includes(i));
    setAddWeightString(filterList.length === 0 ? undefined : filterList[0]);
  };

  /** A collection of functions which output value selectors based on the type of setting, when the setting is not weighted. */
  const stdOutput: Record<SettingType, SettingSelectorFunc> = {
    string: (setting) => {
      // if this is a weighted setting, output nothing; it should output correctly on the next frame
      if (typeof value === "object") return null;
      const { name: sName, values } = setting as ArchipelagoStringSetting;

      /** An event handler which fires when the value for this setting is changed. */
      const onSettingChange: React.ChangeEventHandler<HTMLSelectElement> = ({
        currentTarget,
      }) => {
        onChange(sName, currentTarget.value, category);
      };

      return (
        <select
          key={`${category}-${sName}-val`}
          value={value as string}
          onChange={onSettingChange}
        >
          {Object.keys(values).map((i) => {
            let name = values[i],
              title;
            // If there is an em-dash in the readableName of the value, split it off and display it as tooltip text instead
            if (name.indexOf(" – ") > 0) {
              title = name.substr(name.indexOf(" – ") + 3);
              name = name.substr(0, name.indexOf(" – ")) + " ℹ️";
            }
            // Output the option
            return (
              <option
                key={`${category}-${sName}-val-${i}`}
                title={title}
                value={i}
              >
                {name}
              </option>
            );
          })}
        </select>
      );
    },
    numeric: (setting) => {
      // if this is a weighted setting, output nothing; it should output correctly on the next frame
      if (typeof value === "object") return null;
      const {
        low,
        high,
        step,
        default: vDefault,
      } = setting as ArchipelagoNumericSetting;

      /** An event handler which fires when the value for this setting is changed. */
      const onSettingChange = (newVal: number) => {
        onChange(setting.name, newVal, category);
      };

      return (
        // Output the value slider for this numeric value.
        <>
          <Slider
            key={`${category}-${setting.name}-val`}
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
    },
    boolean: (setting) => {
      // if this is a weighted setting, output nothing; it should output correctly on the next frame
      if (typeof value === "object") return null;

      /** An event handler which fires when the value for this setting is changed. */
      const onSettingChange: React.ChangeEventHandler<HTMLInputElement> = ({
        currentTarget,
      }) => {
        onChange(setting.name, currentTarget.checked, category);
      };

      return (
        // Output the value toggle
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
    },
  };

  /** Outputs a slider for a weighted value, within the context of {@link weightedOutput}. */
  const outputWeightedValue = (
    valueName: string,
    weight: number,
    deletable?: boolean
  ) => {
    /** An event handler which fires when the value for the weight is changed. */
    const onWeightChange = (newVal: number) => {
      if (!weights) return;
      weights[valueName] = newVal;
      onChange(setting.name, Object.assign({}, weights), category);
    };

    /** An event handler which fires when the delete button on a weight is clicked. */
    const onDeleteWeight = () => {
      // If weights are turned off or the weight is not deletable, do nothing
      if (!weights || !deletable) return;
      // Remove the value
      delete weights[valueName];
      // If this is a string setting, decide what should show up in the value selector
      if (setting.type === SettingType.String)
        updateAddWeightString(
          Object.keys((setting as ArchipelagoStringSetting).values),
          Object.keys(weights)
        );
      onChange(setting.name, Object.assign({}, weights), category);
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
        <b>{valueName}</b>: {weight}{" "}
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
  };

  /** A collection of functions which output value selectors based on the type of setting, when the setting is weighted. */
  const weightedOutput: Record<SettingType, SettingSelectorFunc> = {
    string: (setting) => {
      // if this is not a weighted setting, output nothing; it should output correctly on the next frame
      if (weights === null) return null;
      const { name: sName, values } = setting as ArchipelagoStringSetting;
      /** How many selected weights there are. */
      const count = Object.keys(weights).length;
      /** The collection of weighted value sliders. */
      const weightSliders: React.ReactNode[] = [];

      // Create weighted value sliders for selected values
      for (const valueName in weights)
        weightSliders.push(
          outputWeightedValue(valueName, weights[valueName], count > 1)
        );

      /** An event handler that fires when the value selector's value changes. */
      const onAddWeightChange: React.ChangeEventHandler<HTMLSelectElement> = ({
        currentTarget,
      }) => {
        setAddWeightString(currentTarget.value);
      };

      /** An event handler that fires when the "Add value" button is clicked. */
      const onAddWeight = () => {
        if (!addWeightString) return;
        weights[addWeightString] = 50;
        updateAddWeightString(Object.keys(values), Object.keys(weights));
        onChange(setting.name, Object.assign({}, weights), category);
      };

      /** The list of unselected values. */
      const remainingValues = Object.keys(values).filter(
        (i) => !Object.keys(weights).includes(i)
      );

      return (
        <>
          {weightSliders}
          {remainingValues.length > 0 ? (
            // Only output the value selector if there are any values to select
            <>
              <select
                key={`${category}-${sName}-wgtlst`}
                value={addWeightString}
                onChange={onAddWeightChange}
              >
                {remainingValues.map((i) => {
                  let name = values[i],
                    title;
                  if (name.indexOf(" – ") > 0) {
                    title = name.substr(name.indexOf(" – ") + 3);
                    name = name.substr(0, name.indexOf(" – ")) + " ℹ️";
                  }
                  return (
                    <option
                      key={`${category}-${sName}-val-${i}`}
                      title={title}
                      value={i}
                    >
                      {name}
                    </option>
                  );
                })}
              </select>{" "}
              <button
                key={`${category}-${sName}-wgtadd`}
                className="emojibutton"
                onClick={onAddWeight}
              >
                ➕
              </button>
              <br />
            </>
          ) : null}
        </>
      );
    },
    numeric: (setting) => {
      // if this is not a weighted setting, output nothing; it should output correctly on the next frame
      if (weights === null) return null;
      const { low, high, step } = setting as ArchipelagoNumericSetting;
      /** How many selected weights there are. */
      const count = Object.keys(weights).length;
      /** The collection of weighted value sliders. */
      const weightSliders: React.ReactNode[] = [];

      // Create weighted value sliders for selected values
      for (const valueName in weights)
        weightSliders.push(
          outputWeightedValue(
            valueName,
            weights[valueName],
            count >
              ((setting as ArchipelagoNumericSetting).randomable ? 4 : 1) &&
              !valueName.startsWith("random")
          )
        );

      /** An event handler that fires when the value selector's value changes. */
      const onSettingChange = (newVal: number) => {
        setAddWeightNumber(newVal);
      };

      /** An event handler that fires when the "Add value" button is clicked. */
      const onAddWeight = () => {
        if (Object.keys(weights).includes(addWeightNumber.toString())) return;
        weights[addWeightNumber.toString()] = 50;
        onChange(setting.name, Object.assign({}, weights), category);
      };

      return (
        <>
          {weightSliders}
          <Slider
            className="archslider"
            min={low}
            max={high}
            step={step}
            value={addWeightNumber}
            onChange={onSettingChange}
            trackStyle={SelectRail}
          />{" "}
          <b>{addWeightNumber}</b>
          <button
            key={`${category}-${setting.name}-wgtadd`}
            className="emojibutton"
            onClick={onAddWeight}
          >
            ➕
          </button>
        </>
      );
    },
    boolean: (setting) => {
      // if this is not a weighted setting, output nothing; it should output correctly on the next frame
      if (weights === null) return null;

      // super easy; there are only ever two possible weights for this, so always output just those two
      return (
        <>
          {outputWeightedValue("true", weights.true, false)}
          {outputWeightedValue("false", weights.false, false)}
        </>
      );
    },
  };

  /** An event handler that fires when the weighted setting toggle is clicked. */
  const onWeightedCheck: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    if (currentTarget.checked) {
      /** The new collection of weighted values. */
      const newSetting: WeightedSetting = {};
      // Set the current selected value as the first weighted value, and give it a weight of 50
      newSetting[value.toString()] = 50;

      switch (setting.type) {
        case SettingType.Boolean:
          // If Boolean, set the other weight to 0
          newSetting[(!value).toString()] = 0;
          break;
        case SettingType.Numeric:
          // If numeric and randomable, add "random", "random-low", and "random-high"
          if ((setting as ArchipelagoNumericSetting).randomable)
            for (const randomsetting of ["random", "random-low", "random-high"])
              newSetting[randomsetting] = 0;
          setAddWeightNumber(setting.default as number);
          break;
        case SettingType.String:
          // If a string, determine what should be shown in the weighted value selector
          updateAddWeightString(
            Object.keys((setting as ArchipelagoStringSetting).values),
            [value as string]
          );
          break;
      }
      // Set the weighted setting
      onChange(setting.name, newSetting, category);

      // If we're unweighting the setting, just default it
    } else onChange(setting.name, setting.default, category);
  };

  /** An event handler that fires when the "Revert to default" button is clicked. */
  const onDefault = () => {
    onChange(setting.name, setting.default, category);
  };

  return (
    <>
      <div className="setting">
        <b>{readableName}</b>{" "}
        <label className="switch switch-weight" title="Weighted toggle">
          <input
            className="switch-input"
            type="checkbox"
            checked={weighted}
            onChange={onWeightedCheck}
          />
          <span className="switch-label" data-on="Wgt" data-off="Std"></span>
          <span className="switch-handle"></span>
        </label>{" "}
        {value === setting.default ? null : (
          <button
            className="revert emojibutton"
            title="Revert to default"
            onClick={onDefault}
          >
            🔄
          </button>
        )}
        <br />
        {description}
        <br />
        {(weighted ? weightedOutput : stdOutput)[setting.type](setting)}
      </div>
      <hr style={{ borderColor: "blue" }} />
    </>
  );
};

export default Setting;
