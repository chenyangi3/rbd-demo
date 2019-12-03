import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import 'react-virtualized/styles.css';
import { List } from 'react-virtualized';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px
`

const ItemWrap = styled.div`
  width: 100%;
  height: 62px;
  line-height: 62px;
  text-align: center;
  background: grey
`

const VirtualVertical = () => {
  const [taskList, setTaskList] = useState({});

  const getTaskList = (count, desc) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
      id: `${desc}-${k}`,
      content: `${desc}-${k}`
  }));

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle, style) => ({
    userSelect: "none",
    // padding: grid * 2,
    background: isDragging ? "transparent" : "lightgrey",
    ...style,
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    marginRight: "20px"
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

  const getRowRender = (tasks) => ({index, style}) => {
    const task = tasks[index];
    console.log(style)
    // style.top = style.top + index * 8;
    return (
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={
              getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
              style
            )}
          >
            <ItemWrap>{task.content}</ItemWrap>
          </div>
        )}
      </Draggable>
    )
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
      'list1': getTaskList(1000, 'item'),
      'list2': getTaskList(10, 'task'),
    })
  }, []);
  
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Root>
          {taskList && Object.keys(taskList).map((key, index) => (
            <Droppable
              droppableId={key}
              type="task"
              mode="virtual"
              key={index}
              renderClone={(provided, snapshot, rubric) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  <ItemWrap>{taskList[key][rubric.source.index].content}</ItemWrap>
                </div>
              )}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <List
                    height={500}
                    rowCount={taskList[key].length}
                    rowHeight={70}
                    width={300}
                    ref={ref => {
                      if (ref) {
                        const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                        if (whatHasMyLifeComeTo instanceof HTMLElement) {
                          provided.innerRef(whatHasMyLifeComeTo);
                        }
                      }
                    }}
                    rowRenderer={getRowRender(taskList[key])}
                  />
                </div>  
              )}
            </Droppable>
          ))}
        </Root>
        
      </DragDropContext>
    </div>
  )
};

export default VirtualVertical;