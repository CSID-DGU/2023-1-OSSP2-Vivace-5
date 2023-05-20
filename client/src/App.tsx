import React from 'react';
import MyForm from './pages/MyForm';
import PwChange from './pages/PwChange';
import InfoChange from './pages/InfoChange';
import Signup from './pages/SignUp';
import ProjectCorr from './pages/ProjectCorr';
import ProjectAdd from './pages/ProjectAdd';
import { Container } from './pages/Container';
import RouteTest1 from './pages/RouteTest1';
import RouteTest2 from './pages/RouteTest2';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';

import CopyMyForm from './pages/CopyMyForm';
import NewCopyMyForm from './pages/NewCopyMyForm';
import CopySignUp from './pages/CopySignUp';
import NewCopySignUp from './pages/NewCopySignUp';
import CopyPwChange from './pages/CopyPwChange';
import NewCopyPwChange from './pages/NewCopyPwChange';
import CopyInfoChange from './pages/CopyInfoChange'
import NewCopyInfoChange from './pages/NewCopyInfoChange'

const App: React.FC = () => {
  const onSubmit = (form: { name: string; password: string }) => {
    console.log(form);
  };
  
  const pSubmit = (form: { 
    Pname: string; 
    Pdescription: string;
    PcreDate: string;
    Pmember: {
      name: string;
    }
    }) => {
    console.log(form);
  }

  return (
    <React.StrictMode>
      <BrowserRouter>
        <div className="App">
          
          {/* <CopyMyForm />
          <CopySignUp />
            <Signup onSubmit={onSubmit}/>
            <InfoChange onSubmit={onSubmit} />
            <PwChange onSubmit={onSubmit} />
            <ProjectAdd pSubmit={pSubmit} />
            <ProjectCorr onSubmit={onSubmit} /> */}
          <Routes>
            <Route path="/" Component={RouteTest1} />
            <Route path="/pageT" Component={RouteTest2} />         
            <Route path="/myForm" element={<NewCopyMyForm/>} /> 
            <Route path="/signUp" element={<NewCopySignUp/>} />  
            <Route path="/pwChange" element={<NewCopyPwChange/>} />
            <Route path="/copyInfoChange" element={<NewCopyInfoChange/>}/>
          </Routes>
          <Link to="/">Home</Link>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  )


};

export default App;