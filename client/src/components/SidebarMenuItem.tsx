import React from "react";
import { tokens } from "../theme";
import { MenuItem } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { MAIN_PATH } from "../constants";

type ItemPropertyType = {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

const SidebarMenuItem: React.FC<ItemPropertyType> = (props: ItemPropertyType) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={props.selected === props.title}
      style={{ color: colors.grey[100] }}
      onClick={() => {
        props.setSelected(props.title);
      }}
      icon={props.icon}
    >
      <Typography variant="h5">{props.title}</Typography>
      <Link to={MAIN_PATH + props.to} />
    </MenuItem>
  );
};

export default SidebarMenuItem;
