import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DragStart,
  DropResult,
} from "react-beautiful-dnd";

import { APMetaManager } from "../../../defs/generate";
import { APEntityManager } from "../../../objs/entities/APEntityManager";

import "../ItemSelector.css";

export type ManagerValueType<T = APMetaManager> = T extends APEntityManager<
  infer X
>
  ? X
  : never;

export interface APEntityNodeProps<T extends APMetaManager> {
  entity: ManagerValueType<T>;
  category: string | null;
  index: number;
  manager: T;
  checkLabels: Record<string, string>;
  save: () => void;
  children: string;
}
function APEntityNode<T extends APMetaManager>({
  entity,
  category,
  index,
  manager,
  checkLabels,
  save,
  children,
}: APEntityNodeProps<T>) {
  const onCheckChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    const { name, checked } = currentTarget;
    if (checked) manager.delFromList(name, entity.name);
    else manager.addToList(name, undefined, entity.name);
    save();
  };

  return (
    <Draggable draggableId={entity.name} index={index}>
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
            {children}
            {APEntityManager.isItem(entity) && entity.max === 0 ? " ⛔" : null}
          </div>
        );
      }}
    </Draggable>
  );
}

interface APEntityDropboxProps<T extends APMetaManager> {
  id: string;
  category: string | null;
  title: string;
  manager: T;
  checkLabels: Record<string, string>;
  dropDisabled?: boolean;
  AlternateNode?: React.FC<APEntityNodeProps<T>>;
  save: () => void;
}
function APEntityDropbox<T extends APMetaManager>({
  id,
  category,
  title,
  manager,
  checkLabels,
  dropDisabled,
  AlternateNode,
  save,
}: APEntityDropboxProps<T>) {
  const entities = manager.getList(id);
  if (!entities) return null;
  const EntityNode = AlternateNode ?? APEntityNode;
  return (
    <div className="itemdropbox">
      <h4>{title}</h4>
      <Droppable droppableId={id} isDropDisabled={dropDisabled}>
        {(provided) => {
          return (
            <div
              className="itemcontainer"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {entities.map((i, x) => (
                <EntityNode
                  key={`dropbox-${category}-${id}-${i.name}`}
                  entity={i as ManagerValueType<T>}
                  category={category}
                  manager={manager}
                  index={x}
                  checkLabels={checkLabels}
                  save={save}
                >
                  {i.readableName ?? i.name}
                </EntityNode>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

interface APEntitySelectorProps<T extends APMetaManager> {
  category: string | null;
  manager: T;
  save: () => void;
}
interface APEntitySelectorState<T extends APMetaManager> {
  moveEntity?: Readonly<ManagerValueType<T>>;
}
export abstract class APEntitySelector<
  T extends APMetaManager
> extends React.Component<APEntitySelectorProps<T>, APEntitySelectorState<T>> {
  protected abstract readonly _dropLabels: Record<string, string>;
  protected abstract readonly _checkLabels: Record<string, string>;

  protected abstract readonly _title: string;
  protected abstract readonly _description: string;

  protected abstract _additionalComponents: React.ReactNode[];

  onDragStart = ({ source }: DragStart): void => {
    const { manager } = this.props;
    this.setState({
      moveEntity: manager.getEntityAt(
        source.droppableId,
        source.index
      ) as Readonly<ManagerValueType<T>>,
    });
  };

  onDragEnd = (result: DropResult): void => {
    if (!this.state) return;

    const { source, destination } = result;
    const { manager, save } = this.props;
    const { moveEntity } = this.state;

    if (!moveEntity) return;

    if (destination) {
      if (source.droppableId === destination.droppableId) {
        if (
          source.index !== destination.index &&
          source.droppableId !== "_unassigned"
        ) {
          manager.moveInList(
            source.droppableId,
            moveEntity.name,
            destination.index
          );
          save();
        }
      } else {
        manager.addToList(
          destination.droppableId,
          destination.index,
          moveEntity.name
        );
        save();
      }
    }

    return this.setState({
      moveEntity: undefined,
    });
  };

  render() {
    const { category, manager, save } = this.props;
    const listList = [["_unassigned", "Unassigned items"]].concat(
      Object.entries(this._dropLabels)
    );

    return (
      <div className="setting">
        <b>{this._title}</b>
        {manager.isAnyListPopulated() ? null : (
          <button
            className="revert emojibutton"
            title="Revert to default"
            onClick={manager.reset}
          >
            🔄
          </button>
        )}
        <br />
        {this._description}
        <br />
        {this._additionalComponents}
        <div className="itemselector">
          <DragDropContext
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
          >
            {listList.map((i) => (
              <APEntityDropbox
                key={`dropbox-${category}-${i[0]}`}
                id={i[0]}
                category={category}
                manager={manager}
                title={i[1]}
                checkLabels={this._checkLabels}
                AlternateNode={APEntityNode}
                save={save}
              />
            ))}
          </DragDropContext>
        </div>
      </div>
    );
  }
}
