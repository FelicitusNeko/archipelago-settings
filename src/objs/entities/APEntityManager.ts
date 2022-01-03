import { APGameEntity } from "../../defs/core";

/**
 * An object that can be resolved into a relevant {@link APGameEntity} type.
 * @since 1.0.0
 */
export type APEntityResolvable<T extends APGameEntity> = string | T;

/**
 * Manages entities in a category.
 * @since 1.0.0
 */
export abstract class APEntityManager<T extends APGameEntity> {
  /** Entities can only belong to one of these lists. */
  protected _exclusiveLists: Record<string, T[]> = {};
  /** Entities can belong to any of these lists, independent of any other list (including exclusives). */
  protected _inclusiveLists: Record<string, T[]> = {};

  /** The list of valid entities. */
  private _entityList: T[];

  constructor(entityList: T[]) {
    this._entityList = entityList;
  }

  /** The representation of this manager's contents to be used in YAML generation. */
  get yamlValue() {
    const value: Record<string, any> = {};
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      for (const list in group) value[list] = this.serializeList(list);
    return value;
  }
  set yamlValue(value) {
    this.reset();
    for (const list in value) this.deserializeList(list, value[list]);
  }

  /** The list of available overall lists in this manager. */
  get lists() {
    return Object.keys(this._exclusiveLists).concat(
      Object.keys(this._inclusiveLists)
    );
  }

  /** The list of available exclusive lists in this manager. */
  get exclusiveLists() {
    return Object.keys(this._exclusiveLists);
  }

  /** The list of available inclusive lists in this manager. */
  get inclusiveLists() {
    return Object.keys(this._inclusiveLists);
  }

  /**
   * Serializes a list, reducing its entities to only names.
   * @param list The list to serialize.
   * @returns The serialized list, reduced to names only.
   */
  protected serializeList(list: string): any {
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      if (group[list]) return group[list].map((i) => i.name);
  }

  /**
   * Deserializes a list, resolving a list of entity names
   * @param list The list to deserialize.
   * @param content The serialized content of the {@link list}.
   */
  protected deserializeList(list: string, content: any) {
    return this.setList(list, content as string[]);
  }

  /**
   * Duplicate an entity to add to a list.
   * @param entity The entity to duplicate.
   * @returns A shallow duplicate copy of the {@link entity}.
   */
  protected duplicateEntity(entity: T) {
    return Object.fromEntries(Object.entries(entity)) as T;
  }

  /** Retrieve the list of items that have not been assigned to an exclusive list. */
  getUnassigned(): ReadonlyArray<T> {
    const retval = this._entityList.slice();
    const group = this._exclusiveLists;
    for (const list in group)
      for (const entity of group[list])
        retval.filter((i) => i.name !== entity.name);
    return retval;
  }

  /**
   * Retrieve the contents of a list.
   * @param list The list to retrieve, "_unassigned" for unassigned items, or `null` for all items.
   * @returns The contents of the specified list, or `undefined` if the list is not found.
   */
  getList(list: string | null): ReadonlyArray<T> | undefined {
    if (!list) return this._entityList;
    if (list === "_unassigned") return this.getUnassigned();
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      if (group[list]) return group[list].slice();
  }

  /**
   * Retrieve an entity from a given list, or from unassigned/all items.
   * @param list The list to search for the given {@link entity}, "_unassigned" for unassigned items, or `null` for all items.
   * @param entity The entity to find.
   * @returns The entity, if found; otherwise, `undefined`. Also returns `undefined` if the list is not found.
   */
  getEntity(
    list: string | null,
    entity: APEntityResolvable<T>
  ): Readonly<T> | undefined {
    const itemName = typeof entity === "string" ? entity : entity.name;
    const refList: ReadonlyArray<T> | undefined = this.getList(list);
    if (refList) return refList.find((i) => i.name === itemName);
  }

  /**
   *
   * @param list The list from which to retrieve, "_unassigned" for an unassigned item, or `null` for an all item.
   * @param pos The position in the list to retrieve.
   * @returns The entity in the given list at the given position, or `undefined` if the list was not found or the position is out of bounds.
   */
  getEntityAt(list: string | null, pos: number): Readonly<T> | undefined {
    if (pos < 0) return undefined;
    const refList: ReadonlyArray<T> | undefined = this.getList(list);
    if (refList && pos < refList.length) return refList[pos];
  }

  /**
   * Set the contents of a given entity list.
   * @param list The list to set.
   * @param content The entities to place in that list.
   */
  setList(list: string, content: APEntityResolvable<T>[]) {
    this.clearList(list);
    this.addToList(list, 0, ...content);
  }

  /**
   * Clears a given entity list.
   * @param list The list to clear.
   */
  clearList(list: string) {
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      if (group[list]) {
        group[list] = [];
        break;
      }
  }

  /**
   * Adds one or more entities to a list. If they are being added to an exclusive list, this also removes them from other exclusive lists.
   * @param list The list to which to add the entity or entities.
   * @param pos Optional. The position in the list in which to add the entity or entities. This is purely cosmetic.
   * @param entities The entities to add.
   */
  addToList(list: string, pos?: number, ...entities: APEntityResolvable<T>[]) {
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      if (group[list]) {
        if (pos !== undefined && (pos < 0 || pos > group[list].length))
          throw new Error(
            `Position out of range (got ${pos}, expected 0-${group[list].length})`
          );

        const addList: T[] = [];
        for (const entity of entities) {
          const addEntity = this.getEntity(null, entity);
          if (addEntity) addList.push(addEntity);
        }
        group[list].splice(
          pos ?? group[list].length,
          0,
          ...addList.map(this.duplicateEntity)
        );

        if (group === this._exclusiveLists)
          for (const delList in this._exclusiveLists)
            if (list !== delList) this.delFromList(delList, ...addList);

        break;
      }
  }

  /**
   * Delete one or more entities from a given list.
   * @param list The list from which to delete the {@link entities}.
   * @param entities The entities to delete.
   */
  delFromList(list: string, ...entities: APEntityResolvable<T>[]) {
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      if (group[list]) {
        const delList: string[] = [];
        for (const entity of entities) {
          const delEntity = this.getEntity(list, entity);
          if (delEntity) delList.push(delEntity.name);
        }
        group[list] = group[list].filter((i) => !delList.includes(i.name));

        break;
      }
  }

  /**
   * Move an entity within a list. This is purely cosmetic.
   * @param list The list in which to move the {@link entity}.
   * @param entity The entity to move.
   * @param to The index to which to move the {@link entity}.
   */
  moveInList(list: string, entity: APEntityResolvable<T>, to: number) {
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      if (group[list]) {
        if (to !== undefined && (to < 0 || to >= group[list].length))
          throw new Error(
            `Destination out of range (got ${to}, expected 0-${
              group[list].length - 1
            })`
          );
        const moveItem = this.getEntity(list, entity);
        if (moveItem)
          group[list].filter((i) => i !== moveItem).splice(to, 0, moveItem);

        break;
      }
  }

  /**
   * Checks a given list for a given entity.
   * @param list The list to check for the {@link entity}.
   * @param entity The entity to check for.
   * @returns Whether the {@link entity} is in the given {@link list}. Returns false if the list does not exist.
   */
  includes(list: string, entity: APEntityResolvable<T>) {
    return this.getEntity(list, entity) !== undefined;
  }

  /** Resets all lists in this manager to an empty state. */
  reset() {
    for (const group of [this._exclusiveLists, this._inclusiveLists])
      for (const list in group) group[list] = [];
  }
}
