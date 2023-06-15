import React, { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "./Header";
import { UserInfoType } from "../types/UserInfo.type";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import { tokens } from "../theme";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import axios, { AxiosResponse } from "axios";
import { API_HOST, MAIN_DASHBOARD_PATH, MAIN_PATH, OK_RESPONCE, SIGN_IN_PATH } from "../constants";
import { useNavigate } from "react-router-dom";

type UserUpdateFormType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  belong: string;
  region: string;
};

const userSchema = yup.object().shape({
  id: yup.string().required("required"),
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("Invalid email.").required("required"),
  belong: yup.string().required("required"),
  region: yup.string().required("required"),
});

type UserFromProps = {
  userInfo: UserInfoType;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  forceRerendering: () => void;
};

const UpdateUserForm: React.FC<UserFromProps> = ({ userInfo, setIsLoading, forceRerendering }) => {
  /* THEME */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [user, setUser] = useState<UserUpdateFormType>({
    id: userInfo.id,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    belong: userInfo.belong,
    region: userInfo.region,
  });
  const [birth, setBirth] = useState<Dayjs | null>(dayjs(`${userInfo.year}-${userInfo.month}-${userInfo.date}`));
  const [country, setCountry] = useState<string>(userInfo.country);
  const [image, setImage] = useState<string>(userInfo.encodedImg);

  /* NAVIGATION */
  const navigate = useNavigate();

  useEffect(() => {
    setUser({
      id: userInfo.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      belong: userInfo.belong,
      region: userInfo.region,
    });
    setBirth(dayjs(`${userInfo.year}-${userInfo.month}-${userInfo.date}`));
    setCountry(userInfo.country);
    setImage(userInfo.encodedImg);
  }, [userInfo]);

  /* USE_REF */
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* FUNCTIONS */
  const getCountries = (lang = "en") => {
    const A = 65;
    const Z = 90;
    const countryName = new Intl.DisplayNames([lang], { type: "region" });
    const countries: Record<string, any> = {};

    for (let i = A; i <= Z; ++i) {
      for (let j = A; j <= Z; ++j) {
        let code = String.fromCharCode(i) + String.fromCharCode(j);
        let name = countryName.of(code);
        if (code !== name) {
          countries[code] = name;
        }
      }
    }

    return countries;
  };

  const showCountrySelects = () => {
    const countries = getCountries();
    const countryItems: React.JSX.Element[] = [];

    for (let key in countries) {
      countryItems.push(<MenuItem value={countries[key]}>{countries[key]}</MenuItem>);
    }

    return countryItems;
  };

  /* HANDLER */
  const handleFormSubmit = async (values: UserUpdateFormType) => {
    if (!birth) {
      navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
      return;
    }

    setIsLoading(true);

    try {
      const res: AxiosResponse = await axios.put(
        `${API_HOST}/user/update/info`,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          year: birth.year(),
          month: birth.month() + 1,
          date: birth.date(),
          belong: values.belong,
          country,
          region: values.region,
          encodedImg: image,
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

      if (res.status === OK_RESPONCE) {
        forceRerendering();
        navigate(MAIN_PATH + MAIN_DASHBOARD_PATH);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to update user information..");
        setIsLoading(false);
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
    user && (
      <Box m="40px">
        {/* HEADER */}
        <Header title="UPDATE PROFILE" subtitle="Update Your Profile Information" />

        {/* FORM */}
        {birth && country && (
          <Formik onSubmit={handleFormSubmit} initialValues={user} validationSchema={userSchema}>
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, handleReset }) => (
              <form onSubmit={handleSubmit}>
                <Box m="10px" display="flex" flexDirection="row">
                  <Box
                    display="flex"
                    flexDirection="column"
                    p="20px 50px"
                    m="20px"
                    textAlign="center"
                    borderRadius="8px"
                    bgcolor={colors.primary[400]}
                  >
                    <Box
                      display="flex"
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
                    >
                      <img
                        alt="profile-user"
                        width="100px"
                        height="100px"
                        src={image}
                        style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                      />
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

                    {/* NAME */}
                    <Typography variant="h2" fontWeight="bold">
                      {userInfo.firstName + " " + userInfo.lastName}
                    </Typography>

                    {/* EMAIL */}
                    <Typography variant="h5" color={colors.greenAccent[400]} fontWeight="bold" m="10px 0 0 0">
                      {userInfo.email}
                    </Typography>

                    {/* BIRTH */}
                    <Typography variant="h5" color={colors.greenAccent[400]} fontWeight="bold" m="20px 0 0 0">
                      Birth
                    </Typography>
                    <Typography variant="h5" color={colors.grey[100]}>
                      {`${userInfo.year}/${userInfo.month}/${userInfo.date}`}
                    </Typography>

                    {/* BELONG */}
                    <Typography variant="h5" color={colors.greenAccent[400]} fontWeight="bold" m="5px 0 0 0">
                      Belong
                    </Typography>
                    <Typography variant="h5" color={colors.grey[100]}>
                      {userInfo.belong}
                    </Typography>

                    {/* COUNTRY */}
                    <Typography variant="h5" color={colors.greenAccent[400]} fontWeight="bold" m="5px 0 0 0">
                      Country
                    </Typography>
                    <Typography variant="h5" color={colors.grey[100]}>
                      {userInfo.country}
                    </Typography>

                    {/* REGION */}
                    <Typography variant="h5" color={colors.greenAccent[400]} fontWeight="bold" m="5px 0 0 0">
                      Region
                    </Typography>
                    <Typography variant="h5" color={colors.grey[100]}>
                      {userInfo.region}
                    </Typography>

                    {/* CREATED */}
                    <Typography variant="h5" color={colors.greenAccent[400]} fontWeight="bold" m="5px 0 0 0">
                      Created
                    </Typography>
                    <Typography variant="h5" color={colors.grey[100]} margin="0 0 20px 0">
                      {userInfo.createdAt.toLocaleString("ko-KR")}
                    </Typography>
                  </Box>
                  <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                    bgcolor={colors.primary[400]}
                    borderRadius="8px"
                    p="20px"
                    m="20px"
                    width="100%"
                  >
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="User UUID"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.id}
                      name="id"
                      error={!!touched.id && !!errors.id}
                      helperText={touched.id && errors.id}
                      sx={{ gridColumn: "span 4" }}
                      disabled={true}
                    />
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
                      sx={{ gridColumn: "span 4" }}
                      disabled={true}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={!!touched.firstName && !!errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={!!touched.lastName && !!errors.lastName}
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}
                    />

                    <Box sx={{ gridColumn: "span 2" }} display="flex" flexDirection="row" justifyContent="center">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Birthday"
                            defaultValue={dayjs(`${birth.year()}-${birth.month() + 1}-${birth.date()}`)}
                            onChange={(newValue) => setBirth(newValue)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Box>

                    <Select
                      value={country}
                      label="Country"
                      onChange={(e) => setCountry(e.target.value)}
                      sx={{ gridColumn: "span 2" }}
                    >
                      {showCountrySelects()}
                    </Select>

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Belong"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.belong}
                      name="belong"
                      error={!!touched.belong && !!errors.belong}
                      helperText={touched.belong && errors.belong}
                      sx={{ gridColumn: "span 4" }}
                    />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Region"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.region}
                      name="lastName"
                      error={!!touched.region && !!errors.region}
                      helperText={touched.region && errors.region}
                      sx={{ gridColumn: "span 4" }}
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
                    Update
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        )}
      </Box>
    )
  );
};

export default UpdateUserForm;
