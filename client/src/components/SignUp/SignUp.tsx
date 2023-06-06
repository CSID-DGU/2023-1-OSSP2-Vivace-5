import React, { CSSProperties, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { API_HOST, MAIN_PATH } from "../../config/constants";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./SignUp.module.css";

function onSubmit(User: {
    firstName: string;
    lastName: string;
    email: string;
    year: number;
    month: number;
    date: number;
    password: string;
    belong: string;
    country: string;
    region: string;
    encodedImg: string;
}) {}

let imgUrlEx: string;

function SignUp() {
    const navigate = useNavigate();

    //입력 박스 스타일
    const inputBoxStyle: CSSProperties = {
        width: "300px",
        height: "40px",
        marginLeft: "25px",
        marginBottom: "25px",
    };
    // 20230603 [18:25] POST component 맞추기 작업 중.
    // 바로 밑 form은 components의 종류/숫자가 맞지 않아서 잠시 주석처리
    // const [form, setForm] = useState({
    //     email: "",
    //     password: "",
    //     passwordCk: "",
    //     name: "",
    //     birth: 0,
    //     company: "",
    //     region: "",
    // });

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        year: 0,
        month: 0,
        date: 0,
        password: "",
        belong: "",
        country: "",
        region: "",
        encodedImg: "",
    });

    // const { email, password, passwordCk, name, birth, company, region } = form;
    const { firstName, lastName, email, year, month, date, password, belong, country, region, encodedImg } = form;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name == "yearValue") {
            console.log("yearValue 발견!");
        }

        const { name, value } = e.target;
        // console.log("name: " +name);
        // console.log(e.target.name);
        setForm({
            // [birthY]: document.getElementById('yearValue'),
            ...form,
            [name]: value,
        });
    };

    //이미지 base64 만들기
    const [imgUrl, setimgUrl] = useState<string | undefined>(undefined);

    const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            //   이미지 jpg, jpeg로만 받을지 생각중
            //   if (file.name.split('.').pop()?.toLowerCase() !== 'jpg' || file.name.split('.').pop()?.toLowerCase() !== 'jpeg') {
            //     alert('에러가 발생하였습니다.');
            //     return;
            //   }

            const fileReader = new FileReader();
            fileReader.onload = () => {
                if (typeof fileReader.result === "string") {
                    setimgUrl(fileReader.result);
                }
            };
            console.log("test 1");
            console.log(imgUrl);
            console.log(file);
            fileReader.readAsDataURL(file);
            console.log("test 2");
            console.log(imgUrl);
            console.log(file);
            console.log("test 3");
            console.log(form);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onSubmit(form);

        // 20230603 [18:28] 현재 API에는 passwordCk 칸이 없어서 잠시 주석처리 함.

        // 비밀번호 틀리면 아래 form이 제출되지 않도록 함.
        // if (form.password !== form.passwordCk) {
        //     alert("비밀번호를 확인하십시오.");
        //     return;
        // }

        // 현재까지 year에 값 넣은 채로 회원가입 버튼 누르면 그 값 나타내기는 가능.
        //그러나 form안에 그 값이 들어가지 않음. 수정 필요. (2023-05-18 01:43 AM)
        // console.log(selectedOption);
        // let birthM = selectedOption;
        console.log(form);

        let isEmail = true;
        let isProperLength = true;
        let isAlphaNumeric = true;
        let isEachCharAtLeastOne = true;

        // const emailRegex: RegExp = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i;
        // // if (!emailRegex.test(name)) {
        // //     alert("Please enter a valid email address");
        // //     // window.location.reload();
        // // }

        // if (8 > password.length || password.length > 24) {
        //     isProperLength = false;
        //     alert("The length of password must be at least 8 characters and not more than 24 characters.");
        // }

        // const passwordAlphaNumericRegex: RegExp = /^[A-Za-z0-9`~!@#\$%\^&\*\(\)_=\+-]*$/;
        // if (!passwordAlphaNumericRegex.test(password)) {
        //     isAlphaNumeric = false;
        //     alert("password only accepts alphanumeric and some special character.(`~!@#$%^&*()-_=+)");
        // }

        // const eachCharAtLeastOneRegex: RegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#\$%\^&\*\(\)_=\+-]).*/;
        // if (!eachCharAtLeastOneRegex.test(password)) {
        //     isEachCharAtLeastOne = false;
        //     alert(
        //         "password should include at least one Upper case, one lower case, one numerical character, and one special character.(`~!@#$%^&*()_=+-)",
        //     );
        // }

        if (!isEmail || !isProperLength || !isAlphaNumeric || !isEachCharAtLeastOne) {
            return;
        }

        try {
            console.log(password);
            console.log(email);
            // const res: AxiosResponse = await axios.post(`${API_HOST}user/signup`, {
            //     email: email,
            //     password: password,
            //     passwordCk: passwordCk,
            //     name: name,
            //     company: company,
            //     region: region,
            //     birth: birth,
            // });

            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                year: Number(year),
                month: Number(month),
                date: Number(date),
                password: password,
                belong: belong,
                country: country,
                region: region,
                encodedImg: encodedImg,
            };

            console.log(userData);

            const res: AxiosResponse = await axios.post(`${API_HOST}/user/signup`, userData);
            console.log(res);

            if (res.status === 201) {
                localStorage.setItem("access-token", "Bearer " + res.data.accessToken);
                navigate(MAIN_PATH);
            } else if (res.status === 401) {
                alert("login failed!");
            } else if (res.status === 200) {
                alert("User successfully sign up in this service");
            } else if (res.status === 409) {
                alert("If entered email is already existing");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error);
            }
        }

        // setForm({
        //     firstName: "",
        //     lastName: "",
        //     email: "",
        //     year: 0,
        //     month: 0,
        //     date: 0,
        //     password: "",
        //     belong: "",
        //     country: "",
        //     region: "",
        //     encodedImg:"",
        // }); // 초기화
    };

    //Select Box 값 바꿨을 때 console.log에 선택값이 들어오지 않음. 현재 이 값을 받기 위한 작업중.(2023-05-16 12:26 PM)

    // const [Selected, setSelected] = useState("");
    // const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSelected(e.target.value);
    // };
    // function handleChangeSelect(){
    //     const [birth, setYear] = useState({
    //         year: '',
    //         month: '',
    //         day: '',
    //     });
    //     setYear('year');
    //     console.log(year);

    // }
    // This function is triggered when the select changes

    const [selectedOption, setSelectedOption] = useState<String>();

    const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedOption(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <header className={styles.header}>Tempo_SignUp</header>

            <section className={styles.mainScreen}>
                <h1 className={styles.h1}>Tempo</h1>
                <div className={styles.mainScreenComponent}>
                    <div className={styles.inputsection}>
                        <div>
                            <h2>E-mail</h2>
                            <h2>Password</h2>
                            <h2>Password-Check</h2>
                        </div>
                        <div className={styles.inputBoxStyle}>
                            {/* id="outlined-basic에서 id="outlined-{name}"으로 변경" */}
                            <TextField
                                id="outlined-email"
                                label="이메일"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="email"
                                value={email}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-password"
                                label="문자, 숫자, 특수기호 포함 8~16자리"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="password"
                                value={password}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-passwordCk"
                                label="First Name"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="firstName"
                                value={firstName}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <hr className={styles.vLine}></hr>

                    <div className={styles.rightDiv}>
                        <div className={styles.inputsection2}>
                            <div className={styles.textDiv}>
                                <h2 className={styles.text}>프로필 사진</h2>
                                <h2 className={styles.text}>이름</h2>
                                <h2 className={styles.text}>생년월일</h2>
                                <h2 className={styles.text}>소속</h2>
                                <h2 className={styles.text}>거주지</h2>
                            </div>
                            <div>
                                <section>
                                    <i className={`${styles.far} ${styles["fa-user-circle"]} ${styles.userIcon}`}></i>
                                    {/* <input 
                                        accept="image/*" 
                                        multiple type="file"
                                        onChange={onUpload}
                                        name="encodedImg"
                                        value={encodedImg}
                                    />  */}
                                    <img width={"70px"} height={"70px"} src={imgUrl} />
                                    <button className={styles.boxStyle} type="submit">
                                        내PC에서 찾기
                                    </button>
                                    <button className={styles.boxStyle} type="submit">
                                        취소
                                    </button>
                                </section>
                                <TextField
                                    id="outlined-name"
                                    label="last name"
                                    variant="outlined"
                                    style={inputBoxStyle}
                                    type="text"
                                    name="lastName"
                                    value={lastName}
                                    onChange={onChange}
                                />
                                <br />
                                <TextField
                                    id="outlined-birth"
                                    label="YYYYMMDD 형식으로 입력하세요(ex.19991127)year"
                                    variant="outlined"
                                    style={inputBoxStyle}
                                    type="text"
                                    name="year"
                                    value={year}
                                    onChange={onChange}
                                />
                                <TextField
                                    id="outlined-birth"
                                    label="YYYYMMDD 형식으로 입력하세요(ex.19991127)month"
                                    variant="outlined"
                                    style={inputBoxStyle}
                                    type="text"
                                    name="month"
                                    value={month}
                                    onChange={onChange}
                                />
                                <TextField
                                    id="outlined-birth"
                                    label="YYYYMMDD 형식으로 입력하세요(ex.19991127)date"
                                    variant="outlined"
                                    style={inputBoxStyle}
                                    type="text"
                                    name="date"
                                    value={date}
                                    onChange={onChange}
                                />
                                <br />
                                <TextField
                                    id="outlined-company"
                                    label="company"
                                    variant="outlined"
                                    style={inputBoxStyle}
                                    type="text"
                                    name="belong"
                                    value={belong}
                                    onChange={onChange}
                                />
                                <br />
                                <TextField
                                    id="outlined-region"
                                    label="region"
                                    variant="outlined"
                                    style={inputBoxStyle}
                                    type="text"
                                    name="region"
                                    value={region}
                                    onChange={onChange}
                                />
                                <TextField
                                    id="outlined-region"
                                    label="country"
                                    variant="outlined"
                                    style={inputBoxStyle}
                                    type="text"
                                    name="country"
                                    value={country}
                                    onChange={onChange}
                                />
                                <TextField
                                    id="outlined-region"
                                    label="encodedImg"
                                    variant="outlined"
                                    style={inputBoxStyle}
                                    type="text"
                                    name="encodedImg"
                                    value={encodedImg}
                                    onChange={onChange}
                                />
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <hr className={styles.hrStyle}></hr>
            <div className={styles.navBtnStyle}>
                <Button variant="outlined" className={styles.boxStyle} type="submit">
                    제출
                </Button>
                <Link to="/">
                    <Button variant="outlined" className={styles.boxStyle}>
                        취소
                    </Button>
                </Link>
            </div>
        </form>
    );
}

export default SignUp;
