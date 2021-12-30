import { ChangeEvent } from "react";
import { SettingType } from "../../defs/core";

import {
  APBaseSetting,
  APSettingJson,
  // APSettingProps,
  APWeightedSetting,
} from "./APBaseSetting";

/**
 * The interface for Archipelago string-based settings as stored in JSON.
 * @since 1.0.0
 */
export interface APStringSettingJson extends APSettingJson<string> {
  /**
   * The type of setting. Must be {@link SettingType.String}.
   * @override
   */
  type: SettingType.String;
  /** The list of valid values. The key should be the internal value name, and the value should be the user-readable description. */
  values: Record<string, string | string[]>;
}

/**
 * The renderable representation of an Archipelago string-based setting.
 * @since 1.0.0
 */
export class APStringSetting extends APBaseSetting<string> {
  private readonly _values: Record<string, string | string[]>;

  constructor(category: string | null, settingData: APStringSettingJson) {
    super(category, settingData);

    this._values = settingData.values;
    // this.state = {
    //   weighted: false,
    //   value: this.default,
    // };
  }

  /** @override */
  get yamlValue() {
    const { value } = this;
    if (Array.isArray(value)) {
      const valueOut: Record<string, number> = {};
      for (const wValue of value) valueOut[wValue.value] = wValue.weight;

      return valueOut;
    } else return value;
  }
  /** @override */
  set yamlValue(value) {
    if (typeof value === "object") {
      const wValues: APWeightedSetting<string>[] = [];
      for (const wValue of Object.entries(value))
        wValues.push({
          value: wValue[0],
          weight: wValue[1],
        });
      this.value = wValues;
    } else this.value = value;
  }

  /** Gets the first unselected value, for the purpose of setting the weighted selector position. */
  private getFirstUnselected(
    ...additionalOptions: string[]
  ): string | undefined {
    const { value } = this;
    const selectedValues = (
      Array.isArray(value) ? value.map((i) => i.value) : [value]
    ).concat(additionalOptions);
    const remainingValues = Object.keys(this._values).filter(
      (i) => !selectedValues.includes(i)
    );
    return remainingValues[0];
  }

  /** @override */
  protected onWeightedCheck = ({
    currentTarget,
  }: ChangeEvent<HTMLInputElement>) => {
    if (currentTarget.checked) {
      this.value = [
        {
          value: this.value as string,
          weight: 50,
        },
      ] as APWeightedSetting<string>[];
      this.selector = this.getFirstUnselected();
    } else this.value = this.default;
  };

  /** @override */
  protected renderLinearChoice = () => {
    const { category, value } = this;

    // if this is a weighted setting, output nothing; it should output correctly on the next frame
    if (Array.isArray(value)) return null;

    /** An event handler which fires when the value for this setting is changed. */
    const onSettingChange: React.ChangeEventHandler<HTMLSelectElement> = ({
      currentTarget,
    }) => {
      //onChange(sName, currentTarget.value, category);
      this.value = currentTarget.value;
    };

    return (
      <select
        className="settingDropdown"
        key={`${category}-${this.name}-val`}
        value={value}
        onChange={onSettingChange}
      >
        {Object.entries(this._values).map((i) => {
          const [name, readable] = i;
          // Output the option
          return (
            <option
              key={`${category}-${this.name}-val-${name}`}
              title={Array.isArray(readable) ? readable[1] : undefined}
              value={name}
            >
              {Array.isArray(readable) ? `${readable[0]} ℹ️` : readable}
            </option>
          );
        })}
      </select>
    );
  };

  /** @override */
  protected renderWeightedChoice = () => {
    const { category, value, selector } = this;

    // if this is not a weighted setting, output nothing; it should output correctly on the next frame
    if (!Array.isArray(value)) return null;
    //const { name: sName, values } = setting as ArchipelagoStringSetting;
    /** How many selected weights there are. */
    const count = value.length;
    /** The collection of weighted value sliders. */
    const weightSliders: React.ReactNode[] = [];

    // Create weighted value sliders for selected values
    for (const wValue of value) {
      const valueDef = this._values[wValue.value];
      const displayName = valueDef
        ? Array.isArray(valueDef)
          ? valueDef[0]
          : valueDef
        : wValue.value;

      weightSliders.push(
        this.outputWeightedValue(
          wValue.value,
          displayName,
          wValue.weight,
          count > 1
        )
      );
    }

    /** An event handler that fires when the value selector's value changes. */
    const onAddWeightChange: React.ChangeEventHandler<HTMLSelectElement> = ({
      currentTarget,
    }) => {
      //setAddWeightString(currentTarget.value);
      this.selector = currentTarget.value;
    };

    /** An event handler that fires when the "Add value" button is clicked. */
    const onAddWeight = () => {
      if (!selector) return;
      this.value = value.slice().concat([
        {
          value: selector,
          weight: 50,
        },
      ]);
      this.selector = this.getFirstUnselected(selector);
    };

    /** The list of unselected values. */
    const remainingValues = Object.entries(this._values).filter(
      (i) => !value.map((i) => i.value).includes(i[0])
    );

    return (
      <>
        {weightSliders}
        {remainingValues.length > 0 ? (
          // Only output the value selector if there are any values to select
          <>
            <select
              className="settingDropdown"
              key={`${category}-${this.name}-wgtlst`}
              value={selector}
              onChange={onAddWeightChange}
            >
              {remainingValues.map((i) => {
                const [name, readable] = i;

                // let name = values[i],
                //   title;
                return (
                  <option
                    key={`${category}-${this.name}-val-${name}`}
                    title={Array.isArray(readable) ? readable[1] : undefined}
                    value={name}
                  >
                    {Array.isArray(readable) ? `${readable[0]} ℹ️` : readable}
                  </option>
                );
              })}
            </select>{" "}
            <button
              key={`${category}-${this.name}-wgtadd`}
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
  };
}
