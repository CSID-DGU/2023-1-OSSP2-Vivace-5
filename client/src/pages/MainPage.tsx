import React, { useCallback, useEffect, useRef, useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  API_HOST,
  MAIN_CALENDAR_PATH,
  MAIN_DASHBOARD_PATH,
  MAIN_FAQ_PATH,
  MAIN_FORM_PATH,
  MAIN_PROJECT_FORM_PATH,
  MAIN_PROJECT_PATH,
  OK_RESPONCE,
  PROJECT_MANAGE_PATH,
  SIGN_IN_PATH,
} from "../constants";
import Dashboard from "../components/Dashboard";
import Calendar from "../components/Calendar";
import FAQ from "../components/FAQ";
import { Backdrop, CircularProgress } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import Project from "../components/Project";
import { UserInfoType } from "../types/UserInfo.type";
import { BriefProjectInfoType } from "../types/BriefProjectInfo.type";
import { SidebarRefType } from "../types/SidebarRef.type";
import UpdateUserForm from "../components/UpdateUserForm";
import SetUpProjectForm from "../components/SetUpProjectForm";
import ManageProjectForm from "../components/ManageProjectForm";
import Task from "../components/Task";
import ManageTaskForm from "../components/ManageTaskForm";

const MainPage: React.FC = () => {
  /* STATES */
  const [dummyState, setDummyState] = useState<object>({});

  const [projectInfos, setProjectInfos] = useState<BriefProjectInfoType[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfoType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* NAVIGATION */
  const navigate = useNavigate();

  /* USE_EFFECT */
  const refObj = useRef<SidebarRefType>({ setIsCollapsed: setIsLoading });
  const setIsCollapsed = refObj.current.setIsCollapsed;

  /* USE_EFFECT */
  useEffect(() => {
    getUserInfo();
    getProjects();
  }, [dummyState]);

  /* FUNCTIONS */
  const getUserInfo = async () => {
    setIsLoading(true);

    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/user/info`, {
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
        console.log("Failed to get your all project information..");
        setIsLoading(false);
        navigate(SIGN_IN_PATH);
      }
    }
  };

  const getProjects = async () => {
    setIsLoading(true);

    try {
      const res: AxiosResponse = await axios.get(`${API_HOST}/project`, {
        headers: {
          withCredentials: true,
          crossDomain: true,
          credentials: "include",
        },
      });

      setIsLoading(false);

      if (res.status === OK_RESPONCE) {
        const projects = [] as BriefProjectInfoType[];

        for (const project of res.data) {
          const projectInfo: BriefProjectInfoType = {
            id: project.id,
            title: project.title,
            description: project.description,
            type: project.type,
            isBookmarked: project.userToProjects[0].isBookmarked,
            encodedImg: project.encodedImg,
            right: project.userToProjects[0].right,
            progress: Number(project.progress),
          };

          projects.push(projectInfo);
        }

        setProjectInfos(projects);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to get your all project information..");
        setIsLoading(false);
        navigate(SIGN_IN_PATH);
      }
    }
  };

  const forceRerendering = useCallback(() => {
    setDummyState({});
  }, []);

  return userInfo ? (
    <React.Fragment>
      <Sidebar userInfo={userInfo} projectInfos={projectInfos} setIsLoading={setIsLoading} ref={refObj} />
      <main className="content">
        <Topbar />
        <Routes>
          <Route
            path={MAIN_DASHBOARD_PATH}
            element={
              <Dashboard
                projectInfos={projectInfos}
                isLoading={isLoading}
                setIsCollapsed={setIsCollapsed}
                forceRerendering={forceRerendering}
              />
            }
          />
          <Route
            path={MAIN_PROJECT_PATH + "/:projectId"}
            element={
              <Project
                userInfo={userInfo}
                setIsLoading={setIsLoading}
                setIsCollapsed={setIsCollapsed}
                forceRerendering={forceRerendering}
              />
            }
          />
          <Route
            path={MAIN_PROJECT_PATH + PROJECT_MANAGE_PATH + "/:projectId"}
            element={<ManageProjectForm userInfo={userInfo} />}
          />
          <Route
            path={"/task" + "/:projectId" + "/:taskId"}
            element={<Task userInfo={userInfo} setIsLoading={setIsLoading} setIsCollapsed={setIsCollapsed} />}
          />
          <Route path={"/task/manage/:projectId/:taskId"} element={<ManageTaskForm userInfo={userInfo} />} />
          <Route
            path={MAIN_FORM_PATH}
            element={
              <UpdateUserForm userInfo={userInfo} setIsLoading={setIsLoading} forceRerendering={forceRerendering} />
            }
          />
          <Route
            path={MAIN_PROJECT_FORM_PATH}
            element={
              <SetUpProjectForm userInfo={userInfo} setIsLoading={setIsLoading} forceRerendering={forceRerendering} />
            }
          />
          <Route path={MAIN_CALENDAR_PATH} element={<Calendar />} />
          <Route path={MAIN_FAQ_PATH} element={<FAQ />} />
        </Routes>
      </main>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  ) : (
    <></>
  );
};

export default MainPage;
