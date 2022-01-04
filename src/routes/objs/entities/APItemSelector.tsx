import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import Slider from "rc-slider";

import { APGameItem, APGameItemAndQty } from "../../../defs/core";
import { APItemManager } from "../../../objs/entities/APItemManager";
import { APEntityNodeProps, APEntitySelector } from "./APEntitySelector";

/**
 * A renderable representation of a node in a dropbox in an entity manager, specific to items with quantities.
 * @param props The properties for this component.
 * @returns The result of rendering this component.
 */
function APItemQtyNode({
  entity,
  category,
  index,
  manager,
  checkLabels,
  save,
  children,
}: APEntityNodeProps<APItemManager>) {
  const [draggable, setDraggable] = useState(true);

  const entityQty = entity as APGameItemAndQty;
  const { max, qty } = entityQty;

  const onQtyChange = (newVal: number) => {
    manager.setQty(entity, newVal);
    save();
  };

  const onCheckChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    const { name, checked } = currentTarget;
    if (checked) manager.delFromList(name, entity.name);
    else manager.addToList(name, undefined, entity.name);
    save();
  };

  return (
    <Draggable
      draggableId={entity.name}
      index={index}
      isDragDisabled={!draggable}
    >
      {(provided) => {
        return (
          <div
            className="itemnode"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {manager.inclusiveLists.map((i) => (
              <input
                key={`entitynode-${category}-${entity.name}-cbox-${i}`}
                type="checkbox"
                name={i}
                title={checkLabels[i]}
                checked={manager.includes(i, entity.name)}
                onChange={onCheckChange}
              />
            ))}
            {max && max > 2 ? `${qty}× ` : null}
            {children}
            {entity.max === 0 ? " ⛔" : null}
            {max && max > 2 ? (
              <>
                <br />
                <div
                  className="qtycontainer"
                  onMouseEnter={() => setDraggable(false)}
                  onMouseLeave={() => setDraggable(true)}
                >
                  <Slider
                    min={1}
                    max={max}
                    value={qty}
                    onChange={onQtyChange}
                  />
                </div>
              </>
            ) : null}
          </div>
        );
      }}
    </Draggable>
  );
}

/**
 * The renderable representation of an item selector, which interacts with an {@link APItemManager}.
 * @since 1.0.0
 */
export class APItemSelector extends APEntitySelector<APItemManager> {
  _dropLabels = {
    _unassigned: "Unassigned",
    local_items: "Local items",
    non_local_items: "Non-local items",
    start_inventory: "Starting inventory",
  };
  _checkLabels = { start_hints: "Starting hint" };

  _title = "Item selector";
  _description =
    "Select which items are guaranteed to be in your world (local) or not " +
    "(non-local), and items you start with. Check the box if you want to get a " +
    "hint on where that item is from the start. If all of a given item is in " +
    "the starting inventory, hints are disabled. Some items cannot be added to " +
    "start inventory (⛔).";

  // TODO: Additional component for extra startinv→local handling
  _additionalComponents = [];
  _nodeRenderers = {
    start_inventory: APItemQtyNode,
  };
  _dropRestrictors = {
    start_inventory: (item: Readonly<APGameItem>) => {
      return item.max === 0;
    },
  };
}
