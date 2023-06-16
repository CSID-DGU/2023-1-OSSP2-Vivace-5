import {
  Box,
  colors,
  Tabs,
  Tooltip,
  Tab,
  useTheme,
  MenuItem,
  Typography,
  Divider,
  TextField,
  IconButton,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TabPanel from "./TabPanel";
import { tokens } from "../theme";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { BriefMemberInfoType } from "../types/BriefMemberInfo.type";
import MemberAnalysisPanel from "./MemberAnalysisPanel";
import { BookmarkListItemType } from "../types/BookmarkListItem.type";
import BookmakrPanel from "./BookmarkPanel";
import axios from "axios";
import { API_HOST, CREATED_RESPONCE, MAIN_PATH, OK_RESPONCE } from "../constants";
import { useNavigate } from "react-router-dom";
import { SubTask } from "../Enum/SubTask.enum";
import { Right } from "../Enum/Right.enum";

type CommentType = {
  projectComment_id: string;
  projectComment_createdAt: string;
  projectComment_modifiedAt: string;
  projectComment_content: string;
  projectComment_pinned: boolean;
  projectComment_projectId: string;
  projectComment_parentId: string;
  projectComment_userId: string;
  user_id: string;
  user_firstName: string;
  user_lastName: string;
};

type ProjectInnerSidebarProps = {
  myId: string;
  right: Right;
  parentId?: string;
  projectId: string;
  members: BriefMemberInfoType[];
  bookmarkList: BookmarkListItemType[];
  forceRerenderingProject: () => void;
};

const ProjectInnerSidebar: React.FC<ProjectInnerSidebarProps> = ({
  myId,
  right,
  parentId,
  projectId,
  members,
  bookmarkList,
  forceRerenderingProject,
}) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* STATES */
  const [dummy, setDummy] = useState<object>({});
  const [comment, setComment] = useState<string>("");
  const [todoList, setTodoList] = useState<any[] | undefined>(undefined);
  const [memberInfos, setMemberInfos] = useState<BriefMemberInfoType[]>(members);
  const [commentList, setCommentList] = useState<CommentType[]>([]);
  const [leftTabNumber, setLeftTabNumber] = useState<number>(0);
  const [isOpenCommentModify, setIsOpenCommentModify] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [selectedCommentId, setSelectedCommentId] = useState<string>("");
  const [isOpenCommentDelete, setIsOpenCommentDelete] = useState<boolean>(false);

  const navigate = useNavigate();

  /* USE EFFECT */
  useEffect(() => {
    getTodoList();
    getComment();
  }, [dummy]);

  useEffect(() => {
    setMemberInfos(members);
  }, [members]);

  const getTodoList = async () => {
    try {
      const res = await axios.get(
        `${API_HOST}/analysis/todo/${parentId ? "task/" + parentId : "project/" + projectId}`,
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        setTodoList(res.data.todo);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get todo list of ${projectId}..`);
      }
    }
  };

  /* FUNCTION */
  const showTodoList = () => {
    if (!todoList) {
      return;
    }

    const todoListElements: React.JSX.Element[] = [];

    for (const item of todoList) {
      todoListElements.push(
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <MenuItem
            id={item.id}
            onClick={(e) => navigate(MAIN_PATH + `/task/${projectId}/${e.currentTarget.id}`)}
            sx={{ width: "100%" }}
          >
            <Box sx={{ m: "5px", display: "flex", flexDirection: "column", justifyContent: "start", flexGrow: 1 }}>
              {/* TITLE */}
              <Box display="flex" flexDirection="row" justifyContent="space-between" m="5px 10px">
                <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                  {item.title}
                </Typography>

                <Box display="flex" flexDirection="row" justifyContent="start" gap="10px">
                  {/* MILESTONE TOGGLE */}
                  <Tooltip title="Milestone">
                    {item.milestone ? (
                      <FlagRoundedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                    ) : (
                      <FlagOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                    )}
                  </Tooltip>

                  {/* TYPE ICON */}
                  <Tooltip title={item.type}>
                    {item.type === SubTask.TERMINAL ? (
                      <InsertDriveFileOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                    ) : item.type === SubTask.LIST ? (
                      <FormatListNumberedOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                    ) : item.type === SubTask.KANBAN ? (
                      <ViewKanbanOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                    ) : (
                      <AccountTreeOutlinedIcon sx={{ fontSize: "16px", color: colors.blueAccent[400] }} />
                    )}
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ backgroundColor: colors.grey[100], borderBottomWidth: "2px", m: "5px" }} />

              <Box display="flex" flexDirection="row" justifyContent="start" m="5px 10px">
                <Typography variant="h6" color={colors.greenAccent[400]} sx={{ display: "inline" }}>
                  {item.description}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        </Box>,
      );
    }

    return <Box>{todoListElements}</Box>;
  };

  const getComment = async () => {
    try {
      const res = await axios.get(`${API_HOST}/project/comment/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        setCommentList(
          res.data.queryResult.sort((a: CommentType, b: CommentType) =>
            a.projectComment_pinned && !b.projectComment_pinned
              ? -1
              : !a.projectComment_pinned && b.projectComment_pinned
              ? 1
              : new Date(a.projectComment_createdAt).getTime() - new Date(b.projectComment_createdAt).getTime(),
          ),
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  };

  const showComments = () => {
    if (!commentList) {
      return;
    }

    const commentListElements: React.JSX.Element[] = [];

    for (const item of commentList) {
      commentListElements.push(
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          border="1px solid #c2c2c2"
          borderRadius="4px"
          m="10px"
        >
          <Box id={item.projectComment_id} sx={{ width: "100%" }}>
            <Box sx={{ m: "5px", display: "flex", flexDirection: "column", justifyContent: "start", flexGrow: 1 }}>
              {/* HEADER */}
              <Box display="flex" flexDirection="row" justifyContent="space-between">
                <Box display="flex" flexDirection="column" m="5px" p="5px">
                  <Typography variant="h6" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                    {item.user_firstName + " " + item.user_lastName}
                  </Typography>

                  <Typography variant="h6" color={colors.grey[100]} sx={{ display: "inline" }}>
                    {"created: " +
                      new Intl.DateTimeFormat("ko", { dateStyle: "medium", timeStyle: "medium" }).format(
                        new Date(item.projectComment_createdAt),
                      )}
                  </Typography>

                  <Typography variant="h6" color={colors.grey[100]} sx={{ display: "inline" }}>
                    {"modified: " +
                      new Intl.DateTimeFormat("ko", { dateStyle: "medium", timeStyle: "medium" }).format(
                        new Date(item.projectComment_modifiedAt),
                      )}
                  </Typography>
                </Box>

                <Box display="flex" flexDirection="row" m="5px" p="5px">
                  <Box display="flex" flexDirection="column" justifyContent="start">
                    <Tooltip title="Pin">
                      <IconButton
                        id={item.projectComment_id}
                        onClick={handlePinnedClick}
                        disabled={right !== Right.ADMIN}
                      >
                        <PushPinOutlinedIcon
                          sx={{
                            fontSize: "16px",
                            color: item.projectComment_pinned ? colors.blueAccent[400] : undefined,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box display="flex" flexDirection="column" justifyContent="start">
                    <Tooltip title="Modify">
                      <IconButton
                        id={item.projectComment_id}
                        onClick={(e) => {
                          setIsOpenCommentModify(true);
                          setSelectedCommentId(e.currentTarget.id);
                        }}
                      >
                        <AutoFixHighOutlinedIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box display="flex" flexDirection="column" justifyContent="start">
                    <Tooltip title="Delete">
                      <IconButton
                        id={item.projectComment_id}
                        onClick={(e) => {
                          setIsOpenCommentDelete(true);
                          setSelectedCommentId(e.currentTarget.id);
                        }}
                        disabled={item.user_id !== myId}
                      >
                        <ClearOutlinedIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ backgroundColor: colors.grey[100], borderBottomWidth: "1px", m: "2px" }} />

              <Box display="flex" flexDirection="row" justifyContent="start" m="5px 10px">
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ display: "inline" }}>
                  {item.projectComment_content}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>,
      );
    }

    return commentListElements;
  };

  const sendComment = async () => {
    if (comment === "") {
      return;
    }

    try {
      const res = await axios.post(
        `${API_HOST}/project/comment/${projectId}`,
        { content: comment },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === CREATED_RESPONCE) {
        getComment();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  };

  /* HANDLER */
  const handleLeftTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setLeftTabNumber(newValue);
  };

  const handlePinnedClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const res = await axios.patch(
        `${API_HOST}/project/comment/update/fixed/${e.currentTarget.id}`,
        { pinned: !commentList.find((ele) => ele.projectComment_id === e.currentTarget.id)?.projectComment_pinned },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        getComment();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  };

  const handleUpdateCommentContent = async () => {
    setIsSent(true);

    if (commentContent === "") {
      return;
    }

    try {
      const res = await axios.patch(
        `${API_HOST}/project/comment/update/content/${selectedCommentId}`,
        { content: commentContent },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        setIsOpenCommentModify(false);
        setIsSent(false);
        setSelectedCommentId("");
        getComment();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsOpenCommentModify(false);
        setIsSent(false);
        setSelectedCommentId("");
      }
    }
  };

  const handleDeleteCommentContent = async () => {
    try {
      const res = await axios.delete(`${API_HOST}/project/comment/delete/${selectedCommentId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        setIsOpenCommentDelete(false);
        setSelectedCommentId("");
        getComment();

        console.log(commentList);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsOpenCommentDelete(false);
        setSelectedCommentId("");
      }
    }
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  return memberInfos && todoList ? (
    <Box margin="10px" bgcolor={colors.primary[400]} borderRadius="8px" height="100%" overflow="auto">
      <Box
        sx={{
          "&": { borderBottom: 1, borderColor: colors.grey[100] },
          "& .Mui-selected svg": { color: colors.greenAccent[400] },
        }}
      >
        <Tabs
          value={leftTabNumber}
          onChange={handleLeftTabChange}
          TabIndicatorProps={{ style: { backgroundColor: colors.greenAccent[400] } }}
        >
          <Tooltip title="Member Analysis">
            <Tab icon={<PersonPinOutlinedIcon />} {...a11yProps(0)} />
          </Tooltip>
          <Tooltip title="To-do List">
            <Tab icon={<ChecklistOutlinedIcon />} {...a11yProps(1)} />
          </Tooltip>
          <Tooltip title="Comment">
            <Tab icon={<CommentOutlinedIcon />} {...a11yProps(2)} />
          </Tooltip>
          <Tooltip title="Bookmark">
            <Tab icon={<StarOutlinedIcon />} {...a11yProps(3)} />
          </Tooltip>
        </Tabs>
      </Box>
      <MemberAnalysisPanel currentTap={leftTabNumber} members={memberInfos} projectId={projectId} parentId={parentId} />
      <TabPanel value={leftTabNumber} index={1}>
        {showTodoList()}
      </TabPanel>
      <TabPanel value={leftTabNumber} index={2}>
        <Box display="flex" flexDirection="row" margin="10px">
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                sendComment();
              }
            }}
          />
          <IconButton sx={{ ml: "10px" }} onClick={sendComment}>
            <SendOutlinedIcon />
          </IconButton>
        </Box>

        <Divider sx={{ backgroundColor: colors.grey[100], borderBottomWidth: "2px", m: "5px" }} />

        {showComments()}
      </TabPanel>
      <BookmakrPanel
        currentTab={leftTabNumber}
        bookmarkList={bookmarkList}
        projectId={projectId}
        forceRerenderingProject={forceRerenderingProject}
      />

      {/* COMMENT CONTENT UPDATE DIALOG */}
      <Dialog open={isOpenCommentModify}>
        <DialogTitle variant="h4">Update a comment content</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h5">Do you want to add the bookmark folder?</DialogContentText>
          {/* TITLE */}
          <TextField
            autoFocus
            margin="dense"
            label="Content"
            type="text"
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
            error={commentContent === "" && isSent}
            helperText="Comment is empty."
            fullWidth
            variant="standard"
            color="secondary"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsOpenCommentModify(false);
              setIsSent(false);
            }}
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateCommentContent} color="success">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* COMMENT DELETE DIALOG */}
      <Dialog open={isOpenCommentDelete}>
        <DialogTitle variant="h4">Delete the comment</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h5">Do you want to delete comment?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsOpenCommentDelete(false);
            }}
            color="success"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteCommentContent} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  ) : (
    <></>
  );
};

export default ProjectInnerSidebar;
