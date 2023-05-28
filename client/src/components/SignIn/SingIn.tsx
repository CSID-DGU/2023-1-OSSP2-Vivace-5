import React, { CSSProperties, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios, { AxiosResponse } from "axios";
import { API_HOST, MAIN_PATH } from "../../config/constants";
import locale from "antd/es/date-picker/locale/en_US";
import "./SignIn.css";

function SignIn() {
    const navigate = useNavigate();

    //입력 박스 CSS
    const inputBoxStyle: CSSProperties = {
        width: "300px",
        height: "30px",
        marginBottom: "30px",
        marginLeft: "10px",
    };

    const [form, setForm] = useState({
        name: "",
        password: "",
    });

    const { name, password } = form;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let isEmail = true;
        let isProperLength = true;
        let isAlphaNumeric = true;
        let isEachCharAtLeastOne = true;

        const emailRegex: RegExp = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i;
        if (!emailRegex.test(name)) {
            isEmail = false;
            console.log("It is not an email format"); // 이 부분은 이메일 입력 창 아래에 빨간색으로 메세지가 뜨게 만들어주세요
        }

        if (8 > password.length || password.length > 24) {
            isProperLength = false;
            console.log("The length of password must be at least 8 characters and not more than 24 characters.");
        }

        const passwordAlphaNumericRegex: RegExp = /^[A-Za-z0-9`~!@#\$%\^&\*\(\)_=\+-]*$/;
        if (!passwordAlphaNumericRegex.test(password)) {
            isAlphaNumeric = false;
            console.log("password only accepts alphanumeric and some special character.(`~!@#$%^&*()-_=+)");
        }

        const eachCharAtLeastOneRegex: RegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#\$%\^&\*\(\)_=\+-]).*/;
        if (!eachCharAtLeastOneRegex.test(password)) {
            isEachCharAtLeastOne = false;
            console.log(
                "password should include at least one Upper case, one lower case, one numerical character, and one special character.(`~!@#$%^&*()_=+-)",
            );
        }

        if (!isEmail || !isProperLength || !isAlphaNumeric || !isEachCharAtLeastOne) {
            return;
        }

        try {
            const res: AxiosResponse = await axios.post(`${API_HOST}user/signin`, {
                email: name,
                password: password,
            });

            if (res.status === 201) {
                localStorage.setItem("access-token", "Bearer " + res.data.accessToken);
                navigate(MAIN_PATH);
            } else if (res.status === 401) {
                console.log("login failed!");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <header>New_Tempo_MyForm</header>

            <section className="mainScreen">
                <h1>TEMPO</h1>
                <div className="inputsection">
                    <div>
                        <h2>E-mail</h2>
                        <h2>Password</h2>
                    </div>
                    <div style={inputBoxStyle}>
                        <TextField
                            id="outlined-basic"
                            label="input email"
                            variant="outlined"
                            style={inputBoxStyle}
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                        />
                        <br />
                        <TextField
                            id="outlined-basic"
                            label="input password"
                            variant="outlined"
                            style={inputBoxStyle}
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                        />
                        {/* <input style={inputBoxStyle} type="text" name="password" value={password} onChange={onChange} /> */}
                    </div>
                </div>
                <Stack spacing={2} direction="row">
                    <Button variant="contained" type="submit" className="boxStyle">
                        로그인
                    </Button>
                </Stack>
            </section>
            <hr/>
            <section className="navsection">
                <div className="navBtnStyle">
                    <Link to="/signUp">
                        <Button variant="outlined">회원가입</Button>
                    </Link>
                    <Link to="/update/password">
                        {/* PW변경 페이지 route 찾아야 함. */}
                        <Button variant="outlined">비밀번호 변경</Button>
                    </Link>
                </div>
            </section>
        </form>
    );
}

export default SignIn;
