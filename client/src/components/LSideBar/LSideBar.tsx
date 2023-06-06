import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./LSideBar.module.css";
import { API_HOST } from "../../config/constants";
import axios, { AxiosResponse } from "axios";
import { Avatar } from "antd";
import { Link, useNavigate } from "react-router-dom";

interface Project {
    id: string;
    title: string;
    description: string;
    type: string;
    encodedImg: string;
    userToProjects: {
        right: string;
    };
}

interface User {
    name: string;
    email: string;
    profileImage: string;
}

interface MainPageProps {
    onProjectClick: (projectId: string) => void;
}

const LSidebar: React.FC<MainPageProps> = ({ onProjectClick }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userInfo, setUserInfo] = useState<User>({
        name: "",
        email: "",
        profileImage: "",
    });
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        getUserData();
        getProjects();
    }, []);

    console.log(userInfo);
    console.log(projects);

    async function getUserData(): Promise<void> {
        try {
            console.log("getUserData() 실행");
            console.log(localStorage.getItem("access-token"));
            const res: AxiosResponse = await axios.get(`${API_HOST}/user/info`, {
                headers: { Authorization: localStorage.getItem("access-token") },
            });

            console.log("res.status: ", res.status);

            if (res.status === 200) {
                const { firstName, lastName, email, encodedImg } = res.data;

                setUserInfo({
                    name: firstName + lastName,
                    email: email,
                    profileImage: encodedImg,
                });
                console.log(userInfo);
            } else {
                console.log("error");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("error");
            }
        }
    }

    async function getProjects(): Promise<void> {
        try {
            const res: AxiosResponse = await axios.get(`${API_HOST}/project`, {
                headers: { Authorization: localStorage.getItem("access-token") },
            });

            if (res.status === 200) {
                const projectsData: Project[] = res.data;
                setProjects(projectsData);
            } else {
                console.log("error");
            }
        } catch (error) {
            if (axios.isAxiosError("error")) {
                console.log("error");
            }
        }
    }

    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };

    return (
        <div className={`${styles.sidebar} ${isSidebarOpen ? "" : styles.closed}`}>
            <div className={styles.content}>
                <div className={styles.profile}>
                    <div className={styles.profileImageContainer}>
                        <Avatar src={userInfo.profileImage} size={40} />
                    </div>

                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {userInfo.name}
                            <br />
                            <div className={styles.userEmail}>{userInfo.email}</div>
                        </div>
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="프로젝트 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul className={styles.projectList}>
                    {filteredProjects.map((project) => (
                        <div
                            className={styles.liProject}
                            key={project.id}
                            onClick={() => {
                                onProjectClick(project.id);
                                console.log(project.id);
                            }}
                        >
                            {project.title}
                        </div>
                    ))}
                </ul>
                <Link to="/create/project">
                    <button className={styles.addProjectButton}>Add Project</button>
                </Link>
            </div>
        </div>
    );
};

export default LSidebar;
