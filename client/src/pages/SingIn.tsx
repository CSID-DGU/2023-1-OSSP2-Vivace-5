import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios, { AxiosResponse } from "axios";
import { API_HOST, CREATED_RESPONCE, MAIN_DASHBOARD_PATH, MAIN_PATH, SERVICE_NAME, SIGN_UP_PATH } from "../constants";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

type SignInType = {
  email: string;
  password: string;
};

const SignInInitialValues: SignInType = {
  email: "",
  password: "",
};

const passwordRestrictRegExp = /^[A-Za-z0-9`~!@#\$%\^&\*\(\)_=\+-]*$/;
const passwordAtLeastRegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#\$%\^&\*\(\)_=\+-]).*/;

const signInSchema = yup.object().shape({
  email: yup.string().email("Invalid email.").required("required"),
  password: yup
    .string()
    .matches(
      passwordRestrictRegExp,
      "Password only accepts alphanumeric and some special character. (`~!@#$%^&*()-_=+)",
    )
    .matches(
      passwordAtLeastRegExp,
      "Password should include at least one Upper case, one lower case, one numerical character, and one special character. (`~!@#$%^&*()_=+-)",
    )
    .min(8, "The password entered is too short.")
    .max(24, "The password entered is too long.")
    .required("required"),
});

function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleFormSubmit = async (values: SignInType) => {
    setIsLoading(true);

    try {
      const res: AxiosResponse = await axios.post(`${API_HOST}/user/signin`, values);

      setIsLoading(false);

      if (res.status === CREATED_RESPONCE) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        window.confirm("Login failed!!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="content">
      <Box display="flex" flexDirection="column" justifyContent="center" height="100vh">
        <Box display="flex" justifyContent="center" mb="20px">
          <Typography fontSize="80px" fontWeight="bold">
            {SERVICE_NAME}
          </Typography>
        </Box>

        <Formik onSubmit={handleFormSubmit} initialValues={SignInInitialValues} validationSchema={signInSchema}>
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <Box display="flex" justifyContent="center">
              <Box width="33%" justifyContent="center">
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ margin: "10px 0" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ margin: "10px 0" }}
                  />
                  <Box display="flex" justifyContent="space-between" mt="20px" mb="100px">
                    <Button
                      onClick={() => navigate(SIGN_UP_PATH)}
                      type="button"
                      color="warning"
                      variant="contained"
                      sx={{ fontSize: 16 }}
                    >
                      Sign Up
                    </Button>
                    <Button type="submit" color="secondary" variant="contained" sx={{ fontSize: 16 }}>
                      Sign In
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          )}
        </Formik>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </main>
  );
}

export default SignIn;
