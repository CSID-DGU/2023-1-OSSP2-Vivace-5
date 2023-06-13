import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddIcon from "@mui/icons-material/Add";
import styles from "./Kanban.module.css";
import { Task } from "../Data";
import { API_HOST } from "../../../config/constants";
import axios, { AxiosResponse } from "axios";

const initialColumns = [
    { id: "column-1", title: "column 1", tasks: ["task-1", "task-2", "task-3"] },
    { id: "column-2", title: "column 2", tasks: ["task-4", "task-5"] },
];

const initialTasks: { [key: string]: { id: string; title: string } } = {
    "task-1": { id: "task-1", title: "작업 1" },
    "task-2": { id: "task-2", title: "작업 2" },
    "task-3": { id: "task-3", title: "작업 3" },
    "task-4": { id: "task-4", title: "작업 4" },
    "task-5": { id: "task-5", title: "작업 5" },
};

interface KanbanProps {
    currentTask: Task;
    projectId: string;
}

const Kanban: React.FC<KanbanProps> = ({ currentTask, projectId }) => {
    const [columns, setColumns] = useState(initialColumns);
    const [tasks, setTasks] = useState(initialTasks);
    const [showModal, setShowModal] = useState(false);
    const [newTaskData, setNewTaskData] = useState({
        title: "",
        description: "",
        type: "LIST",
        start: "",
        deadline: "",
    });

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
                            return { ...col, tasks: newTasks }; //column에 taskList 업데이트
                        }
                        return col;
                    });

                    setColumns(updatedColumns); //업데이트된 column으로 세팅
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

    const handleAddTask = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setNewTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setNewTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${API_HOST}/task/create`,
                {
                    projectId: projectId,
                    parentId: currentTask.id,
                    isKanban: false,
                    title: newTaskData.title,
                    description: newTaskData.description,
                    type: newTaskData.type,
                    start: newTaskData.start,
                    deadline: newTaskData.deadline,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("access-token"),
                    },
                },
            );

            // Handle successful response
            console.log("New task created:", response.data);

            // Reset form data and close modal
            setNewTaskData({
                title: "",
                description: "",
                type: "LIST",
                start: "",
                deadline: "",
            });
            setShowModal(false);
        } catch (error) {
            // Handle error
            console.error("Error creating task:", error);
        }
    };

    return (
        <div className={styles.kanban}>
            <DragDropContext onDragEnd={handleDragEnd}>
                {columns.map((column) => (
                    <div key={column.id} className={styles.column}>
                        <h2 className={styles.columnTitle}>
                            {column.title}
                            <BorderColorIcon />
                        </h2>
                        <Droppable droppableId={column.id}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className={styles.taskList}>
                                    {column.tasks.map((taskId, index) => {
                                        const task = tasks[taskId];
                                        return (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={styles.taskItem}
                                                    >
                                                        {task.title}
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>

            <button className={styles.addTaskButton} onClick={handleAddTask}>
                <AddIcon />
                Add Task
            </button>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Add Task</h2>
                        <form onSubmit={handleFormSubmit}>
                            <label>
                                Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={newTaskData.title}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={newTaskData.description}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Type:
                                <select name="type" value={newTaskData.type} onChange={handleSelectChange}>
                                    <option value="LIST">List</option>
                                    <option value="KANBAN">Kanban</option>
                                    <option value="GRAPH">Graph</option>
                                    <option value="TERMINAL">Terminal</option>
                                </select>
                            </label>
                            <label>
                                Start (UTC):
                                <input
                                    type="datetime-local"
                                    name="start"
                                    value={newTaskData.start}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Deadline (UTC):
                                <input
                                    type="datetime-local"
                                    name="deadline"
                                    value={newTaskData.deadline}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <button type="submit">Create Task</button>
                        </form>
                        <button onClick={handleModalClose}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Kanban;
