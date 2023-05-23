import Kanban from "../Main/Kanban";
import Network from "../Main/Network";
import TaskList from "../Main/TaskList";
import MarkDown from "../Main/MarkDown";
import AddIcon from "@mui/icons-material/Add";
import React from "react";

function MainSection() {
    const handleAddTask = () => {
        console.log("Add Task 버튼 클릭");
    };

    return (
        <div className="main-section">
            {/* <Network /> */}
            <Kanban />
            {/* <TaskList />*/}
            {/* <MarkDown /> */}
            <div
                className="add-task-button"
                style={{
                    position: "fixed",
                    bottom: "10px",
                    right: "25%",
                    zIndex: "999",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#f2f2f2",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    cursor: "pointer",
                }}
                onClick={handleAddTask}
            >
                <AddIcon />
            </div>
        </div>
    );
}

export default MainSection;
