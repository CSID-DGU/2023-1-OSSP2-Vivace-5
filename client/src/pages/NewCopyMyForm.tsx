import React, { CSSProperties, useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import styles from "./Login.module.css";
import CopySignUp from './CopySignUp';
// import Routers from "./src/routes";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


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
        width: '100%',
        height: '400px',
        flexDirection: 'column',
    }

    const body: CSSProperties = {
        margin: '0',
        width: '100%',
        height: '100%',
    }

    const inputsection: CSSProperties = {
        display: 'flex',
        float: 'left',
    }

    const navsection: CSSProperties = {
        display: 'block',
        justifyContent: 'space-between',
        marginLeft: '0px'
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

    // h1 TEMPO 스타일
    const titleStyle: CSSProperties= {
        fontWeight:'bold',
        fontSize: '60px',
    }


    //입력 박스 스타일
    const inputBoxStyle: CSSProperties= {
        width: '300px',
        height: '30px',
        marginBottom: '30px',
        marginLeft: '10px',

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
        <form onSubmit={handleSubmit} style={body}>
            <header style={header}>New_Tempo_MyForm</header>

            <section style={mainScreen}>
                <h1 style={titleStyle}>TEMPO</h1>
                <div style={inputsection}>
                    <div>
                        <h2>E-mail</h2>
                        <h2>Password</h2>
                    </div>
                    <div style={inputBoxStyle}>
                    
                        <TextField id="outlined-basic" label="input email" variant="outlined" style={inputBoxStyle} type="text" name="name" value={name} onChange={onChange}/>
                        <br/>
                        <TextField id="outlined-basic" label="input password" variant="outlined" style={inputBoxStyle} type="text" name="password" value={password} onChange={onChange}/>
                        {/* <input style={inputBoxStyle} type="text" name="password" value={password} onChange={onChange} /> */}
                    </div>
                </div>
                <Stack spacing={2} direction="row">
                    <Button variant="contained" type="submit" style={boxStyle}>로그인</Button>
                </Stack>
            </section>
            <hr style={hrStyle}></hr>
            <section style={navsection}>                
                <div style={navBtnStyle}>
                    <Link to="/signUp">
                        <Button variant="outlined">회원가입</Button>
                    </Link>
                    <Link to="/pwChange">
                        <Button variant="outlined">비밀번호 변경</Button>
                    </Link>
                </div>
            </section>
        </form>
    );
}

export default CopyMyForm;