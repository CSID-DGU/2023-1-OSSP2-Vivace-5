import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

type HeaderProps = {
  title: string;
  subtitle: string;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box margin="0 0 30px 5px">
      <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ mb: "10px" }}>
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]} fontWeight="bold">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
