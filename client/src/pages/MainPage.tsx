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
<<<<<<< HEAD
        <div className={`main-page ${sidebarOpen ? "" : "sidebar-closed"}`}>
=======
        <div className="main-page">
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
            {sidebarOpen && <LSideBar />}
            <button className="toggle-button" onClick={handleToggleSidebar}>
                {sidebarOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
            </button>
<<<<<<< HEAD
            <div className="MainSection">
                <MainSection />
            </div>
            <RSideBar />
=======
            <MainSection />
            {/* <RSideBar /> */}
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
        </div>
    );
};

export default MainPage;
