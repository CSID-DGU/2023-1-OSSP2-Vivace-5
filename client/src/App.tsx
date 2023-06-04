import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./components/Main/MainPage/MainPage";
import ToSignin from "./components/Redirect/to_signin";
import {
    CREATE_PROJECT_PATH,
    MAIN_PATH,
    SIGN_IN_PATH,
    SIGN_UP_PATH,
    UPDATE_INFO_PATH,
    UPDATE_PASSWORD_PATH,
    UPDATE_PROJECT_PATH,
} from "./config/constants";
import SignIn from "./components/SignIn/SingIn";
import SignUp from "./components/SignUp/SignUp";
import UpdatePassword from "./components/UpdatePassword/UpdatePassword";
import UpdateInfo from "./components/UpdateInfo/UpdateInfo";
import CreateProject from "./components/CreateProject/CreateProject";
import UpdateProject from "./components/UpdateProject/UpdateProject";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" Component={ToSignin} />
                    <Route path={SIGN_IN_PATH} Component={SignIn} />
                    <Route path={SIGN_UP_PATH} Component={SignUp} />
                    <Route path={UPDATE_PASSWORD_PATH} Component={UpdatePassword} />
                    <Route path={UPDATE_INFO_PATH} Component={UpdateInfo} />
                    <Route path={CREATE_PROJECT_PATH} Component={CreateProject} />
                    <Route path={UPDATE_PROJECT_PATH} Component={UpdateProject} />
                    <Route path={MAIN_PATH} Component={MainPage} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
