import React from 'react';
import MyForm from './MyForm';
import PwChange from './PwChange';
import InfoChange from './InfoChange';
import Signup from './SignUp';
import ProjectCorr from './ProjectCorr';
import ProjectAdd from './ProjectAdd';
import { Container } from './Container';
import RouteTest1 from './RouteTest1';
import RouteTest2 from './RouteTest2';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';


import CopyMyForm from './CopyMyForm';
import CopySignUp from './CopySignUp';

function Routers(){
    <Routes>
        <Route path="/signUp" element={<CopySignUp/>}/>
        <Route path="/1outeTest1" element={<RouteTest1/>}/>
        <Route path="/2outeTest2" element={<RouteTest2/>}/>

    </Routes>
}

// 현재 여기 Route들 다 모아놓고 이 페이지를 import 시킬 생각임.
// 아직 제대로 모듈을 못 만들어서 우선 냅두는 중

export default Routers;