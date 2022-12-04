import { APDependency, SettingType } from "../../defs/core";
import { APToggleSetting, APToggleSettingJson } from "./APToggleSetting";
import { APChoiceSetting, APChoiceSettingJson } from "./APChoiceSetting";
import { APNumberSetting, APNumberSettingJson } from "./APNumberSetting";
import { APNumericSetting, APNumericSettingJson } from "./APNumericSetting";
import { APRangeSetting, APRangeSettingJson } from "./APRangeSetting";
import { APStringSetting, APStringSettingJson } from "./APStringSetting";

/**
 * The definition for a weighted setting. Its chance of being selected is based on its weight value.
 * @since 1.0.0
 */
export interface APWeightedValue<T> {
  /** The value of the setting. */
  value: T;
  /** The weighted chance of this setting being selected. */
  weight: number;
}

/**
 * A value type that may or may not be weighted. Whether or not it is can be determined by using {@link isWeighted} or by
 * checking whether or not the value is an array of {@link APWeightedValue}s.
 * @since 1.0.0
 */
export type APWeightableValue<T> = T | APWeightedValue<T>[];

/**
 * The base interface for Archipelago settings as stored in JSON.
 * @since 1.0.0
 */
export interface APSettingJson<T> {
  /** The type of setting. */
  type: SettingType;
  /** The internal name for the setting. */
  name: string;
  /** The user-readable name for the setting. */
  readableName: string;
  /** The description of the setting, for user reference. */
  description: string;
  /** The default value of the setting. */
  default: T;
  /** The dependencies for this setting. The key should be the internal name, and the values should indicate when this setting becomes available. */
  dependsOn?: APDependency;

  // for LttP and really nothing else
  /** When importing from Berserker YAMLs, interpret this Berserker setting as its new Archipelago setting. */
  legacyName?: string;
  /**
   * When importing from Berserker YAMLs, interpret these Berserker values (keys) as their corresponding Archipelago values (values).
   * If the Berserker value no longer exists in Archipelago, the value here should be null.
   */
  legacyValues?: Record<string, T | null>; // null if the setting no longer exists

  /** Whether this setting is currently disabled and should not be included in setting generation. */
  disabled?: boolean;

  /**
   * Whether this setting is universal.
   * @since 1.0.9
   */
  isUniversal?: boolean;
}

/**
 * The renderable representation of an Archipelago setting.
 * @abstract
 * @since 1.0.0
 */
export abstract class APSetting<T> {
  /** The category to which this setting belongs. */
  private readonly _category: string | null;
  /** The type of setting. */
  private readonly _type: SettingType;
  /** The internal name for the setting. */
  private readonly _name: string;
  /** The user-readable name for the setting. */
  private readonly _readableName?: string;
  /** The description of the setting, for user reference. */
  private readonly _description: string;
  /** The default value of the setting. */
  private readonly _default: T;
  /** The dependencies for this setting. The key should be the internal name, and the values should indicate when this setting becomes available. */
  private readonly _dependsOn?: APDependency;
  /** When importing from Berserker YAMLs, interpret this Berserker setting as its new Archipelago setting. */
  private readonly _legacyName?: string;
  /**
   * When importing from Berserker YAMLs, interpret these Berserker values (keys) as their corresponding Archipelago values (values).
   * If the Berserker value no longer exists in Archipelago, the value here should be null.
   */
  private readonly _legacyValues?: Record<string, T | null>;
  /**
   * Whether this setting is universal.
   * @since 1.0.9
   */
  private readonly _isUniversal?: boolean;

  /** The value for this setting. */
  private _value: APWeightableValue<T>;

  /**
   * @param category The category name.
   * @param settingData The JSON representation for this setting.
   * @param initialValue The initial value in its local storage form, if any.
   */
  constructor(
    category: string | null,
    settingData: APSettingJson<T>,
    initialValue?: string
  ) {
    this._category = category;
    this._type = settingData.type;
    this._name = settingData.name;
    this._readableName = settingData.readableName;
    this._description = settingData.description;
    this._default = settingData.default;
    this._dependsOn = settingData.dependsOn;
    this._legacyName = settingData.legacyName;
    this._legacyValues = settingData.legacyValues;
    this._isUniversal = settingData.isUniversal;

    this._value = this._default;
    if (initialValue) this.storageValue = initialValue;
  }

  /** The category to which this setting belongs. */
  get category() {
    return this._category;
  }
  /** The type of setting. */
  get type() {
    return this._type;
  }
  /** The internal name for the setting. */
  get name() {
    return this._name;
  }
  /** The user-readable name for the setting. */
  get readableName() {
    return this._readableName ?? this._name;
  }
  /** The description of the setting, for user reference. */
  get description() {
    return this._description;
  }
  /** The default value of the setting. */
  get default() {
    return this._default;
  }
  /** The dependencies for this setting. The key should be the internal name, and the values should indicate when this setting becomes available. */
  get dependsOn(): Readonly<APDependency> | undefined {
    return this._dependsOn;
  }
  /** When importing from Berserker YAMLs, interpret this Berserker setting as its new Archipelago setting. */
  get legacyName() {
    return this._legacyName;
  }
  /**
   * When importing from Berserker YAMLs, interpret these Berserker values (keys) as their corresponding Archipelago values (values).
   * If the Berserker value no longer exists in Archipelago, the value here should be null.
   */
  get legacyValues(): Readonly<Record<string, T | null>> | undefined {
    return this._legacyValues;
  }
  /**
   * Whether this setting is universal.
   * @since 1.0.9
   */
  get isUniversal() {
    return this._isUniversal;
  }

  /** The value for this setting. */
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }

  /** The JSON-encoded representation for this setting. */
  get storageValue() {
    return JSON.stringify(this._value);
  }
  set storageValue(jsonStr: string) {
    this._value = JSON.parse(jsonStr);
  }

  /** The representation for this setting to be stored in YAML. */
  abstract get yamlValue(): T | Record<string, number>;
  abstract set yamlValue(value);

  /**
   * Checks whether this setting's value is or contains any of the values in a given list.
   * @param values The list of values to check against.
   * @returns Whether this setting's value is or contains any of the given values.
   */
  includes(...values: any[]) {
    return (
      (Array.isArray(this._value)
        ? this._value.filter((i) => i.weight > 0).map((i) => i.value)
        : [this._value]
      ).filter((i) => values.includes(i)).length > 0
    );
  }

  /**
   * Sets this setting's value based on Berserker legacy values.
   * @param value The value from the Berserker YAML.
   * @returns The interpreted value as its Archipelago YAML representation.
   */
  fromBerserkerYamlValue(value: any): T | Record<string, number> {
    if (this._legacyValues) {
      const dstEntries = Object.entries(this._legacyValues);
      if (typeof value === "object") {
        const srcEntries = Object.entries(value)
          .filter((i) => {
            const dstEntry = dstEntries.find((ii) => ii[0] === i[0]);
            return !dstEntry || dstEntry[1] !== null;
          })
          .map((i) => {
            const dstEntry = dstEntries.find((ii) => ii[0] === i[0]);
            if (dstEntry && dstEntry[1]) return [i[0], dstEntry[1]];
            else return i;
          });
        return (this.yamlValue = Object.fromEntries(srcEntries));
      } else {
        const dstEntry = dstEntries.find((i) => i[0] === value.toString());
        if (dstEntry) {
          if (dstEntry[1]) return (this.yamlValue = dstEntry[1]);
        }
      }
    }
    return (this.yamlValue = value);
  }

  /** Whether this setting is a Boolean setting. */
  isToggleSetting(): this is APToggleSetting {
    return [SettingType.Boolean, SettingType.Toggle, SettingType.DeathLink].includes(this.type);
  }
  /**
   * Whether this setting is a numeric setting.
   * @deprecated Use `Range` or `Number` instead
   */
  isNumericSetting(): this is APNumericSetting {
    return this.type === SettingType.Numeric;
  }
  /** Whether this setting is a randomizable numeric setting within a given range. */
  isRangeSetting(): this is APRangeSetting {
    return this.type === SettingType.Range;
  }
  /** Whether this setting is an open-ended numeric setting. */
  isNumberSetting(): this is APNumberSetting {
    return this.type === SettingType.Number;
  }
  /**
   * Whether this setting is a string-based setting.
   * @deprecated Use `Choice` instead
   */
  isStringSetting(): this is APStringSetting {
    return [
      SettingType.String,
      SettingType.Games,
      SettingType.Character,
    ].includes(this.type);
  }
  /** Whether this setting is a choice-based setting from a list of options. */
  isChoiceSetting(): this is APChoiceSetting {
    return [
      SettingType.Choice,
      SettingType.Games,
      SettingType.Character
    ].includes(this.type);
  }

  /**
   * Evaluates whether a setting definition is for a string-based setting.
   * @static
   * @param value The setting definition to evalute.
   * @returns Whether the given setting definition is for a string-based setting.
   * @deprecated Use `Choice` instead
   */
  static isStringJson(value: APSettingJson<unknown>): value is APStringSettingJson {
    return [
      SettingType.String,
      SettingType.Games,
      SettingType.Character,
    ].includes(value.type);
  }
  /**
   * Evaluates whether a setting definition is for a string-based setting.
   * @static
   * @param value The setting definition to evalute.
   * @returns Whether the given setting definition is for a string-based setting.
   * @deprecated Use `Choice` instead
   */
  static isChoiceJson(value: APSettingJson<unknown>): value is APChoiceSettingJson {
    return [
      SettingType.Choice,
      SettingType.Games,
      SettingType.Character,
    ].includes(value.type);
  }
  /**
   * Evaluates whether a setting definition is for a numeric setting.
   * @static
   * @param value The setting definition to evalute.
   * @returns Whether the given setting definition is for a numeric setting.
   * @deprecated Use `Number` or `Range` instead
   */
  static isNumericJson(
    value: APSettingJson<unknown>
  ): value is APNumericSettingJson {
    return value.type === SettingType.Numeric;
  }
  /**
   * Evaluates whether a setting definition is for a numeric setting.
   * @static
   * @param value The setting definition to evalute.
   * @returns Whether the given setting definition is for a numeric setting.
   * @deprecated Use `Number` or `Range` instead
   */
  static isRangeJson(
    value: APSettingJson<unknown>
  ): value is APRangeSettingJson {
    return value.type === SettingType.Range;
  }
  /**
   * Evaluates whether a setting definition is for a numeric setting.
   * @static
   * @param value The setting definition to evalute.
   * @returns Whether the given setting definition is for a numeric setting.
   * @deprecated Use `Number` or `Range` instead
   */
  static isNumberJson(
    value: APSettingJson<unknown>
  ): value is APNumberSettingJson {
    return value.type === SettingType.Number;
  }
  /**
   * Evaluates whether a setting definition is for a Boolean setting.
   * @static
   * @param value The setting definition to evalute.
   * @returns Whether the given setting definition is for a Boolean setting.
   */
  static isToggleJson(
    value: APSettingJson<unknown>
  ): value is APToggleSettingJson {
    return [SettingType.Boolean, SettingType.Toggle, SettingType.DeathLink].includes(value.type);
  }

  /**
   * Whether the given value is weighted.
   * @static
   * @param value The value to check.
   * @returns Whether the value is weighted. If so, it should be treated as an {@link APWeightedValue}.
   */
  static isWeighted(
    value: APWeightableValue<unknown>
  ): value is APWeightedValue<unknown> {
    return Array.isArray(value);
  }
}
