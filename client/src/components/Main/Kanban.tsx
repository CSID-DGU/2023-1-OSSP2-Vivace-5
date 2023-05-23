import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddIcon from "@mui/icons-material/Add";
import "./Kanban.css";

const initialColumns = [
    { id: "column-1", title: "column 1", tasks: ["task-1", "task-2", "task-3"] },
    { id: "column-2", title: "column 2", tasks: ["task-4", "task-5"] },
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

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;

        if (!destination) {
            return;
        }

        if (type === "column") {
            const newColumns = Array.from(columns);
            const [removed] = newColumns.splice(source.index, 1);
            newColumns.splice(destination.index, 0, removed);
            setColumns(newColumns);
        } else if (type === "task") {
            const sourceColumn = columns.find((col) => col.id === source.droppableId);
            const destinationColumn = columns.find((col) => col.id === destination.droppableId);

            if (sourceColumn && destinationColumn && sourceColumn === destinationColumn) {
                const column = columns.find((col) => col.id === source.droppableId);
                if (column) {
                    const newTasks = Array.from(column.tasks);
                    const [removed] = newTasks.splice(source.index, 1);
                    newTasks.splice(destination.index, 0, removed);

                    const updatedColumns = columns.map((col) => {
                        if (col.id === source.droppableId) {
<<<<<<< HEAD
                            return { ...col, tasks: newTasks }; //column에 taskList 업데이트
=======
                            return { ...col, tasks: newTasks };
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
                        }
                        return col;
                    });

<<<<<<< HEAD
                    setColumns(updatedColumns); //업데이트된 column으로 세팅
=======
                    setColumns(updatedColumns);
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
                }
            } else if (sourceColumn && destinationColumn && sourceColumn !== destinationColumn) {
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
            title: `column ${columns.length + 1}`,
            tasks: [],
        };

        setColumns([...columns, newColumn]);
    };

    const updateColumnTitle = (columnId: string, newTitle: string) => {
        const updatedColumns = columns.map((col) => {
            if (col.id === columnId) {
                return { ...col, title: newTitle };
            }
            return col;
        });

        setColumns(updatedColumns);
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
                                                <div className="column-header">
                                                    <h2 className="column-title">{column.title}</h2>
                                                    <button
                                                        className="column-title-button"
                                                        onClick={() => {
                                                            const newTitle = prompt("새로운 열 제목을 입력하세요:");
                                                            if (newTitle) {
                                                                updateColumnTitle(column.id, newTitle);
                                                            }
                                                        }}
                                                    >
                                                        <BorderColorIcon className="reName" />
                                                    </button>
                                                    <span className="task-count">{column.tasks.length}</span>
                                                </div>
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
                                        <AddIcon />
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
