import React from 'react'
import "./login.css"

import {Link} from "react-router-dom"

export default function Login() {
  return (
    <div className='loginContainer'>
        <div className="login">
            <div className="upLogin">
                <span className="logoLogin">VIBEZ</span>
                <span className="message">Fii pregătit să împărtășești doar gânduri pozitive!</span>
            </div>
            <div className="lowLogin">
                <div className="loginProcess">
                    <input placeholder="Introdu adresa de email" className="email"></input>
                    <input placeholder="Introdu parola" className="pass"></input>
                    <Link to="/"><button className="buttonLogin">Conectează-te</button></Link>
                    <span className='forgotPassword'>Ai uitat parola?</span>
                    <Link to="/registration" className='registrationLink'><button className="newAccount">Crează un cont nou</button></Link>
                </div>
            </div>
        </div>
    </div>
  )
}
