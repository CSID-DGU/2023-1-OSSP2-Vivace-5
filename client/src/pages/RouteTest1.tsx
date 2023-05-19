import React, { CSSProperties, useState } from 'react';
import {Routes, Route, Link} from "react-router-dom";
import styles from "./Login.module.css";
import Routers from "./Routes";


function MyForm() {
    
    return(
    <div>
        <div>안녕하세요</div>
        <Link to="/pageT">move</Link>
        <br/>
        <Link to="signUp">SignUpPage</Link>
    </div>
    )
}

export default MyForm;