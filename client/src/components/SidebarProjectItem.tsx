import React from "react";
import { tokens } from "../theme";
import { MenuItem } from "react-pro-sidebar";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH, MAIN_PROJECT_PATH } from "../constants";
import { BriefProjectInfoType } from "../types/BriefProjectInfo.type";
import HtmlTooltip from "./HtmlTooltop";
import AccessCell from "./AccessCell";

const TITLE_LIMIT = 15;

export type SidebarProjectItemProps = {
  projectInfo: BriefProjectInfoType;
  query: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

const SidebarProjectItem: React.FC<SidebarProjectItemProps> = ({ projectInfo, query, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const getHighlightedText = (text: string, highlightRegex: string) => {
    if (highlightRegex === "") {
      return <span>{text}</span>;
    }

    const parts = text.split(new RegExp(`(${highlightRegex})`, "gi"));
    return (
      <span>
        {parts.map((part) =>
          part.toLowerCase() === highlightRegex.toLowerCase() ? (
            <mark key={part} style={{ backgroundColor: colors.redAccent[500] }}>
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  return (
    <HtmlTooltip
      arrow
      title={
        <Box m="10px" width="200px">
          {/* INFORMATIONS */}
          <Box textAlign="center" p="10px">
            {/* TITLE */}
            <Typography variant="h3" color="inherit" fontWeight="bold">
              {projectInfo.title}
            </Typography>

            {/* DESCRIPTION */}
            <Typography variant="h5" color={colors.greenAccent[600]} fontWeight="bold" m="10px 0 0 0">
              {projectInfo.description}
            </Typography>

            {/* PROGRESS */}
            <Typography variant="h5" color={colors.greenAccent[600]} fontWeight="bold" m="20px 0 0 0">
              Progress
            </Typography>
            <Typography variant="h5" color={colors.grey[600]}>
              {Math.ceil(projectInfo.progress * 100) + "%"}
            </Typography>

            {/* TYPE */}
            <Typography variant="h5" color={colors.greenAccent[600]} fontWeight="bold" m="5px 0 0 0">
              TYPE
            </Typography>
            <Typography variant="h5" color={colors.grey[600]}>
              {projectInfo.type}
            </Typography>

            {/* ACCESS */}
            <Box display="flex" justifyContent="center" m="10px 0 0 0">
              <AccessCell access={projectInfo.right} />
            </Box>
          </Box>
        </Box>
      }
      placement="right"
    >
      <MenuItem
        active={selected === projectInfo.id}
        style={{ color: colors.grey[100] }}
        onClick={() => {
          setSelected(projectInfo.id);
          navigate(MAIN_PATH + MAIN_PROJECT_PATH + `/${projectInfo.id}`);
        }}
        icon={
          projectInfo.encodedImg ? (
            <img
              alt="profile-user"
              width="20px"
              height="20px"
              src={projectInfo.encodedImg}
              style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <Avatar src="/broken-image.jpg" sx={{ width: "20px", height: "20px" }} />
          )
        }
      >
        {[
          getHighlightedText(projectInfo.title.substring(0, TITLE_LIMIT), query),
          <span>{projectInfo.title.length > TITLE_LIMIT ? "..." : ""}</span>,
        ]}
      </MenuItem>
    </HtmlTooltip>
  );
};

export default SidebarProjectItem;
