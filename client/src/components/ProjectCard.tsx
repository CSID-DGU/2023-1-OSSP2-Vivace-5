import { Avatar, Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { tokens } from "../theme";
import { API_HOST, MAIN_DASHBOARD_PATH, MAIN_PATH, MAIN_PROJECT_PATH, OK_RESPONCE } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { BriefProjectInfoType } from "../types/BriefProjectInfo.type";
import ProgressCircle from "./ProgressCircle";
import AccessCell from "./AccessCell";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import { SubTask } from "../Enum/SubTask.enum";
import axios, { AxiosResponse } from "axios";

const TITLE_LIMIT = 20;
const DESCRIPTION_LIMIT = 40;

type ProjectCardProps = {
  info: BriefProjectInfoType;
  query: string;
  forceRerendering: () => void;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ info, query, forceRerendering }) => {
  const [typeIcon, setTypeIcon] = useState<React.JSX.Element>(<AccountTreeOutlinedIcon sx={{ fontSize: "30px" }} />);

  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* USE NAVIGATE */
  const navigate = useNavigate();

  /* USE_EFFECT */
  useEffect(() => {
    if (info.type === SubTask.TERMINAL) {
      setTypeIcon(<InsertDriveFileOutlinedIcon sx={{ fontSize: "30px" }} />);
    } else if (info.type === SubTask.LIST) {
      setTypeIcon(<FormatListNumberedOutlinedIcon sx={{ fontSize: "30px" }} />);
    } else if (info.type === SubTask.KANBAN) {
      setTypeIcon(<ViewKanbanOutlinedIcon sx={{ fontSize: "30px" }} />);
    }
  }, [info]);

  /* FUNCTIONS */
  const getHighlightedText = (text: string, highlightRegex: string) => {
    if (highlightRegex === "") {
      return <span>{text}</span>;
    }

    const parts = text.split(new RegExp(`(${highlightRegex})`, "gi"));
    return (
      <span>
        {parts.map((part) =>
          part.toLowerCase() === highlightRegex.toLowerCase() ? (
            <mark style={{ backgroundColor: colors.redAccent[500] }}>{part}</mark>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  /* HANDLERS */
  const handleBookmarkToggleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const res: AxiosResponse = await axios.patch(
        `${API_HOST}/project/update/bookmark/${info.id}`,
        { bookmarkStatus: !info.isBookmarked },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      if (res.status === OK_RESPONCE) {
        forceRerendering();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to update bookmark status of project ${info.id}..`);
        forceRerendering();
      }
    }
  };

  return (
    <Box
      alignItems="center"
      sx={{
        "&": {
          borderRadius: "16px",
          backgroundColor: colors.primary[400],
        },
        "&:hover": {
          backgroundColor: colors.grey[800],
        },
        "& .project-card-title": {
          textDecoration: "none",
        },
        "&:hover .project-card-title": {
          textDecoration: "underline",
        },
      }}
      key={info.id}
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        {/* PROJECT ICON */}
        <Box display="flex" justifyContent="center" alignItems="center" width="20%" margin="40px 20px 10px 30px">
          {info.encodedImg ? (
            <img
              alt="profile-project"
              width="60px"
              height="60px"
              src={info.encodedImg}
              style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <Avatar src="/broken-image.jpg" sx={{ width: "60px", height: "60px" }} />
          )}
        </Box>

        <Box width="50%" m="30px 0 10px">
          {/* TITLE */}
          <Typography
            className="project-card-title"
            variant="h4"
            fontWeight="bold"
            color={colors.grey[100]}
            component={Link}
            to={MAIN_PATH + MAIN_PROJECT_PATH + `/${info.id}`}
          >
            {getHighlightedText(info.title.substring(0, TITLE_LIMIT), query)}
          </Typography>

          {/* DESCRIPTION */}
          <Typography variant="h5" m="10px 0 0 0" color={colors.greenAccent[500]} height="20px">
            {getHighlightedText(
              info.description.substring(0, DESCRIPTION_LIMIT) +
                (info.description.length > DESCRIPTION_LIMIT ? "..." : ""),
              query,
            )}
          </Typography>
        </Box>

        {/* PROGRESS BAR */}
        <Box display="flex" flexDirection="column" justifyContent="center" width="30%" m="30px 0 0 0" p="0 15px">
          <ProgressCircle progress={info.progress} size={60} />
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        margin="20px 30px 30px 20px"
        padding="0 20px"
      >
        {/* PROJECT TYPE */}
        <Box margin="8px 0 0 0">
          <Tooltip title={info.type}>{typeIcon}</Tooltip>
        </Box>

        {/* ACCESS PERMISSION */}
        <AccessCell access={info.right} />

        {/* BOOKMARK TOGGLE */}
        <IconButton onClick={handleBookmarkToggleClick}>
          {info.isBookmarked ? (
            <StarOutlinedIcon sx={{ fontSize: "30px" }} />
          ) : (
            <StarOutlineOutlinedIcon sx={{ fontSize: "30px" }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProjectCard;
