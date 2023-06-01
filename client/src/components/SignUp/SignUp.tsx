import React, { CSSProperties, useState } from "react";
import { Link } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./SignUp.css";

type SignUpProps = {
    onSubmit: (form: {
        email: string;
        name: string;
        password: string;
        passwordCk: string;
        company: string;
        region: string;
        birth: number;
    }) => void;
};

interface User {
    onSubmit: (form: {
        email: string;
        password: string;
        passwordCk?: string;
        name: string;
        // birthY?: number;
        // birthM?: number;
        // birthD?: number;
        birth: number;
        company?: string;
        region?: string;
    }) => void;
}

interface Birth {
    year: number;
    month: number;
    day: number;
}

function onSubmit(User: {
    email: string;
    password: string;
    passwordCk: string;
    name: string;
    birth: number;
    company: string;
    region: string;
}) {}

function SignUp() {
    const inputsection: CSSProperties = {
        display: "flex",
        float: "left",
        width: "40%",
    };

    const titleBox: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
    };

    //입력 박스 스타일
    const inputBoxStyle: CSSProperties = {
        width: "300px",
        height: "40px",
        marginLeft: "25px",
        marginBottom: "25px",
    };

    const [form, setForm] = useState({
        email: "",
        password: "",
        passwordCk: "",
        name: "",
        birth: 0,
        company: "",
        region: "",
    });

    const { email, password, passwordCk, name, birth, company, region } = form;

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(form);
        console.log("출력테스트");
        // 비밀번호 틀리면 아래 form이 제출되지 않도록 함.
        if (form.password !== form.passwordCk) {
            console.log("비밀번호를 확인하십시오.");
            return;
        }
        // 현재까지 year에 값 넣은 채로 회원가입 버튼 누르면 그 값 나타내기는 가능.
        //그러나 form안에 그 값이 들어가지 않음. 수정 필요. (2023-05-18 01:43 AM)
        console.log(selectedOption);
        console.log("출력테스트1");
        let birthM = selectedOption;
        console.log("bitthM:" + birthM);
        console.log(form);
        setForm({
            email: "",
            password: "",
            passwordCk: "",
            name: "",
            birth: 0,
            company: "",
            region: "",
        }); // 초기화
    };

    const [imageSrc, setImageSrc]: any = useState(null);

    const onUpload = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise<void>((resolve) => { 
            reader.onload = () => {	
                setImageSrc(reader.result || null); // 파일의 컨텐츠
                resolve();
            };
        });
    }

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
            <header>Tempo_SignUp</header>

            <section className="mainScreen">
                <h1 className="titleStyle">Tempo</h1>
                <div className="mainScreenComponent">
                    <div className="inputsection">
                        <div>
                            <h2>E-mail</h2>
                            <h2>Password</h2>
                            <h2>Password-Check</h2>
                        </div>
                        <div className="inputBoxStyle">
                            <TextField
                                id="outlined-basic"
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
                                id="outlined-basic"
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
                                id="outlined-basic"
                                label="비밀번호를 다시 입력하세요"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="password"
                                name="passwordCk"
                                value={passwordCk}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <hr className="vLine"></hr>

                    <div className="rightDiv">
                        <div className="inputsection2">
                            <div className="textDiv">
                                <h2 className="text">프로필 사진</h2>
                                <h2 className="text">이름</h2>
                                <h2 className="text">생년월일</h2>
                                <h2 className="text">소속</h2>
                                <h2 className="text">거주지</h2>
                            </div>
                            <div>
                                <section>
                                    <i className="far fa-user-circle, userIcon"></i>
                                    <input 
                                        accept="image/*" 
                                        multiple type="file"
                                        onChange={e => onUpload(e)}
                                    />
                                    <img 
                                        width={'70px'}
                                        height={'70px'} 
                                        src={imageSrc} 
                                    />
                                    <button className="boxStyle" type="submit">
                                        내PC에서 찾기
                                    </button>
                                    <button className="boxStyle" type="submit">
                                        취소
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
                                    label="YYYYMMDD 형식으로 입력하세요(ex.19991127)"
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
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <hr className="hrStyle"></hr>
            <div className="navBtnStyle">
                <Button variant="outlined" className="boxStyle" type="submit">
                    제출
                </Button>
                <Link to="/">
                    <Button variant="outlined" className="boxStyle">
                        취소
                    </Button>
                </Link>
            </div>
        </form>
    );
}

export default SignUp;
