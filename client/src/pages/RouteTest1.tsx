import React, { CSSProperties, useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import styles from "./Login.module.css";
import Routers from "./Routes";

function MyForm() {
    
    return(
    <div>
        <h1>여기는 HOME페이지 입니다.</h1>
        <h2>
            <em>
                아래 Link를 통하여 원하는 페이지로 이동할 수 있습니다.
            </em>
        </h2>
        {/* 이 아래 Link의 to="" 주소가 App.tsx안에 적혀있음. 그래서 따로 path를 설정해주지
        않아도 여기서 바로 주소타고 이동할 수 있다. */}
        
        <nav>
        
                {/* <ol><Link to="/pageT">move</Link></ol> */}
                {/* <ol><Link to="signUp">SignUpPage</Link></ol> */}
                <ol><Link to="/myForm">myForm</Link> </ol>
                <ol><Link to="/signUp">signUp</Link> </ol>
                <ol><Link to="/pwChange">pwChange</Link></ol>
                <ol><Link to="/copyInfoChange">InfoChange</Link></ol>
            
          </nav>
    </div>
    )
}

export default MyForm;