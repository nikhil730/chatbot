import React, { useState } from 'react'
import BackgroundImage from '../assets/images/Background.png';
import GroupImage from '../assets/images/GroupImage.png';
import '../styles/Login.css'
import Header from './Header';
import LoginForm from './LoginForm';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  return (
    <div className="apple-vision-pro-ui">
      <Header/>
      <img className="background-icon" alt="BackgroundImage" src={BackgroundImage} />
      <div className="group-parent">
        <img className="group-icon" alt="GroupImage" src={GroupImage} />
        <b className="welcome-to">Welcome to</b>
        <b className="welcome-to">Goodspace Communications</b>
      </div>
      <LoginForm/>
    </div>
  );
};

export default Login;

  