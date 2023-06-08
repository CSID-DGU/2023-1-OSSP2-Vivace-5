import React, { CSSProperties, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./UpdateInfo.module.css";
import { style } from "d3";

type InfoChangeProps = {
    onSubmit: (form: { name: string; birth: number; company: string; region: string; encodedImg:string }) => void;
};

// { onSubmit }: InfoChangeProps

interface InfoChange {
    onSubmit: (form: { name: string; birth: number; company: string; region: string; encodedImg:string }) => void;
}

function UpdateInfo() {
    function onSubmit(form: { name: string; birth: number; company: string; region: string; encodedImg:string }) {
        return form;
    }

    type OptionType = {
        value: string;
        label: string;
    };

    const options: OptionType[] = [
        { value: "1999", label: "1999년" },
        { value: "2000", label: "2000년" },
        { value: "2001", label: "2001년" },
        { value: "2002", label: "2002년" },
        { value: "2003", label: "2003년" },
        { value: "2004", label: "2004년" },
        { value: "2005", label: "2005년" },
    ];

    //여기는 내가 적은 코드

    const MyComponent = () => {
        <Select options={options} />;
    };

    // var state = {
    //     selectedOptions: null,
    // }
    // const {selectedOption} = this.state;
    function handleChange() {}

    //입력 박스 스타일
    const inputBoxStyle: CSSProperties = {
        width: "300px",
        height: "40px",
        marginLeft: "25px",
        marginBottom: "30px",
        marginTop: "-2px",
    };

    const [form, setForm] = useState({
        name: "",
        birth: 0,
        company: "",
        region: "",
        encodedImg: "",
    });
    const { name, birth, company, region, encodedImg } = form;

    //이미지 base64 만들기
    const [imgUrl, setimgUrl] = useState<string | undefined>(
        undefined
      );

    const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];

        //   이미지 jpg, jpeg로만 받을지 생각중
        //   if (file.name.split('.').pop()?.toLowerCase() !== 'jpg' || file.name.split('.').pop()?.toLowerCase() !== 'jpeg') {
        //     alert('에러가 발생하였습니다.');
        //     return;
        //   }

          const fileReader = new FileReader();
          fileReader.onload = () => {
            if (typeof fileReader.result === 'string') {
              setimgUrl(fileReader.result);
            }
          };
          
          console.log("test 1");
          console.log(imgUrl);
          console.log(file);

          fileReader.readAsDataURL(file);

          console.log("test 2");
          console.log(imgUrl);
          console.log(file);
          console.log("test 3");
          console.log(form);

          form.encodedImg = String(form);
          console.log(form.encodedImg);
        }
    };



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
            name: "",
            birth: 0,
            company: "",
            region: "",
            encodedImg: "",
        }); // 초기화
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <header className={styles.header}>Tempo_UpdateInfo</header>

            <section className={styles.mainScreen}>
                <h1 className={styles.h1}>TEMPO</h1>
                <div className={styles.inputsection}>
                    <div className={styles.textDiv}>
                        <h2 className={styles.texts}>프로필 사진</h2>
                        <h2 className={styles.texts}>이름</h2>
                        <h2 className={styles.texts}>생년월일</h2>
                        <h2 className={styles.texts}>소속</h2>
                        <h2 className={styles.texts}>거주지</h2>
                    </div>
                    <div className={styles.mainRightDiv}>
                        <div style={inputBoxStyle}>
                                <section className={styles.imgSection}>
                                    <img 
                                        className={styles.profileImg}
                                        src={""} 
                                    />
                                    <input 
                                        accept="image/*" 
                                        multiple type="file"
                                        onChange={onUpload}
                                        name="encodedImg"
                                        value={encodedImg}
                                        className={styles.inputsection}
                                    /> 
                                </section>
                            <TextField
                                id="outlined-basic"
                                label="name"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-basic"
                                label="birth(ex.19991127)"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="birth"
                                value={birth}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-basic"
                                label="company"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="company"
                                value={company}
                                onChange={onChange}
                            />
                            <br />
                            <TextField
                                id="outlined-basic"
                                label="region"
                                variant="outlined"
                                style={inputBoxStyle}
                                type="text"
                                name="region"
                                value={region}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className={styles.navsection}>
                <div className={styles.navBtnStyle}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <Link to="/">
                        <Button variant="outlined" className={styles.boxStyle}>
                            변경
                        </Button>
                    </Link>
                    <Link to="/myForm">
                        <Button variant="outlined" className={styles.boxStyle}>
                            취소
                        </Button>
                    </Link>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </section>
            <div className={styles.comfirmBtn}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" type="submit" className={styles.boxStyle2}>
                        확인
                    </Button>
                    <Button variant="outlined" color="error" className={styles.boxStyle2}>
                        계정 삭제
                    </Button>
                </Stack>
            </div>
        </form>
    );
}

export default UpdateInfo;
