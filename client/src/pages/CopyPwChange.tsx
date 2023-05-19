import React, { CSSProperties, useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import styles from "./Login.module.css";

type PwChangeProps = {
  onSubmit: (form: { 
    name: string;
    password: string;  
    }) => void;
};

// function onSubmit(PwChangeProps:{ name: string; password: string;})


interface UserPw {
    onSubmit: (form: { 
        email: string;
        pastPw: string;
        newPw1: string;
        newPw2: string;
    }) => void;
}

function PwChange() {
    
    function onSubmit(form: {
        email: string;
        pastPw: string;
        newPw1: string;
        newPw2: string;
        }) {
            return form;
        }
        

//css 시작
    //헤더 라인 스타일
    const header: CSSProperties = {
        backgroundColor: '#A6C0EE',
        fontSize: '30px',
        fontWeight: 'bold',
        paddingLeft: '20px',
        height: '50px'
    }
    
    //헤더 아리 전체 메인 화면 스타일
    const mainScreen: CSSProperties= {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }

    //'등록'박스 스타일
    const boxStyle: CSSProperties= {
        // backgroundColor:'red',
        height: '40px',
        width: '5rem',
        margin: '10px',
        borderRadius: '10px',
    }

    //메인 박스 스타일
    const mainBoxStyle: CSSProperties= {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'orange',
        height: '50vh',
        paddingTop: '100px',
        paddingBottom: '60px'
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
        marginLeft: '25px',
        marginBottom: '25px',
    }

    //입력 박스 옆 텍스트
    const inputTextStyle: CSSProperties= {
        fontSize: '25px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignContent: 'space-evenly',
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
//css 끝 

    const [form, setForm] = useState({
        email: '',
        pastPw: '',
        newPw1: '',
        newPw2: ''
    });

    const { email, pastPw, newPw1, newPw2 } = form;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
        ...form,
        [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(form);
        
        console.log("비번변경 출력테스트:" + form.email, form.pastPw, form.newPw1, form.newPw2);
        setForm({
        email: '',
        pastPw: '',
        newPw1: '',
        newPw2: ''
        }); 
    };

    return (
        <form onSubmit={handleSubmit} >
            <section style={header}>Tempo_PwChange</section>
            <div style={mainScreen}>
                <div style={mainBoxStyle}>
                    <h1 style={titleStyle}>TEMPO</h1>
                    <div style={inputTextStyle}>
                        <section >
                            이메일 확인
                            <input style={inputBoxStyle} className="idBox" type="text" name="email" value={email} onChange={onChange} />
                            <button style={boxStyle} type="submit">확인</button>
                            <br/>
                            이전 비밀번호
                            <input style={inputBoxStyle} className="idBox" type="text" name="pastPw" value={pastPw} onChange={onChange} />
                            <button style={boxStyle} type="submit">확인</button>
                        </section>
                        
                        <section>
                            변경할 비밀번호
                            <input style={inputBoxStyle} type="text" name="newPw1" value={newPw1} onChange={onChange} />
                            <br />
                            비밀번호 확인
                            <input style={inputBoxStyle} type="text" name="newPw2" value={newPw2} onChange={onChange} />
                        </section>
                    </div>
                    
                </div>
            </div>
            <hr style={hrStyle}></hr>
            <div style={navBtnStyle}>
                <button style={boxStyle} type="submit">변경</button>
                <button style={boxStyle} type="submit">취소</button>
            </div>
                {/* <Link to={"/container"}>
                    이동하자
                </Link> */}
            
        </form>
    );
}

export default PwChange;