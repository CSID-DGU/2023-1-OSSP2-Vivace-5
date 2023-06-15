import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import {
  API_HOST,
  MAIN_DASHBOARD_PATH,
  MAIN_PATH,
  MAIN_PROJECT_PATH,
  OK_RESPONCE,
  PROJECT_MANAGE_PATH,
} from "../constants";
import { SubTask } from "../Enum/SubTask.enum";
import { Avatar, Box, Divider, IconButton, InputBase, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { BriefMemberInfoType } from "../types/MemberInfo.type";
import MemberProfile from "./MemberProfile";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import { UserInfoType } from "../types/UserInfo.type";
import { Right } from "../Enum/Right.enum";
import { BriefTaskInfoType } from "../types/BriefTaskInfo.typs";
import ProjectInnerSidebar from "./ProjectInnerSidebar";
import { BookmarkListItemType } from "../types/BookmarkListItem.type";
import { ProjectInfoType } from "../types/ProjectInfo.type";
import TaskContent from "./TaskContent";

const MaxShowedMemberCount = 5;

type ProjectProps = {
  userInfo: UserInfoType;
  setIsCollapsed: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const Task: React.FC<ProjectProps> = (props) => {
  /* STATES */
  const [dummyState, setDummyState] = useState<object>({});
  const [userRight, setUserRight] = useState<Right>(Right.ADMIN);
  const [isTitleEdit, setIsTitleEdit] = useState<boolean>(false);
  const [isDescriptionEdit, setIsDescriptionEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isBookmarked, setIsBookmarked] = useState<boolean>(true);
  const [bookmarkList, setBookmarkList] = useState<BookmarkListItemType[]>([]);
  const [taskInfo, setTaskInfo] = useState<Record<string, any> | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoType>({
    title: "",
    description: "",
    type: SubTask.GRAPH,
    encodedImg: "",
    createdAt: new Date(),
    members: [],
    tasks: [],
    comments: [],
  });

  /* PARAMS */
  const params = useParams();
  const projectId = params.projectId as string;
  const taskId = params.taskId as string;

  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* USE NAVIGATE */
  const navigate = useNavigate();

  /* USE_EFFECT */
  useEffect(() => {
    props.setIsCollapsed(true);
  }, []);

  useEffect(() => {
    getProjectInfo();
    getBookmarkList();
    getTaskInfo();
  }, [props, dummyState]);

  /* USE_REF */
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* FUNCTIONS */
  const getProjectInfo = async () => {
    props.setIsLoading(true);

    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/project/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      props.setIsLoading(false);

      if (res.status === OK_RESPONCE) {
        const members = new Array<BriefMemberInfoType>();
        for (const userToProjects of res.data.userToProjects) {
          const member: BriefMemberInfoType = {
            id: userToProjects.user.id,
            firstName: userToProjects.user.firstName,
            lastName: userToProjects.user.lastName,
            email: userToProjects.user.email,
            encodedImg: userToProjects.user.encodedImg,
            isBookmarked: userToProjects.isBookmarked,
            right: userToProjects.right,
          };

          if (member.id === props.userInfo.id) {
            setUserRight(member.right);
          }

          members.push(member);
        }

        const taskInfos: BriefTaskInfoType[] = [];

        for (const task of res.data.tasks) {
          taskInfos.push({
            id: task.id,
            title: task.title,
            description: task.description,
            type: task.type,
            milestone: task.milestone,
            isFinished: task.isFinished,
            isBookmarked: task.bookmarks.length > 0,
            rate: task.rate,
            predecessors: task.predecessors,
            successors: task.successors,
          });
        }

        const recievedInfo: ProjectInfoType = {
          title: res.data.title,
          description: res.data.description,
          type: res.data.type,
          encodedImg: res.data.encodedImg,
          createdAt: new Date(res.data.createdAt),
          members: members,
          tasks: taskInfos,
          comments: res.data.comments,
        };

        setProjectInfo(recievedInfo);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get information of ${projectId}..`);
        props.setIsLoading(false);
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  const getBookmarkList = async () => {
    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/task/all/bookmarks/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        const bookmarkListRecived = [];

        for (const item of res.data) {
          bookmarkListRecived.push({
            id: item.id,
            title: item.title,
            taskId: item.taskId,
            children: item.children,
          });
        }

        setBookmarkList(bookmarkListRecived);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get bookmark list of ${projectId}..`);
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  const getTaskInfo = async () => {
    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/task/${taskId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        const children = [];

        for (const child of res.data.children) {
          const childTask = {
            id: child.id,
            title: child.title,
            description: child.description,
            type: child.type,
            milestone: child.milestone,
            isFinished: child.isFinished,
            isBookmarked: child.bookmarks.length > 0,
            rate: child.rate,
            predecessors: child.predecessors,
            successors: child.successors,
          };

          children.push(childTask);
        }

        setTaskInfo({ ...res.data, children });
        setTitle(res.data.title);
        setDescription(res.data.description);
        setIsBookmarked(res.data.bookmarks.length > 0);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get task infomation of ${taskId}..`);
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  const forceRerenderingProject = () => {
    setDummyState({});
  };

  /* HANDLERS */
  const handleTitleEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    const newTitle = event.currentTarget.value;

    if (newTitle === "") {
      setTitle(projectInfo.title);
      setIsTitleEdit(false);
      return;
    }

    if (newTitle === projectInfo.title) {
      setIsTitleEdit(false);
      return;
    }

    try {
      props.setIsLoading(true);

      const res = await axios.patch(
        `${API_HOST}/project/update/title/${projectId}`,
        { newTitle },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      props.setIsLoading(false);

      if (res.status === OK_RESPONCE) {
        setProjectInfo({
          ...projectInfo,
          title: newTitle,
        });
        setIsTitleEdit(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to update title of project ${projectId}..`);
        props.setIsLoading(false);
        setIsTitleEdit(false);
        setTitle(projectInfo.title);
      }
    }
  };

  const handleDescriptionEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    const newDescription = event.currentTarget.value;

    if (newDescription === projectInfo.description) {
      setIsDescriptionEdit(false);
      return;
    }

    try {
      props.setIsLoading(true);

      const res = await axios.patch(
        `${API_HOST}/project/update/description/${projectId}`,
        { newDescription },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      props.setIsLoading(false);

      if (res.status === OK_RESPONCE) {
        setProjectInfo({
          ...projectInfo,
          description: newDescription,
        });
        setIsDescriptionEdit(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to update description of project ${projectId}..`);
        props.setIsLoading(false);
        setIsDescriptionEdit(false);
        setDescription(projectInfo.description);
      }
    }
  };

  const handleBookmarkToggleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const res = await axios.patch(
        `${API_HOST}/project/update/bookmark/${projectId}`,
        { bookmarkStatus: !projectInfo.members.filter((member) => member.id === props.userInfo.id)[0].isBookmarked },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        getBookmarkList();
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to update icon of project ${projectId}..`);
      }
    }
  };

  return projectInfo && taskInfo ? (
    <Box m="20px" display="flex" flexDirection="row" justifyContent="start" height="calc(100vh - 120px)">
      <Box display="flex" flexDirection="column" justifyContent="start" width="40%">
        {/* HEADER */}
        <Box margin="10px" bgcolor={colors.primary[400]} p="20px" borderRadius="8px">
          <Box display="flex" flexDirection="row" justifyContent="space-between" mb="15px">
            <Box display="flex" justifyContent="start">
              <Box display="flex" flexDirection="column" justifyContent="center">
                {/* TITLE */}
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  {isTitleEdit ? (
                    <InputBase
                      sx={{
                        mb: "10px",
                        ml: "10px",
                        display: "inline",
                        color: colors.grey[100],
                        fontWeight: "bold",
                        fontSize: "24px",
                      }}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyUp={handleTitleEnter}
                    />
                  ) : (
                    <Typography
                      variant="h3"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ mb: "10px", ml: "10px", display: "inline" }}
                    >
                      {taskInfo.title}
                    </Typography>
                  )}
                  <Box m="-5px 0 0 10px" display="flex" justifyContent="center" alignItems="center">
                    <IconButton
                      onClick={() => setIsTitleEdit(true)}
                      disabled={userRight === Right.COMPLETION_MOD || userRight === Right.MEMBER_MGT}
                    >
                      <ModeEditOutlinedIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* BOOKMARK TOGGLE */}
            <Box display="flex" flex="column" justifyContent="center">
              <IconButton onClick={handleBookmarkToggleClick}>
                {isBookmarked ? (
                  <StarOutlinedIcon sx={{ fontSize: "30px" }} />
                ) : (
                  <StarOutlineOutlinedIcon sx={{ fontSize: "30px" }} />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* DESCRIPTION */}
          <Box display="flex" flexDirection="row" justifyContent="start" m="10px 0">
            {isDescriptionEdit ? (
              <InputBase
                sx={{
                  mb: "10px",
                  ml: "10px",
                  color: colors.greenAccent[400],
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "100%",
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyUp={handleDescriptionEnter}
              />
            ) : (
              <Typography
                variant="h5"
                color={colors.greenAccent[400]}
                fontWeight="bold"
                sx={{ mb: "10px", ml: "10px", display: "inline" }}
              >
                {taskInfo.description}
              </Typography>
            )}
            <Box m="-5px 0 0 10px" display="flex" justifyContent="center" alignItems="center">
              <IconButton
                onClick={() => setIsDescriptionEdit(true)}
                disabled={userRight === Right.COMPLETION_MOD || userRight === Right.MEMBER_MGT}
              >
                <ModeEditOutlinedIcon sx={{ fontSize: "12px" }} />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ backgroundColor: colors.grey[100], borderBottomWidth: "2px" }} />

          {/* MEMBERS */}
          <Box display="flex" flexDirection="row" justifyContent="start" m="10px 0 0 0">
            {taskInfo.members
              .slice(0, MaxShowedMemberCount > taskInfo.members.length ? taskInfo.members.length : MaxShowedMemberCount)
              .map((member: any) => {
                return (
                  <MemberProfile
                    id={member.id}
                    encodedImg={member.encodedImg}
                    size={30}
                    margin={8}
                    right={member.userToProjects[0].right}
                  />
                );
              })}
            <Box margin="8px" display="flex" justifyContent="center" alignItems="center">
              <IconButton onClick={() => navigate(MAIN_PATH + `/task/manage/:${projectId}/${taskId}`)}>
                <MoreHorizOutlinedIcon sx={{ fontSize: "24px" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* INNER SIDEBAR */}
        <ProjectInnerSidebar
          projectId={projectId}
          members={projectInfo.members}
          bookmarkList={bookmarkList}
          forceRerenderingProject={forceRerenderingProject}
        />
      </Box>

      {/* TASK CONTENT */}
      <TaskContent
        isMember={Boolean(taskInfo.members.find((ele: any) => ele.id === props.userInfo.id))}
        right={userRight}
        tasks={taskInfo.children}
        forceRerenderingProject={forceRerenderingProject}
        projectId={projectId}
        parentId={taskId}
        bookmarkList={bookmarkList}
        setIsLoading={props.setIsLoading}
      />
    </Box>
  ) : (
    <></>
  );
};

export default Task;
