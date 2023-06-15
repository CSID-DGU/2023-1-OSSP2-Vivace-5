import React, { useContext } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { MAIN_DASHBOARD_PATH, MAIN_PATH, SIGN_IN_PATH } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Topbar: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  /* USE_NAVIGATE */
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="space-between" padding={2}>
      {/* BACK */}
      <Box display="flex">
        <IconButton
          onClick={() => {
            navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
          }}
        >
          <HomeOutlinedIcon />
          <Box display="flex" justifyContent="center" alignItems="center" ml="5px">
            <Typography variant="h5">Home</Typography>
          </Box>
        </IconButton>
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIosOutlinedIcon />
          <Box display="flex" justifyContent="center" alignItems="center" ml="5px">
            <Typography variant="h5">Back</Typography>
          </Box>
        </IconButton>
      </Box>

      {/* Icons */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            axios.defaults.headers.common["Authorization"] = "";
            navigate(SIGN_IN_PATH);
          }}
        >
          <LogoutOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
