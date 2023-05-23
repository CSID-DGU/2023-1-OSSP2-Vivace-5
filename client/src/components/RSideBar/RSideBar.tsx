<<<<<<< HEAD
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import "./RSideBar.css";

const Sidebar = () => {
    const [value, setValue] = React.useState("one");
    const [inviteList, setInviteList] = React.useState<
        {
            userName: string;
            projectName: string;
            projectID: string;
        }[]
    >([]);
    const [userList, setUserList] = React.useState<
        {
            userEmail: string;
            userId: string;
            userName: string;
        }[]
    >([]);
    const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(null);
    const [bookmarks, setBookmarks] = React.useState<string[]>([]);
    const [milestones, setMilestones] = React.useState<string[]>([]);
    const [tasks, setTasks] = React.useState<{
        todo: string[];
        progress: string[];
        done: string[];
    }>({
        todo: [],
        progress: [],
        done: [],
    });
    const [commentList, setCommentList] = React.useState<
        {
            userId: string;
            userName: string;
            commentId: string;
            comment: string;
            time: string;
        }[]
    >([]);

    React.useEffect(() => {
        // API 호출을 통해 사용자 이름, 프로젝트 이름, 프로젝트 ID, 유저 리스트, 북마크, 마일스톤, 댓글 리스트 가져오기
        // 예시: fetchData()
        // fetchData()
        //   .then((data) => {
        //     setInviteList(data.inviteList);
        //     setUserList(data.userList);
        //     setBookmarks(data.bookmarks);
        //     setMilestones(data.milestones);
        //     setCommentList(data.commentList);
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching data:", error);
        //   });

        // 임시 데이터 예시
        const data = {
            inviteList: [
                { userName: "John Doe", projectName: "Sample Project", projectID: "123" },
                { userName: "Jane Smith", projectName: "Another Project", projectID: "456" },
            ],
            userList: [
                { userId: "1", userName: "User 1", userEmail: "user1@example.com" },
                { userId: "2", userName: "User 2", userEmail: "user2@example.com" },
                { userId: "3", userName: "User 3", userEmail: "user3@example.com" },
            ],
            bookmarks: ["Task 1", "Task 2", "Task 3"],
            milestones: ["Task 4", "Task 5"],
            tasks: {
                todo: ["Task 1", "Task 2", "Task 3"],
                progress: ["Task 4", "Task 5"],
                done: ["Task 6", "Task 7"],
            },
            commentList: [
                {
                    userId: "1",
                    userName: "User 1",
                    commentId: "1",
                    comment: "Comment 1",
                    time: "12:34 PM",
                },
                {
                    userId: "2",
                    userName: "User 2",
                    commentId: "2",
                    comment: "Comment 2",
                    time: "01:23 PM",
                },
            ],
        };
        setInviteList(data.inviteList);
        setUserList(data.userList);
        setBookmarks(data.bookmarks);
        setMilestones(data.milestones);
        setTasks(data.tasks);
        setCommentList(data.commentList);
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleMemberClick = (memberId: string) => {
        setSelectedMemberId(memberId);
    };

    const handleAcceptInvite = (projectID: string) => {
        console.log("Accepted invite for project ID:", projectID);
        // Perform necessary actions for accepting the invite
    };

    const handleDeclineInvite = (projectID: string) => {
        console.log("Declined invite for project ID:", projectID);
        // Perform necessary actions for declining the invite
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Tabs
                    orientation="horizontal"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="sidebar tabs"
                    sx={{ marginBottom: "16px" }}
                >
                    <Tab value="one" icon={<NotificationsActiveRoundedIcon />} sx={{ minWidth: "7px" }} />
                    <Tab value="two" icon={<AccountCircleRoundedIcon />} sx={{ minWidth: "7px" }} />
                    <Tab value="three" icon={<StarRoundedIcon />} sx={{ minWidth: "7px" }} />
                    <Tab value="four" icon={<RouteRoundedIcon />} sx={{ minWidth: "7px" }} />
                    <Tab value="five" icon={<CommentRoundedIcon />} sx={{ minWidth: "7px" }} />
                </Tabs>
                <Box sx={{ flexGrow: 1, padding: "16px" }}>
                    {value === "one" && (
                        <div>
                            {inviteList.map((invite) => (
                                <div key={invite.projectID} className="notifi">
                                    <div className="inviteText">
                                        <AccountCircleRoundedIcon sx={{ fontSize: 50 }} />
                                        <div className="inviteInfo">
                                            {invite.userName} invited
                                            <br />
                                            you to {invite.projectName}
                                        </div>
                                    </div>
                                    <div className="inviteButtons">
                                        <button
                                            className="acceptButton"
                                            onClick={() => handleAcceptInvite(invite.projectID)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="declineButton"
                                            onClick={() => handleDeclineInvite(invite.projectID)}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {value === "two" && (
                        <div>
                            {userList.map((user) => (
                                <div
                                    className="notifi"
                                    key={user.userId}
                                    onClick={() => handleMemberClick(user.userId)}
                                >
                                    <div className="profile">
                                        <div className="userProfile">
                                            <AccountCircleRoundedIcon sx={{ fontSize: 40 }} />
                                        </div>
                                        <div className="userInfo">
                                            <div className="userName">{user.userName}</div>
                                            <div className="userEmail">{user.userEmail}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {selectedMemberId && <div>Selected Member ID: {selectedMemberId}</div>}
                        </div>
                    )}

                    {value === "three" && (
                        <div>
                            <div className="kanban-board">
                                <div className="column">
                                    <div className="column-header">BookMark</div>
                                    {bookmarks.map((task, index) => (
                                        <div className="task" key={index}>
                                            {task}
                                        </div>
                                    ))}
                                </div>
                                <div className="column">
                                    <div className="column-header">MileStone</div>
                                    {milestones.map((task, index) => (
                                        <div className="task" key={index}>
                                            {task}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {value === "four" && (
                        <div>
                            <div className="kanban-board">
                                <div className="column">
                                    <div className="column-header">To-do</div>
                                    {tasks.todo.map((task, index) => (
                                        <div className="task" key={index}>
                                            {task}
                                        </div>
                                    ))}
                                </div>
                                <div className="column">
                                    <div className="column-header">Progress</div>
                                    {tasks.progress.map((task, index) => (
                                        <div className="task" key={index}>
                                            {task}
                                        </div>
                                    ))}
                                </div>
                                <div className="column">
                                    <div className="column-header">Done</div>
                                    {tasks.done.map((task, index) => (
                                        <div className="task" key={index}>
                                            {task}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {value === "five" && (
                        <div>
                            {commentList.map((comment) => (
                                <div key={comment.commentId} className="comment">
                                    <div className="commentHeader">
                                        <AccountCircleRoundedIcon sx={{ fontSize: 40 }} />
                                        <div className="commentInfo">
                                            <div className="commentUser">{comment.userName}</div>
                                        </div>
                                    </div>
                                    <div className="commentContent">
                                        <div className="commentText">{comment.comment}</div>
                                    </div>
                                    <div className="commentTime">{comment.time}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Sidebar;
=======
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
>>>>>>> 28ce7fecb7cc171cf3ecdbd8aef06c30d425d2d4
