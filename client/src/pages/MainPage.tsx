import React, { useState } from "react";
import Sidebar from "../components/LSide/Sidebar";
import UserInformation from "../components/LSide/UserInformation";
import ProjectList from "../components/LSide/ProjectList";
import AddProject from "./AddProject";
import MainSection from "../components/MainSect/MainSect";
import "../components/LSide/Sidebar.css";
import "../components/LSide/ProjectList.css";
import "../components/LSide/Profile.css";
import "../components/LSide/ProjectListItem.css";
import "../components/LSide/SidebarToggle.css";

type Project = {
    id: number;
    title: string;
    description: string;
};

const MainPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([
        { id: 1, title: "Project 1", description: "Description 1" },
        { id: 2, title: "Project 2", description: "Description 2" },
    ]);

    const handleAddProject = (title: string, description: string) => {
        const newProject = {
            id: Date.now(),
            title,
            description,
        };
        setProjects((prevProjects) => [...prevProjects, newProject]);
    };

    return (
        <div className="main-page">
            <Sidebar>
                <UserInformation
                    profileImage="https://example.com/profile-image.png"
                    username="John Doe11"
                    email="johndoe@example.com"
                />
            </Sidebar>
            <MainSection />
        </div>
    );
};

export default MainPage;
