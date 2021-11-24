import { CSSProperties } from "react";
import preval from "preval.macro";

/** The Unix timestamp for this build. */
const BuildTimestamp: number = preval`module.exports = (new Date()).getTime();`;
export { BuildTimestamp };

/** Indicates what type of setting is being used. */
export enum SettingType {
  /** Refers to a string-based setting. */
  String = "string",
  /** Refers to a numeric setting. */
  Numeric = "numeric",
  /** Refers to a setting whose value may be true/on or false/off. */
  Boolean = "boolean",
}

/** A collection of weights for a setting. The key should be the setting's value, and the value should indicate the chance of it being selected. */
export type WeightedSetting = Record<string, number>;
/** The value for a setting. */
export type SettingValue = string | number | boolean | WeightedSetting;
/**
 * Refers to an event where a setting is reporting a change back to the base app.
 * @param settingName The internal name of the setting.
 * @param newValue The new value for the setting.
 * @param category Optional. The category to which this setting belongs. Should only be undefined in the event of a global setting.
 * @returns void
 */
export type SettingChangeEvent = (
  settingName: string,
  newValue: SettingValue,
  category?: string
) => void;

/**
 * Options for {@link CommonItemSettingChangeEvent}.
 * @since 0.10.0
 */
interface CommonItemSettingChangeEventOptions {
  /** The destination for the given item. */
  destination?: string;
  /** The index number at which to place the item. This is purely aesthetic, and is ignored for unassigned items. */
  index?: number;
  /** The quantity of the starting item. Ignored if this is not a starting item. */
  qty?: number;
  /** Whether a free hint about this item should be provided from the start. Ignored if this is a starting item set to max quantity. */
  startingHint?: boolean;
  /** Resets all lists in this category. If {@link destination} is set, reset only that list. */
  reset?: boolean;
}
/** 
 * Refers to an event where the item selector is reporting a change back to the base app.
 * @since 0.10.0
 */
export type CommonItemSettingChangeEvent = (
  /** The name of the item. */
  itemName: string,
  /** The category to which the item belongs. */
  category: string,
  /** Any options pertaining to the event. */
  options: CommonItemSettingChangeEventOptions
) => void;

/** Refers to a setting dependency. */
export type ArchipelagoDependency = Record<string, SettingValue[]>;

/** The base interface for Archipelago settings. */
export interface ArchipelagoSettingBase {
  /** The type of setting. */
  type: SettingType;
  /** The internal name for the setting. */
  name: string;
  /** The user-readable name for the setting. */
  readableName: string;
  /** The description of the setting, for user reference. */
  description: string;
  /** The default value of the setting. */
  default: SettingValue;
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

/** The interface for a string-based setting. */
export interface ArchipelagoStringSetting extends ArchipelagoSettingBase {
  /** 
   * The type of setting. Must be {@link SettingType.String}.
   * @override
   */
  type: SettingType.String;
  /** The list of valid values. The key should be the internal value name, and the value should be the user-readable description. */
  values: Record<string, string>;
  default: string;
}

/** The interface for a numeric setting. */
export interface ArchipelagoNumericSetting extends ArchipelagoSettingBase {
  /**
   * The type of setting. Must be {@link SettingType.Numeric}.
   * @override
   */
  type: SettingType.Numeric;
  /** The lowest valid value for this setting. */
  low: number;
  /** The highest valid value for this setting. */
  high: number;
  /**
   * Optional. If specified, the slider for this setting will skip this many numbers between values.
   * @since 0.9.3
   */
  step?: number;
  /** @override */
  default: number;
  /** 
   * Whether the setting can be randomized. If so, and if the setting is weighted, "random", "random-low", and
   * "random-high" are added as options.
   */
  randomable?: boolean;
}

/** The interface for a Boolean setting. */
export interface ArchipelagoBooleanSetting extends ArchipelagoSettingBase {
  /**
   * The type of setting. Must be {@link SettingType.Boolean}.
   * @override
   */
  type: SettingType.Boolean;
  /** @override */
  default: boolean;
}

export interface ArchipelagoGameEntity {
  /** The internal name of the entity. */
  name: string;
  /** The human-readable name of the entity, if it differs from {@link ArchipelagoGameEntity.name}. */
  readableName?: string;
}

/**
 * The interface defining an item in an Archipelago game.
 * @since 0.9.4
 */
export interface ArchipelagoItem extends ArchipelagoGameEntity {
  /** The internal name of the item. */
  name: string;
  /** The human-readable name of the item, if it differs from {@link ArchipelagoItem.name}. */
  readableName?: string;
  /**
   * The dependencies for this item. The key should be the internal name of the relevant setting, and the values should
   * indicate when this item is added to the multiworld pool.
   */
  dependsOn?: ArchipelagoDependency;
  /** The maximum number of this item that can be added to the player's starting inventory. Defaults to 1. */
  max?: number;
}

/**
 * The interface defining a location in an Archipelago game.
 * @since 0.9.4
 */
 export interface ArchipelagoLocation extends ArchipelagoGameEntity {
  /** The internal name of the location. */
  name: string;
  /** The human-readable name of the location, if it differs from {@link ArchipelagoLocation.name}. */
  readableName?: string;
}

/**
 * The interface defining the quantity of an item. Usually used for starting inventory.
 * @since 0.9.4
 */
export interface ArchipelagoItemAndQty {
  item: ArchipelagoItem;
  qty: number;
}

/**
 * The interface defining the settings common to all Archipelago games.
 * @since 0.9.4
 */
export interface ArchipelagoCommonSettings {
  local_items?: ArchipelagoItem[];
  non_local_items?: ArchipelagoItem[];
  start_inventory?: ArchipelagoItemAndQty[];
  start_hints?: ArchipelagoItem[];
  start_location_hints?: ArchipelagoLocation[];
  exclude_locations?: ArchipelagoLocation[];
}

/**
 * The interface defining the settings common to all Archipelago games, serialized into strings.
 * @since 0.9.4
 */
export interface MinifiedCommonSettings {
  local_items?: string[];
  non_local_items?: string[];
  start_inventory?: Record<string, number>;
  start_hints?: string[];
  start_location_hints?: string[];
  exclude_locations?: string[];
}

/** The interface defining a category for Archipelago (e.g. a collection of settings for a game). */
export interface ArchipelagoCategory {
  /** The internal name of the category. */
  category: string | null;
  /** The user-readable name of the category. */
  readableName?: string;
  /** The collection of settings for this category. */
  settings: ArchipelagoSettingBase[];
  /**
   * The collection of defined items for this category.
   * @since 0.9.4
   */
  items?: ArchipelagoItem[];
  /**
   * The collection of defined locations for this category.
   * @since 0.9.4
   */
  locations?: ArchipelagoLocation[];
}

/** The list of names which will be rejected by the Archipelago generator. */
const ForbiddenNames = ["Archipelago"]; // lol yup
export { ForbiddenNames };

/** Style for numeric selection slider rails. */
const SelectRail: CSSProperties = {
  backgroundColor: "#94D8F6",
  boxShadow: "0px 0px 5px #1085B8",
};
/** Style for weight selection slider rails. */
const WeightRail: CSSProperties = {
  backgroundColor: "red",
  boxShadow: "0px 0px 5px darkred",
};
export { SelectRail, WeightRail };

/** Some games now support DeathLink, which links all enabled players' lives. If one DeathLinked player dies, all of them do. */
const DeathLinkOption = Object.seal<ArchipelagoBooleanSetting>({
  type: SettingType.Boolean,
  name: "death_link",
  readableName: "DeathLink",
  description:
    "If one DeathLinked player dies, all of them do.",
  default: false,
})
export {DeathLinkOption}