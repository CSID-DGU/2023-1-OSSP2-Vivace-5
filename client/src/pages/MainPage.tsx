import React, { useState } from "react";
import LSideBar from "../components/LSideBar/LSideBar";
import MainSection from "../components/MainSect/MainSect";
import "./MainPage.css";

const MainPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setSidebarOpen((prevState) => !prevState);
    };

    return (
        <div className="main-page">
            {sidebarOpen && <LSideBar />}
            <button className="toggle-button" onClick={handleToggleSidebar}>
                토글
            </button>
            <MainSection />
        </div>
    );
};

export default MainPage;
