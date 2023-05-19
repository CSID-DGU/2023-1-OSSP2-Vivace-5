import React, { CSSProperties, useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import styles from "./Login.module.css";
import CopySignUp from './CopySignUp';
// import Routers from "./src/routes";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';





/*
* 바로 밑에 type랑 function은 없어도 될 것 같아보임.
* 현재 console.log로 [확인]눌렀을 때 입력한 email, password 전송까지 OK
* --------------------------------
* 이제 [회원가입], [비밀번호 변경]눌렀을 때 페이지 이동 구현하면 됨.
*/
type MyFormProps = {
  onSubmit: (form: { name: string; password: string }) => void;
};

function onSubmit(MyFormProps: { name: string; password: string; }){
    
}


function CopyMyForm() {
    const mainScreen: CSSProperties= {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }

    //헤더 라인 스타일
    const header: CSSProperties = {
        backgroundColor: '#A6C0EE',
        fontSize: '30px',
        fontWeight: 'bold',
        paddingLeft: '20px',
        height: '50px'
    }
    
    //'등록'박스 스타일
    const boxStyle: CSSProperties= {
        // backgroundColor:'red',
        height: '2rem',
        width: '10rem',
        // margin: '1rem',
        marginTop: '20px'
    }

    //메인 박스 스타일
    const mainBoxStyle: CSSProperties= {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'orange',
        height: '50vh',
       /*
        display: 'flex',
        justifyContent: 'center',
        align-items: 'center,
        min-height: '100vh',
        */
    }

    // h1 TEMPO 스타일
    const titleStyle: CSSProperties= {
        fontWeight:'bold',
        fontSize: '60px'
    }


    //입력 박스 스타일
    const inputBoxStyle: CSSProperties= {
        width: '300px',
        height: '40px',
        marginLeft: '25px'
    }

    //입력 박스 옆 텍스트
    const inputTextStyle: CSSProperties= {
        fontSize: '30px',
        marginTop: '0px'
    }

    //가로선 스타일
    const hrStyle: CSSProperties= {
        border: '1px solid black',
        width: '700px'
        // border: solid 10px red
    }

    //nav 버튼 스타일
    const navBtnStyle: CSSProperties= {
        fontWeight: 'bold',
        // display: 'flex:',
        // flex: 1,
        // alignItems: 'space-evenly',
        // // justifyContent: 'space-evenly',
        // width: '500px',

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    }

    const [form, setForm] = useState({
        name: '',
        password: ''
    });

    const { name, password } = form;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
        ...form,
        [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // 여기도 모르니까 any 로 하겠습니다.
        e.preventDefault();
        onSubmit(form);

        //TEST용 console.log()
        console.log(form)
        setForm({
        name: '',
        password: ''
        }); // 입력칸 초기화
    };

    return (
        <form onSubmit={handleSubmit} >
            <section style={header}>Tempo_MyForm</section>
            <div style={mainScreen}>
                <div style={mainBoxStyle}>
                    <h1 style={titleStyle}>TEMPO</h1>
                    <section style={inputTextStyle}>
                        E-mail
                        <input style={inputBoxStyle} className="idBox" type="text" name="name" value={name} onChange={onChange} />
                    </section>
                    <br/>
                    <section style={inputTextStyle}>
                        Password
                        <input style={inputBoxStyle} type="text" name="password" value={password} onChange={onChange} />
                        <br />
                    </section>
                    {/* <button  style={boxStyle} type="submit">확인</button> */}
                    {/* MUI 사용 버튼 */}
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" type="submit" style={boxStyle}>로그인</Button>
                        {/* <Button variant="text" >Text</Button>
                        <Button variant="outlined">Outlined</Button> */}
                    </Stack>

                </div>
            </div>
            <hr style={hrStyle}></hr>
            <div style={navBtnStyle}>

                {/* Routes는 위치 어디다 둘 지 고민중. */}
                {/* Routes와 Route를 여기에 둘 필요 없음. 이미 App.tsx에서 Routes를 사용해서
                Link를 지정해주었기 때문. */}
                {/* <Routes>
                    <Route path="/signUp" element={<CopySignUp/>}>회원가입</Route>
                </Routes> */}

                <Link to="/signUp">회원가입</Link>
                <Link to="/pwChange">비밀번호 변경</Link>
                
            </div>
        </form>
    );
}

export default CopyMyForm;