import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ColorModeContext as ColorModeContext, useMode } from "./theme";
import { CssBaseline, Theme, ThemeProvider } from "@mui/material";
import {
  CREATE_PROJECT_PATH,
  MAIN_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  UPDATE_INFO_PATH,
  UPDATE_PASSWORD_PATH,
  UPDATE_PROJECT_PATH,
} from "./constants";
import MainPage from "./pages/MainPage";
import SignIn from "./pages/SingIn";
import NotFound from "./Redirect/NotFound";

const App: React.FC = () => {
  const [theme, colorMode] = useMode();

  useEffect(() => {
    window.addEventListener("error", (e) => {
      if (e.message === "ResizeObserver loop limit exceeded") {
        const resizeObserverErrDiv = document.getElementById("webpack-dev-server-client-overlay-div");
        const resizeObserverErr = document.getElementById("webpack-dev-server-client-overlay");
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute("style", "display: none");
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute("style", "display: none");
        }
      }
    });
  }, []);

  return (
    <ColorModeContext.Provider
      value={
        colorMode as {
          toggleColorMode: () => void;
        }
      }
    >
      <ThemeProvider theme={theme as Theme}>
        <CssBaseline />
        <div className="app">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to={SIGN_IN_PATH} />} />
              <Route path={SIGN_IN_PATH} Component={SignIn} />
              <Route path={SIGN_UP_PATH} />
              <Route path={UPDATE_PASSWORD_PATH} />
              <Route path={UPDATE_INFO_PATH} />
              <Route path={CREATE_PROJECT_PATH} />
              <Route path={UPDATE_PROJECT_PATH} />
              <Route path={MAIN_PATH + "/*"} Component={MainPage} />
              <Route path="*" Component={NotFound} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
