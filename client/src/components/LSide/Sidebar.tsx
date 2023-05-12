import React, { useState } from "react";
import Profile from "./Profile";
import ProjectList from "./ProjectList";
import "./Sidebar.css";

type SidebarProps = {
    children: React.ReactNode;
};

const projects = [
    { id: 1, name: "Project A", description: "This is project A." },
    { id: 2, name: "Project B", description: "This is project B." },
    { id: 3, name: "Project C", description: "This is project C." },
];

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(200);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isResizing) {
            return;
        }

        const sidebar = event.currentTarget;
        const maxWidth = window.innerWidth * 0.8;
        const x = event.pageX - sidebar.parentElement!.getBoundingClientRect().left;
        const newWidth = Math.max(100, Math.min(maxWidth, x));

        setWidth(newWidth);
    };

    return (
        <div
            className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
            style={{ width }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="sidebar-resizer" onMouseDown={handleMouseDown} />
            <Profile imageUrl="https://example.com/profile-image.png" name="John Doe" email="johndoe@example.com" />

            <ProjectList projects={projects} onToggle={handleToggle} />
            <div className="content">{children}</div>
        </div>
    );
};

export default Sidebar;
