import {
  SettingType,
  ArchipelagoSettingBase,
  ArchipelagoStringSetting,
  ArchipelagoNumericSetting,
  ArchipelagoBooleanSetting,
} from "./core";

const Settings: ArchipelagoSettingBase[] = [];

export default Settings;

//------------======================

/*
Settings.push(
  Object.seal<ArchipelagoNumericSetting>({
    type: SettingType.Numeric,
    name: "",
    readableName: "",
    description: "",
    low: 0,
    high: 0,
    default: 0,
  })
);
Settings.push(
  Object.seal<ArchipelagoStringSetting>({
    type: SettingType.String,
    name: "",
    readableName: "",
    description: "",
    values: {},
    default: "",
  })
);
Settings.push(
  Object.seal<ArchipelagoBooleanSetting>({
    type: SettingType.Boolean,
    name: "",
    readableName: "",
    description: "",
    default: true,
  })
);
*/
