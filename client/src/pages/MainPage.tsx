import React, { useState } from "react";
import LSideBar from "../components/LSideBar/LSideBar";
import MainSection from "../components/MainSect/MainSect";
import RSideBar from "../components/RSideBar/RSideBar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./MainPage.css";

const MainPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setSidebarOpen((prevState) => !prevState);
    };

    return (
        <div className={`main-page ${sidebarOpen ? "" : "sidebar-closed"}`}>
            {sidebarOpen && <LSideBar />}
            <button className="toggle-button" onClick={handleToggleSidebar}>
                {sidebarOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
            </button>
            <div className="MainSection">
                <MainSection />
            </div>
            <RSideBar />
        </div>
    );
};

export default MainPage;
