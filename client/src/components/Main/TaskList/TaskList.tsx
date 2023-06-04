import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import "./TaskList.css";

interface Task {
    id: string;
    title: string;
    description: string;
}

interface TaskListProps {}

const TaskList: React.FC<TaskListProps> = () => {
    const [taskList, setTaskList] = useState<Task[]>([
        { id: "task1", title: "Task 1", description: "Description for Task 1" },
        { id: "task2", title: "Task 2", description: "Description for Task 2" },
        { id: "task3", title: "Task 3", description: "Description for Task 3" },
        { id: "task4", title: "Task 4", description: "Description for Task 4" },
        { id: "task5", title: "Task 5", description: "Description for Task 5" },
    ]);

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
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                        {taskList.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => (
                                    <li
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        style={provided.draggableProps.style}
                                    >
                                        <div className="task-wrapper">
                                            <div className="task-content">
                                                <div className="drag-icon">
                                                    <DragIndicatorIcon />
                                                </div>
                                                <div className="separator" />
                                                <h3>{task.title}</h3>
                                                <div className="separator" />
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
