import React, { useState, useEffect } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import yaml from "yaml";
import { DateTime } from "luxon";
import "react-tabs/style/react-tabs.css";

import {
  BuildTimestamp,
  SettingChangeEvent,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoNumericSetting,
  ForbiddenNames,
  SettingValue,
  WeightedSetting,
  SettingType,
} from "../defs/core";
import Setting from "./objs/Setting";
import "./SettingsTool.css";
import { version } from "../../package.json";

import { CategoryList } from "../defs/global";

const { localStorage, location, confirm } = window;

type SettingsSubcollection = Record<string, SettingValue>;
type SettingsCollection = Record<string, SettingValue | SettingsSubcollection>;

interface SavedSettings {
  name: string;
  description: string;
  settings: SettingsCollection;
}

const hasCrossover = (lhs: string[], rhs: string[]) => {
  for (const i of lhs) if (rhs.includes(i)) return true;
  return false;
};

const SettingsTool: React.FC = () => {
  const [playerName, setPlayerName] = useState("Player");
  const [description, setDescription] = useState(
    "Generated using Kewlio's Archipelago Settings Tool"
  );
  const [settings, setSettings] = useState<SettingsCollection>({});

  // Load settings
  useEffect(() => {
    const checkSavedData = (data: SettingsCollection) => {
      console.debug("Reticulating splines");
      const retval: SettingsCollection = {};

      for (const { category, settings: catSettings } of CategoryList) {
        if (category)
          retval[category] = data[category]
            ? Object.assign({}, data[category])
            : {};

        const subcatIn = (
          category ? data[category] : data
        ) as SettingsSubcollection;
        const subcatOut = (
          category ? retval[category] : retval
        ) as SettingsSubcollection;

        for (const setting of catSettings) {
          if (subcatOut[setting.name]) {
            subcatOut[setting.name] =
              typeof subcatOut[setting.name] === "object"
                ? Object.assign({}, subcatIn[setting.name])
                : subcatIn[setting.name];

            switch (setting.type) {
              case SettingType.String:
                {
                  const strSetting = setting as ArchipelagoStringSetting;
                  const validValues = Object.keys(strSetting.values);
                  if (typeof subcatOut[setting.name] === "object") {
                    const weights = subcatOut[setting.name] as WeightedSetting;
                    for (const value of Object.keys(weights))
                      if (!validValues.includes(value)) delete weights[value];
                    if (Object.keys(weights).length === 0)
                      subcatOut[setting.name] = setting.default;
                  } else if (
                    !validValues.includes(subcatOut[setting.name] as string)
                  )
                    subcatOut[setting.name] = setting.default;
                }
                break;
              case SettingType.Numeric:
                {
                  const numSetting = setting as ArchipelagoNumericSetting;
                  if (typeof subcatOut[setting.name] === "object") {
                    const weights = subcatOut[setting.name] as WeightedSetting;
                    for (const value of Object.keys(weights)) {
                      if (value.startsWith("random")) {
                        if (!numSetting.randomable) delete weights[value];
                      } else {
                        const numval = Number.parseInt(value);
                        if (
                          isNaN(numval) ||
                          numval < numSetting.low ||
                          numval > numSetting.high
                        )
                          delete weights[value];
                      }
                    }

                    if (
                      Object.keys(weights).length ===
                      (numSetting.randomable ? 3 : 0)
                    )
                      subcatOut[setting.name] = setting.default;
                  } else if (
                    typeof subcatOut[setting.name] !== "number" ||
                    subcatOut[setting.name] < numSetting.low ||
                    subcatOut[setting.name] > numSetting.high
                  )
                    subcatOut[setting.name] = setting.default;
                }
                break;
              case SettingType.Boolean:
                {
                  const validValues = ["true", "false", "on", "off"];
                  if (typeof subcatOut[setting.name] === "object") {
                    const weights = subcatOut[setting.name] as WeightedSetting;
                    for (const value of Object.keys(weights))
                      if (!validValues.includes(value)) delete weights[value];
                    if (Object.keys(weights).length === 0)
                      subcatOut[setting.name] = setting.default;
                  } else if (typeof subcatOut[setting.name] !== "boolean")
                    subcatOut[setting.name] = setting.default;
                }
                break;
            }

            // TODO: Test continued validity of setting
          } else subcatOut[setting.name] = setting.default;
        }
      }

      return retval;
    };

    const savedSettingsStr = localStorage.getItem("savedSettings");

    if (savedSettingsStr) {
      const savedSettings = JSON.parse(savedSettingsStr) as SavedSettings;
      setPlayerName(savedSettings.name);
      setDescription(savedSettings.description);
      setSettings(checkSavedData(savedSettings.settings));
    } else {
      let defaultSettings: SettingsCollection = {};
      for (const category of CategoryList) {
        const subcollection: SettingsSubcollection = {};
        category.settings.forEach((i) => (subcollection[i.name] = i.default));
        if (!category.category)
          defaultSettings = Object.assign(defaultSettings, subcollection);
        else defaultSettings[category.category] = subcollection;
      }
      setSettings(defaultSettings);
    }
  }, []);

  // Save settings
  useEffect(() => {
    const savedSettings: SavedSettings = {
      name: playerName,
      description,
      settings,
    };
    localStorage.setItem("savedSettings", JSON.stringify(savedSettings));
  }, [playerName, description, settings]);

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    setPlayerName(currentTarget.value);
  };

  const onDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    setDescription(currentTarget.value);
  };

  const onSettingChange: SettingChangeEvent = (
    settingName,
    newValue,
    category?
  ) => {
    const newSetting: SettingsCollection = {};
    if (category) {
      const newSubSetting: SettingsSubcollection = {};
      newSubSetting[settingName] = newValue;
      newSetting[category] = Object.assign(
        {},
        settings[category],
        newSubSetting
      );
    } else newSetting[settingName] = newValue;

    setSettings(Object.assign({}, settings, newSetting));
  };

  const convertBoolean = (
    value: SettingValue,
    setting: ArchipelagoSettingBase
  ) => {
    if (setting.type !== SettingType.Boolean) return value;
    if (setting.name === "swordless") {
      const booleans = ["on, off, true, false"];
      if (typeof value === "object") {
        for (const option in value)
          if (!booleans.includes(value[option].toString())) return value;
      } else if (!booleans.includes(value.toString())) return value;
    }

    if (typeof value === "object") {
      const newValue: WeightedSetting = {};
      newValue.true = value.true ?? value.on ?? 0;
      newValue.false = value.false ?? value.off ?? 0;
      return newValue;
    } else return value.toString() === "true" || value.toString() === "on";
  };

  const importYaml = (yamlIn: any) => {
    const newSettings: SettingsCollection = {};

    for (const { category, settings: catSettings } of CategoryList) {
      if (category) {
        if (!yamlIn[category]) continue;
        newSettings[category] = {};
      }

      const curImport = category ? yamlIn[category] : yamlIn;
      const curCategory = category ? newSettings[category] : newSettings;
      for (const setting of catSettings) {
        if (!curImport[setting.name])
          (curCategory as SettingsSubcollection)[setting.name] =
            setting.default;
        else
          (curCategory as SettingsSubcollection)[setting.name] = convertBoolean(
            curImport[setting.name] as SettingValue,
            setting
          );
      }
    }

    if (yamlIn.name) setPlayerName(yamlIn.name);
    if (yamlIn.description) setDescription(yamlIn.description);
    setSettings(Object.assign({}, settings, newSettings));
  };

  const importLegacyYaml = (yamlInBase: any) => {
    const yamlIn = Object.assign({}, yamlInBase, yamlInBase.rom);
    const newSettings: SettingsCollection = {};

    for (const { category, settings: catSettings } of CategoryList.slice(
      0,
      2
    )) {
      if (category) {
        newSettings[category] = {};
      }

      const curCategory = category ? newSettings[category] : newSettings;
      for (const setting of catSettings) {
        if (!yamlIn[setting.legacyName ?? setting.name]) {
          (curCategory as SettingsSubcollection)[setting.name] =
            setting.default;
        } else {
          let newSetting: SettingValue = convertBoolean(
            yamlIn[setting.legacyName ?? setting.name] as SettingValue,
            setting
          );
          if (setting.name === "swordless") {
            // "weapons" as a string setting changed to "swordless" as a boolean setting, so special handling is needed
            if (typeof newSetting === "object") {
              newSetting = {
                true: newSetting.swordless ?? 0,
                false:
                  (newSetting.vanilla ?? 0) +
                  (newSetting.randomized ?? 0) +
                  (newSetting.assured ?? 0),
              };
            } else newSetting = newSetting === "swordless";
          } else if (setting.name === "music") {
            if (typeof newSetting === "object") {
              newSetting = {
                true: newSetting.false ?? newSetting.off ?? 0,
                false: newSetting.true ?? newSetting.on ?? 0,
              };
            } else
              newSetting =
                newSetting.toString() === "false" ||
                newSetting.toString() === "off";
          } else if (setting.legacyValues) {
            if (typeof newSetting === "object") {
              for (const legacyName in setting.legacyValues) {
                const legacyNewName = setting.legacyValues[legacyName];
                if (newSetting[legacyName]) {
                  if (legacyNewName) {
                    newSetting[legacyNewName] = newSetting[legacyName];
                  }
                  delete newSetting[legacyName];
                }
              }
            } else if (
              Object.keys(setting.legacyValues).includes(newSetting as string)
            ) {
              if (setting.legacyValues[newSetting as string])
                newSetting = setting.legacyValues[newSetting as string]!;
              else newSetting = setting.default;
            }
          }
          if (
            setting.type === SettingType.Numeric &&
            (setting as ArchipelagoNumericSetting).randomable &&
            typeof newSetting === "object"
          ) {
            if (!newSetting.random) newSetting.random = 0;
            newSetting["random-low"] = 0;
            newSetting["random-high"] = 0;
          }
          (curCategory as SettingsSubcollection)[setting.name] = newSetting;
        }
      }
    }

    if (yamlIn.name) setPlayerName(yamlIn.name);
    if (yamlIn.description) setDescription(yamlIn.description);
    setSettings(Object.assign({}, settings, newSettings));
  };

  const onImport = () => {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", ".yaml");
    fileSelector.style.display = "none";
    document.body.appendChild(fileSelector);
    fileSelector.click();
    document.body.removeChild(fileSelector);

    fileSelector.addEventListener("change", () => {
      const { files } = fileSelector;
      if (files && files.length > 0) {
        const file = files[0];
        file
          .text()
          .then((text) => {
            const importedYaml = yaml.parse(text);
            (importedYaml.goals ? importLegacyYaml : importYaml)(importedYaml);
          })
          .catch((e) => console.error(e));
      }
    });
  };

  const onExport: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const outYaml = Object.assign(
      {
        name: playerName,
        description,
        requires: { version: process.env.REACT_APP_CURRENT_ARCHIPELAGO_VER },
      },
      settings
    );

    if (!e.ctrlKey) {
      for (const { category } of CategoryList) {
        if (!category) continue;
        else if (!isGameEnabled(category)) delete outYaml[category];
      }
    }

    const element = document.createElement("a");
    const file = new Blob([yaml.stringify(outYaml)], {
      type: "application/yaml",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${playerName}.yaml`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const onReset = () => {
    if (confirm("Are you sure you want to reset these settings to default?")) {
      localStorage.removeItem("savedSettings");
      location.reload();
    }
  };

  const isGameEnabled = (category: string | null) => {
    if (!category) return true;
    if (!settings) return false;
    if (!settings.game) return false;
    if (!settings[category]) return false;

    if (typeof settings.game === "object") {
      if (Object.keys(settings.game).includes(category))
        return settings.game[category] > 0;
      else return false;
    } else return category === settings.game;
  };

  const outputSettingCollection = (
    category: string | null,
    settingsDef: ArchipelagoSettingBase[]
  ) => {
    if (category !== null && settings[category] === undefined) return null;
    if (!isGameEnabled(category)) return null;

    const subsettings = (
      category === null ? settings : settings[category]
    ) as SettingsSubcollection;
    return settingsDef
      .filter((i) => Object.keys(subsettings).includes(i.name))
      .filter((i) => {
        if (!i.dependsOn) return true;
        else
          for (const check in i.dependsOn) {
            if (typeof subsettings[check] === "object") {
              const weightSubsetting = subsettings[check] as WeightedSetting;
              if (
                !hasCrossover(
                  Object.keys(weightSubsetting),
                  i.dependsOn[check] as string[]
                )
              )
                return false;
              for (const countercheck in weightSubsetting) {
                if (Object.keys(weightSubsetting).includes(countercheck)) {
                  if (weightSubsetting[countercheck] === 0) return false;
                  else break;
                }
              }
            } else if (!i.dependsOn[check].includes(subsettings[check]))
              return false;
          }
        return true;
      })
      .map((i) => (
        <Setting
          key={`setting-${category}-${i.name}`}
          category={category ?? undefined}
          setting={i}
          value={subsettings[i.name]}
          onChange={onSettingChange}
        />
      ));
  };

  return (
    <>
      <div className="settingsTool">
        <hgroup>
          <h1>Archipelago Settings Tool</h1>
          <h2>
            Server version: {process.env.REACT_APP_CURRENT_ARCHIPELAGO_VER}
          </h2>
          <h6>
            App version {version} — built{" "}
            {DateTime.fromMillis(BuildTimestamp).toRFC2822()}
          </h6>
        </hgroup>

        <section className="settings">
          <div className="setting">
            <b>Your name</b>:{" "}
            <input
              type="text"
              value={playerName}
              onChange={onNameChange}
              maxLength={16}
            />
            {ForbiddenNames.includes(playerName)
              ? `Your name cannot be ${playerName}.`
              : null}
            {playerName === "" ? `You must provide a name.` : null}
          </div>
          <div className="setting">
            <b>Settings description</b>:{" "}
            <input
              type="text"
              value={description}
              onChange={onDescriptionChange}
            />
          </div>
          <div className="setting">
            <button
              title="You can import Archipelago or Berserker YAML files."
              onClick={onImport}
            >
              Import YAML
            </button>
            <button
              title="Hold Ctrl to export all settings, including for games not being played."
              onClick={onExport}
            >
              Export YAML
            </button>
            <button onClick={onReset}>Reset this config</button>
          </div>
        </section>

        <Tabs>
          <TabList className="react-tabs__tab-list settingsTabs">
            {CategoryList.filter((i) => isGameEnabled(i.category)).map((i) => (
              <Tab>{i.category ?? "Global"}</Tab>
            ))}
            <Tab>Changelog</Tab>
          </TabList>

          {CategoryList.filter((i) => isGameEnabled(i.category)).map((i) => (
            <TabPanel className="settingsBody">
              {outputSettingCollection(i.category, i.settings)}
            </TabPanel>
          ))}
          <TabPanel className="settingsBody">
            <h4>0.9.3</h4>
            <ul>
              <li>Background changes to make it easier to add new games</li>
            </ul>
            <hr />
            <h4>0.9.2</h4>
            <ul>
              <li>Style tweak on weighted sliders</li>
              <li>
                Don't show dropdown for weighted string settings if all of them
                are on the table
              </li>
              <li>Fixed a couple of options in OoT</li>
              <li>Hide reset button for a setting if it is already default</li>
              <li>
                Reduce YAML output by removing sections for games definitely not
                being played (hold Ctrl to bypass this behaviour)
              </li>
              <li>
                Settings will now properly update if games/settings in them are
                added/removed
              </li>
            </ul>
            <hr />
            <h4>0.9.1</h4>
            <ul>
              <li>
                This is when I started the changelog. I didn't have version
                numbers up until now.
              </li>
              <li>
                Display app version and build time; clarify that "big" version
                is the current official server version at app build time
              </li>
            </ul>
            <hr />
            <h4>0.9</h4>
            Initial public release.
          </TabPanel>
        </Tabs>
      </div>
      <footer>
        The Archipelago Settings Tool is not affiliated to, or built in
        association with, Berserker66, Berserker Multiworld team, or Archipelago
        Multiworld team. The author does not promise any support and holds no
        liability from your use of the tool. Author:{" "}
        <a href="https://twitter.com/squaresym/">KewlioMZX (Twitter)</a>
      </footer>
    </>
  );
};

export default SettingsTool;
