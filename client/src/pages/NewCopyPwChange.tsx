import React, { CSSProperties, useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import styles from "./Login.module.css";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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
        
//20230521 1:21 AM 수정
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

const mainRightDiv: CSSProperties = {
    display: 'flex',
}

const comfirmBtn: CSSProperties = {
    paddingLeft: '30px',
}

const texts: CSSProperties = {
    margin: '25px',
    marginBottom: '30px',
    marginTop: '15px',
    paddingLeft: '70px',
    marginRight: '-35px'
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
        width: '100%',
        height: '400px',
        flexDirection: 'column',
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
        width: '700px',
        marginTop: '30px'
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
        <form onSubmit={handleSubmit} style={body}>
            <header style={header}>New_Tempo_MyForm</header>

            <section style={mainScreen}>
                <h1 style={titleStyle}>TEMPO</h1>
                <div style={inputsection}>
                    <div>
                        <h2 style={texts}>이메일 확인</h2>
                        <h2 style={texts}>이전 비밀번호</h2>
                        <h2 style={texts}>새로운 비밀번호</h2>
                        <h2 style={texts}>비밀번호 확인</h2>
                    </div>
                    <div style={mainRightDiv}>
                        <div style={inputBoxStyle}>
                            <TextField id="outlined-basic" label="email" variant="outlined" style={inputBoxStyle} type="text" name="email" value={email} onChange={onChange}/>
                            <br/>
                            <TextField id="outlined-basic" label="Password" variant="outlined" style={inputBoxStyle} type="text" name="pastPw" value={pastPw} onChange={onChange}/>
                            <br/>
                            <TextField id="outlined-basic" label="New Password" variant="outlined" style={inputBoxStyle} type="text" name="newPw1" value={newPw1} onChange={onChange}/>
                            <br/>
                            <TextField id="outlined-basic" label="New Password" variant="outlined" style={inputBoxStyle} type="password" name="newPw2" value={newPw2} onChange={onChange}/>                           
                            {/* <input style={inputBoxStyle} type="text" name="password" value={password} onChange={onChange} /> */}
                        </div>
                        <div style={comfirmBtn}>
                            <Stack spacing={2} direction="column">
                                <Button variant="contained" type="submit" style={boxStyle}>확인</Button>
                                <Button variant="contained" type="submit" style={boxStyle}>확인</Button>
                            </Stack>
                            
                        </div>
                    </div>
                </div>
                
            </section>
            <hr style={hrStyle}></hr>
            <section style={navsection}>                
                <div style={navBtnStyle}>
                    <Link to="/">
                        <Button variant="outlined">변경</Button>
                    </Link>
                    <Link to="/myForm">
                        <Button variant="outlined">취소</Button>
                    </Link>
                </div>
            </section>
        </form>













        // <form onSubmit={handleSubmit} >
        //     <header style={header}>New_Tempo_PwChange</header>
        //     <div style={mainScreen}>
        //         <div style={mainBoxStyle}>
        //             <h1 style={titleStyle}>TEMPO</h1>
        //             <div style={inputTextStyle}>
        //                 <section >
        //                     이메일 확인
        //                     <input style={inputBoxStyle} className="idBox" type="text" name="email" value={email} onChange={onChange} />
        //                     <button style={boxStyle} type="submit">확인</button>
        //                     <br/>
        //                     이전 비밀번호
        //                     <input style={inputBoxStyle} className="idBox" type="text" name="pastPw" value={pastPw} onChange={onChange} />
        //                     <button style={boxStyle} type="submit">확인</button>
        //                 </section>
                        
        //                 <section>
        //                     변경할 비밀번호
        //                     <input style={inputBoxStyle} type="text" name="newPw1" value={newPw1} onChange={onChange} />
        //                     <br />
        //                     비밀번호 확인
        //                     <input style={inputBoxStyle} type="text" name="newPw2" value={newPw2} onChange={onChange} />
        //                 </section>
        //             </div>
                    
        //         </div>
        //     </div>

        //     <hr style={hrStyle}></hr>
        //     <div style={navBtnStyle}>
        //         <button style={boxStyle} type="submit">변경</button>
        //         {/* <button style={boxStyle} type="submit">취소</button> */}
        //         <Link to="/myForm">
        //             <button style={boxStyle} type="submit">취소</button>
        //         </Link>
        //     </div>            
        // </form>
    );
}

export default PwChange;