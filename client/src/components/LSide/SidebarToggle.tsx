import React from "react";
import "./SidebarToggle.css";

type SidebarToggleProps = {
    onClick: () => void;
};

const SidebarToggle: React.FC<SidebarToggleProps> = ({ onClick }) => {
    return (
        <button className="sidebar-toggle" onClick={onClick}>
            <svg viewBox="0 0 24 24">
                <path d="M3 5h18v2H3zM3 11h18v2H3zM3 17h18v2H3z" />
            </svg>
        </button>
    );
};

export default SidebarToggle;
