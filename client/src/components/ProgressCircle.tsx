import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

type ProgressCircleProps = {
  progress?: number;
  size?: number;
};

const ProgressCircle: React.FC<ProgressCircleProps> = ({ progress = 0.75, size = 40 }) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* VARIABLES */
  const angle = progress * 360;

  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Typography fontSize={size / 4} fontWeight="bold">
          {Math.ceil(progress * 100) + "%"}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressCircle;
