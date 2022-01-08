import { gzipSync } from "zlib";

import React, { useState, useEffect, ReactElement } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import yaml from "yaml";
import { DateTime } from "luxon";
import cogoToast from "cogo-toast";
import "react-tabs/style/react-tabs.css";

import Changelog from "./objs/Changelog";

import {
  BuildTimestamp,
  ForbiddenNames,
  APDependency,
  APSavedSettings,
  APSavedSettingsCategory,
  useForceUpdate,
} from "../defs/core";
import { version } from "../../package.json";
import {
  APCategoryList,
  GameSetting,
  storedDesc,
  storedName,
} from "../defs/generate";
import { APCategory } from "../defs/categories/reader";
import { APStringSettingNode } from "./objs/settings/APStringSettingNode";
import { APNumericSettingNode } from "./objs/settings/APNumericSettingNode";
import { APBooleanSettingNode } from "./objs/settings/APBooleanSettingNode";
import { APItemSelector } from "./objs/entities/APItemSelector";
import { APLocationSelector } from "./objs/entities/APLocationSelector";
import { APHeaderStringNode } from "./objs/settings/APHeaderStringNode";
import "./SettingsTool.css";

const { localStorage, location, confirm } = window;

/**
 * Check a setting or item against its dependencies.
 * @param {string|null} category The category to check.
 * @param {ArchipelagoDependency} dep The dependency list to check against.
 * @returns {boolean} True if all dependencies are met; otherwise false.
 */
const checkDependencyV2 = (
  category: string | null,
  dep?: APDependency
): boolean => {
  // TODO: "not" dependencies (!value)

  // If this setting has no dependencies, keep it
  if (!dep) return true;
  // Get the category to check against
  const categoryObj = APCategoryList.find((i) => i.category === category);
  // If, for some reason, it's not found, then nothing exists anyway; return false
  if (!categoryObj) return false;

  // Iterate through all of the dependencies
  for (const check in dep) {
    // Find the setting in the category; if we can't, then assume deps are not met
    const setting = categoryObj.settings.find((i) => i.name === check);
    if (!setting) return false;

    // If the setting does not include any of the dependencies, then deps are definitely not met
    if (!setting.includes(...dep[check])) return false;
  }
  return true;
};

/**
 * Checks whether a game has been selected for play in the global "Game" setting.
 * @param {string|null} category The category to check.
 * @returns {boolean} Whether this category is enabled. Always true if {@link category} is null.
 */
const isGameEnabledV2 = (category: string | null): boolean => {
  // If there's no category, it's global settings; return true.
  if (!category) return true;
  // Otherwise, just check whether the category is included in the Game setting. Super simple!
  return GameSetting.includes(category);
};

/**
 * Does the actual work of saving. Placed outside the component to comply with the Rules of Hooks.
 * @param playerName The user-provided player name.
 * @param description The user-provided description.
 */
const RealSaveToStorage = (() => {
  let running: boolean = false;
  let queueAnother: [string, string] | undefined = undefined;
  let timeout: number | undefined = undefined;
  const save = (playerName: string, description: string) => {
    running = true;
    const savedSettings: APSavedSettings = {
      playerName,
      description,
      categories: APCategoryList.map((i) => {
        const retval = {
          category: i.category,
          settings: Object.fromEntries(
            i.settings.map((ii) => [ii.name, ii.storageValue])
          ),
        } as APSavedSettingsCategory;
        if (i.items) retval.items = i.items.yamlValue;
        if (i.locations) retval.locations = i.locations.yamlValue;

        return retval;
      }),
    };

    localStorage.setItem(
      "savedSettingsV2",
      gzipSync(JSON.stringify(savedSettings)).toString("base64")
    );

    if (queueAnother) {
      timeout = setTimeout(save, 1000, ...queueAnother);
      queueAnother = undefined;
    } else timeout = undefined;
    running = false;
  };
  return (playerName: string, description: string) => {
    if (!running) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(save, 1000, playerName, description);
    } else queueAnother = [playerName, description];
  };
})();

const restrictName = (value: string) => {
  let modifiedLength = value.length;
  if (/\{(?:PLAYER|player|NUMBER|number)\}/.test(value)) modifiedLength -= 5;
  if (modifiedLength > 16) return "This name is too long.";
  if (modifiedLength === 0) return "You must provide a name.";
  if (ForbiddenNames.includes(value))
    return `The name "${value}" is not allowed.`;
  return null;
};

/**
 * The Archipelago Settings Tool, a tool to generate .YAML settings files for Archipelago Multiworld.
 * @returns {ReactElement<any, any>|null} The body of the Archipelago Settings Tool.
 */
const SettingsTool: React.FC = (): ReactElement<any, any> | null => {
  const [playerName, setPlayerName] = useState("Player");
  const [description, setDescription] = useState(
    "Generated using Kewlio's Archipelago Settings Tool"
  );

  const forceUpdate = useForceUpdate();

  /** Saves the current settings to local storage. */
  const SaveToStorage = (skipUpdate = true) => {
    RealSaveToStorage(playerName, description);
    if (!skipUpdate) forceUpdate();
  };

  // Load settings
  useEffect(() => {
    // Old settings are incompatible; delete them
    localStorage.removeItem("savedSettings");

    if (storedName) setPlayerName(storedName);
    if (storedDesc) setDescription(storedDesc);

    const privacy = localStorage.getItem("apstPrivacy");
    if (!privacy) {
      const { hide } = cogoToast.info(
        <>
          This site uses local storage to save your settings. No data is saved
          on this server, and no analytics are kept. Click on this notification
          to dismiss it.
        </>,
        {
          hideAfter: 0,
          position: "bottom-center",
          heading: "Privacy",
          onClick: () => {
            localStorage.setItem("apstPrivacy", Date.now().toString());
            if (hide) hide();
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    RealSaveToStorage(playerName, description);
  }, [playerName, description]);

  /**
   * Imports data from an Archipelago YAML file.
   * @param yamlIn The imported YAML data.
   * @param {string|null} singleCat Optional. Import only a single category.
   */
  const importYamlV2 = (yamlIn: any, singleCat?: string | null) => {
    // TODO: option to import only one category

    for (const {
      category,
      settings: catSettings,
      items,
      locations,
    } of APCategoryList) {
      // If there's a category and it doesn't exist in the imported data, skip it; otherwise, prepare it
      if (category && !yamlIn[category]) continue;

      /** The category from the data set being imported. */
      const curImport = category ? yamlIn[category] : yamlIn;

      // Iterate through established settings, not through imported data
      for (const setting of catSettings) {
        // If the setting doesn't exist in the imported data, default it in the new settings
        if (curImport[setting.name])
          setting.yamlValue = curImport[setting.name];
        else setting.value = setting.default;
      }

      for (const manager of [items, locations])
        if (manager) {
          const importEntities: Record<string, any> = {};
          for (const list of manager.lists)
            if (curImport[list]) importEntities[list] = curImport[list];
          manager.yamlValue = importEntities;
        }
    }

    // Finally, set the name, description, and settings collection to update the UI
    if (yamlIn.name) setPlayerName(yamlIn.name);
    if (yamlIn.description) setDescription(yamlIn.description);
    SaveToStorage();
  };

  /**
   * Imports data from a Berserker YAML file.
   * @param yamlInBase The imported YAML data.
   */
  const importLegacyYamlV2 = (yamlInBase: any) => {
    /** The aggregate collection of settings from the Berserker YAML. */
    const yamlIn = Object.assign({}, yamlInBase, yamlInBase.rom);

    // Only iterate through global and LttP settings.
    for (const { settings: catSettings } of APCategoryList.filter((i) =>
      [null, "A Link to the Past"].includes(i.category)
    )) {
      // In this function, we refer to a setting's legacyName when checking the imported data
      // Some setting and value names have changed, so we need to use the new ones
      for (const setting of catSettings) {
        // If the setting doesn't exist in the imported data, default it
        if (yamlIn[setting.legacyName ?? setting.name]) {
          setting.value = setting.default;
        } else {
          // Fetch the data
          let oldSetting = yamlIn[setting.legacyName ?? setting.name];

          // "weapons" as a string setting changed to "swordless" as a boolean setting, so special handling is needed
          if (setting.name === "swordless") {
            // If it's weighted, then:
            // - Equate a "true" swordless value as the old chance of "swordless" weapon
            // - Equate a "false" swordless value as the old chance of anything else
            // TODO: when triggers are implemented, triggerfy this instead
            if (typeof oldSetting === "object") {
              setting.yamlValue = {
                true: oldSetting.swordless ?? 0,
                false:
                  (oldSetting.vanilla ?? 0) +
                  (oldSetting.randomized ?? 0) +
                  (oldSetting.assured ?? 0),
              };
              // Otherwise, the value is just whether the old setting is "swordless" or not
            } else setting.yamlValue = oldSetting === "swordless";
          } else if (setting.name === "music") {
            // "disablemusic" became "music", so its value should be flipped
            if (typeof oldSetting === "object") {
              setting.yamlValue = {
                true: oldSetting.false ?? oldSetting.off ?? 0,
                false: oldSetting.true ?? oldSetting.on ?? 0,
              };
            } else
              setting.yamlValue =
                oldSetting.toString() === "false" ||
                oldSetting.toString() === "off";
          } else setting.fromBerserkerYamlValue(oldSetting);
        }
      }
    }

    // Finally, set the name, description, and settings collection to update the UI
    if (yamlIn.name) setPlayerName(yamlIn.name);
    if (yamlIn.description) setDescription(yamlIn.description);
    SaveToStorage();
  };

  /** An event handler that fires when the "Import YAML" button is clicked. */
  const onImport = () => {
    // Create an invisible file selector to open a dialog box
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", ".yaml");
    fileSelector.style.display = "none";

    // Under Firefox, the element must be present in order for the file dialog to appear
    document.body.appendChild(fileSelector);
    fileSelector.click();
    document.body.removeChild(fileSelector);

    fileSelector.addEventListener("change", () => {
      const { files } = fileSelector;
      if (files && files.length > 0) {
        const file = files[0];

        // Take in the text file and try to determine if it's an Archipelago file or a Berserker file
        // How we determine that: an Archipelago file should not have "goals" at the root, but a
        // Berserker file generally would...not a guaranteed method, but this will usually work
        file
          .text()
          .then((text) => {
            const importedYaml = yaml.parse(text);
            (importedYaml.goals ? importLegacyYamlV2 : importYamlV2)(
              importedYaml
            );
          })
          .catch((e) => console.error(e));
      }
    });
  };

  /**
   * An event handler that fires when the "Export YAML" button is clicked.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e The {@link MouseEvent} object.
   */
  const onExportV2: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // TODO: Scan for any obvious problems that would prevent the YAML from working (all-zero weights, bad name, etc.)

    // Create the YAML structure
    let outYaml: any = Object.assign({
      name: playerName,
      description,
      requires: { version: process.env.REACT_APP_CURRENT_ARCHIPELAGO_VER },
    });

    for (const category of APCategoryList) {
      // If Ctrl is NOT held, filter out any category that is definitely not being played
      if (!isGameEnabledV2(category.category) && !e.ctrlKey) continue;
      const settings = category.settings.map((i) => [i.name, i.yamlValue]);
      if (category.items)
        settings.push(...Object.entries(category.items.yamlValue));
      if (category.locations)
        settings.push(...Object.entries(category.locations.yamlValue));
      if (category.category === null)
        outYaml = Object.assign(outYaml, Object.fromEntries(settings));
      else outYaml[category.category] = Object.fromEntries(settings);
    }

    // Create an <a> element to initiate the download
    const element = document.createElement("a");
    const file = new Blob([yaml.stringify(outYaml)], {
      type: "application/yaml",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${playerName}.yaml`;

    // Under Firefox, the element must be present in order for the file dialog to appear
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  /** An event handler that fires when the "Reset this config" button is clicked. */
  const onReset = () => {
    // Confirm the action.
    if (confirm("Are you sure you want to reset these settings to default?")) {
      // If so, just delete the local storage object and reload.
      localStorage.removeItem("savedSettingsV2");
      location.reload();
    }
  };

  /**
   * Converts a collection of settings into an array of {@link Setting} objects.
   * @param category The category to which the settings belong.
   * @param settingsDef The collection of settings to convert.
   * @returns {React.ReactNode[]|null} The collection of {@link Setting} objects.
   */
  const outputSettingCollectionV2 = (
    category: APCategory
  ): React.ReactNode[] | null => {
    // If the game is not selected, nothing to return
    if (!isGameEnabledV2(category.category)) return null;

    const retval = category.settings
      .filter((i) => checkDependencyV2(i.category, i.dependsOn))
      .map((i) => {
        const key = `setting-${category}-${i.name}`;
        if (i.isStringSetting())
          return (
            <APStringSettingNode
              key={key}
              category={i.category}
              setting={i}
              save={SaveToStorage}
            />
          );
        if (i.isNumericSetting())
          return (
            <APNumericSettingNode
              key={key}
              category={i.category}
              setting={i}
              save={SaveToStorage}
            />
          );
        if (i.isBooleanSetting())
          return (
            <APBooleanSettingNode
              key={key}
              category={i.category}
              setting={i}
              save={SaveToStorage}
            />
          );
        return null;
      });

    for (let x = retval.length - 1; x > 0; x--)
      retval.splice(
        x,
        0,
        <hr key={`hr-setting-${x}`} style={{ borderColor: "blue" }} />
      );
    return retval;
  };

  // Finally, lay out the page
  return (
    <>
      <div className="settingsTool">
        <hgroup>
          <h1>Archipelago Settings Tool</h1>
          <h2>AP version: {process.env.REACT_APP_CURRENT_ARCHIPELAGO_VER}</h2>
          <h6>
            App version {version} — built{" "}
            {DateTime.fromMillis(BuildTimestamp).toRFC2822()}
          </h6>
        </hgroup>

        <section className="settings">
          <APHeaderStringNode
            label="Your name"
            value={playerName}
            maxLength={24}
            setValue={setPlayerName}
            restrict={restrictName}
          />
          <APHeaderStringNode
            label="Settings description"
            value={description}
            setValue={setDescription}
          />
          <div className="setting">
            <button
              title="You can import Archipelago or Berserker YAML files."
              onClick={onImport}
            >
              Import YAML
            </button>
            <button
              title="Hold Ctrl to export all settings, including for games not being played."
              onClick={onExportV2}
            >
              Export YAML
            </button>
            <button onClick={onReset}>Reset this config</button>
          </div>
        </section>

        <Tabs>
          <TabList className="react-tabs__tab-list settingsTabs">
            {APCategoryList.filter((i) => isGameEnabledV2(i.category)).map(
              (i) => (
                // Output tabs for enabled games
                <Tab key={`tab-${i.category}`}>{i.category ?? "Global"}</Tab>
              )
            )}
            <Tab>Changelog</Tab>
          </TabList>

          {APCategoryList.filter((i) => isGameEnabledV2(i.category)).map(
            (i) => (
              <TabPanel key={`tabpanel-${i.category}`} className="settingsBody">
                {outputSettingCollectionV2(i)}
                {i.category && i.items ? (
                  <>
                    <hr style={{ borderColor: "blue" }} />
                    <APItemSelector
                      category={i.category}
                      manager={i.items}
                      save={SaveToStorage}
                    />
                  </>
                ) : null}
                {i.category && i.locations ? (
                  <>
                    <hr style={{ borderColor: "blue" }} />
                    <APLocationSelector
                      category={i.category}
                      manager={i.locations}
                      save={SaveToStorage}
                    />
                  </>
                ) : null}
              </TabPanel>
            )
          )}
          <TabPanel className="settingsBody">
            <Changelog />
          </TabPanel>
        </Tabs>
      </div>
      <footer>
        The Archipelago Settings Tool is not affiliated to, or built in
        association with, Berserker66, Berserker Multiworld team, or Archipelago
        Multiworld team. This project is under the{" "}
        <a href="https://mit-license.org">MIT license</a>, and as such, the
        author does not promise any support and holds no liability from your use
        of the tool. Author: KewlioMZX{" "}
        <a href="https://twitter.com/squaresym/">(Twitter)</a>{" "}
        <a href="https://github.com/FelicitusNeko/archipelago-settings/">
          (GitHub)
        </a>
      </footer>
    </>
  );
};

export default SettingsTool;
