import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { API_HOST, MAIN_DASHBOARD_PATH, MAIN_PATH, OK_RESPONCE } from "../constants";
import { UserInfoType } from "../types/UserInfo.type";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import { Right } from "../Enum/Right.enum";
import AccessCell from "./AccessCell";
import HtmlTooltip from "./HtmlTooltop";

type MemberProfileImgCircleProps = {
  id: string;
  encodedImg: string;
  size: number;
  margin: number;
  right?: Right;
};

const MemberProfile: React.FC<MemberProfileImgCircleProps> = ({ id, encodedImg, size, margin, right }) => {
  /* STATES */
  const [, setDummy] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoType>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    year: 0,
    month: 0,
    date: 0,
    belong: "",
    country: "",
    region: "",
    encodedImg: "",
    createdAt: new Date(),
  });

  /* USE_EFFECT */
  useEffect(() => {
    getUserInfo();
  }, [setDummy]);

  /* USE_NAVIGATE */
  const navigate = useNavigate();

  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* FUNCTIONS */
  const getUserInfo = async () => {
    setIsLoading(true);

    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/user/info/${id}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      setIsLoading(false);

      if (res.status === OK_RESPONCE) {
        const recieveUserInfo: UserInfoType = {
          id: res.data.id,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          year: Number(res.data.year),
          month: Number(res.data.month),
          date: Number(res.data.date),
          belong: res.data.belong,
          country: res.data.country,
          region: res.data.region,
          encodedImg: res.data.encodedImg,
          createdAt: new Date(res.data.createdAt),
        };

        setUserInfo(recieveUserInfo);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        setDummy({});
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      margin={`${margin}px`}
      sx={
        typeof right !== "undefined" && right === Right.ADMIN
          ? {
              background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%), ${colors.blueAccent[500]}`,
              borderRadius: "50%",
              width: `${size + 10}px`,
              height: `${size + 10}px`,
            }
          : undefined
      }
    >
      <HtmlTooltip
        arrow
        onMouseEnter={() => getUserInfo()}
        title={
          <Box m="10px" width="200px">
            {/* PROFILE IMAGE */}
            {typeof right === "undefined" ? undefined : (
              <Box display="flex" justifyContent="center" alignItems="center" margin="20px 0 10px 0">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={userInfo.encodedImg}
                  style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                />
              </Box>
            )}

            {/* INFORMATIONS */}
            <Box textAlign="center">
              {/* NAME */}
              {typeof right === "undefined" ? undefined : (
                <Typography variant="h2" color="inherit" fontWeight="bold">
                  {userInfo.firstName + " " + userInfo.lastName}
                </Typography>
              )}

              {/* EMAIL */}
              {typeof right === "undefined" ? undefined : (
                <Typography variant="h5" color={colors.greenAccent[600]} fontWeight="bold" m="10px 0 0 0">
                  {userInfo.email}
                </Typography>
              )}

              {/* BIRTH */}
              <Typography
                variant={typeof right === "undefined" ? "h5" : "h6"}
                color={colors.greenAccent[600]}
                fontWeight="bold"
                m="20px 0 0 0"
              >
                Birth
              </Typography>
              <Typography variant={typeof right === "undefined" ? "h5" : "h6"} color={colors.grey[600]}>
                {`${userInfo.year}/${userInfo.month}/${userInfo.date}`}
              </Typography>

              {/* BELONG */}
              <Typography
                variant={typeof right === "undefined" ? "h5" : "h6"}
                color={colors.greenAccent[600]}
                fontWeight="bold"
                m="5px 0 0 0"
              >
                Belong
              </Typography>
              <Typography variant={typeof right === "undefined" ? "h5" : "h6"} color={colors.grey[600]}>
                {userInfo.belong}
              </Typography>

              {/* COUNTRY */}
              <Typography
                variant={typeof right === "undefined" ? "h5" : "h6"}
                color={colors.greenAccent[600]}
                fontWeight="bold"
                m="5px 0 0 0"
              >
                Country
              </Typography>
              <Typography variant={typeof right === "undefined" ? "h5" : "h6"} color={colors.grey[600]}>
                {userInfo.country}
              </Typography>

              {/* REGION */}
              <Typography
                variant={typeof right === "undefined" ? "h5" : "h6"}
                color={colors.greenAccent[600]}
                fontWeight="bold"
                m="5px 0 0 0"
              >
                Region
              </Typography>
              <Typography variant={typeof right === "undefined" ? "h5" : "h6"} color={colors.grey[600]}>
                {userInfo.region}
              </Typography>

              {/* CREATED */}
              <Typography
                variant={typeof right === "undefined" ? "h5" : "h6"}
                color={colors.greenAccent[600]}
                fontWeight="bold"
                m="5px 0 0 0"
              >
                Created
              </Typography>
              <Typography
                variant={typeof right === "undefined" ? "h5" : "h6"}
                color={colors.grey[600]}
                margin="0 0 20px 0"
              >
                {userInfo.createdAt.toLocaleString("ko-KR")}
              </Typography>

              {/* ACCESS */}
              <Box display="flex" m="0 0 20px 0" justifyContent="center">
                {typeof right === "undefined" ? undefined : <AccessCell access={right} />}
              </Box>
            </Box>
          </Box>
        }
        placement={typeof right === "undefined" ? "right" : "bottom"}
      >
        <img
          alt="profile-user"
          width={`${size}px`}
          height={`${size}px`}
          src={encodedImg}
          style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
        />
      </HtmlTooltip>
    </Box>
  );
};

export default MemberProfile;
