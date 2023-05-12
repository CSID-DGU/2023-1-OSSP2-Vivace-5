import React from "react";
import "./ProjectListItem.css";

type Project = {
    id: number;
    name: string;
    description: string;
};

type ProjectItemProps = {
    project: Project;
    isOpen: boolean;
    onToggle: () => void;
};

const ProjectItem: React.FC<ProjectItemProps> = ({ project, isOpen, onToggle }) => {
    return (
        <li className="project-item">
            <div className="project-header" onClick={onToggle}>
                <h4>{project.name}</h4>
                <button>{isOpen ? "-" : "+"}</button>
            </div>
            {isOpen && (
                <div className="project-details">
                    <p>{project.description}</p>
                </div>
            )}
        </li>
    );
};

export default ProjectItem;
