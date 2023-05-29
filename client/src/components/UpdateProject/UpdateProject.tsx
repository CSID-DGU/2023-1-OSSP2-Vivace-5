import React, { CSSProperties, useState } from "react";
import "./UpdateProject.css";

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
        <form>

            <div className="upperPage">
                {/*  프로젝트 정보를 나타내는 테이블*/}
                <table className="mainTable">
                    <tbody>
                        <tr className="trStyle">
                            <th scope="row">프로젝트 이름</th>
                            <td className="tdStyle">
                                VIVACE-OSSP
                                <button className="corrBtnStyle">
                                    <i className="far fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        <tr className="trStyle">
                            <th scope="row">프로젝트 설명</th>
                            <td className="tdStyle">
                                직관적이고 사용하기 쉬운 GRAPH 기반의 프로젝트 관리도구
                                <button className="corrBtnStyle">
                                    <i className="far fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        <tr className="trStyle">
                            <th scope="row">프로젝트 생성 일자</th>
                            <td className="tdStyle">
                                2023.05.11
                                <button className="corrBtnStyle">
                                    <i className="far fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        <tr className="trStyle">
                            <th scope="row">프로젝트 멤버</th>
                            <td className="tdStyle">
{/* <<<<<<< Updated upstream:client/src/components/UpdateProject/UpdateProject.tsx */}
                                props.name1 props.name2 props.name3 props.name4 props.name5
=======
                                {/* props.name1
                                props.name2
                                props.name3
                                props.name4
                                props.name5 */}
{/* >>>>>>> Stashed changes:client/src/pages/NewCopyProjectCorr.tsx */}
                                <button className="corrBtnStyle">
                                    <i className="far fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 프로젝트 나가기&삭제 버튼 들어있는 div */}
            <div className="lowerPage">
                <div className="lowerDiv">
                    <button className="buttonStyle">프로젝트 나가기</button>
                    <button className="deletebtn">프로젝트 삭제</button>
                </div>
            </div>
        </form>
    );
}

export default UpdateProject;