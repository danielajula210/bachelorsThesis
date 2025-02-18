import React from 'react'
import "./tbar.css"

import {Search, Person, CircleNotifications} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';

import { Link } from 'react-router-dom';


export default function Tbar() {

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
          <div className="Links">
          <Link to="/">
            <HomeIcon className="homeLink"/></Link></div>
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
          <Link to="/myprofile">
          <img src="/assets/users/me.jpg" alt="" className="profileImg" />
          </Link>
        </div>    
    </div>
  )
}
