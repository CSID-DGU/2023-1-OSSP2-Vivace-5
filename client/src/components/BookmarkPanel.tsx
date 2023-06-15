import {
  Box,
  Typography,
  colors,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  MenuItem,
  TextField,
} from "@mui/material";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { MAIN_PATH, API_HOST, OK_RESPONCE, CREATED_RESPONCE } from "../constants";
import { BookmarkListItemType } from "../types/BookmarkListItem.type";
import TabPanel from "./TabPanel";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";

type BookmarkPanelProps = {
  currentTab: number;
  projectId: string;
  bookmarkList: BookmarkListItemType[];
  forceRerenderingProject: () => void;
};

const BookmakrPanel: React.FC<BookmarkPanelProps> = ({
  currentTab,
  projectId,
  bookmarkList,
  forceRerenderingProject,
}) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* STATES */
  const [bookmarkListInfo, setBookmarkListInfo] = useState<BookmarkListItemType[]>(bookmarkList);
  const [bookmarkListOn, setbookmarkListOn] = useState<BookmarkListItemType[]>([]);
  const [path, setPath] = useState<BookmarkListItemType[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [targetDelete, setTargetDelete] = useState<BookmarkListItemType | undefined>(undefined);
  const [folderTitle, setFolderTitle] = useState<string>("");
  const [isSend, setIsSend] = useState<boolean>(false);

  const navigate = useNavigate();

  /* USE_EFFECT */
  useEffect(() => {
    setPath([]);
  }, []);

  useEffect(() => {
    setBookmarkListInfo(bookmarkList);
  }, [bookmarkList]);

  useEffect(() => {
    if (path.length > 0) {
      setbookmarkListOn(path[-1].children.sort((a, b) => (a.taskId && !b.taskId ? 1 : !a.taskId && b.taskId ? -1 : 0)));
    } else {
      setbookmarkListOn(bookmarkListInfo.sort((a, b) => (a.taskId && !b.taskId ? 1 : !a.taskId && b.taskId ? -1 : 0)));
    }
  }, [bookmarkListInfo]);

  /* FUNCTION */
  const showBookmarkList = () => {
    const bookmarkListElements: React.JSX.Element[] = [];

    for (const item of bookmarkListOn) {
      bookmarkListElements.push(
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <MenuItem id={item.id} onClick={handleBookmarkItemClick} sx={{ width: "100%" }}>
            <Box sx={{ m: "5px", display: "flex", flexDirection: "row", justifyContent: "start" }}>
              {/* FOLDER ICON */}
              {item.taskId ? undefined : (
                <Box display="flex" justifyContent="center" alignItems="center" mr="10px">
                  <FolderOutlinedIcon />
                </Box>
              )}

              {/* TITLE */}
              <Box display="flex" flexDirection="row" justifyContent="start">
                <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                  {item.title}
                </Typography>
              </Box>
            </Box>
          </MenuItem>

          {/* DELETE */}
          <Box display="flex">
            <IconButton
              id={item.id}
              sx={{ p: "10px" }}
              onClick={(e) => {
                setTargetDelete(
                  bookmarkListOn.find((ele) => {
                    return ele.id === e.currentTarget.id;
                  }),
                );
                setIsDeleteOpen(true);
              }}
            >
              <ClearOutlinedIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Box>
        </Box>,
      );
    }

    return bookmarkListElements;
  };

  const showPath = () => {
    const pathElements: React.JSX.Element[] = [];

    for (const item of path) {
      pathElements.push(
        <>
          <Box
            onClick={(e) => {
              const id = e.currentTarget.id;

              for (let i = 0; i < path.length; ++i) {
                if (path[i].id === id) {
                  setPath(path.slice(0, i + 1));
                  setbookmarkListOn(
                    path[i].children.sort((a, b) => (a.taskId && !b.taskId ? 1 : !a.taskId && b.taskId ? -1 : 0)),
                  );
                  return;
                }
              }
            }}
            id={item.id}
            sx={{
              "&": { p: "5px 8px", borderRadius: "4px" },
              "&:hover": { bgcolor: colors.primary[500] },
              "&:hover h5": { textDecoration: "underline", cursor: "pointer" },
            }}
          >
            <Typography variant="h5">{item.title}</Typography>
          </Box>
          <Box sx={{ "&": { m: "5px 2px" } }}>
            <Typography variant="h5">/</Typography>
          </Box>
        </>,
      );
    }

    return (
      <Box display="flex" flexDirection="row" justifyContent="space-between" m="5px 15px">
        <Box display="flex" flexDirection="row" justifyContent="start">
          <Box
            onClick={() => {
              setPath([]);
              setbookmarkListOn(bookmarkList);
            }}
            sx={{
              "&": { p: "5px 8px", borderRadius: "4px" },
              "&:hover": { bgcolor: colors.primary[500] },
              "&:hover h5": { textDecoration: "underline", cursor: "pointer" },
            }}
          >
            <Typography variant="h5">root</Typography>
          </Box>
          <Box sx={{ "&": { m: "5px 2px" } }}>
            <Typography variant="h5">/</Typography>
          </Box>
          {pathElements}
        </Box>

        {/* ADD FOLDER */}
        <Box display="flex">
          <IconButton sx={{ p: "10px" }} onClick={() => setIsAddOpen(true)}>
            <AddOutlinedIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Box>
      </Box>
    );
  };

  /* HANDLER */
  const handleBookmarkItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const selected: BookmarkListItemType = bookmarkListInfo.filter((item) => item.id === event.currentTarget.id)[0];

    if (selected.taskId) {
      navigate(MAIN_PATH + "/" + projectId + "/" + selected.taskId);
    }

    setPath([...path, selected]);
    setbookmarkListOn(selected.children.sort((a, b) => (a.taskId && !b.taskId ? 1 : !a.taskId && b.taskId ? -1 : 0)));
  };

  const handleBookmarkDeleteClick = async () => {
    if (!targetDelete) {
      setIsDeleteOpen(false);
      return;
    }

    try {
      const res: AxiosResponse = await axios.delete(`${API_HOST}/task/delete/bookmark/${targetDelete.id}/${false}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status !== OK_RESPONCE) {
        console.log(`Failed to delete bookmark ${targetDelete.id}..`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to delete bookmark ${targetDelete.id}..`);
      }
    } finally {
      setIsDeleteOpen(false);
      setTargetDelete(undefined);
      forceRerenderingProject();
    }
  };

  const handleBookmarkDeleteAllClick = async () => {
    if (!targetDelete) {
      setIsDeleteOpen(false);
      return;
    }

    try {
      const res: AxiosResponse = await axios.delete(`${API_HOST}/task/delete/bookmark/${targetDelete.id}/${true}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status !== OK_RESPONCE) {
        console.log(`Failed to delete bookmark ${targetDelete.id}..`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to delete bookmark ${targetDelete.id}..`);
      }
    } finally {
      setIsDeleteOpen(false);
      setTargetDelete(undefined);
      forceRerenderingProject();
    }
  };

  const handleFolderCreateClick = async () => {
    if (folderTitle === "") {
      setIsSend(true);
      return;
    }

    try {
      const res: AxiosResponse = await axios.post(
        `${API_HOST}/task/create/bookmark`,
        path.length > 0 ? { title: folderTitle, projectId, parentId: path[-1].id } : { title: folderTitle, projectId },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status !== CREATED_RESPONCE) {
        console.log(`Failed to create bookmark folder in project ${projectId}..`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to create bookmark folder in project ${projectId}..`);
      }
    } finally {
      setIsAddOpen(false);
      setIsSend(false);
      forceRerenderingProject();
    }
  };

  return (
    bookmarkListOn && (
      <TabPanel value={currentTab} index={3}>
        {showPath()}

        <Divider sx={{ backgroundColor: colors.grey[100], borderBottomWidth: "2px", m: "5px" }} />

        {showBookmarkList()}

        {/* BOOKMARK DIALOG */}
        <Dialog open={isDeleteOpen}>
          <DialogTitle variant="h4">Delete bookmark</DialogTitle>
          <DialogContent>
            <DialogContentText variant="h5">Do you want to delete the bookmark?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleBookmarkDeleteClick} color="error">
              Delete It
            </Button>
            <Button onClick={handleBookmarkDeleteAllClick} color="error">
              Delete All
            </Button>
          </DialogActions>
        </Dialog>

        {/* BOOKMARK DIALOG */}
        <Dialog open={isAddOpen}>
          <DialogTitle variant="h4">Add bookmark folder</DialogTitle>
          <DialogContent>
            <DialogContentText variant="h5">Do you want to add the bookmark folder?</DialogContentText>
            {/* TITLE */}
            <TextField
              autoFocus
              margin="dense"
              label="Folder Title"
              type="text"
              value={folderTitle}
              onChange={(event) => setFolderTitle(event.target.value)}
              error={folderTitle === "" && isSend}
              helperText="Title is empty."
              fullWidth
              variant="standard"
              color="secondary"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsAddOpen(false);
                setIsSend(false);
              }}
              color="error"
            >
              Cancel
            </Button>
            <Button onClick={handleFolderCreateClick} color="success">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
    )
  );
};

export default BookmakrPanel;
