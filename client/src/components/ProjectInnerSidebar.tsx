import { Box, colors, Tabs, Tooltip, Tab, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import TabPanel from "./TabPanel";
import { tokens } from "../theme";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";

import StarOutlinedIcon from "@mui/icons-material/StarOutlined";

import { BriefMemberInfoType } from "../types/MemberInfo.type";
import MemberAnalysisPanel from "./MemberAnalysisPanel";
import { BookmarkListItemType } from "../types/BookmarkListItem.type";
import BookmakrPanel from "./BookmarkPanel";

type ProjectInnerSidebarProps = {
  parentId?: string;
  projectId: string;
  members: BriefMemberInfoType[];
  bookmarkList: BookmarkListItemType[];
  forceRerenderingProject: () => void;
};

const ProjectInnerSidebar: React.FC<ProjectInnerSidebarProps> = ({
  projectId,
  members,
  bookmarkList,
  forceRerenderingProject,
}) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* STATES */
  const [memberInfos, setMemberInfos] = useState<BriefMemberInfoType[]>(members);
  const [leftTabNumber, setLeftTabNumber] = React.useState(0);

  /* USE EFFECT */
  useEffect(() => {
    setMemberInfos(members);
  }, [members]);

  /* HANDLER */
  const handleLeftTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setLeftTabNumber(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  return (
    memberInfos && (
      <Box margin="10px" bgcolor={colors.primary[400]} borderRadius="8px" height="100%">
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
        <MemberAnalysisPanel currentTap={leftTabNumber} members={memberInfos} />
        <TabPanel value={leftTabNumber} index={1}>
          To-do List
        </TabPanel>
        <TabPanel value={leftTabNumber} index={2}>
          Comment
        </TabPanel>
        <BookmakrPanel
          currentTab={leftTabNumber}
          bookmarkList={bookmarkList}
          projectId={projectId}
          forceRerenderingProject={forceRerenderingProject}
        />
      </Box>
    )
  );
};

export default ProjectInnerSidebar;
