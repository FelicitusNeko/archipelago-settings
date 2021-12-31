import React, { useState, useEffect, ReactElement } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import yaml from "yaml";
import { DateTime } from "luxon";
import "react-tabs/style/react-tabs.css";

//import Setting from "./objs/Setting";
import ItemSelector from "./objs/ItemSelector";
import Changelog from "./objs/Changelog";

import {
  BuildTimestamp,
  // SettingChangeEvent,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoNumericSetting,
  ForbiddenNames,
  SettingValue,
  WeightedSetting,
  SettingType,
  ArchipelagoDependency,
  ArchipelagoCommonSettings,
  MinifiedCommonSettings,
  ArchipelagoGameEntity,
  ArchipelagoItem,
  ArchipelagoLocation,
  CommonItemSettingChangeEvent,
} from "../defs/core";
import { version } from "../../package.json";
import { CategoryList } from "../defs/global";
import { APCategoryList } from "../defs/generate";
import { APCategory } from "../defs/categories/reader";
import { APStringSettingNode } from "./objs/APStringSettingNode";
import { APNumericSettingNode } from "./objs/APNumericSettingNode";
import { APBooleanSettingNode } from "./objs/APBooleanSettingNode";
import "./SettingsTool.css";

const { localStorage, location, confirm } = window;

type SettingsSubcollection = Record<string, SettingValue>;
type SettingsCollection = Record<string, SettingValue | SettingsSubcollection>;

/** Settings currently saved in the browser's local storage. */
interface SavedSettings {
  /** The saved player name. */
  name: string;
  /** The saved file description. */
  description: string;
  /** The saved collection of settings. */
  settings: SettingsCollection;
  /** Common settings to every category. */
  commonSettings?: Record<string, MinifiedCommonSettings>;
}

const EmptyCommonSetings: MinifiedCommonSettings = Object.seal({
  local_items: [],
  non_local_items: [],
  start_inventory: {},
  start_hints: [],
  start_location_hints: [],
  exclude_locations: [],
});

/**
 * Checks whether there is any crossover between two arrays.
 * @param {string[]} lhs One array to check against.
 * @param {string[]} rhs The other array to check against.
 * @returns {boolean} Whether there is any crossover between the arrays.
 */
const hasCrossover = (lhs: string[], rhs: string[]): boolean => {
  for (const i of lhs) if (rhs.includes(i)) return true;
  return false;
};

/**
 * Serializes the common settings for browser storage and YAML output.
 * @param commonSettings The set of common settings to serialize.
 * @returns {Record<string, MinifiedCommonSettings>} The set of serialized common settings.
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
 * Normalize Boolean values toward "true" or "false".
 * @param {SettingValue} value The current value for this setting.
 * @param {ArchipelagoSettingBase} setting The setting object to which the value belongs.
 * @returns {SettingValue} If the setting is not a {@link ArchipelagoBooleanSetting}, the original value. Otherwise, the normalized Boolean value.
 */
const convertBoolean = (
  value: SettingValue,
  setting: ArchipelagoSettingBase
): SettingValue => {
  // If it's already a Boolean, nothing to be done
  if (setting.type !== SettingType.Boolean) return value;

  // Special handling for LttP "swordless" setting because of its conversion from Berserker
  if (setting.name === "swordless") {
    const booleans = ["on", "off", "true", "false"];
    if (typeof value === "object") {
      for (const option in value)
        if (!booleans.includes(value[option].toString())) return value;
    } else if (!booleans.includes(value.toString())) return value;
  }

  if (typeof value === "object") {
    // If it's a weighted setting, use the Boolean value first, then its on/off equivalent, then default 0
    const newValue: WeightedSetting = {};
    newValue.true = value.true ?? value.on ?? 0;
    newValue.false = value.false ?? value.off ?? 0;
    return newValue;
    // Otherwise, just return whether the value is string "true" or "on"
  } else return value.toString() === "true" || value.toString() === "on";
};

/**
 * Checks a collection of settings for validity, and makes revisions as necessary.
 * @param data The collection of settings to verify.
 * @returns The revised collection of settings.
 */
const checkSavedData = (data: SettingsCollection) => {
  console.info("Reticulating splines"); // lul
  //console.debug('before',data);
  /** The overall collection of revised settings. */
  const retval: SettingsCollection = {};

  for (const { category, settings: catSettings } of CategoryList) {
    if (category) {
      // If the category doesn't exist, create it
      if (!data[category]) data[category] = {};
      retval[category] = data[category]
        ? Object.assign({}, data[category])
        : {};
    }

    /** The collection of existing settings for this category. */
    const subcatIn = (
      category ? data[category] : data
    ) as SettingsSubcollection;
    /** The collection of revised settings for this category. */
    const subcatOut = (
      category ? retval[category] : retval
    ) as SettingsSubcollection;
    //console.log(subcatOut);

    for (const setting of catSettings) {
      if (subcatIn[setting.name]) {
        // NOTE: is this fixed? was subcatOut (I'm hoping this is fixed now)
        // The setting exists; validate it
        subcatOut[setting.name] =
          typeof subcatOut[setting.name] === "object"
            ? Object.assign({}, subcatIn[setting.name])
            : subcatIn[setting.name];

        switch (setting.type) {
          case SettingType.String:
            {
              /** The current setting as an {@link ArchipelagoStringSetting}. */
              const strSetting = setting as ArchipelagoStringSetting;
              /** The list of valid values. */
              const validValues = Object.keys(strSetting.values);

              if (typeof subcatOut[setting.name] === "object") {
                // If the setting is weighted, check every single value to make sure it's valid
                /** The collection of weighted values for this setting. */
                const weights = subcatOut[setting.name] as WeightedSetting;
                for (const value of Object.keys(weights))
                  if (!validValues.includes(value)) delete weights[value];

                // If no valid values are left, default this setting
                if (Object.keys(weights).length === 0)
                  subcatOut[setting.name] = setting.default;
              } else if (
                // If the setting isn't weighted, check the single value against list of valid values
                !validValues.includes(subcatOut[setting.name] as string)
              )
                // If it's not valid, default it
                subcatOut[setting.name] = setting.default;
            }
            break;
          case SettingType.Numeric:
            {
              /** The current setting as an {@link ArchipelagoNumericSetting}. */
              const numSetting = setting as ArchipelagoNumericSetting;

              if (typeof subcatOut[setting.name] === "object") {
                // If the setting is weighted, check every single value to make sure it's valid
                /** The collection of weighted values for this setting. */
                const weights = subcatOut[setting.name] as WeightedSetting;
                for (const value of Object.keys(weights)) {
                  if (value.startsWith("random")) {
                    // If the value is a form of random, and the value is not randomable, delete the random value
                    if (!numSetting.randomable) delete weights[value];
                  } else {
                    /** The current numeric value for this setting. */
                    const numval = Number.parseInt(value);
                    if (
                      // If the value is out of bounds or not a number, delete the value
                      isNaN(numval) ||
                      numval < numSetting.low ||
                      numval > numSetting.high
                    )
                      delete weights[value];
                  }
                }

                if (
                  // If no numeric values are left, default the setting
                  Object.keys(weights).length ===
                  (numSetting.randomable ? 3 : 0)
                )
                  subcatOut[setting.name] = setting.default;
              } else if (
                // If the single setting is not numeric or out of bounds, default the setting
                typeof subcatOut[setting.name] !== "number" ||
                subcatOut[setting.name] < numSetting.low ||
                subcatOut[setting.name] > numSetting.high
              )
                subcatOut[setting.name] = setting.default;
            }
            break;
          case SettingType.Boolean:
            {
              /** The list of valid values. */
              const validValues = ["true", "false", "on", "off"];
              if (typeof subcatOut[setting.name] === "object") {
                // If the setting is weighted, check every single value to make sure it's valid
                /** The collection of weighted values for this setting. */
                const weights = subcatOut[setting.name] as WeightedSetting;
                for (const value of Object.keys(weights))
                  if (!validValues.includes(value)) delete weights[value];

                // If no valid values are left, default this setting
                if (Object.keys(weights).length === 0)
                  subcatOut[setting.name] = setting.default;
                // Otherwise, normalize the Boolean value
                else
                  subcatOut[setting.name] = convertBoolean(
                    subcatOut[setting.name],
                    setting
                  );
              } else if (typeof subcatOut[setting.name] !== "boolean")
                // If the setting isn't weighted, check the single value against list of valid values
                // If it's not valid, default it
                subcatOut[setting.name] = setting.default;
            }
            break;
        }
      } else subcatOut[setting.name] = setting.default;
      // The setting does not exist; default it
    }
  }

  //console.debug('after',retval);
  return retval;
};

/**
 * Check a setting or item against its dependencies.
 * @param {SettingsSubcollection} subsettings The subcollection of settings to check.
 * @param {ArchipelagoDependency} dep The dependency list to check against.
 * @returns {boolean} True if all dependencies are met; otherwise false.
 */
const checkDependency = (
  subsettings: SettingsSubcollection,
  dep?: ArchipelagoDependency
): boolean => {
  // TODO: "not" dependencies (!value)

  // If this setting has no dependencies, keep it
  if (!dep) return true;
  // Iterate through all of the dependencies
  else
    for (const check in dep) {
      if (typeof subsettings[check] === "object") {
        /** The collection of weights for the parent setting. */
        const weightSubsetting = subsettings[check] as WeightedSetting;
        // If the required value(s) is/are not selected at all, filter out
        if (
          !hasCrossover(Object.keys(weightSubsetting), dep[check] as string[])
        )
          return false;
        // If the required value(s) present has/all have a weight of 0, filter out
        for (const countercheck in weightSubsetting) {
          if (Object.keys(weightSubsetting).includes(countercheck)) {
            if (weightSubsetting[countercheck] === 0) return false;
            else break;
          }
        }
        // If it's a single value, filter out if a required value is not set
      } else if (!dep[check].includes(subsettings[check])) return false;
    }
  return true;
};

/**
 * Checks whether a game has been selected for play in the global "Game" setting.
 * @param {string|null} category The category to check.
 * @returns {boolean} Whether this category is enabled. Always true if {@link category} is null.
 */
const isGameEnabled = (
  settings: SettingsCollection,
  category: string | null
): boolean => {
  // Definite answers:
  // If there's no category, it's global settings; return true.
  if (!category) return true;
  // If there are no settings at all (which shouldn't happen unless the page is freshly loaded), return false.
  if (!settings) return false;
  // If there is no "game" setting (see above), return false.
  if (!settings.game) return false;
  // If the category is not present in settings, return false.
  if (!settings[category]) return false;

  if (typeof settings.game === "object") {
    // If the game setting is weighted, return true for any category whose weight is higher than zero
    if (Object.keys(settings.game).includes(category))
      return settings.game[category] > 0;
    else return false;
    // Otherwise, only return true for the one selected category
  } else return category === settings.game;
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
  const [settings, setSettings] = useState<SettingsCollection>({});
  const [commonSettings, setCommonSettings] = useState<
    Record<string, ArchipelagoCommonSettings>
  >({});

  // Load settings
  useEffect(() => {
    // Attempt to retrieve settings from local storage
    /** The stringified collection of saved settings. */
    const savedSettingsStr = localStorage.getItem("savedSettings");

    if (savedSettingsStr) {
      // There are saved settings; load them in
      const savedSettings = JSON.parse(savedSettingsStr) as SavedSettings;
      //console.debug(savedSettings);
      const {
        name: nameIn,
        description: descriptionIn,
        settings: settingsIn,
        commonSettings: commonSettingsIn,
      } = savedSettings;
      setPlayerName(nameIn);
      setDescription(descriptionIn);
      setSettings(checkSavedData(settingsIn));

      //console.debug(commonSettingsIn);
      if (commonSettingsIn) {
        //console.debug("Common settings found; deserializing", commonSettingsIn);
        const categories = CategoryList.map((i) => i.category);
        for (const category of categories)
          if (category && !commonSettingsIn[category])
            commonSettingsIn[category] = Object.assign({}, EmptyCommonSetings);
        for (const category of Object.keys(commonSettingsIn))
          if (!categories.includes(category)) delete commonSettingsIn[category];
        //console.debug(commonSettingsIn);
        setCommonSettings(deserializeCommonSettings(commonSettingsIn));
      } else {
        //console.debug("No common settings, generating empty set");
        const newEmptyCommons: Record<string, MinifiedCommonSettings> = {};
        for (const { category } of CategoryList)
          if (category)
            newEmptyCommons[category] = Object.assign({}, EmptyCommonSetings);
        setCommonSettings(deserializeCommonSettings(newEmptyCommons));
      }
    } else {
      // There are not saved settings; load in the settings collection and populate with defaults
      console.debug("No saved settings found at all, generating default set");

      let defaultSettings: SettingsCollection = {};
      const newEmptyCommons: Record<string, MinifiedCommonSettings> = {};

      for (const { category, settings } of CategoryList) {
        const subcollection: SettingsSubcollection = {};
        settings.forEach((i) => (subcollection[i.name] = i.default));
        if (!category)
          defaultSettings = Object.assign(defaultSettings, subcollection);
        else {
          defaultSettings[category] = subcollection;
          newEmptyCommons[category] = Object.assign({}, EmptyCommonSetings);
        }
      }
      setSettings(defaultSettings);
      setCommonSettings(deserializeCommonSettings(newEmptyCommons));
    }
  }, []);

  // Save settings
  useEffect(() => {
    //console.debug("Saving");
    const savedSettings: SavedSettings = {
      name: playerName,
      description,
      settings,
      commonSettings: minifyCommonSettings(commonSettings),
    };
    // When settings are modified, save them to local storage
    localStorage.setItem("savedSettings", JSON.stringify(savedSettings));
  }, [playerName, description, settings, commonSettings]);

  /**
   * An event handler that fires when the player name is changed.
   * @param param0 The event object for this event.
   */
  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    setPlayerName(currentTarget.value);
  };

  /**
   * An event handler that fires when the YAML description is changed.
   * @param param0 The event object for this event.
   */
  const onDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    setDescription(currentTarget.value);
  };

  // /**
  //  * A synthetic event handler that fires when the value of a setting is changed.
  //  * @param {string} settingName The internal name of the setting.
  //  * @param {SettingValue} newValue The new value for this setting.
  //  * @param {string} [category] Optional. The category to which this setting belongs. If omitted, it is presumed to be a global setting.
  //  */
  // const onSettingChange: SettingChangeEvent = (
  //   settingName: string,
  //   newValue: SettingValue,
  //   category?: string
  // ) => {
  //   const newSetting: SettingsCollection = {};
  //   if (category) {
  //     // If there's a category specified, update the setting in that category
  //     const newSubSetting: SettingsSubcollection = {};
  //     newSubSetting[settingName] = newValue;
  //     newSetting[category] = Object.assign(
  //       {},
  //       settings[category],
  //       newSubSetting
  //     );
  //     // Otherwise, update the global setting
  //   } else newSetting[settingName] = newValue;

  //   // Merge everything together
  //   setSettings(Object.assign({}, settings, newSetting));
  // };

  const SaveToStorage = () => {
    // do what it says
  };

  /**
   * A synthetic event handler that fires when the value of a common item setting is changed.
   * @param itemName The name of the item.
   * @param category The category to which the item belongs.
   * @param options Any options pertaining to the event.
   * @since 0.10.0
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
  };

  /**
   * Imports data from an Archipelago YAML file.
   * @param yamlIn The imported YAML data.
   * @param {string|null} singleCat Optional. Import only a single category.
   */
  const importYaml = (yamlIn: any, singleCat?: string | null) => {
    // TODO: option to import only one category
    // TODO: import common settings
    /** The collection of imported settings. */
    const newSettings: SettingsCollection = {};
    const newMinifiedSettings: Record<string, MinifiedCommonSettings> = {};

    for (const { category, settings: catSettings } of CategoryList) {
      // If there's a category and it doesn't exist in the imported data, skip it; otherwise, prepare it
      if (category) {
        if (!yamlIn[category]) continue;
        newSettings[category] = {};
      }

      /** The category from the data set being imported. */
      const curImport = category ? yamlIn[category] : yamlIn;
      /** The category from the destination {@link SettingsSubcollection}. */
      const curCategory = category ? newSettings[category] : newSettings;

      // Iterate through established settings, not through imported data
      for (const setting of catSettings) {
        // If the setting doesn't exist in the imported data, default it in the new settings
        if (!curImport[setting.name])
          (curCategory as SettingsSubcollection)[setting.name] =
            setting.default;
        // Otherwise, import the setting
        else
          (curCategory as SettingsSubcollection)[setting.name] = convertBoolean(
            curImport[setting.name] as SettingValue,
            setting
          );
      }

      if (category) {
        const {
          local_items,
          non_local_items,
          start_inventory,
          start_hints,
          start_location_hints,
          exclude_locations,
        } = yamlIn[category];
        newMinifiedSettings[category] = {
          local_items,
          non_local_items,
          start_inventory,
          start_hints,
          start_location_hints,
          exclude_locations,
        };
      }
    }

    // Finally, set the name, description, and settings collection to update the UI
    if (yamlIn.name) setPlayerName(yamlIn.name);
    if (yamlIn.description) setDescription(yamlIn.description);
    setSettings(Object.assign({}, settings, newSettings));
    setCommonSettings(deserializeCommonSettings(newMinifiedSettings));
  };

  /**
   * Imports data from a Berserker YAML file.
   * @param yamlInBase The imported YAML data.
   */
  const importLegacyYaml = (yamlInBase: any) => {
    /** The aggregate collection of settings from the Berserker YAML. */
    const yamlIn = Object.assign({}, yamlInBase, yamlInBase.rom);
    /** The collection of imported settings. */
    const newSettings: SettingsCollection = {};

    // Only iterate through global and LttP settings.
    for (const { category, settings: catSettings } of CategoryList.slice(
      0,
      2
    )) {
      // If there's a category (which would be LttP), prepare it in the settings collection
      if (category) {
        newSettings[category] = {};
      }

      // Unlike importYaml, there isn't a need for curImport, as the data file is mostly flat
      /** The category from the destination {@link SettingsSubcollection}. */
      const curCategory = category ? newSettings[category] : newSettings;

      // In this function, we refer to a setting's legacyName when checking the imported data
      // Some setting and value names have changed, so we need to use the new ones
      for (const setting of catSettings) {
        // If the setting doesn't exist in the imported data, default it
        if (!yamlIn[setting.legacyName ?? setting.name]) {
          (curCategory as SettingsSubcollection)[setting.name] =
            setting.default;
        } else {
          // Fetch the data
          let newSetting: SettingValue = convertBoolean(
            yamlIn[setting.legacyName ?? setting.name] as SettingValue,
            setting
          );

          // "weapons" as a string setting changed to "swordless" as a boolean setting, so special handling is needed
          if (setting.name === "swordless") {
            // If it's weighted, then:
            // - Equate a "true" swordless value as the old chance of "swordless" weapon
            // - Equate a "false" swordless value as the old chance of anything else
            if (typeof newSetting === "object") {
              newSetting = {
                true: newSetting.swordless ?? 0,
                false:
                  (newSetting.vanilla ?? 0) +
                  (newSetting.randomized ?? 0) +
                  (newSetting.assured ?? 0),
              };
              // Otherwise, the value is just whether the old setting is "swordless" or not
            } else newSetting = newSetting === "swordless";
          } else if (setting.name === "music") {
            // "disablemusic" became "music", so its value should be flipped
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
            // If legacy values are specified, change the old values into new ones
            if (typeof newSetting === "object") {
              // Basic rundown: iterate through all weighted settings and change them into new ones
              // If the old value no longer exists, remove it from weights
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
              // If the old value no longer exists, assign a default value here
              // Otherwise, assign the new corresponding value
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
            // Weighted numeric settings which are randomable should gain a random, random-low, and random-high value
            // TODO: I think random-mid is also a thing
            if (!newSetting.random) newSetting.random = 0;
            newSetting["random-low"] = 0;
            newSetting["random-high"] = 0;
          }
          (curCategory as SettingsSubcollection)[setting.name] = newSetting;
        }
      }
    }

    // Finally, set the name, description, and settings collection to update the UI
    if (yamlIn.name) setPlayerName(yamlIn.name);
    if (yamlIn.description) setDescription(yamlIn.description);
    setSettings(Object.assign({}, settings, newSettings));
  };

  /**
   * An event handler that fires when the "Import YAML" button is clicked.
   */
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
            (importedYaml.goals ? importLegacyYaml : importYaml)(importedYaml);
          })
          .catch((e) => console.error(e));
      }
    });
  };

  /**
   * An event handler that fires when the "Export YAML" button is clicked.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e The {@link MouseEvent} object.
   */
  const onExport: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // TODO: Scan for any obvious problems that would prevent the YAML from working (all-zero weights, bad name, etc.)

    // Create the YAML structure
    const outYaml: any = Object.assign(
      {
        name: playerName,
        description,
        requires: { version: process.env.REACT_APP_CURRENT_ARCHIPELAGO_VER },
      },
      settings
    );

    // If Ctrl is NOT held, filter out any category that is definitely not being played
    if (!e.ctrlKey) {
      for (const { category } of CategoryList) {
        if (!category) continue;
        else if (!isGameEnabled(settings, category)) delete outYaml[category];
      }
    }

    const minifiedSettings = minifyCommonSettings(commonSettings);
    for (const category of Object.keys(minifiedSettings))
      if (outYaml[category])
        outYaml[category] = Object.assign(
          outYaml[category],
          minifiedSettings[category]
        );

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
      localStorage.removeItem("savedSettings");
      location.reload();
    }
  };

  // /**
  //  * Converts a collection of settings into an array of {@link Setting} objects.
  //  * @param category The category to which the settings belong.
  //  * @param settingsDef The collection of settings to convert.
  //  * @returns {React.ReactNode[]|null} The collection of {@link Setting} objects.
  //  */
  // const outputSettingCollection = (
  //   category: string | null,
  //   settingsDef: ArchipelagoSettingBase[]
  // ): React.ReactNode[] | null => {
  //   // If there are no settings for a category, nothing to return
  //   if (category !== null && settings[category] === undefined) return null;
  //   // If the game is not selected, nothing to return
  //   if (!isGameEnabled(settings, category)) return null;

  //   /** The relevant subcollection of settings for this operation. */
  //   const subsettings = (
  //     category === null ? settings : settings[category]
  //   ) as SettingsSubcollection;
  //   return (
  //     settingsDef
  //       // Filter out any invalid settings (shouldn't happen, but just in case)
  //       .filter((i) => Object.keys(subsettings).includes(i.name))
  //       .filter((i) => checkDependency(subsettings, i.dependsOn))
  //       .map((i) => (
  //         // Return the setting object
  //         <Setting
  //           key={`setting-${category}-${i.name}`}
  //           category={category ?? undefined}
  //           setting={i}
  //           value={subsettings[i.name]}
  //           onChange={onSettingChange}
  //         />
  //       ))
  //   );
  // };

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
    // if (!isGameEnabled(settings, category)) return null;

    return category.settings.map((i) => {
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
    // /** The relevant subcollection of settings for this operation. */
    // const subsettings = (
    //   category === null ? settings : settings[category]
    // ) as SettingsSubcollection;
    // return (
    //   settingsDef
    //     // Filter out any invalid settings (shouldn't happen, but just in case)
    //     .filter((i) => Object.keys(subsettings).includes(i.name))
    //     .filter((i) => checkDependency(subsettings, i.dependsOn))
    //     .map((i) => (
    //       // Return the setting object
    //       <Setting
    //         key={`setting-${category}-${i.name}`}
    //         category={category ?? undefined}
    //         setting={i}
    //         value={subsettings[i.name]}
    //         onChange={onSettingChange}
    //       />
    //     ))
    // );
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
              onClick={onExport}
            >
              Export YAML
            </button>
            <button onClick={onReset}>Reset this config</button>
          </div>
        </section>

        <Tabs>
          <TabList className="react-tabs__tab-list settingsTabs">
            {/* {CategoryList.filter((i) =>
              isGameEnabled(settings, i.category)
            ).map((i) => (
              // Output tabs for enabled games
              <Tab key={`tab-${i.category}`}>{i.category ?? "Global"}</Tab>
            ))} */}
            {APCategoryList.map((i) => (
              <Tab key={`tab-${i.category}`}>{i.category ?? "Global"}</Tab>
            ))}
            <Tab>Changelog</Tab>
          </TabList>

          {APCategoryList.map((i) => (
            <TabPanel key={`tabpanel-${i.category}`} className="settingsBody">
              {outputSettingCollectionV2(i)}
              {i.category && i.items ? (
                <ItemSelector
                  category={i.category}
                  items={i.items/*.filter((ii) =>
                    checkDependency(
                      settings[i.category!] as SettingsSubcollection,
                      ii.dependsOn
                    )
                    )*/}
                  commonSettings={commonSettings[i.category]}
                  onChange={onCommonItemSettingChange}
                />
              ) : null}
            </TabPanel>
          ))}
          {/* {CategoryList.filter((i) => isGameEnabled(settings, i.category)).map(
            (i) => (
              // Output tab panels containing setting collections for enabled games
              <TabPanel key={`tabpanel-${i.category}`} className="settingsBody">
                {outputSettingCollection(i.category, i.settings)}
                {i.category && i.items ? (
                  <ItemSelector
                    category={i.category}
                    items={i.items.filter((ii) =>
                      checkDependency(
                        settings[i.category!] as SettingsSubcollection,
                        ii.dependsOn
                      )
                    )}
                    commonSettings={commonSettings[i.category]}
                    onChange={onCommonItemSettingChange}
                  />
                ) : null}
              </TabPanel>
            )
          )} */}
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
