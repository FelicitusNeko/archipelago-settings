import { APGameItem, APGameItemAndQty } from "../../defs/core";
import { APEntityManager, APEntityResolvable } from "./APEntityManager";

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
 * Manages items in a category.
 * @since 1.0.0
 */
export class APItemManager extends APEntityManager<APGameItem> {
  /** How to handle start_inventory entries in the item manager. */
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

  /** How to handle start_inventory entries in the item manager. */
  get startInvMode() {
    return this._startInvMode;
  }
  set startInvMode(value) {
    this._startInvMode = value;
  }

  /** @override Special handling is needed for `start_inventory` and `local_items`. */
  protected serializeList(list: string) {
    const startInv = this._exclusiveLists.start_inventory as APGameItemAndQty[];
    if (list === "start_inventory") {
      return Object.fromEntries(startInv.map((i) => [i.name, i.qty]));
    } else if (
      list === "local_items" &&
      this._startInvMode !== MakeStartInvLocal.No
    ) {
      const baseList = super.serializeList(list);
      if (baseList)
        for (const item of startInv)
          if (
            this._startInvMode === MakeStartInvLocal.Always ||
            item.qty === (item.max ?? 1)
          )
            baseList.push(item.name);
      return baseList;
    } else return super.serializeList(list);
  }

  /** @override Special handling is needed for `start_inventory`. */
  protected deserializeList(list: string, content: any) {
    if (list === "start_inventory") {
      const setList: APGameItemAndQty[] = [];
      for (const entry of Object.entries(content as Record<string, number>)) {
        const findEntity = this.getEntity(null, entry[0]);
        if (findEntity && findEntity.max !== 0) {
          const addEntity = this.duplicateEntity(
            findEntity
          ) as APGameItemAndQty;
          addEntity.qty = entry[1];
          setList.push(addEntity);
        }
      }
      this._exclusiveLists.start_inventory = setList;
      this.delFromList("local_items", ...setList);
    } else return super.deserializeList(list, content);
  }

  /** @override Special handling is needed for {@link APGameItemAndQty}s. */
  protected duplicateEntity(entity: APGameItem | APGameItemAndQty) {
    if (!APItemManager.hasQty(entity)) return super.duplicateEntity(entity);
    return Object.fromEntries(Object.entries(entity)) as APGameItemAndQty;
  }

  /** @override Also reset {@link startInvMode}. */
  reset() {
    super.reset();
    this._startInvMode = MakeStartInvLocal.MaxOnly;
  }

  // /** @override Special handling is needed for `start_inventory`. */
  // setList(list: string, content: APEntityResolvable<APGameItem>[]) {
  //   if (list !== "start_inventory") super.setList(list, content);
  // }

  /** @override Special handling is needed for `start_inventory`. */
  addToList(
    list: string,
    pos?: number,
    ...entities: APEntityResolvable<APGameItem>[]
  ) {
    if (list !== "start_inventory") return super.addToList(list, pos, ...entities);

    const group = this._exclusiveLists;
    if (pos !== undefined && (pos < 0 || pos > group[list].length))
      throw new Error(
        `Position out of range (got ${pos}, expected 0-${group[list].length})`
      );

    const addList: APGameItemAndQty[] = [];
    for (const entity of entities) {
      const findEntity = this.getEntity(null, entity) as APGameItemAndQty;
      if (findEntity && findEntity.max !== 0) {
        const addEntity = this.duplicateEntity(findEntity) as APGameItemAndQty;
        addEntity.qty = 1;
        addList.push(addEntity);
      }
    }
    group[list].splice(
      pos ?? group[list].length,
      0,
      ...addList.map(this.duplicateEntity)
    );

    for (const delList in this._exclusiveLists)
      if (list !== delList) this.delFromList(delList, ...addList);
  }

  /**
   * Update the quantity of a starting item.
   * @param entity The item to modify.
   * @param qty The quantity of the item to set to.
   */
  setQty(entity: APEntityResolvable<APGameItem>, qty: number) {
    const item = this.getEntity("start_inventory", entity) as
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
