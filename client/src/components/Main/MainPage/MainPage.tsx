import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./MainPage.css";
import LSideBar from "../../LSideBar/LSideBar";
import RSideBar from "../../RSideBar/RSideBar";
import MainSection from "../MainSect/MainSect";

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
