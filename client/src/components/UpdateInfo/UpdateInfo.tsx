import React, { CSSProperties, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./UpdateInfo.module.css";
import { style } from "d3";
import axios, { AxiosResponse } from "axios";
import { API_HOST } from "../../config/constants";

type InfoChangeProps = {
    onSubmit: (form: { name: string; birth: number; company: string; region: string; encodedImg:string }) => void;
};

// { onSubmit }: InfoChangeProps

interface InfoChange {
    onSubmit: (form: { name: string; birth: number; company: string; region: string; encodedImg:string }) => void;
}

async function UpdateInfo() {
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
    // const inputBoxStyle: CSSProperties = {
    //     width: "300px",
    //     height: "40px",
    //     marginLeft: "25px",
    //     marginBottom: "30px",
    //     marginTop: "-2px",
    // };

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
          fileReader.readAsDataURL(file);
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

//계정삭제 버튼 누르면 입력칸이 나오고, 입력칸에 비밀번호를 입력해야 함.
//쉽게 바꾸려면 "계정을 삭제합니다."라는 문구 그대로 치면 삭제되게 해도 됨.
    const onDeleteClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        
    }

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

    //PUT 테스트 필요함
    // function axiosPut() {
    //     const name = document.getElementById("name");
    //     const email = document.getElementById("email");
    //     const updateDate = document.getElementById("update_date");
       
    //     const updateDataObj = { "first_name": "White", "last_name": "Rabbit" , "email": "alice@elice.io" };
       
    //     axios.put(`${API_HOST}/user/signup`, updateDataObj)
    //       .then(response => {
    //           firstName = `${response.data.firstname};
    //           lastName = ${response.data.last_name}`;
    //           email = response.data.email;
    //           updateDate.innerHTML = new Date()
    //       })
    //   }






//********************************

//form UI와 상관없이 모든 요소를 입력받는다고 가정하고 작성함.   
    const [users, setUsers] = useState({
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
    });

//사용자 baerer 토큰 빼오기 (확인 필요)
    let token = localStorage.getItem('Bearer access-token');

//토큰 통해서 사용자 정보에 접근
    useEffect(() => {
        axios.get(`${API_HOST}/user/info/${token}`)
          .then(response => response.data)
          .then(response => {
              setUsers(response.results)
          })
      }, []);

    let currentId:string = users.id;
    let currentFirstName:string = users.firstName;
    let currentLastName:string = users.lastName;
    let currentEmail:string = users.email;
    let currentYear:number = users.year;
    let currentMonth:number = users.month;
    let currentDate:number = users.date;
    let currentBelong:string = users.belong;
    let currentCountry:string = users.country;
    let currentRegion:string = users.region;
    let currentEncodedImg:string = users.encodedImg;
    let currentCreatedAt:string = users.createdAt;

    // 새 UI에 각자 값들 placeholder로 넣어주는 과정 필요
    // `<input class="Example" placeholder=`${currentId}`/>`;

// [IF] 데이터가 제대로 들어가지 않는다면 버튼 하나 만들어서 useState로 값들 다시 받고
//할당하는 것도 생각해보아야 함.
    try {
//put통해서 사용자 정보 전부 바꾸기
    const res: AxiosResponse = await axios.put(`${API_HOST}/user/signin`, users);
    
    if(res.status == 201) {
        console.log("Infomation Update Success!");    
    }
    } catch (error)  {
        console.log(error);
    }
    

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <header className={styles.header}></header>

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
                        <div className={styles.inputBoxStyle}>
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
                            <div className={styles.name}>
                                <TextField
                                    id="outlined-basic"
                                    // className={styles.name1}
                                    label="first name"
                                    variant="outlined"
                                    className={styles.inputBoxStyle}
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                />
                                <TextField
                                    id="outlined-basic"
                                    className={styles.inputBoxStyle}
                                    label="last name"
                                    variant="outlined"
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                />
                            </div>
                            <br />
                            <div className={styles.birth}>
                                <TextField
                                    id="outlined-basic"
                                    label="Year"
                                    variant="outlined"
                                    
                                    type="text"
                                    name="birth"
                                    value={birth}
                                    onChange={onChange}
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="Month"
                                    variant="outlined"
                                    className={styles.inputBoxStyle}
                                    type="text"
                                    name="birth"
                                    value={birth}
                                    onChange={onChange}
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="Date"
                                    variant="outlined"
                                    className={styles.inputBoxStyle}
                                    type="text"
                                    name="birth"
                                    value={birth}
                                    onChange={onChange}
                                />
                            </div>
                            <br />
                            <TextField
                                id="outlined-basic"
                                label="company"
                                variant="outlined"
                                className={styles.inputBoxStyle}
                                type="text"
                                name="company"
                                value={company}
                                onChange={onChange}
                            />
                            <br />
                            <div className={styles.region}>
                                <TextField
                                    id="outlined-basic"
                                    label="country"
                                    variant="outlined"
                                    className={styles.inputBoxStyle}
                                    type="text"
                                    name="region"
                                    value={region}
                                    onChange={onChange}
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="region"
                                    variant="outlined"
                                    className={styles.inputBoxStyle}
                                    type="text"
                                    name="region"
                                    value={region}
                                    onChange={onChange}
                                />
                            </div>
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
                    <Button variant="outlined" color="error" className={styles.boxStyle2} onClick={onDeleteClick}>
                        계정 삭제
                    </Button>
                </Stack>
            </div>
        </form>
    );
}

export default UpdateInfo;
