import axios, { AxiosResponse } from "axios";
import React, { CSSProperties, useState } from "react";
import { API_HOST } from "../../config/constants";
import styles from "./UpdateProject.module.css";

type ProjectCorrProps = {
    onSubmit: (form: { title: string; description: string; type: string; encodedImg:string; members:string[] }) => void;
};

function onSubmit(ProjectCorrProps: { title: string; description: string; type: string; encodedImg:string; members: { name:string ; right:string}}) {}




//*******************************************

async function UpdateProject() {
    const [form, setForm] = useState({
        title:"",
        description: "",
        type: "",
        encodedImg: "",
        members: {
            name: "",
            right: "",
        }
    });


    const { title, description, type, encodedImg, members } = form;

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
        setForm({
            title:form.title,
            description: form.description,
            type: form.type,
            encodedImg: form.encodedImg,
            members: {
                name: form.members.name,
                right: form.members.right,
            }
        }); // 초기화
    };


    try {
        //put통해서 사용자 정보 전부 바꾸기
        const res: AxiosResponse = await axios.put(`${API_HOST}/user/signin`, form);
        
        console.log("res.data출력");
        console.log(res.data);
            
        if(res.status == 201) {
            console.log("Infomation Update Success!");    
        }
        } catch (error)  {
            console.log(error);
    }

    
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
                                        name="title"
                                        value={title}
                                        onChange={onChange}
                                        placeholder="이름 입력"
                                    />
                                </td>
                            </tr>
                            <tr className={styles.trStyle}>
                                <th scope="row" className={styles.th}>프로젝트 설명</th>
                                <td className={styles.tdStyle}>
                                    <input
                                        className={styles.inputBoxStyle }
                                        // className="idBox"
                                        type="text"
                                        name="description"
                                        value={description}
                                        onChange={onChange}
                                        placeholder="설명 입력"
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
                                        value={type}
                                        onChange={onChange}
                                    />
                                </td>
                            </tr>
                            <tr className={styles.trStyle}>
                                <th scope="row">base64 URL들어갈 자리</th>
                                <td className={styles.tdStyle}>
                                    <input
                                        className={styles.inputBoxStyle}
                                        // className="idBox"
                                        type="text"
                                        name="encodedImg"
                                        value={encodedImg}
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
                                        name="members"
                                        // value={{form.members.name},
                                        // {form.members.right}}
                                        onChange={onChange}
                                    />
                                </td>
                            </tr>
                            <tr className={styles.trStyle}>
                                <th scope="row">프로젝트 멤버</th>
                                <td className={styles.tdStyle}>
                                    <button className={styles.corrBtnStyle} type="button">
                                        <i className={`${styles.fas} ${styles["fa-plus-square"]} $[styles.plusBtn]`}></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 프로젝트 나가기&삭제 버튼 들어있는 div */}
            <div className={styles.lowerPage}>
                <div className={styles.lowerDiv}>
                    <button className={styles.buttonStyle}>프로젝트 나가기</button>
                    <button className={styles.deletebtn}>프로젝트 삭제</button>
                </div>
            </div>
        </form>
    );
}

export default UpdateProject;