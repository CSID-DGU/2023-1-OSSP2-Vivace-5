import React, { useEffect, useState } from "react";
import { Right } from "../Enum/Right.enum";
import { Box, Typography, useTheme } from "@mui/material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { tokens } from "../theme";

type AccessCellProps = {
  access: Right;
};

const AccessCell = ({ access }: AccessCellProps): React.JSX.Element => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [accessRight, setAccessRight] = useState<Right>(Right.ADMIN);

  useEffect(() => {
    setAccessRight(access);
  }, [access]);

  return (
    access && (
      <Box
        width="60%"
        p="5px"
        display="flex"
        justifyContent="center"
        bgcolor={access === Right.ADMIN ? colors.greenAccent[600] : colors.greenAccent[700]}
        borderRadius="4px"
      >
        <Box display="flex" flexDirection="column" justifyContent="center" sx={{ m: "0 5px" }}>
          {access === Right.ADMIN && <AdminPanelSettingsOutlinedIcon />}
          {(access === Right.MEMBER_AND_TASK_MGT || access === Right.MEMBER_MGT || access === Right.TASK_MGT) && (
            <SecurityOutlinedIcon />
          )}
          {access === Right.COMPLETION_MOD && <LockOpenOutlinedIcon />}
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography color={colors.grey[100]} sx={{ m: "0 5px" }} fontWeight="bold">
            {access === Right.ADMIN && "ADMIN"}
            {access === Right.MEMBER_AND_TASK_MGT && "Manager"}
            {access === Right.MEMBER_MGT && "Member MGT"}
            {access === Right.TASK_MGT && "Task MGT"}
            {access === Right.COMPLETION_MOD && "Member"}
          </Typography>
        </Box>
      </Box>
    )
  );
};

export default AccessCell;
