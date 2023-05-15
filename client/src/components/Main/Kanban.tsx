import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import "./Kanban.css";

// 초기 열과 작업 리스트
const initialColumns = [
    { id: "column-1", title: "열 1", tasks: ["task-1", "task-2", "task-3"] },
    { id: "column-2", title: "열 2", tasks: ["task-4", "task-5"] },
];

const initialTasks: { [key: string]: { id: string; content: string } } = {
    "task-1": { id: "task-1", content: "작업 1" },
    "task-2": { id: "task-2", content: "작업 2" },
    "task-3": { id: "task-3", content: "작업 3" },
    "task-4": { id: "task-4", content: "작업 4" },
    "task-5": { id: "task-5", content: "작업 5" },
};

const Kanban: React.FC = () => {
    const [columns, setColumns] = useState(initialColumns);
    const [tasks, setTasks] = useState(initialTasks);

    // 드래그 앤 드롭 이벤트 핸들러
    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        // 같은 열에서 작업 순서 변경
        if (source.droppableId === destination.droppableId) {
            const column = columns.find((col) => col.id === source.droppableId);
            if (column) {
                const newTasks = Array.from(column.tasks);
                const [removed] = newTasks.splice(source.index, 1);
                newTasks.splice(destination.index, 0, removed);

                const updatedColumns = columns.map((col) => {
                    if (col.id === source.droppableId) {
                        return { ...col, tasks: newTasks };
                    }
                    return col;
                });

                setColumns(updatedColumns);
            }
        }
        // 다른 열로 작업 이동
        else {
            const sourceColumn = columns.find((col) => col.id === source.droppableId);
            const destinationColumn = columns.find((col) => col.id === destination.droppableId);

            if (sourceColumn && destinationColumn) {
                const sourceTasks = Array.from(sourceColumn.tasks);
                const destinationTasks = Array.from(destinationColumn.tasks);
                const [removed] = sourceTasks.splice(source.index, 1);
                destinationTasks.splice(destination.index, 0, removed);

                const updatedColumns = columns.map((col) => {
                    if (col.id === source.droppableId) {
                        return { ...col, tasks: sourceTasks };
                    }
                    if (col.id === destination.droppableId) {
                        return { ...col, tasks: destinationTasks };
                    }
                    return col;
                });

                setColumns(updatedColumns);
            }
        }
    };

    const addColumn = () => {
        const newColumnId = `column-${columns.length + 1}`;
        const newColumn = {
            id: newColumnId,
            title: `열 ${columns.length + 1}`,
            tasks: [],
        };

        setColumns([...columns, newColumn]);
    };

    return (
        <div className="kanban">
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="column-container">
                    <Droppable droppableId="all-columns" direction="horizontal" type="column">
                        {(provided) => (
                            <div className="column-container" ref={provided.innerRef} {...provided.droppableProps}>
                                {columns.map((column, columnIndex) => (
                                    <Draggable draggableId={column.id} index={columnIndex} key={column.id}>
                                        {(provided) => (
                                            <div
                                                className="column"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <h2 className="column-title">{column.title}</h2>
                                                <Droppable droppableId={column.id} type="task">
                                                    {(provided) => (
                                                        <div
                                                            className="task-list"
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                        >
                                                            {column.tasks.map((taskId, index) => (
                                                                <Draggable
                                                                    draggableId={taskId}
                                                                    index={index}
                                                                    key={taskId}
                                                                >
                                                                    {(provided) => (
                                                                        <div
                                                                            className="task"
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <p>{tasks[taskId].content}</p>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                <div className="add-column-button-container">
                                    <button className="add-column-button" onClick={addColumn}>
                                        열 추가
                                    </button>
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    );
};
export default Kanban;
