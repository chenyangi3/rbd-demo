import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px
`

const MultiVertical = () => {
  const [taskList, setTaskList] = useState({});

  const getTaskList = (count, desc) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
      id: `${desc}-${k}`,
      content: `${desc}-${k}`
  }));

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background color if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250,
  });

  /**
   * 重排数组
   * @param {*} list 改变的数据源
   * @param {*} startIndex 起始位置的索引
   * @param {*} endIndex 结束位置的索引
   */
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  /**
   * 甬道间数据重排.
   * @param {list} source 来源列表
   * @param {list} destination 目标列表
   * @param {object} droppableSource 来源项
   * @param {object} droppableDestination 目标项
   */
  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const desClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    desClone.splice(droppableDestination.index, 0, removed);
    const result = {};
    result['source'] = sourceClone;
    result['destination'] = desClone;

    return result;

  }

  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log(result)
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      const newTaskList = reorder(
        taskList[source.droppableId],
        result.source.index,
        result.destination.index
      );
      setTaskList((prevState) => ({
        ...prevState,
        [source.droppableId]: newTaskList
      }))
    } else {
      const newTaskList = move(
        taskList[source.droppableId],
        taskList[destination.droppableId],
        source,
        destination
      )
      setTaskList((prevState) => ({
        ...prevState,
        [source.droppableId]: newTaskList.source,
        [destination.droppableId]: newTaskList.destination
      }))
    }
  }

  useEffect(() => {
    setTaskList({
      'list1': getTaskList(10, 'item'),
      'list2': getTaskList(10, 'task'),
      'list3': getTaskList(10, 'record')
    })
  }, []);
  
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Root>
          {taskList && Object.keys(taskList).map((key, index) => (
            <Droppable droppableId={key} type="task" key={index}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {taskList[key].map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </Root>
        
      </DragDropContext>
    </div>
  )
};

export default MultiVertical;