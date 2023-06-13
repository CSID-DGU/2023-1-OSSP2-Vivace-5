import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { API_HOST } from "../../../config/constants";
import axios, { AxiosResponse } from "axios";
import styles from "./MainPage.module.css";
import LSideBar from "../../LSideBar/LSideBar";
import RSideBar from "../../RSideBar/RSideBar";
import MainSection from "../MainSect/MainSect";
import { Task, Project } from "../Data";

const MainPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [currentTask, setCurrentTask] = useState<Task | null>(null); // Task에 맞춰서 추후 정의

    const handleToggleSidebar = () => {
        setSidebarOpen((prevState) => !prevState);
    };

    const handleProjectClick = async (projectId: string) => {
        try {
            console.log("handleProjectClick");
            const res: AxiosResponse = await axios.get(`${API_HOST}/project/${projectId}`, {
                headers: { Authorization: localStorage.getItem("access-token") },
            });

            console.log("handleProjectClick");
            console.log("res:", res.status);

            if (res.status === 200) {
                const projectData: Project = res.data;
                setSelectedProject(projectData);
                setCurrentTask({ ...projectData.tasks[0], project: projectData });
            } else {
                console.log("error");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("error");
            }
        }
    };

    const handleUpdateCurrentTask = (task: any) => {
        setCurrentTask(task);
    };

    return (
        <div className={`${styles.mainPage} ${!sidebarOpen ? styles.sidebarClosed : ""}`}>
            {sidebarOpen && <LSideBar onProjectClick={handleProjectClick} />}
            <button className={styles.toggleButton} onClick={handleToggleSidebar}>
                {sidebarOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
            </button>

            <div className={styles.mainSection}>
                <MainSection
                    currentTask={currentTask}
                    onUpdateCurrentTask={handleUpdateCurrentTask}
                    selectedProject={selectedProject}
                    onTaskPathClick={function (taskId: string): void {
                        throw new Error("Function not implemented.");
                    }}
                />
            </div>
            {/* <RSideBar /> */}
        </div>
    );
};

export default MainPage;
