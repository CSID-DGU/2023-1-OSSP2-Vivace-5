import React, { CSSProperties, useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import styles from "./Login.module.css";

type MyFormProps = {
  onSubmit: (form: { name: string; password: string }) => void;
};

function MyForm({ onSubmit }: MyFormProps) {
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
        height: '5rem',
        width: '10rem',
        margin: '1rem'
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
        fontSize: '40px',
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
        setForm({
        name: '',
        password: ''
        }); // 초기화
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
                    <button style={boxStyle} type="submit">확인</button>
                </div>
            </div>
            <hr style={hrStyle}></hr>
            <div style={navBtnStyle}>
                <a>회원가입</a>
                <a>비밀번호 변경</a>
            </div>
        </form>
    );
}

export default MyForm;