import { ArchipelagoDependency, SettingType } from "../defs/core";
import { APBooleanSetting } from "./APBooleanSetting";
import { APNumericSetting } from "./APNumericSetting";
import { APStringSetting } from "./APStringSetting";

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

export type APWeightableValue<T> = T | APWeightedValue<T>[];

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
  private readonly _dependsOn?: ArchipelagoDependency;
  /** When importing from Berserker YAMLs, interpret this Berserker setting as its new Archipelago setting. */
  private readonly _legacyName?: string;
  /**
   * When importing from Berserker YAMLs, interpret these Berserker values (keys) as their corresponding Archipelago values (values).
   * If the Berserker value no longer exists in Archipelago, the value here should be null.
   */
  private readonly _legacyValues?: Record<string, string | null>;

  /** The value for this setting. */
  private _value: APWeightableValue<T>;

  constructor(
    category: string | null,
    settingData: APSettingJson<T>,
    initialValue?: APWeightableValue<T>
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

    this._value = initialValue ?? this._default;
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
  get dependsOn(): Readonly<ArchipelagoDependency> | undefined {
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
  get legacyValues(): Readonly<Record<string, string | null>> | undefined {
    return this._legacyValues;
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

  /** Whether this setting is a Boolean setting. */
  isBooleanSetting(): this is APBooleanSetting {
    return this.type === SettingType.Boolean;
  }
  /** Whether this setting is a numeric setting. */
  isNumericSetting(): this is APNumericSetting {
    return this.type === SettingType.Numeric;
  }
  /** Whether this setting is a string-based setting. */
  isStringSetting(): this is APStringSetting {
    return [
      SettingType.String,
      SettingType.Games,
      SettingType.Character,
    ].includes(this.type);
  }

  /** Whether the given value is weighted. */
  static isWeighted(
    value: APWeightableValue<any>
  ): value is APWeightedValue<any> {
    return Array.isArray(value);
  }
}
