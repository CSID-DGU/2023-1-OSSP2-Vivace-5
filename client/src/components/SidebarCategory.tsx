import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

type CategoryProps = {
  title: string;
  isCollapsed: boolean;
};

const SidebarCategory: React.FC<CategoryProps> = (props: CategoryProps) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Typography
      variant="h5"
      color={colors.grey[300]}
      sx={props.isCollapsed ? { m: "10px 0 5px 0" } : { m: "10px 0 5px 20px" }}
      align={props.isCollapsed ? "center" : undefined}
    >
      {props.title}
    </Typography>
  );
};

export default SidebarCategory;
