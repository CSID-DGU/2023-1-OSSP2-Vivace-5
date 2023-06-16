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
import { BriefMemberInfoType } from "../types/BriefMemberInfo.type";
import MemberProfile from "./MemberProfile";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import { UserInfoType } from "../types/UserInfo.type";
import { Right } from "../Enum/Right.enum";
import { BriefTaskInfoType } from "../types/BriefTaskInfo.typs";
import ProjectInnerSidebar from "./ProjectInnerSidebar";
import ProjectContent from "./ProjectContent";
import { BookmarkListItemType } from "../types/BookmarkListItem.type";
import { ProjectInfoType } from "../types/ProjectInfo.type";

const MaxShowedMemberCount = 5;

type ProjectProps = {
  userInfo: UserInfoType;
  setIsCollapsed: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  forceRerendering: () => void;
};

const Project: React.FC<ProjectProps> = (props) => {
  /* STATES */
  const [dummyState, setDummyState] = useState<object>({});
  const [userRight, setUserRight] = useState<Right>(Right.ADMIN);
  const [isTitleEdit, setIsTitleEdit] = useState<boolean>(false);
  const [isDescriptionEdit, setIsDescriptionEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isBookmarked, setIsBookmarked] = useState<boolean>(true);
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
  const [bookmarkList, setBookmarkList] = useState<BookmarkListItemType[]>([]);

  /* PARAMS */
  const params = useParams();
  const projectId = params.projectId as string;

  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* USE NAVIGATE */
  const navigate = useNavigate();

  /* USE_EFFECT */
  useEffect(() => {
    getProjectInfo();
    props.setIsCollapsed(true);
  }, []);

  useEffect(() => {
    getProjectInfo();
    getBookmarkList();
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
            setIsBookmarked(member.isBookmarked);
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
        setTitle(recievedInfo.title);
        setDescription(recievedInfo.description);
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

  const forceRerenderingProject = useCallback(() => {
    setDummyState({});
  }, []);

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

  const handleProjectIconClick = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  };

  const onUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    if (event.target.files[0].size > 4 * 1024 * 1024) {
      window.confirm(`The icon size of project cannot exceed 4 MB. (Current size: ${event.target.files[0].size} Byte)`);
    }

    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);

    reader.onloadend = async () => {
      const base64 = reader.result;

      if (base64) {
        try {
          props.setIsLoading(true);

          const res = await axios.patch(
            `${API_HOST}/project/update/icon/${projectId}`,
            { newIconBase64: base64 },
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
            setProjectInfo({ ...projectInfo, encodedImg: base64 as string });
            return;
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log(`Failed to update icon of project ${projectId}..`);
            props.setIsLoading(false);
          }
        }
      }
    };
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
        props.forceRerendering();
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to update icon of project ${projectId}..`);
      }
    }
  };

  return (
    projectInfo && (
      <Box m="20px" display="flex" flexDirection="row" justifyContent="start" height="calc(100vh - 120px)">
        <Box display="flex" flexDirection="column" justifyContent="start" width="40%">
          {/* HEADER */}
          <Box margin="10px" bgcolor={colors.primary[400]} p="20px" borderRadius="8px">
            <Box display="flex" flexDirection="row" justifyContent="space-between" mb="15px">
              <Box display="flex" justifyContent="start">
                {/* PROJECT ICON */}
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  margin="5px 15px 5px 5px"
                  sx={{
                    "&:hover > img": {
                      backgroundColor: colors.grey[400],
                      opacity: 0.3,
                    },
                    "&:hover > .MuiIconButton-root": {
                      zIndex: 1,
                    },
                  }}
                >
                  {projectInfo.encodedImg ? (
                    <img
                      alt="profile-project"
                      width="60px"
                      height="60px"
                      src={projectInfo.encodedImg}
                      style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <Avatar src="/broken-image.jpg" sx={{ width: "60px", height: "60px" }} />
                  )}
                  <IconButton
                    onClick={handleProjectIconClick}
                    sx={{ position: "absolute", zIndex: -1 }}
                    disabled={userRight !== Right.ADMIN}
                  >
                    <ModeEditOutlinedIcon />
                  </IconButton>
                  <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    style={{ display: "none" }}
                    ref={inputRef}
                    onChange={onUploadImage}
                  />
                </Box>

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
                        {projectInfo.title}
                      </Typography>
                    )}
                    <Box m="-5px 0 0 10px" display="flex" justifyContent="center" alignItems="center">
                      <IconButton onClick={() => setIsTitleEdit(true)} disabled={userRight !== Right.ADMIN}>
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
                  {projectInfo.description}
                </Typography>
              )}
              <Box m="-5px 0 0 10px" display="flex" justifyContent="center" alignItems="center">
                <IconButton onClick={() => setIsDescriptionEdit(true)} disabled={userRight !== Right.ADMIN}>
                  <ModeEditOutlinedIcon sx={{ fontSize: "12px" }} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ backgroundColor: colors.grey[100], borderBottomWidth: "2px" }} />

            {/* MEMBERS */}
            <Box display="flex" flexDirection="row" justifyContent="start" m="10px 0 0 0">
              {projectInfo.members
                .slice(
                  0,
                  MaxShowedMemberCount > projectInfo.members.length ? projectInfo.members.length : MaxShowedMemberCount,
                )
                .map((member) => {
                  return (
                    <MemberProfile
                      id={member.id}
                      encodedImg={member.encodedImg}
                      size={30}
                      margin={8}
                      right={member.right}
                    />
                  );
                })}
              <Box margin="8px" display="flex" justifyContent="center" alignItems="center">
                <IconButton
                  onClick={() => {
                    navigate(MAIN_PATH + MAIN_PROJECT_PATH + PROJECT_MANAGE_PATH + `/${projectId}`);
                  }}
                >
                  <MoreHorizOutlinedIcon sx={{ fontSize: "24px" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* INNER SIDEBAR */}
          <ProjectInnerSidebar
            myId={props.userInfo.id}
            right={userRight}
            projectId={projectId}
            members={projectInfo.members}
            bookmarkList={bookmarkList}
            forceRerenderingProject={forceRerenderingProject}
          />
        </Box>

        {/* PROJECT CONTENT */}
        <ProjectContent
          right={userRight}
          tasks={projectInfo.tasks}
          forceRerenderingProject={forceRerenderingProject}
          projectId={projectId}
          projectType={projectInfo.type}
          bookmarkList={bookmarkList}
          setIsLoading={props.setIsLoading}
        />
      </Box>
    )
  );
};

export default Project;
