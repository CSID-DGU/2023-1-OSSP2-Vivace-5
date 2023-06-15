import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import Header from "./Header";
import { tokens } from "../theme";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { Right } from "../Enum/Right.enum";
import axios, { AxiosResponse } from "axios";
import { API_HOST, MAIN_DASHBOARD_PATH, MAIN_PATH, OK_RESPONCE } from "../constants";
import { ProjectInfoType } from "../types/ProjectInfo.type";
import { BriefMemberInfoType } from "../types/MemberInfo.type";
import { UserInfoType } from "../types/UserInfo.type";

type ProjectUpdateFormType = {
  title: string;
  description: string;
  members: BriefMemberInfoType[];
};

const ManageProjectSchema = yup.object().shape({
  title: yup.string().required("required"),
  description: yup.string().required("required"),
  members: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().uuid("Member ID must be UUID.").required("required"),
        firstName: yup.string().required("required"),
        lastName: yup.string().required("required"),
        email: yup.string().required("required"),
        encodedImg: yup.string().required("required"),
        right: yup
          .mixed()
          .oneOf([Right.ADMIN, Right.COMPLETION_MOD, Right.MEMBER_AND_TASK_MGT, Right.MEMBER_MGT, Right.TASK_MGT]),
      }),
    )
    .required("required"),
});

type SetUpProjectFormProps = {
  userInfo: UserInfoType;
};

const ManageProjectForm: React.FC<SetUpProjectFormProps> = ({ userInfo }) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [right, setRight] = useState<Right>(Right.ADMIN);
  const [image, setImage] = useState<string>("");
  const [projectInfo, setProjectInfo] = useState<ProjectInfoType | undefined>(undefined);
  const [initialValues, setInitialValues] = useState<ProjectUpdateFormType | undefined>(undefined);

  /* PARAMS */
  const params = useParams();
  const projectId = params.projectId as string;

  /* USE EFFECT */
  useEffect(() => {
    getProjectInfo();
  }, [userInfo]);

  useEffect(() => {
    if (!projectInfo) {
      return;
    }

    setInitialValues({
      title: projectInfo.title,
      description: projectInfo.description,
      members: [...projectInfo.members],
    });
    setImage(projectInfo.encodedImg);
  }, [projectInfo]);

  /* NAVIGATION */
  const navigate = useNavigate();

  /* USE_REF */
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* FUNCTIONS */
  const getProjectInfo = async () => {
    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/project/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        const members = new Array<BriefMemberInfoType>();
        for (const userToProjects of res.data.userToProjects) {
          const member: BriefMemberInfoType = {
            id: userToProjects.user.id,
            firstName: userToProjects.user.firstName,
            lastName: userToProjects.user.lastName,
            email: userToProjects.user.email,
            encodedImg: userToProjects.user.encodedImg,
            isBookmarked: userToProjects.isBookmarked,
            right: userToProjects.right,
          };

          if (userInfo.id === member.id) {
            setRight(member.right);
          }

          members.push(member);
        }

        const recievedInfo: ProjectInfoType = {
          title: res.data.title,
          description: res.data.description,
          type: res.data.type,
          encodedImg: res.data.encodedImg,
          createdAt: new Date(res.data.createdAt),
          members: members,
          tasks: [],
          comments: res.data.comments,
        };

        setProjectInfo(recievedInfo);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get information of ${projectId}..`);

        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  /* HANDLER */
  const handleFormSubmit = async (values: ProjectUpdateFormType) => {
    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/project/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        const members = new Array<BriefMemberInfoType>();
        for (const userToProjects of res.data.userToProjects) {
          const member: BriefMemberInfoType = {
            id: userToProjects.user.id,
            firstName: userToProjects.user.firstName,
            lastName: userToProjects.user.lastName,
            email: userToProjects.user.email,
            encodedImg: userToProjects.user.encodedImg,
            isBookmarked: userToProjects.isBookmarked,
            right: userToProjects.right,
          };

          if (userInfo.id === member.id) {
            setRight(member.right);
          }

          members.push(member);
        }

        const recievedInfo: ProjectInfoType = {
          title: res.data.title,
          description: res.data.description,
          type: res.data.type,
          encodedImg: res.data.encodedImg,
          createdAt: new Date(res.data.createdAt),
          members: members,
          tasks: [],
          comments: res.data.comments,
        };

        setProjectInfo(recievedInfo);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get information of ${projectId}..`);

        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  const handleProjectIconClick = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  };

  const onUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    if (event.target.files[0].size > 4 * 1024 * 1024) {
      window.confirm(`The icon size of project cannot exceed 4 MB. (Current size: ${event.target.files[0].size} Byte)`);
    }

    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);

    reader.onloadend = async () => {
      const base64 = reader.result;

      if (base64) {
        setImage(base64 as string);
      }
    };
  };

  const handleProjectDeleteClick = async () => {
    try {
      const res: AxiosResponse = await axios.delete(`${API_HOST}/project/delete/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to delete project of ${projectId}..`);
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  const handleProjectWithdrawClick = async () => {
    try {
      const res: AxiosResponse = await axios.delete(`${API_HOST}/project/withdraw/${projectId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to withdraw project of ${projectId}..`);
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  return initialValues ? (
    <Box m="40px">
      {/* HEADER */}
      <Header title="MANAGE PROJECT" subtitle="Manage project member." />

      {/* FORM */}
      <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={ManageProjectSchema}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, handleReset }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box m="10px" display="flex" flexDirection="row" height="70vh">
              <Box display="grid" bgcolor={colors.primary[400]} borderRadius="8px" p="30px" m="20px" width="50%">
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  margin="20px 0 10px 0"
                  sx={{
                    "&:hover > img": {
                      backgroundColor: colors.grey[400],
                      opacity: 0.3,
                    },
                    "&:hover > .MuiIconButton-root": {
                      zIndex: 1,
                    },
                  }}
                  m="60px 0 40px 0"
                >
                  {image ? (
                    <img
                      alt="profile-user"
                      width="200px"
                      height="200px"
                      src={image}
                      style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <Avatar src="/broken-image.jpg" sx={{ width: "200px", height: "200px" }} />
                  )}
                  <IconButton onClick={handleProjectIconClick} sx={{ position: "absolute", zIndex: -1 }}>
                    <ModeEditOutlinedIcon />
                  </IconButton>
                  <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    style={{ display: "none" }}
                    ref={inputRef}
                    onChange={onUploadImage}
                  />
                </Box>

                <Box display="grid" gap="10px">
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.title}
                    name="title"
                    error={!!touched.title && !!errors.title}
                    helperText={touched.title && errors.title}
                  />

                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    error={!!touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                  />
                </Box>
              </Box>
              <Box bgcolor={colors.primary[400]} borderRadius="8px" p="20px" m="20px" width="50%" overflow="auto">
                <FieldArray
                  name="members"
                  render={(arrayHelpers) => (
                    <Box display="flex" flexDirection="column">
                      <Button
                        type="button"
                        color="secondary"
                        variant="contained"
                        sx={{ m: "10px 10px 20px 10px" }}
                        onClick={() => arrayHelpers.push({ memberId: "", right: Right.ADMIN })}
                      >
                        Add Member
                      </Button>
                      <Box m="10px" p="15px" bgcolor={colors.primary[600]} borderRadius="4px">
                        {values.members.map((member, index) => (
                          <Box>
                            <Grid
                              item
                              key={index}
                              container
                              justifyContent="center"
                              alignItems="center"
                              rowSpacing={2}
                              columnSpacing={2}
                            >
                              <Grid item>
                                <img
                                  alt="profile-user"
                                  width="40px"
                                  height="40px"
                                  src={member.encodedImg}
                                  style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Typography variant="h4">{member.firstName + " " + member.lastName}</Typography>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Typography variant="h4">{member.email}</Typography>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Select
                                  fullWidth
                                  value={member.right}
                                  label="Right"
                                  onChange={(e) => {
                                    setRight(e.target.value as Right);
                                  }}
                                  disabled={right !== Right.ADMIN}
                                  color="error"
                                >
                                  <MenuItem value={Right.ADMIN}>{Right.ADMIN}</MenuItem>
                                  <MenuItem value={Right.MEMBER_AND_TASK_MGT}>{Right.MEMBER_AND_TASK_MGT}</MenuItem>
                                  <MenuItem value={Right.MEMBER_MGT}>{Right.MEMBER_MGT}</MenuItem>
                                  <MenuItem value={Right.TASK_MGT}>{Right.TASK_MGT}</MenuItem>
                                  <MenuItem value={Right.COMPLETION_MOD}>{Right.COMPLETION_MOD}</MenuItem>
                                </Select>
                              </Grid>

                              <Grid item xs={12} sm>
                                <Button
                                  fullWidth
                                  type="button"
                                  color="error"
                                  variant="contained"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  Delete
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                />
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" mt="20px" mr="40px" ml="40px">
              <Box>
                <Button
                  onClick={handleProjectDeleteClick}
                  type="button"
                  color="error"
                  variant="contained"
                  sx={{ mr: "30px", fontSize: 16 }}
                  disabled={right !== Right.ADMIN}
                >
                  Delete
                </Button>
                <Button
                  onClick={handleProjectWithdrawClick}
                  type="button"
                  color="error"
                  variant="contained"
                  sx={{ mr: "30px", fontSize: 16 }}
                  disabled={right === Right.ADMIN}
                >
                  Withdraw
                </Button>
              </Box>
              <Box>
                <Button
                  onClick={handleReset}
                  type="button"
                  color="warning"
                  variant="contained"
                  sx={{ mr: "30px", fontSize: 16 }}
                >
                  Reset
                </Button>
                <Button type="submit" color="success" variant="contained" sx={{ fontSize: 16 }}>
                  Create
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  ) : (
    <></>
  );
};

export default ManageProjectForm;
