import {
  APGameEntity,
  APGameItem,
  APGameItemAndQty,
  APGameLocation,
} from "../defs/core";

/**
 * How to handle `start_inventory` entries in the item manager.
 * @since 1.0.0
 */
export enum MakeStartInvLocal {
  /** No special handling. */
  No,
  /** If a `start_inventory` item is set to maximum quantity, it will automatically be added to `local_items` as well. */
  MaxOnly,
  /** All `start_inventory` items will be added to `local_items` as well. */
  Always,
}

/**
 * An object that can be resolved into a relevant {@link APGameEntity} type.
 * @since 1.0.0
 */
type APEntityResolvable<T extends APGameEntity> = string | T;

/**
 * Manages entities in a category.
 * @since 1.0.0
 */
export abstract class APEntityManager<T extends APGameEntity> {
  /** Entities can only belong to one of these lists. */
  protected _exclusiveLists: Record<string, T[]> = {};
  /** Entities can belong to any of these lists, independent of any other list (including exlcusives). */
  protected _inclusiveLists: Record<string, T[]> = {};

  /** The list of valid entities. */
  private _entityList: T[];

  constructor(entityList: T[]) {
    this._entityList = entityList;
  }

  /**
   * Retrieve an entity from the master entity list.
   * @param entity The entity to find.
   * @returns The entity, if found; otherwise, `undefined`.
   */
  protected getItemFromStock(entity: APEntityResolvable<T>) {
    const itemName = typeof entity === "string" ? entity : entity.name;
    return this._entityList.find((i) => i.name === itemName);
  }

  /**
   * Retrieve an entity from a given list.
   * @param list The list to search for the given {@link entity}.
   * @param entity The entity to find.
   * @returns The entity, if found; otherwise, `undefined`. Also returns `undefined` if the list is not found.
   */
  protected getItemFromList(list: string, entity: APEntityResolvable<T>) {
    const itemName = typeof entity === "string" ? entity : entity.name;
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      if (group[list]) return group[list].find((i) => i.name === itemName);
    return undefined;
  }

  /**
   * Duplicate an entity to add to a list.
   * @param entity The entity to duplicate.
   * @returns A shallow duplicate copy of {@link entity}.
   */
  protected duplicateItem(entity: T) {
    return Object.fromEntries(Object.entries(entity)) as T;
  }

  /**
   * Set the contents of a given entity list.
   * @param list The list to set.
   * @param content The entities to place in that list.
   */
  setList(list: string, content: APEntityResolvable<T>[]) {}

  /**
   * Clears a given entity list.
   * @param list The list to clear.
   */
  clearList(list: string) {
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      if (group[list]) group[list] = [];
  }

  /**
   * Adds one or more entities to a list. If they are being added to an exclusive list, this also removes them from other exclusive lists.
   * @param list The list to which to add the entity or entities.
   * @param pos Optional. The position in the list in which to add the entity or entities. This is purely cosmetic.
   * @param entities The entities to add.
   */
  addToList(list: string, pos?: number, ...entities: APEntityResolvable<T>[]) {
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      if (group[list])
        for (const entity of entities) {
          const newEntity = this.getItemFromStock(entity);
          if (!newEntity) continue;
        } // TODO: finish this function tomorrow; it's 4:36 AM
  }

  /**
   * Delete one or more entities from a given list.
   * @param list The list from which to delete the {@link entities}.
   * @param entities The entities to delete.
   */
  delFromList(list: string, ...entities: APEntityResolvable<T>[]) {}

  /**
   * Move an entity within a list. This is purely cosmetic.
   * @param list The list in which to move the {@link entity}.
   * @param entity The entity to move.
   * @param to The index to which to move the {@link entity}.
   */
  moveInList(list: string, entity: APEntityResolvable<T>, to: number) {}

  /**
   * Checks a given list for a given entity.
   * @param list The list to check for the {@link entity}.
   * @param entity The entity to check for.
   * @returns Whether the {@link entity} is in the given {@link list}. Returns false if the list does not exist.
   */
  includes(list: string, entity: APEntityResolvable<T>) {
    return this.getItemFromList(list, entity) !== undefined;
  }

  /** Resets all lists in this manager to an empty state. */
  reset() {
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      for (const list in group) group[list] = [];
  }
}

/**
 * Manages items in a category.
 * @since 1.0.0
 */
export class APItemManager extends APEntityManager<APGameItem> {
  private _startInvMode: MakeStartInvLocal = MakeStartInvLocal.MaxOnly;

  constructor(entityList: APGameItem[]) {
    super(entityList);
    this._exclusiveLists = {
      local_items: [],
      non_local_items: [],
      start_inventory: [],
    };
    this._inclusiveLists = {
      start_hints: [],
    };
  }

  get startInvMode() {
    return this._startInvMode;
  }
  set startInvMode(value) {
    this._startInvMode = value;
  }

  /** @override Special handling is needed for `start_inventory`. */
  reset() {
    super.reset();
    this._startInvMode = MakeStartInvLocal.MaxOnly;
  }

  /** @override Special handling is needed for `start_inventory`. */
  setList(list: string, content: APEntityResolvable<APGameItem>[]) {
    if (list !== "start_inventory") super.setList(list, content);
  }

  /** @override Special handling is needed for `start_inventory`. */
  addToList(
    list: string,
    pos?: number,
    ...entities: APEntityResolvable<APGameItem>[]
  ) {
    if (list !== "start_inventory") super.addToList(list, pos, ...entities);
  }

  /**
   * Update the quantity of a starting item.
   * @param entity The item to modify.
   * @param qty The quantity of the item to set to.
   */
  setQty(entity: APEntityResolvable<APGameItem>, qty: number) {
    const item = this.getItemFromList("start_inventory", entity) as
      | APGameItemAndQty
      | undefined;
    if (!item) return;
    if (qty < 1 || qty > (item.max ?? 1)) return;
    item.qty = qty;
  }

  /**
   * Checks an entity for a quantity. If it has one, the entity should be treated as {@link APGameItemAndQty}.
   * @static
   * @param value The entity to check.
   * @returns Whether the entity includes a quantity.
   */
  static hasQty(
    value: APGameItem | APGameItemAndQty
  ): value is APGameItemAndQty {
    return (value as APGameItemAndQty).qty !== undefined;
  }
}

/**
 * Manages locations in a category.
 * @since 1.0.0
 */
export class APLocationManager extends APEntityManager<APGameLocation> {
  constructor(entityList: APGameLocation[]) {
    super(entityList);
    this._exclusiveLists = {
      exclude_locations: [],
    };
    this._inclusiveLists = {
      start_location_hints: [],
    };
  }
}
