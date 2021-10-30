import { CSSProperties } from "react";
import preval from "preval.macro";

const BuildTimestamp = preval`module.exports = (new Date()).getTime();`;
export { BuildTimestamp };

export enum SettingType {
  String = "string",
  Numeric = "numeric",
  Boolean = "boolean",
}

export type WeightedSetting = Record<string, number>;
export type SettingValue = string | number | boolean | WeightedSetting;
export type SettingChangeEvent = (
  settingName: string,
  newValue: SettingValue,
  category?: string
) => void;

export interface ArchipelagoSettingBase {
  type: SettingType;
  name: string;
  readableName: string;
  description: string;
  default: SettingValue;
  dependsOn?: Record<string, SettingValue[]>;

  // for LttP and really nothing else
  legacyName?: string;
  legacyValues?: Record<string, string | null>; // null if the setting no longer exists
}

export interface ArchipelagoStringSetting extends ArchipelagoSettingBase {
  type: SettingType.String;
  values: Record<string, string>;
  default: string;
}

export interface ArchipelagoNumericSetting extends ArchipelagoSettingBase {
  type: SettingType.Numeric;
  low: number;
  high: number;
  default: number;
  randomable?: boolean;
}

export interface ArchipelagoBooleanSetting extends ArchipelagoSettingBase {
  type: SettingType.Boolean;
  default: boolean;
}

export interface ArchipelagoCategory {
  category: string | null;
  readableName?: string;
  settings: ArchipelagoSettingBase[];
}

const ForbiddenNames = ["Archipelago"]; // lol yup
export { ForbiddenNames };

const SelectRail: CSSProperties = {
  backgroundColor: "#94D8F6",
  boxShadow: "0px 0px 5px #1085B8",
};
const WeightRail: CSSProperties = {
  backgroundColor: "red",
  boxShadow: "0px 0px 5px darkred",
};
export { SelectRail, WeightRail };
