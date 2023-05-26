import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./LSideBar.css";
import { API_HOST } from "../../config/constants";
import axios, { AxiosResponse } from "axios";
import { Avatar } from "antd";

interface Project {
    id: number;
    name: string;
}

interface User {
    name: string;
    email: string;
    profileImage: string;
}

const LSidebar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userInfo, setUserInfo] = useState({ name: "", email: "", profileImage: "" });

    async function getUserData(): Promise<void> {
        try {
            const res: AxiosResponse = await axios.get(`${API_HOST}user/info`, {
                headers: { Authorization: localStorage.getItem("access-token") },
            });

            if (res.status === 200) {
                const {
                    id,
                    firstName,
                    lastName,
                    email,
                    year,
                    month,
                    date,
                    belong,
                    country,
                    region,
                    encodedImg,
                    createdAt,
                } = res.data;

                setUserInfo({ name: firstName + lastName, email, profileImage: encodedImg });
                console.log(userInfo);
            } else {
                console.log("error!!");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error);
            }
        }
    }

    getUserData();

    const projects: Project[] = [
        { id: 1, name: "Project 1" },
        { id: 2, name: "Project 2" },
        { id: 3, name: "Project 3" },
    ];

    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };

    return (
        <div className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
            <div className="content">
                <div className="profile">
                    <div className="profileImageContainer">
                        <Avatar src={userInfo.profileImage} size={40} />
                    </div>

                    <div className="userInfo">
                        <div className="userName">
                            {userInfo.name}
                            <br />
                            <div className="userEmail">{userInfo.email}</div>
                        </div>
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="프로젝트 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul className="project-list">
                    {filteredProjects.map((project) => (
                        <li key={project.id} onClick={() => console.log(project.id)}>
                            {project.name}
                        </li>
                    ))}
                </ul>
                <button className="add-project-button">Add Project</button>
            </div>
        </div>
    );
};

export default LSidebar;
