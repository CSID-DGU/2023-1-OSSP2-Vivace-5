import React, { useCallback, useEffect, useState } from "react";
import TabPanel from "./TabPanel";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import { BriefMemberInfoType } from "../types/MemberInfo.type";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import AccessCell from "./AccessCell";

type MemberAnalysisPanelProps = {
  currentTap: number;
  members: BriefMemberInfoType[];
};

const MemberAnalysisPanel: React.FC<MemberAnalysisPanelProps> = ({ currentTap, members }) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* STATES */
  const [currentMember, setCurrentMember] = useState<BriefMemberInfoType>(members[0]);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  /* USE EFFECT */
  useEffect(() => {
    setCurrentMember(members[0]);
  }, [members]);

  const showMemberList = () => {
    const memberList = [] as React.JSX.Element[];

    for (const member of members) {
      if (currentMember.id !== member.id) {
        memberList.push(
          /* MEMBER LIST ITEM */
          <MenuItem id={member.id} onClick={handleMemberItemClick}>
            <Box
              sx={{
                "&": { m: "5px", display: "flex", flexDirection: "row", justifyContent: "start" },
              }}
            >
              {/* MEMBER ICON */}
              <Box display="flex" justifyContent="center" alignItems="center" margin="5px 10px 10px">
                <img
                  alt="profile-user"
                  width="40px"
                  height="40px"
                  src={member.encodedImg}
                  style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                />
              </Box>

              <Box display="flex" flexDirection="column" justifyContent="center" m="5px 10px 10px">
                {/* NAME */}
                <Box display="flex" flexDirection="row" justifyContent="start">
                  <Typography variant="h4" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                    {member.firstName + " " + member.lastName}
                  </Typography>
                </Box>

                {/* EMAIL */}
                <Box display="flex" flexDirection="row" justifyContent="start">
                  <Typography variant="h6" color={colors.greenAccent[400]} fontWeight="bold" sx={{ display: "inline" }}>
                    {member.email}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" m="15px 0 20px 0" justifyContent="center" width="200px">
                <AccessCell access={member.right} />
              </Box>
            </Box>
          </MenuItem>,
        );
      }
    }

    return memberList;
  };

  const showMemberTasks = () => {};

  /* HANDLERS */
  const handleMemberItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    for (const member of members) {
      if (event.currentTarget.id === member.id) {
        setCurrentMember(member);
      }
    }

    setIsOpenDialog(false);
  };

  return (
    currentMember && (
      <TabPanel value={currentTap} index={0}>
        <Box m="5px 10px 10px 10px" display="flex" flexDirection="row" justifyContent="space-between">
          {/* MEMBER ICON */}
          <Box display="flex" justifyContent="center" alignItems="center" margin="5px 10px 10px">
            <img
              alt="profile-user"
              width="40px"
              height="40px"
              src={currentMember.encodedImg}
              style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
            />
          </Box>

          <Box display="flex" flexDirection="column" justifyContent="center" m="5px 10px 10px">
            {/* NAME */}
            <Box display="flex" flexDirection="row" justifyContent="start">
              <Typography variant="h4" color={colors.grey[100]} fontWeight="bold" sx={{ display: "inline" }}>
                {currentMember.firstName + " " + currentMember.lastName}
              </Typography>
            </Box>

            {/* EMAIL */}
            <Box display="flex" flexDirection="row" justifyContent="start">
              <Typography variant="h6" color={colors.greenAccent[400]} fontWeight="bold" sx={{ display: "inline" }}>
                {currentMember.email}
              </Typography>
            </Box>
          </Box>

          {/* OPEN DIALOG */}
          <Box margin="8px 15px" display="flex" justifyContent="center" alignItems="center">
            <IconButton onClick={() => setIsOpenDialog(true)}>
              <MoreHorizOutlinedIcon sx={{ fontSize: "24px" }} />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ backgroundColor: colors.grey[100], borderBottomWidth: "2px" }} />

        {/* SELECT MEMBER DIALOG */}
        <Dialog open={isOpenDialog}>
          <Box p="10px" display="flex" flexDirection="column" justifyContent="start">
            <DialogTitle variant="h4">Select Member to analyze</DialogTitle>

            {showMemberList()}
            <DialogActions>
              <Button onClick={() => setIsOpenDialog(false)} color="error">
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </TabPanel>
    )
  );
};

export default MemberAnalysisPanel;
