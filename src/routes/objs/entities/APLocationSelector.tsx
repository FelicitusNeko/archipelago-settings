import { APLocationManager } from "../../../objs/entities/APLocationManager";
import { APEntitySelector } from "./APEntitySelector";

/**
 * The renderable representation of a location selector, which interacts with an {@link APLocationManager}.
 * @since 1.0.0
 */
export class APLocationSelector extends APEntitySelector<APLocationManager> {
  _dropLabels = {
    _unassigned: "Unassigned",
    exclude_locations: "Exclude location",
  };
  _checkLabels = { start_location_hints: "Starting hint" };

  _title = "Location selector";
  _description =
    "Select which locations will be guaranteed not to hold any progression items. " +
    "Check the box to start with a hint as to what's in that location.";

  // TODO: Additional component for extra startinv→local handling
  _additionalComponents = [];
  _nodeRenderers = {};
  _dropRestrictors = {};
}
