import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const ItemWrap = styled.div`
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
`

const MultiHorizontal = () => {
  const [taskList, setTaskList] = useState({});

  const getTaskList = (count, desc) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
      id: `${desc}-${k}`,
      content: `${desc}-${k}`
  }));

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `${grid}px`,
    background: isDragging ? "lightgreen" : "grey",
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    display: "flex",
    overflow: "auto",
    marginBottom: "10px"
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
        {taskList && Object.keys(taskList).map((key, index) => (
          <Droppable droppableId={key} type="task" key={index} direction="horizontal">
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
                        <ItemWrap>{item.content}</ItemWrap>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>  
        ))}
      </DragDropContext>
    </div>
  )
};

export default MultiHorizontal;