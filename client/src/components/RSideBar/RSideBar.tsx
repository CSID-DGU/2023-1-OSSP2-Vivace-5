import React, { useState } from "react";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import Tab4 from "./Tab4";
import Tab5 from "./Tab5";
import "./RSideBar.css";

// 탭 버튼의 데이터를 정의합니다.
interface TabButton {
    id: string;
    label: string;
}

const tabButtons: TabButton[] = [
    { id: "tab1", label: "T1" },
    { id: "tab2", label: "T2" },
    { id: "tab3", label: "T3" },
    { id: "tab4", label: "T4" },
    { id: "tab5", label: "T5" },
    // 필요한 만큼의 탭 버튼을 정의합니다.
];

const RSideBar: React.FC = () => {
    const [activeTab, setActiveTab] = useState(tabButtons[0].id); // 초기값은 첫 번째 탭 버튼의 id

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case "tab1":
                return <Tab1 />;
            case "tab2":
                return <Tab2 />;
            case "tab3":
                return <Tab3 />;
            case "tab4":
                return <Tab4 />;
            case "tab5":
                return <Tab5 />;
            // 필요한 만큼의 탭 컴포넌트를 렌더링합니다.
            default:
                return null;
        }
    };

    return (
        <div>
            <ul className="sidebar">
                {tabButtons.map((button) => (
                    <li
                        key={button.id}
                        className={activeTab === button.id ? "active" : ""}
                        onClick={() => handleTabClick(button.id)}
                    >
                        {button.label}
                    </li>
                ))}
            </ul>
            <div className="content">{renderActiveTabContent()}</div>
        </div>
    );
};

export default RSideBar;
