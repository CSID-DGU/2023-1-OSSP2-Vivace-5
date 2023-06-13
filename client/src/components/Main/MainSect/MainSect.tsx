import React, { ChangeEvent, useState } from "react";
import MarkDown from "../MarkDown/MarkDown";
import Network from "../Network/Network";
import Kanban from "../Kanban/Kanban";
import TaskList from "../TaskList/TaskList";
import AddIcon from "@mui/icons-material/Add";
import styles from "./MainSect.module.css";
import axios from "axios";
import { API_HOST } from "../../../config/constants";
import { Project, Task } from "../Data";

interface MainSectionProps {
    currentTask?: Task | null;
    onUpdateCurrentTask: (task: Task) => void;
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
            {selectedProject && (
                <div className={styles.projectInfoContainer}>
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
                                {/* {selectedProject.parentTasks?.map((task) => (
                                    <p
                                        key={task.id}
                                        onClick={() => handleTaskPathClick(task.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {task.title}
                                    </p>
                                ))} */}
                                <button className={styles.toggleMarkdownButton} onClick={toggleMarkdownVisibility}>
                                    {showMarkdown ? "-" : "+"}
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                </div>
            )}
            <div className={styles.taskContainer}>
                {showMarkdown && currentTask && <MarkDown currentTask={currentTask} />}{" "}
                {/* Render MarkDown component only when showMarkdown is true and currentTask exists */}
                {currentTask && (
                    <div>
                        {currentTask.type === "network" && <Network currentTask={currentTask} />}
                        {currentTask.type === "kanban" && (
                            <Kanban currentTask={currentTask} projectId={selectedProject?.id || ""} />
                        )}
                        {currentTask.type === "tasklist" && <TaskList currentTask={currentTask} />}
                    </div>
                )}
            </div>
            {/* ... */}
        </div>
    );
};

export default MainSection;
