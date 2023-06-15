import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { tokens } from "../theme";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownViewer from "./MarkdownViewer";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import TabPanel from "./TabPanel";
import { DocumentInfoType } from "../types/DocumentInfo.type";
import axios, { AxiosResponse } from "axios";
import { API_HOST, OK_RESPONCE } from "../constants";
import { Right } from "../Enum/Right.enum";

type DocumentPanelType = {
  right: Right;
  projectId: string;
  currentTab: number;
  setCurrentNum: React.Dispatch<React.SetStateAction<number>>;
  tabNumber: number;
  docInfo: DocumentInfoType;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  forceRerenderContent: () => void;
};

const DocumentPanel: React.FC<DocumentPanelType> = ({
  right,
  projectId,
  currentTab,
  setCurrentNum,
  tabNumber,
  docInfo,
  forceRerenderContent,
  setIsLoading,
}) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* STATES */
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isTitleEdit, setIsTitleEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  /* USE_REF */
  const ref = useRef<any>(null);

  /* USE_EFFECT */
  useEffect(() => {
    setTitle(docInfo.title);
  }, [docInfo]);

  /* HANDLER */
  const handleTitleEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    if (title === "" || title === docInfo.title) {
      setTitle(docInfo.title);
      setIsTitleEdit(false);
      return;
    }

    try {
      const res: AxiosResponse = await axios.patch(
        `${API_HOST}/project/docs/update/title/${projectId}`,
        { docId: docInfo.id, newTitle: title },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        setIsTitleEdit(false);
        forceRerenderContent();
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get document information of ${projectId}..`);
        setTitle(docInfo.title);
        setIsTitleEdit(false);
      }
    }
  };

  const handleDeleteClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const res: AxiosResponse = await axios.delete(`${API_HOST}/project/docs/delete/${projectId}/${docInfo.id}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        setIsDeleteDialogOpen(false);
        setCurrentNum(tabNumber - 1);
        forceRerenderContent();
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get document information of ${projectId}..`);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const handleSaveClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      setIsLoading(true);

      const res: AxiosResponse = await axios.patch(
        `${API_HOST}/project/docs/update/content/${projectId}`,
        { docId: docInfo.id, newContent: ref.current.getInstance().getMarkdown() },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get document information of ${projectId}..`);
      }
    }

    setIsLoading(false);
    setIsEditing(false);
    forceRerenderContent();
  };

  return (
    <TabPanel value={currentTab} index={tabNumber}>
      <Box>
        {/* DOCUMENT HEADER */}
        <Box display="flex" justifyContent="space-between" p="10px">
          {/* DOCUMENT TITLE */}
          <Box display="flex" flexDirection="row" justifyContent="start">
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
                {docInfo.title}
              </Typography>
            )}
            <Box m="-5px 0 0 10px" display="flex" justifyContent="center" alignItems="center">
              <IconButton
                onClick={() => setIsTitleEdit(true)}
                disabled={right === Right.MEMBER_MGT || right === Right.COMPLETION_MOD}
              >
                <ModeEditOutlinedIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Button
              color="error"
              variant="contained"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={right === Right.MEMBER_MGT || right === Right.COMPLETION_MOD}
              sx={{ mr: "10px" }}
            >
              Delete
            </Button>
            <Button
              color={isEditing ? "success" : "secondary"}
              variant="contained"
              onClick={(e) => {
                if (isEditing) {
                  handleSaveClick(e);
                  return;
                }

                setIsEditing(!isEditing);
              }}
              disabled={right === Right.MEMBER_MGT || right === Right.COMPLETION_MOD}
              sx={{ mr: "10px" }}
            >
              {isEditing ? "Save" : "Modify"}
            </Button>
          </Box>
        </Box>
        <Box
          m="10px"
          sx={{
            "&": { backgroundColor: "#f2f0f0", borderRadius: "4px", border: "2px #e0e2e9 solid" },
            "& .ProseMirror": { borderRight: "1px #a1a4ab solid" },
          }}
        >
          {isEditing ? (
            <MarkdownEditor content={docInfo.content} editorRef={ref} />
          ) : (
            <Box p="10px 20px" height="calc(100vh - 300px)">
              <MarkdownViewer content={docInfo.content} />
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={isDeleteDialogOpen}>
        <Box p="10px">
          <DialogTitle variant="h4">Delete Document</DialogTitle>
          <DialogContent>
            <DialogContentText variant="h5">Are you sure you want to erase this document?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDeleteClick} color="error">
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </TabPanel>
  );
};

export default DocumentPanel;
