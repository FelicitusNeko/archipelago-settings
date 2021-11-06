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
  dependsOn?: Record<string, SettingValue[]>;

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
  /** Whether the setting can be randomized. If so, and if the setting is weighted, "random", "random-low", and "random-high" are added as options. */
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

export interface ArchipelagoItem {
  name: string;
  readableName?: string;
}

export interface ArchipelagoLocation {
  name: string;
  readableName?: string;
}

/** The interface defining a category for Archipelago (e.g. a collection of settings for a game). */
export interface ArchipelagoCategory {
  /** The internal name of the category. */
  category: string | null;
  /** The user-readable name of the category. */
  readableName?: string;
  /** The collection of settings for this category. */
  settings: ArchipelagoSettingBase[];

  items?: ArchipelagoItem[];
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
