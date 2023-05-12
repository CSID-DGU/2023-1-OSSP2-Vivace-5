import React from 'react';
import MyForm from './pages/MyForm';
import PwChange from './pages/PwChange';
import InfoChange from './pages/InfoChange';
import Signup from './pages/SignUp';
import ProjectCorr from './pages/ProjectCorr';
import ProjectAdd from './pages/ProjectAdd';
import { Container } from './pages/Container';
import { Route, Routes } from 'react-router-dom';

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
  <div className="App">
    <MyForm onSubmit={onSubmit}/>
    <Signup onSubmit={onSubmit}/>
    <InfoChange onSubmit={onSubmit} />
    <PwChange onSubmit={onSubmit} />
    <ProjectAdd pSubmit={pSubmit} />
    <ProjectCorr onSubmit={onSubmit} />
    {/* <Container styles={{border: '1px solid black', padding: '1rem', color: 'red'}} /> */}
  </div>
  )


};

export default App;