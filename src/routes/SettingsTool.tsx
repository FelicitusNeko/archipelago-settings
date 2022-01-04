import { gunzipSync, gzipSync } from "zlib";

import React, { useState, useEffect, ReactElement } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import yaml from "yaml";
import { DateTime } from "luxon";
import "react-tabs/style/react-tabs.css";

import ItemSelector from "./objs/ItemSelector";
import Changelog from "./objs/Changelog";

import {
  BuildTimestamp,
  ForbiddenNames,
  SettingValue,
  APDependency,
  ArchipelagoCommonSettings,
  MinifiedCommonSettings,
  ArchipelagoGameEntity,
  ArchipelagoItem,
  ArchipelagoLocation,
  CommonItemSettingChangeEvent,
  APSavedSettings,
  APSavedSettingsCategory,
} from "../defs/core";
import { version } from "../../package.json";
import { CategoryList } from "../defs/global";
import { APCategoryList, GameSetting } from "../defs/generate";
import { APCategory } from "../defs/categories/reader";
import { APStringSettingNode } from "./objs/APStringSettingNode";
import { APNumericSettingNode } from "./objs/APNumericSettingNode";
import { APBooleanSettingNode } from "./objs/APBooleanSettingNode";
import { APItemSelector } from "./objs/entities/APItemSelector";
import "./SettingsTool.css";

const { localStorage, location, confirm } = window;

/** @deprecated */
type SettingsSubcollection = Record<string, SettingValue>;
/** @deprecated */
type SettingsCollection = Record<string, SettingValue | SettingsSubcollection>;

/** @deprecated */
const EmptyCommonSetings: MinifiedCommonSettings = Object.seal({
  local_items: [],
  non_local_items: [],
  start_inventory: {},
  start_hints: [],
  start_location_hints: [],
  exclude_locations: [],
});

/**
 * Serializes the common settings for browser storage and YAML output.
 * @param commonSettings The set of common settings to serialize.
 * @returns {Record<string, MinifiedCommonSettings>} The set of serialized common settings.
 * @deprecated will be replaced by entity managers
 */
const minifyCommonSettings = (
  commonSettings: Record<string, ArchipelagoCommonSettings>
) => {
  const retval: Record<string, MinifiedCommonSettings> = {};

  for (const category of Object.keys(commonSettings)) {
    const settings = commonSettings[category];
    retval[category] = {};

    if (settings.local_items)
      retval[category].local_items = settings.local_items.map((i) => i.name);
    if (settings.non_local_items)
      retval[category].non_local_items = settings.non_local_items.map(
        (i) => i.name
      );
    if (settings.start_inventory) {
      retval[category].start_inventory = {};
      for (let { item, qty } of settings.start_inventory)
        retval[category].start_inventory![item.name] = qty;
    }
    if (settings.start_hints)
      retval[category].start_hints = settings.start_hints.map((i) => i.name);
    if (settings.start_location_hints)
      retval[category].start_location_hints = settings.start_location_hints.map(
        (i) => i.name
      );
    if (settings.exclude_locations)
      retval[category].exclude_locations = settings.exclude_locations.map(
        (i) => i.name
      );
  }

  return retval;
};

/**
 * Deserialize common settings into complete data that is used by the Settings Tool.
 * @param minifiedSettings The set of serialized data.
 * @returns The deserialized common settings for the Settings Tool to use.
 * @deprecated will be replaced by entity managers
 */
const deserializeCommonSettings = (
  minifiedSettings: Record<string, MinifiedCommonSettings>
) => {
  //console.debug(minifiedSettings);
  const retval: Record<string, ArchipelagoCommonSettings> = {};

  const fetchEntity = (itemName: string, entityList: ArchipelagoGameEntity[]) =>
    entityList.reduce(
      (r: ArchipelagoGameEntity | null, i) => (i.name === itemName ? i : r),
      null
    );

  for (const category of Object.keys(minifiedSettings)) {
    //console.debug("Deserializing", category);
    const minSettings = minifiedSettings[category];
    const fullSettings: ArchipelagoCommonSettings = {};
    const { items, locations } = CategoryList.reduce((r, i) =>
      i.category === category ? i : r
    );

    if (items) {
      if (minSettings.local_items)
        fullSettings.local_items = minSettings.local_items.map((i) =>
          fetchEntity(i, items)
        ) as ArchipelagoItem[];
      if (minSettings.non_local_items)
        fullSettings.non_local_items = minSettings.non_local_items.map((i) =>
          fetchEntity(i, items)
        ) as ArchipelagoItem[];
      if (minSettings.start_inventory) {
        fullSettings.start_inventory = [];
        for (const itemName in minSettings.start_inventory) {
          const item = fetchEntity(itemName, items);
          if (item)
            fullSettings.start_inventory.push({
              item,
              qty: minSettings.start_inventory[itemName],
            });
        }
      }
      if (minSettings.start_hints)
        fullSettings.start_hints = minSettings.start_hints.map((i) =>
          fetchEntity(i, items)
        ) as ArchipelagoItem[];
    }
    if (locations) {
      if (minSettings.start_location_hints)
        fullSettings.start_location_hints =
          minSettings.start_location_hints.map((i) =>
            fetchEntity(i, locations)
          ) as ArchipelagoLocation[];
      if (minSettings.exclude_locations)
        fullSettings.exclude_locations = minSettings.exclude_locations.map(
          (i) => fetchEntity(i, locations)
        ) as ArchipelagoLocation[];
    }

    //console.debug(minSettings, fullSettings);
    retval[category] = fullSettings;
  }

  //console.debug(retval);
  return retval;
};

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

/** Creates a hook which facilitates forced updating of a function component. */
const useForceUpdate = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
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
  /** @deprecated Entity managers will remove the need for this */
  const [commonSettings, setCommonSettings] = useState<
    Record<string, ArchipelagoCommonSettings>
  >({});

  const forceUpdate = useForceUpdate();

  /** Saves the current settings to local storage. */
  const SaveToStorage = (skipUpdate = false) => {
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

    if (!skipUpdate) forceUpdate();
  };

  // Load settings
  useEffect(() => {
    // Attempt to retrieve settings from local storage
    /** The stringified collection of saved settings. */
    console.debug("Loading");
    const savedSettingsStr = (() => {
      const store = localStorage.getItem("savedSettingsV2");
      if (!store || store[0] === "{") return store;
      else return gunzipSync(Buffer.from(store, "base64")).toString();
    })();

    if (savedSettingsStr) {
      // There are saved settings; load them in
      const savedSettings = JSON.parse(savedSettingsStr) as APSavedSettings;
      const {
        playerName: nameIn,
        description: descriptionIn,
        categories: categoriesIn,
        //commonSettings: commonSettingsIn,
      } = savedSettings;
      setPlayerName(nameIn);
      setDescription(descriptionIn);

      //console.debug(savedSettings);
      for (const category of APCategoryList) {
        const savedCategory = categoriesIn.find(
          (i) => i.category === category.category
        );
        if (!savedCategory) continue;
        for (const setting of category.settings)
          if (savedCategory.settings[setting.name])
            setting.storageValue = savedCategory.settings[setting.name];

        if (category.items && savedCategory.items)
          category.items.yamlValue = savedCategory.items;
        if (category.locations && savedCategory.locations)
          category.locations.yamlValue = savedCategory.locations;
      }

      // HACK: find a way to initialise settings with saved data
      forceUpdate();
    }
  }, []);

  /**
   * An event handler that fires when the player name is changed.
   * @param param0 The event object for this event.
   */
  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    setPlayerName(currentTarget.value);
    SaveToStorage(true);
  };

  /**
   * An event handler that fires when the YAML description is changed.
   * @param param0 The event object for this event.
   */
  const onDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    setDescription(currentTarget.value);
    SaveToStorage(true);
  };

  /**
   * A synthetic event handler that fires when the value of a common item setting is changed.
   * @param itemName The name of the item.
   * @param category The category to which the item belongs.
   * @param options Any options pertaining to the event.
   * @since 0.10.0
   * @deprecated will be replaced by entity managers
   */
  const onCommonItemSettingChange: CommonItemSettingChangeEvent = (
    itemName,
    category,
    options
  ) => {
    //console.debug("onCommonItemSettingChange", itemName, category, options);
    const { destination, index, qty, startingHint, reset } = options;

    // doing this to trick React into recognising this is a new common settings object
    const newCommonSettings = Object.assign({}, commonSettings);
    const catCommons = Object.assign({}, newCommonSettings[category]);

    const validDests = [
      "local_items",
      "non_local_items",
      "start_inventory",
      "unassigned",
    ];

    if (reset) {
      const validResetDests = [...validDests, "start_hints"];
      if (destination && !validResetDests.includes(destination)) {
        console.warn(`Invalid destination ${destination}`);
        return;
      }

      if (!destination || destination === "local_items")
        catCommons.local_items = [];
      if (!destination || destination === "non_local_items")
        catCommons.non_local_items = [];
      if (!destination || destination === "start_inventory")
        catCommons.start_inventory = [];
      if (!destination || destination === "start_hints")
        catCommons.start_hints = [];
    } else {
      const { items } =
        CategoryList[CategoryList.map((i) => i.category).indexOf(category)];
      if (!items) {
        console.warn(`Item list not found for category ${category}`);
        return;
      }

      const item = items[items.map((i) => i.name).indexOf(itemName)];
      if (!item) {
        console.warn(`Item ${itemName} not found in category ${category}`);
        return;
      }

      if (destination) {
        //console.debug("Destination detected");
        if (!validDests.includes(destination)) {
          console.warn(`Invalid destination ${destination}`);
          return;
        }

        if (catCommons.local_items)
          catCommons.local_items = catCommons.local_items.filter(
            (i) => i !== item
          );
        if (catCommons.non_local_items)
          catCommons.non_local_items = catCommons.non_local_items.filter(
            (i) => i !== item
          );
        if (catCommons.start_inventory)
          catCommons.start_inventory = catCommons.start_inventory.filter(
            (i) => i.item !== item
          );

        switch (destination) {
          case "local_items":
            //console.debug("Local item");
            if (!catCommons.local_items) catCommons.local_items = [item];
            else {
              catCommons.local_items = catCommons.local_items.slice(0);
              if (index === undefined || index >= catCommons.local_items.length)
                catCommons.local_items.push(item);
              else catCommons.local_items.splice(index, 0, item);
            }
            break;

          case "non_local_items":
            //console.debug("Nonlocal item");
            if (!catCommons.non_local_items)
              catCommons.non_local_items = [item];
            else {
              catCommons.non_local_items = catCommons.non_local_items.slice(0);
              if (
                index === undefined ||
                index >= catCommons.non_local_items.length
              )
                catCommons.non_local_items.push(item);
              else catCommons.non_local_items.splice(index, 0, item);
            }
            break;

          case "start_inventory":
            {
              //console.debug("Start inv");
              const itemQty = { item, qty: qty ?? 1 };
              if (item.max === 0) {
                console.warn(
                  `Item ${item} has max of 0 and thus cannot be added to start inventory (there may be a similar item; look for that one)`
                );
                return;
              }
              if (!catCommons.start_inventory)
                catCommons.start_inventory = [itemQty];
              else {
                catCommons.start_inventory =
                  catCommons.start_inventory.slice(0);
                if (
                  index === undefined ||
                  index >= catCommons.start_inventory.length
                )
                  catCommons.start_inventory.push(itemQty);
                else catCommons.start_inventory.splice(index, 0, itemQty);
              }
              if (catCommons.start_hints)
                catCommons.start_hints = catCommons.start_hints.filter(
                  (i) => i !== item
                );
            }
            break;
        }
      } else if (qty) {
        //console.debug("Quantity detected");
        if (qty < 1) {
          console.warn(`Quantity cannot go lower than 0`);
          return;
        }
        if (qty > (item.max ?? 1)) {
          console.warn(
            `Quantity for ${item.name} cannot go higher than ${item.max ?? 1}`
          );
          return;
        }
        if (!catCommons.start_inventory) {
          console.warn(`No starting inventory yet defined for ${category}`);
          return;
        }
        const index = catCommons.start_inventory
          .map((i) => i.item)
          .indexOf(item);
        if (index < 0) {
          console.warn(`${item.name} not in starting inventory`);
          return;
        }
        catCommons.start_inventory = catCommons.start_inventory.slice(0);
        catCommons.start_inventory[index].qty = qty;
      }

      if (
        !reset &&
        startingHint !== undefined &&
        destination !== "start_inventory"
      ) {
        //console.debug("Starthint detected");
        if (catCommons.start_inventory) {
          const index = catCommons.start_inventory
            .map((i) => i.item)
            .indexOf(item);
          if (
            index >= 0 &&
            catCommons.start_inventory[index].qty === (item.max ?? 1)
          ) {
            console.warn(
              `All of item ${item.name} in starting inventory; no hints available`
            );
            return;
          }
        }

        if (startingHint) {
          if (!catCommons.start_hints) catCommons.start_hints = [item];
          else {
            catCommons.start_hints = catCommons.start_hints.slice(0);
            if (index === undefined || index >= catCommons.start_hints.length)
              catCommons.start_hints.push(item);
            else catCommons.start_hints.splice(index, 0, item);
          }
        } else {
          if (!catCommons.start_hints) {
            console.warn(`No starting hints yet defined for ${category}`);
            return;
          } else
            catCommons.start_hints = catCommons.start_hints.filter(
              (i) => i !== item
            );
        }
      }
    }

    //console.debug("Updating common settings");
    newCommonSettings[category] = catCommons;
    setCommonSettings(newCommonSettings);
    SaveToStorage(true);
  };

  /**
   * Imports data from an Archipelago YAML file.
   * @param yamlIn The imported YAML data.
   * @param {string|null} singleCat Optional. Import only a single category.
   */
  const importYamlV2 = (yamlIn: any, singleCat?: string | null) => {
    // TODO: option to import only one category
    /** The collection of imported settings. */
    //const newSettings: SettingsCollection = {};
    //const newMinifiedSettings: Record<string, MinifiedCommonSettings> = {};

    for (const { category, settings: catSettings, items, locations } of APCategoryList) {
      // If there's a category and it doesn't exist in the imported data, skip it; otherwise, prepare it
      if (category) {
        if (!yamlIn[category]) continue;
        //newSettings[category] = {};
      }

      /** The category from the data set being imported. */
      const curImport = category ? yamlIn[category] : yamlIn;

      // Iterate through established settings, not through imported data
      for (const setting of catSettings) {
        // If the setting doesn't exist in the imported data, default it in the new settings
        if (curImport[setting.name])
          setting.yamlValue = curImport[setting.name];
        else setting.value = setting.default;
      }

      for (const manager of [items, locations]) if (manager) {
        const importEntities: Record<string, any> = {};
        for (const list of manager.lists) if (curImport[list]) importEntities[list] = curImport[list];
        manager.yamlValue = importEntities;
      }

      // if (category) {
      //   const {
      //     local_items,
      //     non_local_items,
      //     start_inventory,
      //     start_hints,
      //     start_location_hints,
      //     exclude_locations,
      //   } = yamlIn[category];
      //   newMinifiedSettings[category] = {
      //     local_items,
      //     non_local_items,
      //     start_inventory,
      //     start_hints,
      //     start_location_hints,
      //     exclude_locations,
      //   };
      // }
    }

    // Finally, set the name, description, and settings collection to update the UI
    if (yamlIn.name) setPlayerName(yamlIn.name);
    if (yamlIn.description) setDescription(yamlIn.description);
    //setCommonSettings(deserializeCommonSettings(newMinifiedSettings));
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

    return category.settings
      .filter((i) => checkDependencyV2(i.category, i.dependsOn))
      .map((i) => {
        if (i.isStringSetting())
          return (
            <APStringSettingNode
              category={i.category}
              setting={i}
              save={SaveToStorage}
            />
          );
        if (i.isNumericSetting())
          return (
            <APNumericSettingNode
              category={i.category}
              setting={i}
              save={SaveToStorage}
            />
          );
        if (i.isBooleanSetting())
          return (
            <APBooleanSettingNode
              category={i.category}
              setting={i}
              save={SaveToStorage}
            />
          );
        return null;
      });
  };

  // Finally, lay out the page
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
                  <APItemSelector
                    category={i.category}
                    manager={i.items}
                    save={SaveToStorage}
                  />
                ) : // <ItemSelector
                //   category={i.category}
                //   items={[]
                //     /*i.items.filter((ii) =>
                //   checkDependency(
                //     settings[i.category!] as SettingsSubcollection,
                //     ii.dependsOn
                //   )
                //   )*/
                //   }
                //   commonSettings={commonSettings[i.category]}
                //   onChange={onCommonItemSettingChange}
                // />
                null}
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
