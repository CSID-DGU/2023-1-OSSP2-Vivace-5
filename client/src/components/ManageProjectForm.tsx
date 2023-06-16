import React, { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, Tooltip, Typography, useTheme } from "@mui/material";
import Header from "./Header";
import { tokens } from "../theme";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { Right } from "../Enum/Right.enum";
import axios, { AxiosResponse } from "axios";
import { API_HOST, MAIN_DASHBOARD_PATH, MAIN_PATH, OK_RESPONCE } from "../constants";
import { ProjectInfoType } from "../types/ProjectInfo.type";
import { BriefMemberInfoType } from "../types/BriefMemberInfo.type";
import { UserInfoType } from "../types/UserInfo.type";

type SetUpProjectFormProps = {
  userInfo: UserInfoType;
};

const ManageProjectForm: React.FC<SetUpProjectFormProps> = ({ userInfo }) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* PARAMS */
  const params = useParams();
  const projectId = params.projectId as string;

  /* NAVIGATION */
  const navigate = useNavigate();

  /* USE_REF */
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [right, setRight] = useState<Right>(Right.ADMIN);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoType | undefined>(undefined);

  /* USE EFFECT */
  useEffect(() => {
    getProjectInfo();
  }, [userInfo]);

  /* FUNCTIONS */
  const getProjectInfo = async () => {
    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/project/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

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

          if (userInfo.id === member.id) {
            setRight(member.right);
          }

          members.push(member);
        }

        const recievedInfo: ProjectInfoType = {
          title: res.data.title,
          description: res.data.description,
          type: res.data.type,
          encodedImg: res.data.encodedImg,
          createdAt: new Date(res.data.createdAt),
          members: members,
          tasks: [],
          comments: res.data.comments,
        };

        setProjectInfo(recievedInfo);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get information of ${projectId}..`);

        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  const showMemberList = () => {
    if (!projectInfo || projectInfo.members.length === 0) {
      return;
    }

    const memberListElements: React.JSX.Element[] = [];

    for (const item of projectInfo.members) {
      memberListElements.push(
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          border="1px solid #c2c2c2"
          borderRadius="4px"
          m="10px"
          p="15px"
        >
          <Box sx={{ m: "5px", display: "flex", flexDirection: "row", justifyContent: "space-between", flexGrow: 1 }}>
            {/* PROFILE IMAGE */}
            <Box display="flex" flexDirection="column" justifyContent="center" alignContent="center" m="0 20px">
              {item.encodedImg ? (
                <img
                  alt="profile-project"
                  width="80px"
                  height="80px"
                  src={item.encodedImg}
                  style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <Avatar src="/broken-image.jpg" sx={{ width: "60px", height: "60px" }} />
              )}
            </Box>

            {/* MEMBER INFO */}
            <Box display="flex" flexDirection="column" m="5px" p="5px" gap="10px" width="45%">
              <Box>
                <Typography
                  variant="h5"
                  color={colors.greenAccent[300]}
                  fontWeight="bold"
                  sx={{ display: "inline", mr: "10px" }}
                >
                  {"Member UUID"}
                </Typography>
                <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                  {item.id}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  color={colors.greenAccent[300]}
                  fontWeight="bold"
                  sx={{ display: "inline", mr: "10px" }}
                >
                  {"Name"}
                </Typography>
                <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                  {item.firstName + " " + item.lastName}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  color={colors.greenAccent[300]}
                  fontWeight="bold"
                  sx={{ display: "inline", mr: "10px" }}
                >
                  {"Email"}
                </Typography>
                <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                  {item.email}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" flexDirection="row" justifyContent="space-between" alignContent="center" width="500px">
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                bgcolor={item.right === Right.ADMIN ? colors.greenAccent[600] : colors.greenAccent[700]}
                borderRadius="4px"
                p="20px"
              >
                <Box display="flex" flexDirection="column" justifyContent="center" sx={{ m: "0 5px" }}>
                  {item.right === Right.ADMIN && <AdminPanelSettingsOutlinedIcon />}
                  {(item.right === Right.MEMBER_AND_TASK_MGT ||
                    item.right === Right.MEMBER_MGT ||
                    item.right === Right.TASK_MGT) && <SecurityOutlinedIcon />}
                  {item.right === Right.COMPLETION_MOD && <LockOpenOutlinedIcon />}
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center">
                  <Typography color={colors.grey[100]} sx={{ m: "0 5px" }} fontWeight="bold">
                    {item.right === Right.ADMIN && "ADMIN"}
                    {item.right === Right.MEMBER_AND_TASK_MGT && "Manager"}
                    {item.right === Right.MEMBER_MGT && "Member MGT"}
                    {item.right === Right.TASK_MGT && "Task MGT"}
                    {item.right === Right.COMPLETION_MOD && "Member"}
                  </Typography>
                </Box>
              </Box>

              <Box p="20px" display="flex" justifyContent="center" alignContent="center">
                <Tooltip title="Change Access Right">
                  <Button variant="contained" color="secondary">
                    <SecurityOutlinedIcon
                      sx={{
                        fontSize: "16px",
                      }}
                    />
                    <Typography>Change Access Right</Typography>
                  </Button>
                </Tooltip>
              </Box>

              <Box p="20px" display="flex" justifyContent="center" alignContent="center">
                <Tooltip title="Dismiss">
                  <Button variant="contained" color="error">
                    <DirectionsRunOutlinedIcon sx={{ fontSize: "16px" }} />
                    <Typography>Dismiss</Typography>
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>,
      );
    }

    return memberListElements;
  };

  /* HANDLER */
  const handleProjectDeleteClick = async () => {
    try {
      const res: AxiosResponse = await axios.delete(`${API_HOST}/project/delete/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to delete project of ${projectId}..`);
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  const handleProjectWithdrawClick = async () => {
    try {
      const res: AxiosResponse = await axios.delete(`${API_HOST}/project/withdraw/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to withdraw project of ${projectId}..`);
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  return (
    <Box m="40px" display="flex" flexDirection="column">
      <Box m="10px" p="20px" bgcolor={colors.primary[400]} borderRadius="8px">
        <Header title="PROJECT MEMBER MANAGEMENT" subtitle="Manage the project member"></Header>
      </Box>

      <Box m="10px" p="20px" bgcolor={colors.primary[400]} borderRadius="8px" height="60vh" overflow="auto">
        {showMemberList()}
      </Box>
    </Box>
  );
};

export default ManageProjectForm;
