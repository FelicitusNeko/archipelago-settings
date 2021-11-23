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
  index: number;
  children: string;
  max?: number;
  qty?: number;
}
const ItemNode: React.FC<ItemNodeProps> = ({ id, index, children }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => {
        return (
          <div
            className="itemnode"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {children}
          </div>
        );
      }}
    </Draggable>
  );
};

interface ItemDropboxProps {
  id: string;
  title: string;
  items?: ArchipelagoItem[];
  itemsAndQtys?: ArchipelagoItemAndQty[];
}
const ItemDropbox: React.FC<ItemDropboxProps> = ({
  id,
  title,
  items,
  itemsAndQtys,
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
              {/* TODO: list generation goes here*/}
              {items
                ? items.map((i, x) => (
                    <ItemNode key={`item-${i.name}`} id={i.name} index={x}>
                      {i.readableName ?? i.name}
                    </ItemNode>
                  ))
                : itemsAndQtys!.map(({ item, qty }, x) => (
                    <ItemNode
                      key={`item-${item.name}`}
                      id={item.name}
                      index={x}
                      max={item.max === undefined ? 1 : item.max}
                      qty={qty}
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
  const { local_items, non_local_items, start_inventory } = commonSettings;

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
            ? !commonSettings.start_inventory.map(i => i.item).includes(i)
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
        ({ item: moveItem/*, qty: moveQty*/ } =
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
    <div className="itemselector">
      <DragDropContext onDragEnd={onDragEnd}>
        <ItemDropbox
          id="unassigned"
          title="Unassigned items"
          items={unassigned}
        />
        <ItemDropbox
          id="local_items"
          title="Local items"
          items={local_items ?? []}
        />
        <ItemDropbox
          id="non_local_items"
          title="Non-Local items"
          items={non_local_items ?? []}
        />
        <ItemDropbox
          id="start_inventory"
          title="Starting inventory"
          itemsAndQtys={start_inventory ?? []}
        />
      </DragDropContext>
    </div>
  );
};

export default ItemSelector;
