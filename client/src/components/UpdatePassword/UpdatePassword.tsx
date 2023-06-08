import React, { CSSProperties, useState } from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./UpdatePassword.module.css";
import { API_HOST } from "../../config/constants";
import axios, { AxiosResponse } from "axios";
import { red } from "@mui/material/colors";

type PwChangeProps = {
    onSubmit: (form: { name: string; password: string }) => void;
};

// function onSubmit(PwChangeProps:{ name: string; password: string;})

interface UserPw {
    onSubmit: (form: { pastPw: string; newPw1: string; newPw2: string }) => void;
}

function UpdatePassword() {
    function onSubmit(form: { pastPw: string; newPw1: string; newPw2: string }) {
        return form;
    }

    // function onSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setForm({
    //       ...form,
    //       [name]: value,
    //     });
    //   };





    //입력 박스 스타일
    const inputBoxStyle: CSSProperties = {
        width: "300px",
        height: "40px",
        marginLeft: "25px",
        marginBottom: "25px",
    };

    const [form, setForm] = useState({
        pastPw: "",
        newPw1: "",
        newPw2: "",
    });

    const {pastPw, newPw1, newPw2 } = form;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // const res: AxiosResponse = await axios.get(`${API_HOST}/user/info/`);
        // res.status;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(form);

        console.log("비번변경 출력테스트:" + form.pastPw, form.newPw1, form.newPw2);
        setForm({
            pastPw: "",
            newPw1: "",
            newPw2: "",
        });
    };

    return (
        <form className={styles.form}>
            <header className={styles.header}></header>

            <section className={styles.mainScreen}>
                <h1 className={styles.h1}>TEMPO</h1>
                <div className={styles.inputsection}>
                    <div>
                        <h2 className={styles.h2}>이전 비밀번호</h2>
                        <h2 className={styles.h2}>변경할 비밀번호</h2>
                        <h2 className={styles.h2}>비밀번호 확인</h2>
                    </div>
                    <div className={styles.mainRightDiv}>
                        <div style={inputBoxStyle}>
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
                        <div className={styles.comfirmBtn}>
                            <Stack spacing={4} direction="column">
                                <Button variant="contained" type="submit" className={styles.boxStyle1}>
                                    확인
                                </Button>
                                <Button variant="contained" type="submit" className={styles.boxStyle1}>
                                    확인
                                </Button>
                            </Stack>
                        </div>
                    </div>
                </div>
            </section>
            <section className={styles.navsection}>
                <div className={styles.navBtnStyle}>
                    <div></div>
                    <Link to="/">
                        <Button variant="outlined" className={styles.boxStyle2}>변경</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="outlined" className={styles.boxStyle2}>취소</Button>
                    </Link>
                    <div></div>
                </div>
            </section>
        </form>
    );
}

export default UpdatePassword;
