import React, {useRef,useContext,createContext} from 'react'
import {Link} from "react-router-dom"

import "./login.css"

import {loginCall} from "../../apiCalls"
import {RegistrationContext} from "../../context/RegistrationContext";

import {CircularProgress} from "@mui/material"

export default function Login() {
    const email = useRef();
    const password = useRef();
    const {user, isFetching, error, dispatch}=useContext(RegistrationContext);

    const handleSubmit = (event) => {
        event.preventDefault();

        loginCall({email:email.current.value,password:password.current.value},dispatch);
    };

    console.log(user);
    return (
        <div className='loginContainer'>
            <div className="login">
                <div className="upLogin">
                    <span className="logoLogin">VIBEZ</span>
                    <span className="message">Fii pregătit să împărtășești doar gânduri pozitive!</span>
                </div>
                <div className="lowLogin">
                    <form className="loginProcess" onSubmit={handleSubmit}>
                        <input placeholder="Introdu adresa de email" type="email" required className="email" ref={email}></input>
                        <input placeholder="Introdu parola" type="password" required minLength="8" className="pass" ref={password}></input>
                        <button className="buttonLogin">{isFetching? <CircularProgress color="inherit"/> :"Conectează-te"}</button>
                        <span className='forgotPassword'>Ai uitat parola?</span>
                        <Link to="/registration" className='registrationLink'><button className="newAccount">Crează un cont nou</button></Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
