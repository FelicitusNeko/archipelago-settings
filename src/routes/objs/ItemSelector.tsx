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
  offset: number;
  items?: ArchipelagoItem[];
  itemsAndQtys?: ArchipelagoItemAndQty[];
}
const ItemDropbox: React.FC<ItemDropboxProps> = ({
  id,
  title,
  offset,
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
                      max={(item.max === undefined ? 1 : item.max)}
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
  items: ArchipelagoItem[];
  commonSettings: ArchipelagoCommonSettings;
}
const ItemSelector: React.FC<ItemSelectorProps> = ({
  items,
  commonSettings,
}) => {
  const [unassigned, setUnassigned] = useState(items);

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
    );
  }, [commonSettings, items, setUnassigned]);

  const onDragEnd = (result: DropResult, provided: ResponderProvided): void => {
    console.debug(result, provided);

    let moveItem: ArchipelagoItem;
    let moveQty = -1;

    if (!result.destination) return;
    if (result.source.droppableId === result.destination.droppableId) {
      if (
        result.source.index === result.destination.index ||
        result.source.droppableId === "unassigned"
      )
        return;
    }
  };

  return (
    <div className="itemselector">
      <DragDropContext onDragEnd={onDragEnd}>
        <ItemDropbox
          id="unassigned"
          title="Unassigned items"
          offset={0}
          items={unassigned}
        />
        <ItemDropbox
          id="local-items"
          title="Local items"
          offset={items.length}
          items={[]}
        />
        <ItemDropbox
          id="non-local-items"
          title="Non-Local items"
          offset={items.length * 2}
          items={[]}
        />
        <ItemDropbox
          id="start-inventory"
          title="Starting inventory"
          offset={items.length * 3}
          items={[]}
        />
      </DragDropContext>
    </div>
  );
};

export default ItemSelector;
