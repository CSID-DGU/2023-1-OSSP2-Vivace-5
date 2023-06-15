import React, { ChangeEvent, ChangeEventHandler, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, InputBase, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchIcon from "@mui/icons-material/Search";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import {
  MAIN_CALENDAR_PATH,
  MAIN_DASHBOARD_PATH,
  MAIN_FAQ_PATH,
  MAIN_FORM_PATH,
  MAIN_PROJECT_FORM_PATH,
  SERVICE_NAME,
} from "../constants";
import SidebarCategory from "./SidebarCategory";
import SidebarMenuItem from "./SidebarMenuItem";
import MemberProfile from "./MemberProfile";
import { UserInfoType } from "../types/UserInfo.type";
import { useNavigate } from "react-router-dom";
import { BriefProjectInfoType } from "../types/BriefProjectInfo.type";
import SidebarProjectItem from "./SidebarProjectItem";

type SidebarRefType = {
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

type SidebarProps = {
  userInfo: UserInfoType;
  projectInfos: BriefProjectInfoType[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = forwardRef(function Sidebar(props: SidebarProps, ref: React.Ref<SidebarRefType>) {
  /* STATES */
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [queriedBookmarks, setQueriedBookmarks] = useState<BriefProjectInfoType[]>([]);
  const [selected, setSelected] = useState<string>("Dashboard");
  const [userInfo, setUserInfo] = useState<UserInfoType>(props.userInfo);

  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* USE_IMPERATIVE_HANDLE */
  useImperativeHandle(ref, () => ({ setIsCollapsed }));

  /* USE_NAVIGATE */
  const navigate = useNavigate();

  /* USE EFFECT */
  useEffect(() => {
    const result = [] as BriefProjectInfoType[];

    for (const projectInfo of props.projectInfos) {
      const matchResult = projectInfo.title.match(new RegExp(`(${query})`, "gi"));

      if (query === "" || (matchResult && matchResult.length > 0)) {
        if (projectInfo.isBookmarked === true) {
          result.push(projectInfo);
        }
      }
    }

    setQueriedBookmarks(result);
  }, [query, props]);

  useEffect(() => {
    setUserInfo(props.userInfo);
  }, [props.userInfo]);

  /* FUNCTIONS */
  const QueriedBookmarksList = () => {
    const queriedBookmarkElements: React.JSX.Element[] = [];

    for (const queriedBookmark of queriedBookmarks) {
      queriedBookmarkElements.push(
        <SidebarProjectItem
          key={queriedBookmark.id}
          projectInfo={queriedBookmark}
          query={query}
          selected={selected}
          setSelected={setSelected}
        />,
      );
    }

    return queriedBookmarkElements;
  };

  /* HANDLER */
  const handleQueryChange: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    userInfo && (
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
            >
              {!isCollapsed && (
                <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                  <Typography variant="h3" color={colors.grey[100]} fontWeight="bold">
                    {SERVICE_NAME}
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {/* USER */}
            {!isCollapsed && (
              <Box mb="25px">
                <MemberProfile id={userInfo.id} encodedImg={userInfo.encodedImg} size={100} margin={0} />

                <Box textAlign="center">
                  <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "20px 0 10px 0" }}>
                    {userInfo.firstName + " " + userInfo.lastName}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]} fontWeight="bold">
                    {userInfo.email}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* MENU */}
            <Box paddingLeft={isCollapsed ? undefined : "5%"}>
              <SidebarMenuItem
                title="Dashboard"
                to={MAIN_DASHBOARD_PATH}
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <SidebarCategory title="★" isCollapsed={isCollapsed} />
              {/* SEARCH BAR */}
              <Box
                display={isCollapsed ? "none" : "flex"}
                bgcolor={colors.primary[500]}
                borderRadius="3px"
                margin="15px 15px 5px"
                width="85%"
              >
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" onChange={handleQueryChange} />
                <IconButton type="button" sx={{ p: 1 }}>
                  <SearchIcon />
                </IconButton>
              </Box>

              {/* QUERIED BOOKMARK PROJECTS */}
              {QueriedBookmarksList()}

              <SidebarCategory title="Pages" isCollapsed={isCollapsed} />
              <SidebarMenuItem
                title="Profile Form"
                to={MAIN_FORM_PATH}
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <SidebarMenuItem
                title="Set up Project"
                to={MAIN_PROJECT_FORM_PATH}
                icon={<PrecisionManufacturingOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <SidebarMenuItem
                title="Calendar"
                to={MAIN_CALENDAR_PATH}
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <SidebarMenuItem
                title="FAQ Page"
                to={MAIN_FAQ_PATH}
                icon={<HelpOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    )
  );
});

export default Sidebar;
