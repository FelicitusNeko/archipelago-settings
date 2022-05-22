import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import Slider from "rc-slider";

import { APGameItem, APGameItemAndQty } from "../../../defs/core";
import { APItemManager, MakeStartInvLocal } from "../../../objs/entities/APItemManager";
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

  const onQtyChange = (newVal: number|number[]) => {
    if (!Array.isArray(newVal)) {
      manager.setQty(entity, newVal);
      save();
    }
  };

  const onCheckChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    const { name, checked } = currentTarget;
    if (checked) manager.addToList(name, undefined, entity.name);
    else manager.delFromList(name, entity.name);
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

  _nodeRenderers = {
    start_inventory: APItemQtyNode,
  };
  _dropRestrictors = {
    start_inventory: (item: Readonly<APGameItem>) => {
      return item.max === 0;
    },
  };

  startInvComp = () => {
    const {manager, save} = this.props;
    const onStartInvChange: React.ChangeEventHandler<HTMLSelectElement> = ({
      currentTarget,
    }) => {
      manager.startInvMode = Number.parseInt(currentTarget.value) as MakeStartInvLocal;
      save();
      this.forceUpdate();
    }

    return <p>
      <b>Start inventory mode:</b>{" "}
      <select onChange={onStartInvChange} value={manager.startInvMode}>
        <option value={0}>Do nothing</option>
        <option value={1}>On export, any max qty item in Start Inventory will be added to Local Items</option>
        <option value={2}>On export, all items in Start Inventory will be added to Local Items</option>
      </select>
    </p>
  }
  _additionalComponents = [this.startInvComp];
}
