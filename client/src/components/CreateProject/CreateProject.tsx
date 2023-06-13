import axios, { AxiosResponse } from "axios";
import React, { CSSProperties, useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { API_HOST } from "../../config/constants";
import styles from "./CreateProject.module.css";
import TextField from "@mui/material/TextField";

type ProjectAddProps = {
    pSubmit: (form: {
        title: string;
        description: string;
        type: string;
        encodedImg: string;
        members: {
            name: string,
            right: string
        }
    }) => void;
};

function pSubmit(ProjectAddProps: {
    title: string;
    description: string;
    type: string;
    encodedImg: string;
    members: {
        name: string,
        right: string,
    }
}) {}

function CreateProject() {
    
    const [form, setForm] = useState({
        title:"",
        description: "",
        type: "",
        encodedImg: "",
        members: {
            name: "",
            right: "",
        },
    });

    const { title, description, type, encodedImg, members:stringArray} = form;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };


    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        console.log(pSubmit(form));
    }

    function alertBtn(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        alert("같은 소속 내 사람들의 이름이 optional list로 들어갈 예정입니다.");
    }


//**************************************************

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        pSubmit(form);

        console.log(form);
        setForm({
            title:"",
            description: "",
            type: "",
            encodedImg: "",
            members: {
                name: "",
                right: "",
            },
        });

    try {
        const  projectData = {
            "title": title,
            "description": description,
            "type": type,
            "encodedImg": encodedImg,
            "members": [
            {
                "name": form.members.name,
                "right": form.members.right
            }
            ]
        }    
        console.log(form);
        console.log(projectData);

        interface users {
            "id": string;
            "firstName": string,
            "lastName": string,
            "email": "string",
            "year": number,
            "month": number,
            "date": number,
            "belong": string,
            "country": string,
            "region": string,
            "encodedImg": string,
            "createdAt": string
        }

        const [users, setUsers] = useState([{
            "id": "",
            "firstName": "",
            "lastName": "",
            "email": "",
            "year": 0,
            "month": 0,
            "date": 0,
            "belong": "",
            "country": "",
            "region": "",
            "encodedImg": "",
            "createdAt": ""
        }]);

        const [sameBelongusers, setSameBelongUsers] = useState([{
            "id": "",
            "firstName": "",
            "lastName": "",
            "email": "",
            "year": 0,
            "month": 0,
            "date": 0,
            "belong": "",
            "country": "",
            "region": "",
            "encodedImg": "",
            "createdAt": ""
        }]);
//로그인한 user정보 받아오기
        useEffect(() => {
          axios.get(`${API_HOST}/user/info/`)
            .then(response => response.data)
            .then(response => {
                setUsers(response.results)
            })
        }, []);

//여기선 dongguk이 아니라, 각 사용자의 belong을 받아와야 함(수정 필요!).
    let sameBelongUser: [string];

        for(let i=0; i<users.length; i++) {
            if(users[i].belong == 'dongguk') {
                setSameBelongUsers(users)
                console.log(sameBelongusers[i].belong);
            }
        }

        const res1: AxiosResponse = await axios.post(`${API_HOST}/project/create`, projectData);
        console.log(res1);

//token가져오는게 이게 맞는지 확인 필요.
        let token = localStorage.getItem('Bearer access-token');
        
        if(res1.status === 200) {
            console.log("Successfully created project!");
            console.log("your token: " + token);
        }

    }catch (error) {
                if (axios.isAxiosError(error)) {
                    alert(error);
                }
    }

};


    return (
        <form className={styles.formStyle} onSubmit={handleSubmit}>
            <header className={styles.header}></header>
            <section className={styles.mainSection}>
                <div className={styles.upperPage}>
                    <table className={styles.mainTable}>
                        <tbody className={styles.tbody}>
                            <tr className={styles.trStyle}>
                                <th scope="row">프로젝트 이름</th>
                                <td className={styles.tdStyle}>
                                    <input
                                        className={styles.inputBoxStyle}
                                        // className="idBox"
                                        type="text"
                                        name="Pname"
                                        // value={title}
                                        // onChange={title}
                                        placeholder="이름 입력"
                                    />
                                </td>
                            </tr>
                            <tr className={styles.trStyle}>
                                <th scope="row" className={styles.th}>프로젝트 설명</th>
                                <td className={styles.tdStyle}>
                                    <input
                                        className={styles.inputBoxStyle}
                                        // className="idBox"
                                        type="text"
                                        name="description"
                                        // value={description}
                                        // onChange={onChange}
                                        placeholder="설명 입력"
                                    />



                                    <TextField
                                        id="outlined-email"
                                        label="이메일"
                                        variant="outlined"
                                        className={styles.inputBoxStyle}
                                        type="text"
                                        name="title"
                                        value={title}
                                        onChange={onChange}
                                    />


                                    <TextField
                                        id="outlined-email"
                                        label="이메일"
                                        variant="outlined"
                                        className={styles.inputBoxStyle}
                                        type="text"
                                        name="description"
                                        value={description}
                                        onChange={onChange}
                                    />


                                    <TextField
                                        id="outlined-email"
                                        label="이메일"
                                        variant="outlined"
                                        className={styles.inputBoxStyle}
                                        type="text"
                                        name="type"
                                        value={type}
                                        onChange={onChange}
                                    />


                                    <TextField
                                        id="outlined-email"
                                        label="이메일"
                                        variant="outlined"
                                        className={styles.inputBoxStyle}
                                        type="text"
                                        name="encodedImg"
                                        value={encodedImg}
                                        onChange={onChange}
                                    />


                                    <TextField
                                        id="outlined-email"
                                        label="이메일"
                                        variant="outlined"
                                        className={styles.inputBoxStyle}
                                        type="text"
                                        name="name"
                                        value={form.members.name}
                                        onChange={onChange}
                                    />


                                    <TextField
                                        id="outlined-email"
                                        label="이메일"
                                        variant="outlined"
                                        className={styles.inputBoxStyle}
                                        type="text"
                                        name="right"
                                        value={form.members.right}
                                        onChange={onChange}
                                    />
                                    {/* <input onChange={onChange} value={members.right} /> */}


                                    <TextField
                                        id="outlined-email"
                                        label="이메일"
                                        variant="outlined"
                                        className={styles.inputBoxStyle}
                                        type="text"
                                        name="title"
                                        value={title}
                                        onChange={onChange}
                                    />



                                </td>
                            </tr>
                            <tr className={styles.trStyle}>
                                <th scope="row">프로젝트 생성 일자</th>
                                <td className={styles.tdStyle}>
                                    <input
                                        className={styles.inputBoxStyle}
                                        // className="idBox"
                                        type="text"
                                        name="type"
                                        // value={type}
                                        // onChange={onChange}
                                    />
                                </td>
                            </tr>
                            <tr className={styles.trStyle}>
                                <th scope="row">프로젝트 멤버</th>
                                <td className={styles.tdStyle}>
                                    <button className={styles.corrBtnStyle} type="button" onClick={alertBtn}>
                                        <i className={`${styles.fas} ${styles["fa-plus-square"]} $[styles.plusBtn]`}></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            
            <div className={styles.lowerPage}>
                <div>
                    <button className={styles.buttonStyle} type="submit" onClick={handleClick}>
                        프로젝트 생성하기
                    </button>
                </div>
            </div>
        </form>
    );
}

export default CreateProject;
