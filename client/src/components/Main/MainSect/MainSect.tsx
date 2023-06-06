import React, { ChangeEvent, useState } from "react";
import MarkDown from "../MarkDown/MarkDown";
import Network from "../Network/Network";
import Kanban from "../Kanban/Kanban";
import TaskList from "../TaskList/TaskList";
import AddIcon from "@mui/icons-material/Add";
import styles from "./MainSect.module.css";
import axios from "axios";
import { API_HOST } from "../../../config/constants";

interface Project {
    id: string;
    title: string;
    description: string;
    encodedImg: string;
    parentTasks?: Task[];
}

interface Task {
    id: string;
    title: string;
}

interface MainSectionProps {
    currentTask: any; // Task에 맞춰서 추후 정의
    onUpdateCurrentTask: (task: any) => void; // Task에 맞춰서 추후 정의
    selectedProject: Project | null;
    onTaskPathClick: (taskId: string) => void;
}

const MainSection: React.FC<MainSectionProps> = ({
    currentTask,
    onUpdateCurrentTask,
    selectedProject,
    onTaskPathClick,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [showMarkdown, setShowMarkdown] = useState(true);
    const [newTaskData, setNewTaskData] = useState({
        projectId: "3148412e-1a62-46dc-97b2-b84a27eaffe8",
        parentId: "1268c369-9f46-44f4-b3f9-0c0f14f25cd9",
        isKanban: false,
        title: "",
        description: "",
        type: "GRAPH",
        start: "",
        deadline: "",
    });

    const handleAddTask = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_HOST}/task/create`, newTaskData, {
                headers: { Authorization: localStorage.getItem("access-token") },
            });
            console.log("Task created:", res.data);
            // Perform any necessary action after task creation
            // For example, update the task list
            // onUpdateTaskList(res.data);
            handleModalClose();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleTaskPathClick = (taskId: string) => {
        onTaskPathClick(taskId);
    };

    const toggleMarkdownVisibility = () => {
        setShowMarkdown((prevValue) => !prevValue);
    };

    return (
        <div className={styles.mainSection}>
            <div className={styles.projectInfoContainer}>
                {selectedProject && (
                    <React.Fragment>
                        <img
                            src={`data:image/png;base64,${selectedProject.encodedImg}`}
                            alt="Project Image"
                            className={styles.projectImage}
                        />
                        <div className={styles.projectInfo}>
                            <div className={styles.projectTitle}>{selectedProject.title}</div>
                            <p>{selectedProject.description}</p>
                            <div className={styles.pathContainer}>
                                Render the path here
                                {/* Example: */}
                                {selectedProject.parentTasks?.map((task) => (
                                    <p
                                        key={task.id}
                                        onClick={() => handleTaskPathClick(task.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {task.title}
                                    </p>
                                ))}
                                <button className={styles.toggleMarkdownButton} onClick={toggleMarkdownVisibility}>
                                    {showMarkdown ? "-" : "+"}
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>
            <div className={styles.taskContainer}>
                {showMarkdown && <MarkDown />} {/* Render MarkDown component only when showMarkdown is true */}
                {currentTask && (
                    <div>
                        {currentTask.type === "network" && <Network />}
                        {currentTask.type === "kanban" && <Kanban />}
                        {currentTask.type === "tasklist" && <TaskList />}
                    </div>
                )}
            </div>
            <div
                className={styles.addTaskButton}
                style={{
                    position: "fixed",
                    bottom: "10px",
                    right: "25%",
                    zIndex: "999",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#f2f2f2",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    cursor: "pointer",
                }}
                onClick={handleAddTask}
            >
                <AddIcon />
            </div>

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

export default MainSection;
