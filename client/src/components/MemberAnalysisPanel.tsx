import React, { useCallback, useEffect, useState } from "react";
import TabPanel from "./TabPanel";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import { BriefMemberInfoType } from "../types/BriefMemberInfo.type";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AccessCell from "./AccessCell";
import axios from "axios";
import { API_HOST, OK_RESPONCE } from "../constants";
import { SubTask } from "../Enum/SubTask.enum";
import { Handle, Position } from "reactflow";
import { Right } from "../Enum/Right.enum";
import { useNavigate } from "react-router-dom";

type MemberTaskType = {
  id: string;
  title: string;
  description: string;
  type: SubTask;
  milestone: boolean;
  createdAt: string;
  start: string;
  end: string | null;
  deadline: string;
  isFinished: boolean;
  parentColumnId: string | null;
  projectId: string;
};

type MemberAnalysisPanelProps = {
  projectId: string;
  parentId?: string;
  currentTap: number;
  members: BriefMemberInfoType[];
};

const MemberAnalysisPanel: React.FC<MemberAnalysisPanelProps> = ({ projectId, parentId, currentTap, members }) => {
  const navigate = useNavigate();

  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* STATES */
  const [currentMember, setCurrentMember] = useState<BriefMemberInfoType>(members[0]);
  const [currentMemberTask, setCurrentMemberTask] = useState<MemberTaskType[]>([]);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  /* USE EFFECT */
  useEffect(() => {
    setCurrentMember(members[0]);
  }, [members]);

  useEffect(() => {
    getMemberTasks();
  }, [currentMember]);

  const showMemberList = () => {
    const memberList = [] as React.JSX.Element[];

    for (const member of members) {
      if (currentMember.id !== member.id) {
        memberList.push(
          /* MEMBER LIST ITEM */
          <MenuItem id={member.id} onClick={handleMemberItemClick}>
            <Box
              sx={{
                "&": { m: "5px", display: "flex", flexDirection: "row", justifyContent: "start" },
              }}
            >
              {/* MEMBER ICON */}
              <Box display="flex" justifyContent="center" alignItems="center" margin="5px 10px 10px">
                <img
                  alt="profile-user"
                  width="40px"
                  height="40px"
                  src={member.encodedImg}
                  style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                />
              </Box>

              <Box display="flex" flexDirection="column" justifyContent="center" m="5px 10px 10px">
                {/* NAME */}
                <Box display="flex" flexDirection="row" justifyContent="start">
                  <Typography variant="h4" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                    {member.firstName + " " + member.lastName}
                  </Typography>
                </Box>

                {/* EMAIL */}
                <Box display="flex" flexDirection="row" justifyContent="start">
                  <Typography variant="h6" color={colors.greenAccent[400]} fontWeight="bold" sx={{ display: "inline" }}>
                    {member.email}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" m="15px 0 20px 0" justifyContent="center" width="200px">
                <AccessCell access={member.right} />
              </Box>
            </Box>
          </MenuItem>,
        );
      }
    }

    return memberList;
  };

  const getMemberTasks = async () => {
    try {
      const res = await axios.get(
        `${API_HOST}/analysis/user/tasks/project/${parentId ? parentId : projectId}/${currentMember.id}`,
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        setCurrentMemberTask(res.data.yourTask);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  };

  const showMemberTasks = () => {
    if (currentMemberTask.length === 0) {
      return;
    }

    const taskElements: React.JSX.Element[] = [];

    for (const item of currentMemberTask) {
      taskElements.push(
        <Box
          sx={{
            "&": {
              background: "#f5f5f6",
              color: "#222",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 15%), 0 2px 4px -1px rgb(0 0 0 / 8%)",
              borderRadius: "2px",
              width: 250,
            },
          }}
        >
          {/* HEADER */}
          <Box
            padding="6px 10px"
            borderBottom="1px solid #c2c2c2"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography
              fontSize="16px"
              fontWeight="bold"
              onClick={() => navigate(`/main/task/${projectId}/${item.id}`)}
            >
              {item.title}
            </Typography>

            <Box display="flex" flexDirection="row" justifyContent="start" gap="5px">
              {/* MILESTONE TOGGLE */}
              <Tooltip title="Milestone">
                {item.milestone ? (
                  <FlagRoundedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                ) : (
                  <FlagOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                )}
              </Tooltip>

              {/* FINISH STATUS TOGGLE */}
              <Tooltip title="Complete">
                <DoneOutlinedIcon
                  sx={{
                    fontSize: "16px",
                    color: item.isFinished ? colors.redAccent[400] : colors.blueAccent[400],
                  }}
                />
              </Tooltip>
            </Box>
          </Box>

          <Box
            sx={{ "&": { padding: "6px 10px" }, "& p": { fontSize: "10px" } }}
            fontSize="10px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            {/* DESCRIPTION */}
            <Box width="60%">
              <Typography fontSize="12px" fontWeight="bold">
                {item.description}
              </Typography>
            </Box>

            <Box display="flex" flexDirection="row" justifyContent="start">
              {/* TYPE ICON */}
              <Box sx={{ ml: "5px" }}>
                <Tooltip title={item.type}>
                  {item.type === SubTask.TERMINAL ? (
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                  ) : item.type === SubTask.LIST ? (
                    <FormatListNumberedOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                  ) : item.type === SubTask.KANBAN ? (
                    <ViewKanbanOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                  ) : (
                    <></>
                  )}
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>,
      );
    }

    return taskElements;
  };

  /* HANDLERS */
  const handleMemberItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    for (const member of members) {
      if (event.currentTarget.id === member.id) {
        setCurrentMember(member);
      }
    }

    setIsOpenDialog(false);
  };

  return (
    currentMember && (
      <TabPanel value={currentTap} index={0}>
        <Box m="5px 10px 10px 10px" display="flex" flexDirection="row" justifyContent="space-between">
          {/* MEMBER ICON */}
          <Box display="flex" justifyContent="center" alignItems="center" margin="5px 10px 10px">
            <img
              alt="profile-user"
              width="40px"
              height="40px"
              src={currentMember.encodedImg}
              style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
            />
          </Box>

          <Box display="flex" flexDirection="column" justifyContent="center" m="5px 10px 10px">
            {/* NAME */}
            <Box display="flex" flexDirection="row" justifyContent="start">
              <Typography variant="h4" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                {currentMember.firstName + " " + currentMember.lastName}
              </Typography>
            </Box>

            {/* EMAIL */}
            <Box display="flex" flexDirection="row" justifyContent="start">
              <Typography variant="h6" color={colors.greenAccent[400]} fontWeight="bold" sx={{ display: "inline" }}>
                {currentMember.email}
              </Typography>
            </Box>
          </Box>

          {/* OPEN DIALOG */}
          <Box margin="8px 15px" display="flex" justifyContent="center" alignItems="center">
            <IconButton onClick={() => setIsOpenDialog(true)}>
              <MoreHorizOutlinedIcon sx={{ fontSize: "24px" }} />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ backgroundColor: colors.grey[100], borderBottomWidth: "2px" }} />

        {/* SELECT MEMBER DIALOG */}
        <Dialog open={isOpenDialog}>
          <Box p="10px" display="flex" flexDirection="column" justifyContent="start">
            <DialogTitle variant="h4">Select Member to analyze</DialogTitle>

            {showMemberList()}
            <DialogActions>
              <Button onClick={() => setIsOpenDialog(false)} color="error">
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </TabPanel>
    )
  );
};

export default MemberAnalysisPanel;
