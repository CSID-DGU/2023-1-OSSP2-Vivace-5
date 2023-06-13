import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import styles from "./TaskList.module.css";
import { Project, Task } from "../Data";

interface TaskListProps {
    currentTask: Task;
}

const TaskList: React.FC<TaskListProps> = ({ currentTask }) => {
    const [taskList, setTaskList] = useState<Task[]>([]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updatedTasks = Array.from(taskList);
        const [removed] = updatedTasks.splice(result.source.index, 1);
        updatedTasks.splice(result.destination.index, 0, removed);

        setTaskList(updatedTasks);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="taskList">
                {(provided) => (
                    <ul className={styles.taskList} {...provided.droppableProps} ref={provided.innerRef}>
                        {taskList.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => (
                                    <li
                                        className={styles.taskItem}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        style={provided.draggableProps.style}
                                    >
                                        <div className={styles.taskWrapper}>
                                            <div className={styles.taskContent}>
                                                <div className={styles.dragIcon}>
                                                    <DragIndicatorIcon />
                                                </div>
                                                <div className={styles.separator} />
                                                <h3>{task.title}</h3>
                                                <div className={styles.separator} />
                                                <p>{task.description}</p>
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default TaskList;
