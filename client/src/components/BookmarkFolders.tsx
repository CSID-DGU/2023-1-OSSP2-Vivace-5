import { Box, Typography, colors, IconButton, Divider, useTheme, MenuItem } from "@mui/material";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { BookmarkListItemType } from "../types/BookmarkListItem.type";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";

type BookmarkPanelProps = {
  projectId: string;
  bookmarkList: BookmarkListItemType[];
};

const BookmakrFolders = forwardRef<BookmarkListItemType | undefined, BookmarkPanelProps>(
  ({ projectId, bookmarkList }, ref) => {
    /* THEME */
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    /* STATES */
    const [bookmarkListInfo, setBookmarkListInfo] = useState<BookmarkListItemType[]>(bookmarkList);
    const [bookmarkListOn, setbookmarkListOn] = useState<BookmarkListItemType[]>([]);
    const [path, setPath] = useState<BookmarkListItemType[]>([]);
    const [selected, setSelected] = useState<BookmarkListItemType | undefined>(undefined);

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
        setbookmarkListOn(
          path[-1].children.sort((a, b) => (a.taskId && !b.taskId ? 1 : !a.taskId && b.taskId ? -1 : 0)),
        );
      } else {
        setbookmarkListOn(
          bookmarkListInfo.sort((a, b) => (a.taskId && !b.taskId ? 1 : !a.taskId && b.taskId ? -1 : 0)),
        );
      }
    }, [bookmarkListInfo]);

    useImperativeHandle(ref, () => selected);

    /* FUNCTION */
    const showBookmarkList = () => {
      const bookmarkListElements: React.JSX.Element[] = [];

      for (const item of bookmarkListOn) {
        if (item.taskId) {
          continue;
        }

        bookmarkListElements.push(
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            sx={item.id === selected?.id ? { bgcolor: colors.primary[300] } : undefined}
          >
            <MenuItem id={item.id} onClick={handleBookmarkItemClick} sx={{ width: "100%" }}>
              <Box sx={{ m: "5px", display: "flex", flexDirection: "row", justifyContent: "start" }}>
                {/* FOLDER ICON */}
                <Box display="flex" justifyContent="center" alignItems="center" mr="10px">
                  <FolderOutlinedIcon />
                </Box>

                {/* TITLE */}
                <Box display="flex" flexDirection="row" justifyContent="start">
                  <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                    {item.title}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>

            {/* ENTER */}
            <Box display="flex">
              <IconButton
                id={item.id}
                sx={{ p: "10px" }}
                onClick={(e) => {
                  const selected: BookmarkListItemType = bookmarkListInfo.filter(
                    (item) => item.id === e.currentTarget.id,
                  )[0];

                  setPath([...path, selected]);
                  setbookmarkListOn(
                    selected.children.sort((a, b) => (a.taskId && !b.taskId ? 1 : !a.taskId && b.taskId ? -1 : 0)),
                  );
                }}
              >
                <SouthOutlinedIcon sx={{ fontSize: "20px" }} />
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
        </Box>
      );
    };

    /* HANDLER */
    const handleBookmarkItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      if (selected) {
        setSelected(undefined);
      } else {
        setSelected(bookmarkListInfo.filter((item) => item.id === event.currentTarget.id)[0]);
      }
    };

    return (
      bookmarkListOn && (
        <Box m="0 10px 10px">
          {showPath()}

          <Divider sx={{ backgroundColor: colors.grey[100], borderBottomWidth: "2px", m: "5px" }} />

          {showBookmarkList()}
        </Box>
      )
    );
  },
);

export default BookmakrFolders;
