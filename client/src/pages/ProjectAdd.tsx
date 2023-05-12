import React, { CSSProperties, useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import styles from "./Login.module.css";

type ProjectAddProps = {
  pSubmit: (form: { 
    Pname: string;
    Pdescription: string;
    PcreDate: string;
    Pmember: {
        name: string;
    } 
    }) => void;
};

function ProjectAdd({ pSubmit }: ProjectAddProps) {
//css시작
    const formStyle: CSSProperties = {
        height: '720px',
    }
    const upperPage: CSSProperties = {
        width: '100%',
        height: '60%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
    const lowerPage: CSSProperties = {
        width: '100%',
        height: '40%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const mainTable: CSSProperties= {
        
        borderCollapse: 'collapse',
        border: '1px solid black',
        letterSpacing: '1px',
        fontSize: '0.8rem',
        width: '54%'
    }

    const trStyle: CSSProperties = {
        border: '1px solid black',
        padding: '5px 10px',
        width: '30%',
        backgroundColor: '#A6C0EE'
    }

    const tdStyle: CSSProperties = {
        border: '1px solid black',
        padding: '5px 10px',
        width: '70%',
        backgroundColor: 'white'
        
    }

    const corrBtnStyle: CSSProperties = {
        float: 'left',
        backgroundColor: 'white',
        border: '0px'
    }

    const buttonStyle: CSSProperties = {
        width: '100%',
        height: '50px',
        margin: '5px',
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '150%',
    }

    const inputBoxStyle: CSSProperties = {
        border: '0px solid black',
        width: '100%',
        height: '100%',
    }

    const plusBtn: CSSProperties = {
        color: '#A6C0EE',
        width: '100%',
        fontSize: '25px'
    }
//css끝
    const [form, setForm] = useState({
        Pname: '',
            Pdescription: '',
            PcreDate: '',
            Pmember: {
                name: ''
            }
    });

    const { Pname, Pdescription, PcreDate, Pmember} = form;

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
        pSubmit(form);
        setForm({
            Pname: '',
            Pdescription: '',
            PcreDate: '',
            Pmember: {
                name: ''
            }
        }); // 초기화
    };

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    
        console.log(pSubmit(form));
    }
    
    function alertBtn(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        alert("같은 소속 내 사람들의 이름이 optional list로 들어갈 예정입니다.");
    }

    return (
        <form style={formStyle}>

        (left/right) bar는 각각 widh 23%로 설정하면 됩니다.
            
            <div style={upperPage}>
                {/*  프로젝트 정보를 나타내는 테이블*/}
                <table style={mainTable}>
                    
                    <tbody>
                        <tr style={trStyle}>
                            <th scope="row">프로젝트 이름</th>
                            <td style={tdStyle}>
                                <input style={inputBoxStyle} className="idBox" type="text" name="Pname" value={Pname} onChange={onChange} placeholder="이름 입력"/>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th scope="row">프로젝트 설명</th>
                            <td style={tdStyle}>
                                <input style={inputBoxStyle} className="idBox" type="text" name="Pdescription" value={Pdescription} onChange={onChange} placeholder="설명 입력"/>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th scope="row">프로젝트 생성 일자</th>
                            <td style={tdStyle}>
                                <input style={inputBoxStyle} className="idBox" type="text" name="PcreDate" value={PcreDate} onChange={onChange} />                                
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th scope="row">프로젝트 멤버</th>
                            <td style={tdStyle}>
                                <button style={corrBtnStyle} type="button" onClick={alertBtn}>
                                    <i className="fas fa-plus-square" style={plusBtn}></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            {/* 프로젝트 나가기&삭제 버튼 들어있는 div */}
            <div style={lowerPage}>
                <div>
                    <button style={buttonStyle} type="button" onClick={handleClick}>프로젝트 생성하기</button>
                </div>
            </div>
            
        </form>
    );
}

export default ProjectAdd;