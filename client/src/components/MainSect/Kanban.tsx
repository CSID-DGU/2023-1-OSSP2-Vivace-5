import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Kanban.css";

type TaskType = {
    id: string;
    content: string;
};

type ColumnType = {
    id: string;
    title: string;
    taskIds: string[];
};

type InitialDataType = {
    tasks: { [key: string]: TaskType };
    columns: { [key: string]: ColumnType };
    columnOrder: string[];
};

const initialData: InitialDataType = {
    tasks: {
        "task-1": { id: "task-1", content: "Task 1" },
        "task-2": { id: "task-2", content: "Task 2" },
        "task-3": { id: "task-3", content: "Task 3" },
        "task-4": { id: "task-4", content: "Task 4" },
    },
    columns: {
        "column-1": {
            id: "column-1",
            title: "To do",
            taskIds: ["task-1", "task-2", "task-3", "task-4"],
        },
        "column-2": {
            id: "column-2",
            title: "In progress",
            taskIds: [],
        },
        "column-3": {
            id: "column-3",
            title: "Done",
            taskIds: [],
        },
    },
    columnOrder: ["column-1", "column-2", "column-3"],
};

const KanbanBoard: React.FC = () => {
    const [data, setData] = useState(initialData);

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const sourceColumn = data.columns[source.droppableId];
        const destinationColumn = data.columns[destination.droppableId];

        if (sourceColumn === destinationColumn) {
            const newTaskIds = Array.from(sourceColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...sourceColumn,
                taskIds: newTaskIds,
            };

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn,
                },
            };

            setData(newData);
        } else {
            const sourceTaskIds = Array.from(sourceColumn.taskIds);
            sourceTaskIds.splice(source.index, 1);
            const newSourceColumn = {
                ...sourceColumn,
                taskIds: sourceTaskIds,
            };

            const destinationTaskIds = Array.from(destinationColumn.taskIds);
            destinationTaskIds.splice(destination.index, 0, draggableId);
            const newDestinationColumn = {
                ...destinationColumn,

                taskIds: destinationTaskIds,
            };

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newSourceColumn.id]: newSourceColumn,
                    [newDestinationColumn.id]: newDestinationColumn,
                },
            };

            setData(newData);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="board">
                {data.columnOrder.map((columnId) => {
                    const column = data.columns[columnId];
                    const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

                    return (
                        <div key={column.id} className="column">
                            <h3>{column.title}</h3>
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                                    >
                                        {tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`task ${snapshot.isDragging ? "dragging" : ""}`}
                                                    >
                                                        {task.content}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
