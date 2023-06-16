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
import { useNavigate, useParams } from "react-router-dom";
import { Right } from "../Enum/Right.enum";
import axios, { AxiosResponse } from "axios";
import { API_HOST, MAIN_DASHBOARD_PATH, MAIN_PATH, OK_RESPONCE } from "../constants";
import { ProjectInfoType } from "../types/ProjectInfo.type";
import { BriefMemberInfoType } from "../types/BriefMemberInfo.type";
import { UserInfoType } from "../types/UserInfo.type";

type TaskUpdateFormType = {
  members: any[];
};

const ManageTaskSchema = yup.object().shape({
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

const ManageTaskForm: React.FC<SetUpProjectFormProps> = ({ userInfo }) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [right, setRight] = useState<Right>(Right.ADMIN);
  const [taskInfo, setTaskInfo] = useState<Record<string, any> | null>(null);
  const [initialValues, setInitialValues] = useState<TaskUpdateFormType | undefined>(undefined);

  /* PARAMS */
  const params = useParams();
  const taskId = params.taskId as string;
  const projectId = params.projectId as string;

  /* USE EFFECT */
  useEffect(() => {
    getTaskInfo();
  }, [userInfo]);

  useEffect(() => {
    if (!taskInfo) {
      return;
    }

    const members = [];
    for (const member of taskInfo.members) {
      members.push({
        id: member.id,
        encodedImg: member.encodedImg,
      });
    }
    setInitialValues({ members });
  }, [taskInfo]);

  /* NAVIGATION */
  const navigate = useNavigate();

  /* USE_REF */
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* FUNCTIONS */
  const getTaskInfo = async () => {
    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/task/${taskId}`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      if (res.status === OK_RESPONCE) {
        const children = [];

        for (const child of res.data.children) {
          const childTask = {
            id: child.id,
            title: child.title,
            description: child.description,
            type: child.type,
            milestone: child.milestone,
            isFinished: child.isFinished,
            isBookmarked: child.bookmarks.length > 0,
            rate: child.rate,
            predecessors: child.predecessors,
            successors: child.successors,
          };

          children.push(childTask);
        }

        setTaskInfo({ ...res.data, children });
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Failed to get task infomation of ${taskId}..`);
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    }
  };

  /* HANDLER */
  const handleFormSubmit = async (values: TaskUpdateFormType) => {};

  return initialValues ? (
    <Box m="40px">
      {/* HEADER */}
      <Header title="MANAGE PROJECT" subtitle="Manage project member." />

      {/* FORM */}
      <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={ManageTaskSchema}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, handleReset }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box m="10px" display="flex" flexDirection="row" height="70vh">
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
                                  value={right}
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
                Update
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  ) : (
    <></>
  );
};

export default ManageTaskForm;
