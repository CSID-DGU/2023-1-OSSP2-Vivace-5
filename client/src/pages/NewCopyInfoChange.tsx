import React, { CSSProperties, useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import styles from "./Login.module.css";
import Select from "react-select";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

type InfoChangeProps = {
  onSubmit: (form: {
    name: string; 
    birth: number;
    company: string;
    region: string;
}) => void;
};

// { onSubmit }: InfoChangeProps

interface InfoChange {
    onSubmit: (form: { 
        name: string;
        birth: number;
        company: string;
        region: string;
    }) => void;
}

function InfoChange() {
    function onSubmit(form: { 
        name: string;
        birth: number;
        company: string;
        region: string;
    }) {
        return form;
    }

    type OptionType = {
        value: string;
        label: string;
    }

    const options:OptionType[] = [
        {value: '1999', label: '1999년'},
        {value: '2000', label: '2000년'},
        {value: '2001', label: '2001년'},
        {value: '2002', label: '2002년'},
        {value: '2003', label: '2003년'},
        {value: '2004', label: '2004년'},
        {value: '2005', label: '2005년'},   
    ]

    //여기는 내가 적은 코드

    const MyComponent = () => {
        <Select options={options} />
    }

    // var state = {
    //     selectedOptions: null,
    // }
    // const {selectedOption} = this.state;
    function handleChange(){

    }
    
//css 시작

    //20230521 02:00 AM 수정
    const body: CSSProperties = {
        margin: '0',
        width: '100%',
        height: '100%',
    }

    const inputsection: CSSProperties = {
        display: 'flex',
        float: 'left',
    }

    const comfirmBtn: CSSProperties = {
        marginTop: '30px',
        // paddingLeft: '30px',
        display: 'flex',
        justifyContent: 'center',
    }

    const texts: CSSProperties = {
        margin: '25px',
        marginBottom: '30px',
        marginTop: '30px',
        paddingLeft: '70px',
        marginRight: '-35px'
    }

    const textDiv: CSSProperties = {
        marginTop: '1%'
    }

    const navsection: CSSProperties = {
        display: 'block',
        justifyContent: 'space-between',
        marginLeft: '0px'
    }

    const mainRightDiv: CSSProperties = {
        display: 'flex',
        marginBottom: '100px'
    }

    const userIcon: CSSProperties = {
        fontSize: '4rem',
        fontWeight: 'lightweight',
        borderColor: 'gray',
        marginLeft: '50px',
        marginRight: '20px',
        marginBottom: '20px'
    }

    

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
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }

    //'등록'박스 스타일
    const boxStyle: CSSProperties= {
        // backgroundColor:'red',
        height: '40px',
        width: '8rem',
        margin: '10px',
        borderRadius: '10px',
    }

    const boxStyle2: CSSProperties= {
        
        height: '40px',
        width: '20rem',
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
        fontSize: '60px',
        textAlign: 'center',
        margin: '30px'   
    }


    //입력 박스 스타일
    const inputBoxStyle: CSSProperties= {
        width: '300px',
        height: '40px',
        marginLeft: '25px',
        marginBottom: '30px',
        marginTop: '-2px',
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
        // justifyContent: 'space-evenly',
        width: '100%',
        // paddingLeft: '30px',
        
        justifyContent: 'center',   
    }

    //선택 옵션 리스트 스타일
    const optionBoxStyle: CSSProperties= {
        // display: 'flex',
        // flex: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-evenly',
        height: '40px',
        width: '5rem',
        // margin: '10px',
        // borderRadius: '10px',
        display: 'inline-block',
    }

    const optionBox: CSSProperties ={
        width: '100%',
        textAlign: 'center'
    }

    const birthBox: CSSProperties = {
        marginBottom: '30px',
    }

    const footer: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
    }
    
    const footerBoxStyle: CSSProperties = {
        width: '20%',
        height: '50px',
        margin: '50px',
        borderRadius: '10px'
    }

    const delText: CSSProperties = {
        color: 'red',
    }
//css 끝 

    const [form, setForm] = useState({
        name: '',
        birth: 0,
        company: '',
        region: '',
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
            name: '',
            birth: 0,
            company: '',
            region: '',
        
        }); // 초기화
    };

    return (
        <form onSubmit={handleSubmit} style={body}>
            <header style={header}>New_Tempo_MyForm</header>

            <section style={mainScreen}>
                <h1 style={titleStyle}>TEMPO</h1>
                <div style={inputsection}>
                    <div style={textDiv}>
                        <h2 style={texts}>프로필 사진</h2>
                        <h2 style={texts}>이름</h2>
                        <h2 style={texts}>생년월일</h2>
                        <h2 style={texts}>소속</h2>
                        <h2 style={texts}>거주지</h2>
                    </div>
                    <div style={mainRightDiv}>
                        <div style={inputBoxStyle}>
                            <section>
                                <i className="fas fa-user-edit" style={userIcon}></i>
                                <button style={boxStyle} type="submit">내PC에서 찾기</button>
                            </section>
                            <TextField id="outlined-basic" label="name" variant="outlined" style={inputBoxStyle} type="text" name="name" value={name} onChange={onChange}/>
                            <br/>
                            <TextField id="outlined-basic" label="birth(ex.19991127)" variant="outlined" style={inputBoxStyle} type="text" name="birth" value={birth} onChange={onChange}/>
                            <br/>
                            <TextField id="outlined-basic" label="company" variant="outlined" style={inputBoxStyle} type="text" name="company" value={company} onChange={onChange}/>
                            <br/>
                            <TextField id="outlined-basic" label="region" variant="outlined" style={inputBoxStyle} type="text" name="region" value={region} onChange={onChange}/>                           
                        </div>
                        
                    </div>
                </div>
                
            </section>
            <hr style={hrStyle}></hr>
            <section style={navsection}>                
                <div style={navBtnStyle}>
                    <Link to="/">
                        <Button variant="outlined" style={boxStyle}>변경</Button>
                    </Link>
                    <Link to="/myForm">
                        <Button variant="outlined" style={boxStyle}>취소</Button>
                    </Link>
                </div>
            </section>
            <div style={comfirmBtn}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" type="submit" style={boxStyle2}>확인</Button>
                    <Button variant="outlined" color="error" style={boxStyle2}>계정 삭제</Button>
                </Stack> 
            </div>
        </form>
    );
}

export default InfoChange;