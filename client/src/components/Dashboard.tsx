import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import Header from "./Header";
import { Backdrop, Box, CircularProgress, IconButton, InputBase, Pagination, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { tokens } from "../theme";
import SearchIcon from "@mui/icons-material/Search";
import { BriefProjectInfoType } from "../types/BriefProjectInfo.type";
import ProjectCard from "./ProjectCard";

type DashboardProps = {
  projectInfos: BriefProjectInfoType[];
  isLoading: boolean;
  setIsCollapsed: Function;
  forceRerendering: () => void;
};

const Dashboard: React.FC<DashboardProps> = (props) => {
  /* STATES */
  const [queriedInfos, setQueriedInfos] = useState<BriefProjectInfoType[]>([]);
  const [projectCountPerOnePage, setProjectCountPerOnePage] = useState<number>(9);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  /* MAVIGATION */
  const navigate = useNavigate();

  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* USE_EFFECT */
  useEffect(() => {
    props.setIsCollapsed(false);
  }, []);

  useEffect(() => {
    if (query === "") {
      setQueriedInfos(props.projectInfos);
      setMaxPage(Math.floor(props.projectInfos.length / projectCountPerOnePage) + 1);
      return;
    }

    const result = [] as BriefProjectInfoType[];

    for (const projectInfo of props.projectInfos) {
      const matchResult = (projectInfo.title + " " + projectInfo.description).match(new RegExp(`(${query})`, "gi"));

      if (matchResult && matchResult.length > 0) {
        result.push(projectInfo);
      }
    }

    setQueriedInfos(result);
    setMaxPage(Math.floor(result.length / projectCountPerOnePage) + 1);
  }, [query, props]);

  /* FUNCTIONS */
  const ShowProjectInfo = (): React.JSX.Element[] => {
    const start = (page - 1) * projectCountPerOnePage;
    let end = page * projectCountPerOnePage;
    if (end > queriedInfos.length) {
      end = queriedInfos.length;
    }

    const projectGrid = [];

    for (let i = start; i < end; ++i) {
      projectGrid.push(
        <ProjectCard
          key={queriedInfos[i].id}
          info={queriedInfos[i]}
          query={query}
          forceRerendering={props.forceRerendering}
        />,
      );
    }

    return projectGrid;
  };

  /* HANDLER */
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleQueryChange: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onMediaQueryChange = () => {
    if (isWidth) {
      setProjectCountPerOnePage(9);
      setMaxPage(Math.floor(props.projectInfos.length / 9) + 1);
    } else if (isNarrow) {
      setProjectCountPerOnePage(3);
      setMaxPage(Math.floor(props.projectInfos.length / 3) + 1);
    } else {
      setProjectCountPerOnePage(6);
      setMaxPage(Math.floor(props.projectInfos.length / 6) + 1);
    }

    setPage(1);
  };

  /* REACT_RESPONSIVE */
  const isWidth = useMediaQuery({ query: "(min-width:1350px)" }, undefined, onMediaQueryChange);
  const isNarrow = useMediaQuery({ query: "(max-width:900px) and (min-width:0px)" }, undefined, onMediaQueryChange);

  return (
    <React.Fragment>
      <Box m="40px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        </Box>

        {/* PROJECTS GRID */}
        <Box
          display="grid"
          flexWrap="wrap"
          gap="40px"
          gridTemplateColumns={`repeat(6, minmax(0, 1fr))`}
          sx={{
            "& > div": { gridColumn: isWidth ? "span 2" : isNarrow ? "span 6" : "span 3" },
          }}
        >
          {ShowProjectInfo()}
        </Box>

        {/* SEARCH BAR */}
        <Box display="flex" justifyContent="center">
          <Box display="flex" bgcolor={colors.primary[400]} borderRadius="3px" width="300px" margin="40px 0 0 0">
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" onChange={handleQueryChange} />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>

        {/* PAGINATION */}
        <Box display="flex" justifyContent="center" margin="30px" height="100px">
          <Pagination
            count={maxPage}
            color="secondary"
            size="large"
            page={page}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>

      {/* LOADING SPINNER */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={props.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
};

export default Dashboard;
