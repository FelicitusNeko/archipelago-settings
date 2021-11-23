import Slider from "rc-slider/lib/Slider";
import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";

import {
  ArchipelagoCommonSettings,
  ArchipelagoItem,
  ArchipelagoItemAndQty,
  CommonItemSettingChangeEvent,
} from "../../defs/core";
import "./ItemSelector.css";

interface ItemNodeProps {
  id: string;
  category: string;
  index: number;
  children: string;
  hint: boolean;
  max?: number;
  qty?: number;
  onChange: CommonItemSettingChangeEvent;
}
const ItemNode: React.FC<ItemNodeProps> = ({
  id,
  category,
  index,
  children,
  hint,
  max,
  qty,
  onChange,
}) => {
  const [draggable, setDraggable] = useState(true);

  const onHintChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => onChange(id, category, { startingHint: currentTarget.checked });

  const onQtyChange = (newVal: number) =>
    onChange(id, category, { qty: newVal });

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!draggable}>
      {(provided) => {
        return (
          <div
            className="itemnode"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {max === undefined || max !== qty ? (
              <input type="checkbox" checked={hint} onChange={onHintChange} />
            ) : null}
            {qty && max && max > 2 ? `${qty}× ` : null}
            {children}
            {qty && max && max > 2 ? (
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
};

interface ItemDropboxProps {
  id: string;
  category: string;
  title: string;
  items?: ArchipelagoItem[];
  itemsAndQtys?: ArchipelagoItemAndQty[];
  start_hints?: ArchipelagoItem[];
  onChange: CommonItemSettingChangeEvent;
}
const ItemDropbox: React.FC<ItemDropboxProps> = ({
  id,
  category,
  title,
  items,
  itemsAndQtys,
  start_hints,
  onChange,
}) => {
  if ((!items && !itemsAndQtys) || (items && itemsAndQtys)) return null;
  return (
    <div className="itemdropbox">
      <h4>{title}</h4>
      <Droppable droppableId={id}>
        {(provided) => {
          return (
            <div
              className="itemcontainer"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items
                ? items.map((i, x) => (
                    <ItemNode
                      key={`item-${i.name}`}
                      id={i.name}
                      category={category}
                      index={x}
                      hint={start_hints ? start_hints.includes(i) : false}
                      onChange={onChange}
                    >
                      {i.readableName ?? i.name}
                    </ItemNode>
                  ))
                : itemsAndQtys!.map(({ item, qty }, x) => (
                    <ItemNode
                      key={`item-${item.name}`}
                      id={item.name}
                      category={category}
                      index={x}
                      max={item.max === undefined ? 1 : item.max}
                      qty={qty}
                      hint={start_hints ? start_hints.includes(item) : false}
                      onChange={onChange}
                    >
                      {item.readableName ?? item.name}
                    </ItemNode>
                  ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

interface ItemSelectorProps {
  category: string;
  items: ArchipelagoItem[];
  commonSettings: ArchipelagoCommonSettings;
  onChange: CommonItemSettingChangeEvent;
}
const ItemSelector: React.FC<ItemSelectorProps> = ({
  category,
  items,
  commonSettings,
  onChange,
}) => {
  const [unassigned, setUnassigned] = useState(items);
  const { local_items, non_local_items, start_inventory, start_hints } =
    commonSettings;

  useEffect(() => {
    setUnassigned(
      items
        .filter((i) =>
          commonSettings.local_items
            ? !commonSettings.local_items.includes(i)
            : true
        )
        .filter((i) =>
          commonSettings.non_local_items
            ? !commonSettings.non_local_items.includes(i)
            : true
        )
        .filter((i) =>
          commonSettings.start_inventory
            ? !commonSettings.start_inventory.map((i) => i.item).includes(i)
            : true
        )
    );
  }, [commonSettings, items, setUnassigned]);

  //console.debug(category, items, commonSettings);

  const onDragEnd = (result: DropResult, provided: ResponderProvided): void => {
    console.debug(result, provided);

    let moveItem: ArchipelagoItem;
    //let moveQty = -1;

    if (!result.destination) return;
    if (result.source.droppableId === result.destination.droppableId) {
      if (
        result.source.index === result.destination.index ||
        result.source.droppableId === "unassigned"
      )
        return;
    }

    switch (result.source.droppableId) {
      case "unassigned":
        moveItem = unassigned[result.source.index];
        break;
      case "local_items":
        if (!local_items) return;
        moveItem = local_items[result.source.index];
        break;
      case "non_local_items":
        if (!non_local_items) return;
        moveItem = non_local_items[result.source.index];
        break;
      case "start_inventory":
        if (!start_inventory) return;
        ({ item: moveItem /*, qty: moveQty*/ } =
          start_inventory[result.source.index]);
        break;
      default:
        return;
    }

    if (result.source.droppableId === result.destination.droppableId)
      onChange(moveItem.name, category, { index: result.destination.index });
    else
      onChange(moveItem.name, category, {
        destination: result.destination.droppableId,
        index: result.destination.index,
      });
  };

  return (
    <div className="setting">
      <b>Item selector</b>
      <br />
      Select which items are guaranteed to be in your world (local) or not
      (non-local), and items you start with. Check the box if you want to get a
      hint on where that item is from the start.
      <br />
      <div className="itemselector">
        <DragDropContext onDragEnd={onDragEnd}>
          <ItemDropbox
            id="unassigned"
            category={category}
            title="Unassigned items"
            items={unassigned}
            start_hints={start_hints}
            onChange={onChange}
          />
          <ItemDropbox
            id="local_items"
            category={category}
            title="Local items"
            items={local_items ?? []}
            start_hints={start_hints}
            onChange={onChange}
          />
          <ItemDropbox
            id="non_local_items"
            category={category}
            title="Non-Local items"
            items={non_local_items ?? []}
            start_hints={start_hints}
            onChange={onChange}
          />
          <ItemDropbox
            id="start_inventory"
            category={category}
            title="Starting inventory"
            itemsAndQtys={start_inventory ?? []}
            start_hints={start_hints}
            onChange={onChange}
          />
        </DragDropContext>
      </div>
    </div>
  );
};

export default ItemSelector;
