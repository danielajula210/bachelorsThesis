import React, {useRef,useState} from 'react'
import {Link} from 'react-router-dom';
import {useNavigate} from "react-router-dom"
import axios from 'axios'

import "./registration.css"

export default function Registration() {
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const firstname = useRef();
    const lastname = useRef();
    const date = useRef();
    const email = useRef();
    const password = useRef();
    const password2 = useRef();

    const handleClick = async (error)=>{
        error.preventDefault();
        if(password2.current.value !== password.current.value){
            setErrorMessage("Parolele trebuie să fie identice!");
        }
        else {
            const user={
                firstname:firstname.current.value,
                lastname:lastname.current.value,
                dateofbirth:date.current.value,
                email:email.current.value,
                password:password.current.value,
            }
            try{
                const response = await axios.post("/authentificationRoute/register",user);
                navigate("/login")
            }catch(error){
                console.log(error);
            }    
        }
    };

    return (
        <div className='registrationContainer'>
            <div className="registration">
                <div className="upRegistration">
                    <span className="logoRegistration">VIBEZ</span>
                    <span className="message">Fii pregătit să împărtășești doar gânduri pozitive!</span>
                </div>
                <div className="lowRegistration">
                    <form className="registrationProcess" onSubmit={handleClick}>
                        <input placeholder="Introdu numele de familie" required ref={lastname} className="lastname"></input>
                        <input placeholder="Introdu prenumele" required ref={firstname} className="firstname"></input>
                        <div className="dateContainer">
                            <label className="datetext">Introdu data nașterii</label>
                            <input type="date" required ref={date} className="date" />
                        </div>
                        <input placeholder="Introdu adresa de email" required ref={email} className="email" type="email"></input>
                        <input placeholder="Introdu parola" required ref={password} className="pass" type="password" minLength="8"></input>
                        <input placeholder="Reintrodu parola" required ref={password2} className="pass"type="password" minLength="8"></input>
                        {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
                        <button className="buttonRegistration" type="submit" onClick={handleClick}>Înregistrează-te</button>
                        <button className="buttonLoginReg"  onClick={() => navigate("/login")}>Conectează-te</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
