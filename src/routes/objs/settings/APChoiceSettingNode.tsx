import React, { ChangeEvent } from "react";
import { APWeightedValue } from "../../../objs/settings/APSetting";
import { APChoiceSetting } from "../../../objs/settings/APChoiceSetting";
import { APSettingNode } from "./APSettingNode";

export class APChoiceSettingNode extends APSettingNode<APChoiceSetting> {
  componentDidMount() {
    const { selector } = this.state;
    if (selector === undefined)
      this.setState({ selector: this.getFirstUnselected() });
  }

  /** Gets the first unselected value, for the purpose of setting the weighted selector position. */
  private getFirstUnselected(
    ...additionalOptions: string[]
  ): string | undefined {
    const { setting } = this.props;
    const { value } = this.state;
    const selectedValues = (
      Array.isArray(value) ? value.map((i) => i.value) : [value]
    ).concat(additionalOptions);
    const remainingValues = setting.values.filter(i => !selectedValues.includes(i.name));
    // const remainingValues = Object.keys(setting.values).filter(
    //   (i) => !selectedValues.includes(i)
    // );
    return remainingValues[0].name;
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

    const curVal = setting.values.find(i => i.name == value);

    return (
      <>
        <select
          className="settingDropdown"
          key={`${category}-${setting.name}-val`}
          value={value}
          onChange={onSettingChange}
        >
          {
            setting.values.map(i =>
              <option
                key={`${category}-${setting.name}-val-${i.name}`}
                title={i.description}
                value={i.name}>
                {i.readableName ?? i.name}{i.description ? '  ℹ️' : null}
              </option>
            )
          }
        </select>
        {curVal && curVal.description ? (
          <>
            <br />
            {curVal.description}
          </>
        ) : null}
      </>
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
      let valueDef = setting.values.find(i => i.name === wValue.value);
      if (!valueDef) valueDef = { name: "!!!UNKNOWN" };

      const displayName = valueDef.readableName ?? valueDef.name;

      weightSliders.push(
        this.outputWeightedValue(
          wValue.value,
          displayName,
          wValue.weight,
          count > 1,
          valueDef.description
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
    // const remainingValues = Object.entries(setting.values).filter(
    //   (i) => !value.map((i) => i.value).includes(i[0])
    // );
    const remainingValues = setting.values.filter(i => !value.map(i => i.value).includes(i.name));

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
                return (<option
                  key={`${category}-${setting.name}-val-${i.name}`}
                  title={i.description}
                  value={i.name}>
                  {i.readableName ?? i.name}{i.description ? '  ℹ️' : null}
                </option>);
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
