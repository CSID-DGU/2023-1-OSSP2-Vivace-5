import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./LSideBar.css";

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

    const user: User = {
        name: "John Doe",
        email: "johndoe@example.com",
        profileImage: "path/to/profile/image.jpg",
    };

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
<<<<<<< HEAD
                        <AccountCircleIcon sx={{ fontSize: 40 }} />
                    </div>

                    <div className="userInfo">
                        <div className="userName">
                            {user.name}
                            <br />
                            <div className="userEmail">{user.email}</div>
                        </div>
=======
                        <AccountCircleIcon className="profileImage" fontSize="large" />
                    </div>

                    <div className="userInfo">
                        <div className="userName">{user.name}</div>
                        <div className="userEmail">{user.email}</div>
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
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
<<<<<<< HEAD
                        <li key={project.id} onClick={() => console.log(project.id)}>
                            {project.name}
                        </li>
=======
                        <li key={project.id}>{project.name}</li>
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
                    ))}
                </ul>
                <button className="add-project-button">Add Project</button>
            </div>
        </div>
    );
};

export default LSidebar;
