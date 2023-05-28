import React, { CSSProperties, useState } from "react";

type ProjectCorrProps = {
    onSubmit: (form: { name: string; password: string }) => void;
};

function onSubmit(ProjectCorrProps: { name: string; password: string }) {}

function UpdateProject() {
    //css시작
    const formStyle: CSSProperties = {
        height: "720px",
    };
    const upperPage: CSSProperties = {
        width: "100%",
        height: "70%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };
    const lowerPage: CSSProperties = {
        width: "100%",
        height: "30%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const mainTable: CSSProperties = {
        borderCollapse: "collapse",
        border: "1px solid black",
        letterSpacing: "1px",
        fontSize: "0.8rem",
        width: "54%",
    };

    const lowerDiv: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        borderCollapse: "collapse",
        // border: '1px solid black',
        letterSpacing: "1px",
        fontSize: "0.8rem",
        width: "54%",
        paddingBottom: "100px",
    };
    const trStyle: CSSProperties = {
        border: "1px solid black",
        padding: "5px 10px",
        width: "30%",
        height: "60px",
        backgroundColor: "#A6C0EE",
    };

    const tdStyle: CSSProperties = {
        border: "1px solid black",
        padding: "5px 10px",
        width: "70%",
        backgroundColor: "white",
    };

    const corrBtnStyle: CSSProperties = {
        float: "right",
        backgroundColor: "white",
        border: "0px",
    };

    const buttonStyle: CSSProperties = {
        width: "30%",
        height: "50px",
        margin: "10px",
        fontSize: "20px",
    };

    const deletebtn: CSSProperties = {
        width: "30%",
        height: "50px",
        margin: "10px",
        fontSize: "20px",
        color: "red",
    };
    //css끝
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
        // 여기도 모르니까 any 로 하겠습니다.
        e.preventDefault();
        onSubmit(form);
        setForm({
            name: "",
            password: "",
        }); // 초기화
    };

    return (
        <form style={formStyle}>
            {/* (left/right) bar는 각각 widh 23%로 설정하면 됩니다. */}

            <div style={upperPage}>
                {/*  프로젝트 정보를 나타내는 테이블*/}
                <table style={mainTable}>
                    <tbody>
                        <tr style={trStyle}>
                            <th scope="row">프로젝트 이름</th>
                            <td style={tdStyle}>
                                VIVACE-OSSP
                                <button style={corrBtnStyle}>
                                    <i className="far fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th scope="row">프로젝트 설명</th>
                            <td style={tdStyle}>
                                직관적이고 사용하기 쉬운 GRAPH 기반의 프로젝트 관리도구
                                <button style={corrBtnStyle}>
                                    <i className="far fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th scope="row">프로젝트 생성 일자</th>
                            <td style={tdStyle}>
                                2023.05.11
                                <button style={corrBtnStyle}>
                                    <i className="far fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th scope="row">프로젝트 멤버</th>
                            <td style={tdStyle}>
{/* <<<<<<< Updated upstream:client/src/components/UpdateProject/UpdateProject.tsx */}
                                props.name1 props.name2 props.name3 props.name4 props.name5
=======
                                {/* props.name1
                                props.name2
                                props.name3
                                props.name4
                                props.name5 */}
{/* >>>>>>> Stashed changes:client/src/pages/NewCopyProjectCorr.tsx */}
                                <button style={corrBtnStyle}>
                                    <i className="far fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 프로젝트 나가기&삭제 버튼 들어있는 div */}
            <div style={lowerPage}>
                <div style={lowerDiv}>
                    <button style={buttonStyle}>프로젝트 나가기</button>
                    <button style={deletebtn}>프로젝트 삭제</button>
                </div>
            </div>
        </form>
    );
}

export default UpdateProject;
