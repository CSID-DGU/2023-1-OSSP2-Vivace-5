import { Tooltip, TooltipProps, colors, styled, tooltipClasses } from "@mui/material";
import React from "react";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: colors.grey[100],
    color: colors.grey[900],
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: colors.grey[100],
  },
}));

export default HtmlTooltip;
