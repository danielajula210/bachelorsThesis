import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';


import "./tbar.css"

import {RegistrationContext} from "../../context/RegistrationContext";

import {Search, Person, CircleNotifications} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";


export default function Tbar() {  
    const FLDR = process.env.REACT_APP_POSTS_FOLDER;
    const [open, setOpen] = useState(false);
    //const [user,setUsers]=useState({});
    const menuRef = useRef(null);

    const {user}=useContext(RegistrationContext);

  
    const toggleMenu = () => {
      setOpen((prev) => !prev);
    };
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [menuRef]);

  return (
    <div className='tbarContainer'>
        <div className="leftTopbar">
          <span className="logo">VIBEZ</span>
          <div className="searchBar">
              <Search className='searchIcon'/>
              <input placeholder='Caută pe Vibez' className="searchInput" />
          </div>
        </div>

        <div className="rightTopbar">
          <Link to="/"> 
            <HomeIcon className="homeLink"/>
          </Link>
          <div className="iconList">
            <div className="icons">
              <Person/>
              <span className="item">1</span>
            </div>
            <div className="icons">
              <CircleNotifications/>
              <span className="item">2</span>
            </div>
          </div>

          
          <div className='moreAndProfile'>
            <Link to='/myprofile'>
                <img src={user.profileImage ? FLDR+user.profileImage: FLDR+"users/defaultProfileImage.png"} alt="" className="profileImg" />
            </Link>
            <div className="moreIconContainer" ref={menuRef}>
              <div className="moreIcon" onClick={toggleMenu}>
                <AppsIcon />
              </div>
              {open && (
                <div className="dropdownMenu">
                  <div className="dropdownItem">
                    <SettingsIcon />
                    <span>Setări</span>
                  </div>
                  <Link to="/login" className=' toLogout'>
                  <div className="dropdownItem">
                    <LogoutIcon/>
                    <span>Deconectare</span>
                  </div>
                  </Link>
                </div>
              )}
          </div>
          </div>
        </div>    
    </div>
  )
}
