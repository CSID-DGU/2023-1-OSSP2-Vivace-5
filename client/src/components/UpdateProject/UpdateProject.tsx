import React, { CSSProperties, useState } from "react";
import styles from "./UpdateProject.module.css";

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
                                        // value={Pname}
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
                                        name="Pdescription"
                                        // value={Pdescription}
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
                                        name="PcreDate"
                                        // value={PcreDate}
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