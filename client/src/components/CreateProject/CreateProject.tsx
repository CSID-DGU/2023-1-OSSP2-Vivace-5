import React, { CSSProperties, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import styles from "./CreateProject.module.css";

type ProjectAddProps = {
    pSubmit: (form: {
        Pname: string;
        Pdescription: string;
        PcreDate: string;
        Pmember: {
            name: string;
        };
    }) => void;
};

function pSubmit(ProjectAddProps: {
    Pname: string;
    Pdescription: string;
    PcreDate: string;
    Pmember: {
        name: string;
    };
}) {}

function CreateProject() {
    
    const [form, setForm] = useState({
        Pname: "",
        Pdescription: "",
        PcreDate: "",
        Pmember: {
            name: "",
        },
    });

    const { Pname, Pdescription, PcreDate, Pmember } = form;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // 여기도 모르니까 any 로 하겠습니다.
        e.preventDefault();
        pSubmit(form);
        console.log(form);
        setForm({
            Pname: "",
            Pdescription: "",
            PcreDate: "",
            Pmember: {
                name: "",
            },
        }); // 초기화
    };

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        console.log(pSubmit(form));
    }

    function alertBtn(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        alert("같은 소속 내 사람들의 이름이 optional list로 들어갈 예정입니다.");
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
                                        name="Pname"
                                        value={Pname}
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
                                        value={Pdescription}
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
                                        value={PcreDate}
                                        onChange={onChange}
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
