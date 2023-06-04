import React, { CSSProperties, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./UpdateInfo.module.css";
import { style } from "d3";

type InfoChangeProps = {
    onSubmit: (form: { name: string; birth: number; company: string; region: string }) => void;
};

// { onSubmit }: InfoChangeProps

interface InfoChange {
    onSubmit: (form: { name: string; birth: number; company: string; region: string }) => void;
}

function UpdateInfo() {
    function onSubmit(form: { name: string; birth: number; company: string; region: string }) {
        return form;
    }

    type OptionType = {
        value: string;
        label: string;
    };

    const options: OptionType[] = [
        { value: "1999", label: "1999년" },
        { value: "2000", label: "2000년" },
        { value: "2001", label: "2001년" },
        { value: "2002", label: "2002년" },
        { value: "2003", label: "2003년" },
        { value: "2004", label: "2004년" },
        { value: "2005", label: "2005년" },
    ];

    //여기는 내가 적은 코드

    const MyComponent = () => {
        <Select options={options} />;
    };

    // var state = {
    //     selectedOptions: null,
    // }
    // const {selectedOption} = this.state;
    function handleChange() {}

    //입력 박스 스타일
    const inputBoxStyle: CSSProperties = {
        width: "300px",
        height: "40px",
        marginLeft: "25px",
        marginBottom: "30px",
        marginTop: "-2px",
    };

    const [form, setForm] = useState({
        name: "",
        birth: 0,
        company: "",
        region: "",
    });

    const { name, birth, company, region } = form;

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
        console.log(form);
        setForm({
            name: "",
            birth: 0,
            company: "",
            region: "",
        }); // 초기화
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <header className={styles.header}>Tempo_UpdateInfo</header>

            <section className={styles.mainScreen}>
                <h1 className={styles.h1}>TEMPO</h1>
                <div className={styles.inputsection}>
                    <div className={styles.textDiv}>
                        <h2 className={styles.texts}>프로필 사진</h2>
                        <h2 className={styles.texts}>이름</h2>
                        <h2 className={styles.texts}>생년월일</h2>
                        <h2 className={styles.texts}>소속</h2>
                        <h2 className={styles.texts}>거주지</h2>
                    </div>
                    <div className={styles.mainRightDiv}>
                        <div style={inputBoxStyle}>
                            <section>
                                <i className={`${styles.fas} ${"fa-user-edit"} ${styles.userIcon}`}></i>
                                <button className={styles.boxStyle} type="submit">
                                    내PC에서 찾기
                                </button>
                            </section>
                            <TextField
                                id="outlined-basic"
                                label="name"
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
                                label="birth(ex.19991127)"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="birth"
                                value={birth}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-basic"
                                label="company"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="company"
                                value={company}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-basic"
                                label="region"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="region"
                                value={region}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <hr className={styles.hrStyle}></hr>
            <section className={styles.navsection}>
                <div className={styles.navBtnStyle}>
                    <Link to="/">
                        <Button variant="outlined" className={styles.boxStyle}>
                            변경
                        </Button>
                    </Link>
                    <Link to="/myForm">
                        <Button variant="outlined" className={styles.boxStyle}>
                            취소
                        </Button>
                    </Link>
                </div>
            </section>
            <div className={styles.comfirmBtn}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" type="submit" className={styles.boxStyle2}>
                        확인
                    </Button>
                    <Button variant="outlined" color="error" className={styles.boxStyle2}>
                        계정 삭제
                    </Button>
                </Stack>
            </div>
        </form>
    );
}

export default UpdateInfo;
