import React, { useState } from "react";
import ProjectListItem from "./ProjectListItem";
import "./ProjectList.css";

type Project = {
    id: number;
    name: string;
    description: string;
};

type ProjectListProps = {
    projects: Project[];
    onToggle: () => void;
};

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
    const [openProjectId, setOpenProjectId] = useState<number | null>(null);

    const handleProjectToggle = (projectId: number) => {
        setOpenProjectId((prevId) => (prevId === projectId ? null : projectId));
    };

    return (
        <div className="project-list">
            <h3>Projects</h3>
            <ul>
                {projects.map((project) => (
                    <ProjectListItem
                        key={project.id}
                        project={project}
                        isOpen={openProjectId === project.id}
                        onToggle={() => handleProjectToggle(project.id)}
                    />
                ))}
            </ul>
            <button onClick={() => console.log("Add project")}>Add Project</button>
        </div>
    );
};

export default ProjectList;
