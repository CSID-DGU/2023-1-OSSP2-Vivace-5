import React, { CSSProperties, useState } from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./UpdatePassword.css";

type PwChangeProps = {
    onSubmit: (form: { name: string; password: string }) => void;
};

// function onSubmit(PwChangeProps:{ name: string; password: string;})

interface UserPw {
    onSubmit: (form: { email: string; pastPw: string; newPw1: string; newPw2: string }) => void;
}

function UpdatePassword() {
    function onSubmit(form: { email: string; pastPw: string; newPw1: string; newPw2: string }) {
        return form;
    }

    //입력 박스 스타일
    const inputBoxStyle: CSSProperties = {
        width: "300px",
        height: "40px",
        marginLeft: "25px",
        marginBottom: "25px",
    };

    const [form, setForm] = useState({
        email: "",
        pastPw: "",
        newPw1: "",
        newPw2: "",
    });

    const { email, pastPw, newPw1, newPw2 } = form;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(form);

        console.log("비번변경 출력테스트:" + form.email, form.pastPw, form.newPw1, form.newPw2);
        setForm({
            email: "",
            pastPw: "",
            newPw1: "",
            newPw2: "",
        });
    };

    return (
        <form>
            <header>Tempo_UpdatePassword</header>

            <section className="mainScreen">
                <h1>TEMPO</h1>
                <div className="inputsection">
                    <div>
                        <h2>이메일 확인</h2>
                        <h2>이전 비밀번호</h2>
                        <h2>새로운 비밀번호</h2>
                        <h2>비밀번호 확인</h2>
                    </div>
                    <div className="mainRightDiv">
                        <div style={inputBoxStyle}>
                            <TextField
                                id="outlined-basic"
                                label="email"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="email"
                                value={email}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-basic"
                                label="Password"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="pastPw"
                                value={pastPw}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-basic"
                                label="New Password"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="newPw1"
                                value={newPw1}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-basic"
                                label="New Password"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="password"
                                name="newPw2"
                                value={newPw2}
                                onChange={onChange}
                            />
                            {/* <input style={inputBoxStyle} type="text" name="password" value={password} onChange={onChange} /> */}
                        </div>
                        <div className="comfirmBtn">
                            <Stack spacing={2} direction="column">
                                <Button variant="contained" type="submit" className="boxStyle">
                                    확인
                                </Button>
                                <Button variant="contained" type="submit" className="boxStyle">
                                    확인
                                </Button>
                            </Stack>
                        </div>
                    </div>
                </div>
            </section>
            <hr></hr>
            <section className="navsection">
                <div className="navBtnStyle">
                    <Link to="/">
                        <Button variant="outlined">변경</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="outlined">취소</Button>
                    </Link>
                </div>
            </section>
        </form>
    );
}

export default UpdatePassword;
