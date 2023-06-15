import React, { useEffect, useRef, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { BriefTaskInfoType } from "../types/BriefTaskInfo.typs";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
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
import { SubTask } from "../Enum/SubTask.enum";
import axios, { AxiosResponse } from "axios";
import { API_HOST, OK_RESPONCE } from "../constants";
import { Right } from "../Enum/Right.enum";
import { BookmarkListItemType } from "../types/BookmarkListItem.type";
import BookmakrFolders from "./BookmarkFolders";
import { useNavigate } from "react-router-dom";

type NodeData = {
  task: BriefTaskInfoType;
  isVertical: boolean;
  right: Right;
  bookmarkList: BookmarkListItemType[];
  projectId: string;
  forceRerenderingProject: () => void;
};

const GraphNode = ({ data }: NodeProps<NodeData>) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* STATES */
  const [bookmarkTitle, setBookmarkTitle] = useState<string>("");
  const [isCheckAllOpen, setIsCheckAllOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isBookmarkDeleteOpen, setIsBookmarkDeleteOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isSend, setIsSend] = useState<boolean>(false);
  const [typeIcon, setTypeIcon] = useState<React.JSX.Element>(
    <AccountTreeOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />,
  );

  /* USE EFFECT */
  useEffect(() => {
    if (data.task.type === SubTask.TERMINAL) {
      setTypeIcon(<InsertDriveFileOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />);
    } else if (data.task.type === SubTask.LIST) {
      setTypeIcon(<FormatListNumberedOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />);
    } else if (data.task.type === SubTask.KANBAN) {
      setTypeIcon(<ViewKanbanOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />);
    }
  }, [data]);

  const refObj = useRef<BookmarkListItemType | undefined>(undefined);

  const navigate = useNavigate();

  /* FUNCTIONS */
  const showBookmarkFolders = () => {
    return <></>;
  };

  /* HANDLER */
  const handleMilestoneToggle = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const res: AxiosResponse = await axios.patch(
        `${API_HOST}/task/update/milestone/${data.task.id}`,
        { milestone: !data.task.milestone },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        data.forceRerenderingProject();
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to change milestone status of ${data.task.id}..`);
        data.forceRerenderingProject();
      }
    }
  };

  const handleFinisheClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const res: AxiosResponse = await axios.patch(
        `${API_HOST}/task/update/finished/${data.task.id}`,
        { isFinished: !data.task.isFinished },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        data.forceRerenderingProject();
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to change finishing status of ${data.task.id}..`);
        data.forceRerenderingProject();
      }
    }
  };

  const handleDescendantFinisheClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const res: AxiosResponse = await axios.patch(
        `${API_HOST}/task/update/finished/all/${data.task.id}`,
        { isFinished: !data.task.isFinished },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status !== OK_RESPONCE) {
        console.log(`Failed to change finishing status of ${data.task.id}..`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to change finishing status of ${data.task.id}..`);
      }
    } finally {
      setIsCheckAllOpen(false);
      data.forceRerenderingProject();
    }
  };

  const handleDeleteClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const res: AxiosResponse = await axios.delete(`${API_HOST}/task/delete/${data.task.id}/${false}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status !== OK_RESPONCE) {
        console.log(`Failed to delete task ${data.task.id}..`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to delete task ${data.task.id}..`);
      }
    } finally {
      setIsDeleteOpen(false);
      data.forceRerenderingProject();
    }
  };

  const handleDeleteAllClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const res: AxiosResponse = await axios.delete(`${API_HOST}/task/delete/${data.task.id}/${true}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status !== OK_RESPONCE) {
        console.log(`Failed to delete task ${data.task.id}..`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to delete task ${data.task.id}..`);
      }
    } finally {
      setIsDeleteOpen(false);
      data.forceRerenderingProject();
    }
  };

  const handleRegisterBookmarkClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (bookmarkTitle === "") {
      setIsSend(true);
      return;
    }

    try {
      const res: AxiosResponse = await axios.post(
        `${API_HOST}/task/create/bookmark`,
        refObj.current
          ? { title: bookmarkTitle, projectId: data.projectId, taskId: data.task.id, parentId: refObj.current.id }
          : { title: bookmarkTitle, projectId: data.projectId, taskId: data.task.id },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status !== OK_RESPONCE) {
        console.log(`Failed to register bookmark of task ${data.task.id}..`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to register bookmark of task ${data.task.id}..`);
      }
    } finally {
      setIsSend(false);
      setIsRegisterOpen(false);
      data.forceRerenderingProject();
    }
  };

  const handleBookmarkDeleteClick = async () => {
    try {
      const res: AxiosResponse = await axios.delete(
        `${API_HOST}/task/delete/bookmark/byid/${data.projectId}/${data.task.id}`,
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status !== OK_RESPONCE) {
        console.log(`Failed to delete bookmark of task ${data.task.id}..`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to delete bookmark of task ${data.task.id}..`);
      }
    } finally {
      setIsBookmarkDeleteOpen(false);
      data.forceRerenderingProject();
    }
  };

  return (
    <Box
      sx={{
        "&": {
          background: "#f5f5f6",
          color: "#222",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 15%), 0 2px 4px -1px rgb(0 0 0 / 8%)",
          borderRadius: "2px",
          width: 250,
        },
        "& .react-flow__handle": {
          width: data.isVertical ? "20px" : "10px",
          height: data.isVertical ? "10px" : "20px",
          borderRadius: "3px",
          backgroundColor: colors.blueAccent[400],
        },
      }}
    >
      {/* HANDLE */}
      <Handle type="target" position={data.isVertical ? Position.Top : Position.Left} />
      <Handle type="source" position={data.isVertical ? Position.Bottom : Position.Right} />

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
          onClick={() => navigate(`/main/task/${data.projectId}/${data.task.id}`)}
        >
          {data.task.title}
        </Typography>

        <Box display="flex" flexDirection="row" justifyContent="start" gap="5px">
          {/* BOOKMARK */}
          <Tooltip title="Bookmark">
            <IconButton
              onClick={() => {
                if (data.task.isBookmarked) {
                  setIsBookmarkDeleteOpen(true);
                } else {
                  setIsRegisterOpen(true);
                }
              }}
              sx={{ p: 0 }}
            >
              {data.task.isBookmarked ? (
                <StarOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
              ) : (
                <StarOutlineOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
              )}
            </IconButton>
          </Tooltip>

          {/* MILESTONE TOGGLE */}
          <Tooltip title="Milestone">
            <IconButton
              onClick={handleMilestoneToggle}
              sx={{ p: 0 }}
              disabled={data.right === Right.MEMBER_MGT || data.right === Right.COMPLETION_MOD}
            >
              {data.task.milestone ? (
                <FlagRoundedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
              ) : (
                <FlagOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
              )}
            </IconButton>
          </Tooltip>

          {/* FINISH STATUS TOGGLE */}
          <Tooltip title="Complete">
            <IconButton onClick={handleFinisheClick} sx={{ p: 0 }}>
              <DoneOutlinedIcon
                sx={{ fontSize: "16px", color: data.task.isFinished ? colors.redAccent[400] : colors.blueAccent[400] }}
              />
            </IconButton>
          </Tooltip>

          {/* FINISH ALL DESCENDANT STATUS TOGGLE */}
          <Tooltip title="Complete All">
            <IconButton
              onClick={() => {
                setIsCheckAllOpen(true);
              }}
              sx={{ p: 0 }}
            >
              <DoneAllOutlinedIcon
                sx={{ fontSize: "16px", color: data.task.rate >= 1 ? colors.redAccent[400] : colors.blueAccent[400] }}
              />
            </IconButton>
          </Tooltip>

          {/* DELETE */}
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setIsDeleteOpen(true);
              }}
              sx={{ p: 0 }}
              disabled={data.right === Right.MEMBER_MGT || data.right === Right.COMPLETION_MOD}
            >
              <ClearOutlinedIcon
                sx={{ fontSize: "16px", color: data.task.rate >= 1 ? colors.redAccent[400] : colors.blueAccent[400] }}
              />
            </IconButton>
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
            {data.task.description}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="row" justifyContent="start">
          {/* PROGRESS */}
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "start" }}>
            <Typography
              fontSize="12px"
              color={Math.round(data.task.rate * 100) >= 100 ? "secondary" : "primary"}
              fontWeight="bold"
            >{`${Math.round(data.task.rate * 100)}`}</Typography>
            <Typography fontSize="12px" color="primary" ml="2px">
              %
            </Typography>
          </Box>

          {/* TYPE ICON */}
          <Box sx={{ ml: "5px" }}>
            <Tooltip title={data.task.type}>{typeIcon}</Tooltip>
          </Box>
        </Box>
      </Box>

      {/* FINISH ALL DIALOG */}
      <Dialog open={isCheckAllOpen}>
        <DialogTitle variant="h4">Finish All Descendants</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h5">
            Do you want to check completion all descendants under the task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCheckAllOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDescendantFinisheClick} color="error">
            Check All
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen}>
        <DialogTitle variant="h4">Delete the task</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h5">
            Do you want to delete task including all contents under the task or only it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteClick} color="error">
            Delete It
          </Button>
          <Button onClick={handleDeleteAllClick} color="error">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>

      {/* BOOKMARK REGISTER DIALOG */}
      <Dialog open={isRegisterOpen}>
        <DialogTitle variant="h4">Register bookmark</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h5">Do you want to register task into your bookmark?</DialogContentText>
          {/* TITLE */}
          <TextField
            autoFocus
            margin="dense"
            label="Folder Title"
            type="text"
            value={bookmarkTitle}
            onChange={(event) => setBookmarkTitle(event.target.value)}
            error={bookmarkTitle === "" && isSend}
            helperText="Title is empty."
            fullWidth
            variant="standard"
            color="secondary"
          />
        </DialogContent>
        <BookmakrFolders projectId={data.projectId} bookmarkList={data.bookmarkList} ref={refObj} />
        <DialogActions>
          <Button onClick={() => setIsRegisterOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRegisterBookmarkClick} color="success">
            Rigister
          </Button>
        </DialogActions>
      </Dialog>

      {/* BOOKMARK DELETE DIALOG */}
      <Dialog open={isBookmarkDeleteOpen}>
        <DialogTitle variant="h4">Delete bookmark</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h5">Do you want to delete the bookmark?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsBookmarkDeleteOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBookmarkDeleteClick} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GraphNode;
