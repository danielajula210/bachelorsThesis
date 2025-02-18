import React from 'react'
import "./registration.css"

import {Link} from 'react-router-dom';

export default function Registration() {
  return (
    <div className='registrationContainer'>
        <div className="registration">
            <div className="upRegistration">
                <span className="logoRegistration">VIBEZ</span>
                <span className="message">Fii pregătit să împărtășești doar gânduri pozitive!</span>
            </div>
            <div className="lowRegistration">
                <div className="registrationProcess">
                    <input placeholder="Introdu un username" className="username"></input>
                    <div className="dateContainer">
                        <label className="datetext">Introdu data nașterii</label>
                        <input type="date" className="date" />
                    </div>
                    <input placeholder="Introdu adresa de email" className="email"></input>
                    <input placeholder="Introdu parola" className="pass"></input>
                    <input placeholder="Reintrodu parola" className="pass"></input>
                    <Link to="/login"><button className="buttonRegistration">Înregistrează-te</button></Link>
                 </div>
            </div>
        </div>
    </div>
  )
}
