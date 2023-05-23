// import React from "react";
// import MainPage from "../src/pages/MainPage";

// const App: React.FC = () => {
//     return (
//         <div className="app">
//             <MainPage />
//         </div>
//     );
// };

import React from 'react';
import RouteTest1 from './pages/RouteTest1';
import RouteTest2 from './pages/RouteTest2';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import NewCopyMyForm from './pages/NewCopyMyForm';
import NewCopySignUp from './pages/NewCopySignUp';
import NewCopyPwChange from './pages/NewCopyPwChange';
import NewCopyInfoChange from './pages/NewCopyInfoChange'
import NewCopyProjectCorr from './pages/NewCopyProjectCorr';
import NewCopyProjectAdd from './pages/NewCopyProjectAdd';

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
            <Route path="/copyInfoChange" element={<NewCopyInfoChange/>}/>
            <Route path="/copyInfoChange" element={<NewCopyInfoChange/>}/>
            <Route path="/newCopyProjectAdd" element={<NewCopyProjectAdd/>}/>
            <Route path="/newCopyProjectCorr" element={<NewCopyProjectCorr/>}/>
          </Routes>
          <Link to="/">Home</Link>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  )


};

export default App;