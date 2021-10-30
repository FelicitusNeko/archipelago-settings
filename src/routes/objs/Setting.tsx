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

interface SettingProps {
  category?: string;
  setting: ArchipelagoSettingBase;
  value: SettingValue;
  onChange: SettingChangeEvent;
}
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

  const updateAddWeightString = (fullList: string[], curList: string[]) => {
    const filterList = fullList.filter((i) => !curList.includes(i));
    setAddWeightString(filterList.length === 0 ? undefined : filterList[0]);
  };

  const stdOutput: Record<SettingType, SettingSelectorFunc> = {
    string: (setting) => {
      if (typeof value === "object") return null;
      const { name: sName, values } = setting as ArchipelagoStringSetting;
      const onSettingChange: React.ChangeEventHandler<HTMLSelectElement> = ({
        currentTarget,
      }) => {
        onChange(sName, currentTarget.value, category);
      };
      return (
        <select value={value as string} onChange={onSettingChange}>
          {Object.keys(values).map((i) => {
            let name = values[i],
              title;
            if (name.indexOf(" – ") > 0) {
              title = name.substr(name.indexOf(" – ") + 3);
              name = name.substr(0, name.indexOf(" – "));
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
        </select>
      );
    },
    numeric: (setting) => {
      if (typeof value === "object") return null;
      const {
        low,
        high,
        step,
        default: vDefault,
      } = setting as ArchipelagoNumericSetting;

      const onSettingChange = (newVal: number) => {
        onChange(setting.name, newVal, category);
      };

      return (
        <>
          <Slider
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
      if (typeof value === "object") return null;
      const onSettingChange: React.ChangeEventHandler<HTMLInputElement> = ({
        currentTarget,
      }) => {
        onChange(setting.name, currentTarget.checked, category);
      };
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
    },
  };

  const outputWeightedSetting = (
    valueName: string,
    weight: number,
    deletable?: boolean
  ) => {
    const onWeightChange = (newVal: number) => {
      if (!weights) return;
      weights[valueName] = newVal;
      onChange(setting.name, Object.assign({}, weights), category);
    };
    const onDeleteWeight = () => {
      if (!weights || !deletable) return;
      delete weights[valueName];
      if (setting.type === SettingType.String)
        updateAddWeightString(
          Object.keys((setting as ArchipelagoStringSetting).values),
          Object.keys(weights)
        );
      onChange(setting.name, Object.assign({}, weights), category);
    };
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
  const weightedOutput: Record<SettingType, SettingSelectorFunc> = {
    string: (setting) => {
      if (weights === null) return null;
      const { name: sName, values } = setting as ArchipelagoStringSetting;
      const count = Object.keys(weights).length;
      const weightSliders: React.ReactNode[] = [];

      for (const valueName in weights)
        weightSliders.push(
          outputWeightedSetting(valueName, weights[valueName], count > 1)
        );

      const onAddWeightChange: React.ChangeEventHandler<HTMLSelectElement> = ({
        currentTarget,
      }) => {
        setAddWeightString(currentTarget.value);
      };

      const onAddWeight = () => {
        if (!addWeightString) return;
        weights[addWeightString] = 50;
        updateAddWeightString(Object.keys(values), Object.keys(weights));
        onChange(setting.name, Object.assign({}, weights), category);
      };

      const remainingValues = Object.keys(values).filter(
        (i) => !Object.keys(weights).includes(i)
      );

      return (
        <>
          {weightSliders}
          {remainingValues.length > 0 ? (
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
                    name = name.substr(0, name.indexOf(" – "));
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
      if (weights === null) return null;
      const { low, high, step } = setting as ArchipelagoNumericSetting;
      const count = Object.keys(weights).length;
      const weightSliders: React.ReactNode[] = [];

      const onAddWeight = () => {
        if (Object.keys(weights).includes(addWeightNumber.toString())) return;
        weights[addWeightNumber.toString()] = 50;
        onChange(setting.name, Object.assign({}, weights), category);
      };

      const onSettingChange = (newVal: number) => {
        setAddWeightNumber(newVal);
      };

      for (const valueName in weights)
        weightSliders.push(
          outputWeightedSetting(
            valueName,
            weights[valueName],
            count >
              ((setting as ArchipelagoNumericSetting).randomable ? 4 : 1) &&
              !valueName.startsWith("random")
          )
        );
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
      if (weights === null) return null;
      return (
        <>
          {outputWeightedSetting("true", weights.true, false)}
          {outputWeightedSetting("false", weights.false, false)}
        </>
      );
    },
  };

  const onWeightedCheck: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    if (currentTarget.checked) {
      const newSetting: WeightedSetting = {};
      newSetting[value.toString()] = 50;
      switch (setting.type) {
        case SettingType.Boolean:
          newSetting[(!value).toString()] = 0;
          break;
        case SettingType.Numeric:
          if ((setting as ArchipelagoNumericSetting).randomable)
            for (const randomsetting of ["random", "random-low", "random-high"])
              newSetting[randomsetting] = 0;
          setAddWeightNumber(setting.default as number);
          break;
        case SettingType.String:
          updateAddWeightString(
            Object.keys((setting as ArchipelagoStringSetting).values),
            [value as string]
          );
          break;
      }
      onChange(setting.name, newSetting, category);
    } else onChange(setting.name, setting.default, category);
  };

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
