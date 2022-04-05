import { APGameLocation } from "../../defs/core";
import { APEntityManager } from "./APEntityManager";

/**
 * Manages locations in a category.
 * @since 1.0.0
 */
export class APLocationManager extends APEntityManager<APGameLocation> {
  constructor(entityList: APGameLocation[]) {
    super(entityList);
    this._exclusiveLists = {
      priority_locations: [],
      exclude_locations: [],
    };
    this._inclusiveLists = {
      start_location_hints: [],
    };
  }
}
