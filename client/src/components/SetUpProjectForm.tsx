import React, { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, Grid, IconButton, MenuItem, Select, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Field, FieldArray, Formik } from "formik";
import * as yup from "yup";
import Header from "./Header";
import { UserInfoType } from "../types/UserInfo.type";
import { tokens } from "../theme";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { useNavigate } from "react-router-dom";
import { SubTask } from "../Enum/SubTask.enum";
import { Right } from "../Enum/Right.enum";
import axios, { AxiosResponse } from "axios";
import { API_HOST, CREATED_RESPONCE, MAIN_DASHBOARD_PATH, MAIN_PATH, OK_RESPONCE } from "../constants";

type ProjectSetUpFormType = {
  title: string;
  description: string;
  type: SubTask;
  members: MemberRegisterInfo[];
};

type MemberRegisterInfo = {
  memberId: string;
  right: Right;
};

const ProjectSetUpSchema = yup.object().shape({
  title: yup.string().required("required"),
  description: yup.string().required("required"),
  type: yup.mixed().oneOf([SubTask.GRAPH, SubTask.LIST, SubTask.KANBAN, SubTask.TERMINAL]),
  members: yup
    .array()
    .of(
      yup.object().shape({
        memberId: yup.string().uuid("Member ID must be UUID.").required("required"),
        right: yup
          .mixed()
          .oneOf([Right.ADMIN, Right.COMPLETION_MOD, Right.MEMBER_AND_TASK_MGT, Right.MEMBER_MGT, Right.TASK_MGT]),
      }),
    )
    .required("required"),
});

type SetUpProjectFormProps = {
  userInfo: UserInfoType;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  forceRerendering: () => void;
};

const SetUpProjectForm: React.FC<SetUpProjectFormProps> = ({ userInfo, setIsLoading, forceRerendering }) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [image, setImage] = useState<string>("");
  const [projectInfo, setProjectInfo] = useState<ProjectSetUpFormType>({
    title: "",
    description: "",
    type: SubTask.GRAPH,
    members: [],
  });

  /* NAVIGATION */
  const navigate = useNavigate();

  useEffect(() => {
    setImage("");
  }, []);

  /* USE_REF */
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* HANDLER */
  const handleFormSubmit = async (values: ProjectSetUpFormType) => {
    try {
      setIsLoading(true);

      const res: AxiosResponse = await axios.post(
        `${API_HOST}/project/create`,
        {
          title: values.title,
          description: values.description,
          type: values.type,
          encodedImg: image,
          members: values.members,
        },
        {
          headers: {
            withCredentials: true,
            crossDomain: true,
            credentials: "include",
          },
        },
      );

      setIsLoading(false);

      if (res.status === CREATED_RESPONCE) {
        forceRerendering();
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        window.confirm("Failed to create project.. //" + error.message);
        setIsLoading(false);
        forceRerendering();
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

  return (
    <Box m="40px">
      {/* HEADER */}
      <Header title="SET UP PROJECT" subtitle="Setting up your own project." />

      {/* FORM */}
      <Formik onSubmit={handleFormSubmit} initialValues={projectInfo} validationSchema={ProjectSetUpSchema}>
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

                  <Select
                    fullWidth
                    defaultValue={SubTask.GRAPH}
                    value={values.type}
                    label="Type"
                    name="type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.type && !!errors.type}
                  >
                    <MenuItem value={SubTask.GRAPH}>{SubTask.GRAPH}</MenuItem>
                    <MenuItem value={SubTask.LIST}>{SubTask.LIST}</MenuItem>
                    <MenuItem value={SubTask.KANBAN}>{SubTask.KANBAN}</MenuItem>
                    <MenuItem value={SubTask.TERMINAL}>{SubTask.TERMINAL}</MenuItem>
                  </Select>
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
                        {values.members.map((_, index) => (
                          <Grid
                            item
                            key={index}
                            container
                            justifyContent="center"
                            alignItems="center"
                            rowSpacing={2}
                            columnSpacing={2}
                          >
                            <Grid item xs={12} sm={12}>
                              <Field fullWidth name={`members.${index}.memberId`} component={TextField} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Field fullWidth name={`members.${index}.right`} label="Right" component={Select}>
                                <MenuItem value={Right.ADMIN}>{Right.ADMIN}</MenuItem>
                                <MenuItem value={Right.MEMBER_AND_TASK_MGT}>{Right.MEMBER_AND_TASK_MGT}</MenuItem>
                                <MenuItem value={Right.MEMBER_MGT}>{Right.MEMBER_MGT}</MenuItem>
                                <MenuItem value={Right.TASK_MGT}>{Right.TASK_MGT}</MenuItem>
                                <MenuItem value={Right.COMPLETION_MOD}>{Right.COMPLETION_MOD}</MenuItem>
                              </Field>
                            </Grid>

                            <Grid item xs={12} sm={6}>
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
                        ))}
                      </Box>
                    </Box>
                  )}
                />
              </Box>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px" mr="40px">
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
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default SetUpProjectForm;
