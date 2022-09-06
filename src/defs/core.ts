import { CSSProperties, useState } from "react";
import preval from "preval.macro";

/** The Unix timestamp for this build. */
const BuildTimestamp: number = preval`module.exports = (new Date()).getTime();`;
export { BuildTimestamp };

/** Indicates what type of setting is being used. */
export enum SettingType {
  /** Refers to a string-based setting. */
  String = "string",
  /** Refers to the string-based game selection setting. This should only exist once. */
  Games = "games",
  /** Refers to the string-based sprite/model selection setting, if one exists. This typically should only exist no more than once per game. */
  Character = "char",
  /** Refers to a numeric setting. */
  Numeric = "numeric",
  /** Refers to a setting whose value may be true/on or false/off. */
  Boolean = "boolean",
  /** Refers to a Boolean setting related to DeathLink. Some assumptions are made as a result. */
  DeathLink = "deathlink",
}

/** Indicates what type of entity is being used. */
export enum EntityType {
  /** Refers to an item. */
  Item = "item",
  /** Refers to a location. */
  Location = "location",
}

/** Refers to a setting dependency. */
export type APDependency = Record<string, unknown[]>;

/**
 * The base class for game entities.
 * @since 1.0.0
 */
export interface APGameEntity {
  /** The type of entity. */
  type: EntityType;
  /** The internal name of the entity. */
  name: string;
  /** The human-readable name of the entity, if it differs from {@link APGameEntity.name}. */
  readableName?: string;
}

/**
 * The interface defining an item in an Archipelago game.
 * @since 1.0.0
 */
export interface APGameItem extends APGameEntity {
  /** The type of entity. */
  type: EntityType.Item;
  /**
   * The dependencies for this item. The key should be the internal name of the relevant setting, and the values should
   * indicate when this item is added to the multiworld pool.
   */
  dependsOn?: APDependency;
  /** The maximum number of this item that can be added to the player's starting inventory. Defaults to 1. */
  max?: number;
}

/**
 * The interface defining a location in an Archipelago game.
 * @since 1.0.0
 */
export interface APGameLocation extends APGameEntity {
  /** @override */
  type: EntityType.Location;

  /** Whether this location can not be excluded from containing a progression item. */
  neverExclude?: boolean;
}

/**
 * The interface defining the quantity of an item. Usually used for starting inventory.
 * @since 1.0.0
 */
export interface APGameItemAndQty extends APGameItem {
  /** The quantity of this item, usually used for starting inventory. */
  qty: number;
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

/** The category structure stored within {@link APSavedSettings}. */
export interface APSavedSettingsCategory {
  /** The name of the category, or `null` if global settings. */
  category: string | null;
  /** Serialized data pertaining to settings for this category. */
  settings: Record<string, string>;
  /** Serialized data pertaining to items for this category, if any. */
  items?: Record<string, any>;
  /** Serialized data pertaining to locations for this category, if any. */
  locations?: Record<string, any>;
}

/** Settings currently saved in the browser's local storage. */
export interface APSavedSettings {
  /** The name of the player (also referred to as "slot name"). */
  playerName: string;
  /** The user-provided description of this settings collection. This is purely for the user's reference. */
  description: string;
  /** The stored data for each category. */
  categories: APSavedSettingsCategory[];
}

/** Creates a hook which facilitates forced updating of a function component. */
const useForceUpdate = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
};
export {useForceUpdate};