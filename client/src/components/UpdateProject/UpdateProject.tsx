import React, { CSSProperties, useState } from "react";
import styles from "./UpdateProject.module.css";
import axios from "axios";
import { API_HOST } from "../../config/constants";

type ProjectCorrProps = {
    onSubmit: (form: { name: string; password: string }) => void;
};

function onSubmit(ProjectCorrProps: { name: string; password: string }) {}

function UpdateProject() {
    const [form, setForm] = useState({
        name: "",
        password: "",
    });

    const { name, password } = form;

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
            name: "",
            password: "",
        }); // 초기화
    };

    // const handleWithdrawProject = async () => {
    //     try {
    //         await axios.delete(`${API_HOST}/project/withdraw/{id}`, {
    //             data: { id: projectId },
    //             headers: { Authorization: localStorage.getItem("access-token") },
    //         });
    //         // Handle success or perform any necessary actions
    //     } catch (error) {
    //         // Handle error or display an error message
    //     }
    // };

    // const handleDeleteProject = async () => {
    //     try {
    //         await axios.delete(`${API_HOST}/project/delete/{id}`, {
    //             data: { id: projectId },
    //             headers: { Authorization: localStorage.getItem("access-token") },
    //         });
    //         // Handle success or perform any necessary actions
    //     } catch (error) {
    //         // Handle error or display an error message
    //     }
    // };

    return (
        <form className={styles.form}>
            <div className={styles.upperPage}>
                {/*  프로젝트 정보를 나타내는 테이블*/}
                <table className={styles.mainTable}>
                    <tbody>
                        <tr className={styles.trStyle}>
                            <th scope="row">프로젝트 이름</th>
                            <td className={styles.tdStyle}>
                                VIVACE-OSSP
                                <button className={styles.corrBtnStyle}>
                                    <i className={`${styles.far} ${"fa-edit"}`}></i>
                                </button>
                            </td>
                        </tr>
                        <tr className={styles.trStyle}>
                            <th scope="row">프로젝트 설명</th>
                            <td className={styles.tdStyle}>
                                직관적이고 사용하기 쉬운 GRAPH 기반의 프로젝트 관리도구
                                <button className={styles.corrBtnStyle}>
                                    <i className={`${styles.far} ${"fa-edit"}`}></i>
                                </button>
                            </td>
                        </tr>
                        <tr className={styles.trStyle}>
                            <th scope="row">프로젝트 생성 일자</th>
                            <td className={styles.tdStyle}>
                                2023.05.11
                                <button className={styles.corrBtnStyle}>
                                    <i className={`${styles.far} ${"fa-edit"}`}></i>
                                </button>
                            </td>
                        </tr>
                        <tr className={styles.trStyle}>
                            <th scope="row">프로젝트 멤버</th>
                            <td className={styles.tdStyle}>
                                {/* <<<<<<< Updated upstream:client/src/components/UpdateProject/UpdateProject.tsx */}
                                props.name1 props.name2 props.name3 props.name4 props.name5 =======
                                {/* props.name1
                                props.name2
                                props.name3
                                props.name4
                                props.name5 */}
                                {/* >>>>>>> Stashed changes:client/src/pages/NewCopyProjectCorr.tsx */}
                                <button className={styles.corrBtnStyle}>
                                    <i className={`${styles.far} ${"fa-edit"}`}></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 프로젝트 나가기&삭제 버튼 들어있는 div */}
            {/* <div className={styles.lowerPage}>
                <div className={styles.lowerDiv}>
                    <button className={styles.buttonStyle} onClick={handleWithdrawProject}>
                        프로젝트 나가기
                    </button>
                    <button className={styles.deletebtn} onClick={handleDeleteProject}>
                        프로젝트 삭제
                    </button>
                </div>
            </div> */}
        </form>
    );
}

export default UpdateProject;
