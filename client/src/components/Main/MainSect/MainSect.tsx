import React from "react";
import MarkDown from "../MarkDown/MarkDown";
import Network from "../Network/Network";
import Kanban from "../Kanban/Kanban";
import TaskList from "../TaskList/TaskList";
import AddIcon from "@mui/icons-material/Add";
import styles from "./MainSect.module.css";

interface MainSectionProps {
    currentTask: any; // Task에 맞춰서 추후 정의
    onUpdateCurrentTask: (task: any) => void; // Task에 맞춰서 추후 정의
}

const MainSection: React.FC<MainSectionProps> = ({ currentTask, onUpdateCurrentTask }) => {
    const handleAddTask = () => {
        console.log("Add Task 버튼 클릭");
    };

    // switch로 currentTask의 type에 따라 다른 컴포넌트를 렌더링
    const renderComponent = () => {
        if (currentTask) {
            switch (currentTask.type) {
                case "markdown":
                    return <MarkDown />;
                case "network":
                    return <Network />;
                case "kanban":
                    return <Kanban />;
                case "tasklist":
                    return <TaskList />;
                default:
                    return null;
            }
        }
        return null;
    };

    return (
        <div className={styles.mainSection}>
            {renderComponent()}
            <div
                className={styles.addTaskButton}
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
};

export default MainSection;
