// Copyright 2021 FelicitusNeko
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ChangeEvent } from "react";
import { APWeightedValue } from "../../../objs/settings/APSetting";
import { APStringSetting } from "../../../objs/settings/APStringSetting";
import { APSettingNode } from "./APSettingNode";

export class APStringSettingNode extends APSettingNode<APStringSetting> {
  /** Gets the first unselected value, for the purpose of setting the weighted selector position. */
  private getFirstUnselected(
    ...additionalOptions: string[]
  ): string | undefined {
    const { setting } = this.props;
    const { value } = this.state;
    const selectedValues = (
      Array.isArray(value) ? value.map((i) => i.value) : [value]
    ).concat(additionalOptions);
    const remainingValues = Object.keys(setting.values).filter(
      (i) => !selectedValues.includes(i)
    );
    return remainingValues[0];
  }

  /** @override */
  protected onWeightedCheck = ({
    currentTarget,
  }: ChangeEvent<HTMLInputElement>) => {
    const { setting } = this.props;
    const { value } = this.state;
    if (currentTarget.checked) {
      this.setState({
        value: [
          {
            value: value as string,
            weight: 50,
          },
        ] as APWeightedValue<string>[],
        selector: this.getFirstUnselected(),
      });
    } else
      this.setState({
        value: setting.default,
      });
  };

  /** @override */
  protected renderLinearChoice = () => {
    const { category, setting } = this.props;
    const { value } = setting;

    // if this is a weighted setting, output nothing; it should output correctly on the next frame
    if (Array.isArray(value)) return null;

    /** An event handler which fires when the value for this setting is changed. */
    const onSettingChange: React.ChangeEventHandler<HTMLSelectElement> = ({
      currentTarget,
    }) => {
      this.setState({
        value: currentTarget.value,
      });
    };

    return (
      <select
        className="settingDropdown"
        key={`${category}-${setting.name}-val`}
        value={value}
        onChange={onSettingChange}
      >
        {Object.entries(setting.values).map((i) => {
          const [name, readable] = i;
          // Output the option
          return (
            <option
              key={`${category}-${setting.name}-val-${name}`}
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
    const { category, setting } = this.props;
    const { selector } = this.state;
    const { value } = setting;

    // if this is not a weighted setting, output nothing; it should output correctly on the next frame
    if (!Array.isArray(value)) return null;
    /** How many selected weights there are. */
    const count = value.length;
    /** The collection of weighted value sliders. */
    const weightSliders: React.ReactNode[] = [];

    // Create weighted value sliders for selected values
    for (const wValue of value) {
      const valueDef = setting.values[wValue.value];
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
      this.setState({
        selector: currentTarget.value,
      });
    };

    /** An event handler that fires when the "Add value" button is clicked. */
    const onAddWeight = () => {
      if (!selector) return;
      this.setState({
        value: value.slice().concat([
          {
            value: selector,
            weight: 50,
          },
        ]),
        selector: this.getFirstUnselected(selector),
      });
    };

    /** The list of unselected values. */
    const remainingValues = Object.entries(setting.values).filter(
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
              key={`${category}-${setting.name}-wgtlst`}
              value={selector}
              onChange={onAddWeightChange}
            >
              {remainingValues.map((i) => {
                const [name, readable] = i;
                return (
                  <option
                    key={`${category}-${setting.name}-val-${name}`}
                    title={Array.isArray(readable) ? readable[1] : undefined}
                    value={name}
                  >
                    {Array.isArray(readable) ? `${readable[0]} ℹ️` : readable}
                  </option>
                );
              })}
            </select>{" "}
            <button
              key={`${category}-${setting.name}-wgtadd`}
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
