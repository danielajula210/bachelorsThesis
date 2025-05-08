import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from "axios";


import "./tbar.css"

import {RegistrationContext} from "../../context/RegistrationContext";
import { Logout } from "../../context/RegistrationAction";

import {Search, Person, CircleNotifications} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";


export default function Tbar() {  
    const FLDR = process.env.REACT_APP_POSTS_FOLDER;
    const [open, setOpen] = useState(false);
    const [user,setUsers]=useState({});
    const {user:loggedInUser}= useContext(RegistrationContext);
    const menuRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(RegistrationContext);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
  
    useEffect(() => {
      const fetchUser = async () => {
        if (!loggedInUser || !loggedInUser._id) return;
        try {
          const response = await axios.get(`/usersRoute?userId=${loggedInUser._id}`);
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
    
      fetchUser();
    }, [loggedInUser]);
    

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

    
    const handleSearchChange = async (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      if (value.trim() === "") {
          setSearchResults([]);
          setShowResults(false);
          return;
      }

      try {
          const res = await axios.get(`/usersRoute/search?query=${value}`);
          setSearchResults(res.data); 
          setShowResults(true);
      } catch (err) {
          console.error("Search error:", err);
          setShowResults(false);
      }
    };

    const handleResultClick = () => {
        setShowResults(false);
        setSearchTerm("");
    };

    const handleLogout = (e) => {
      e?.preventDefault?.();
      dispatch(Logout()); 
      localStorage.removeItem("user");
      navigate("/login");
    };

    useEffect(() => {
      const fetchNotifications = async () => {
          if (!loggedInUser || !loggedInUser._id) return;
          try {
              const response = await axios.get(`/usersRoute/${loggedInUser._id}/notifications`);
              setNotifications(response.data);
          } catch (error) {
              console.error("Error fetching notifications:", error);
          }
      };

      fetchNotifications();
  }, [loggedInUser]); 

  return (
    <div className='tbarContainer'>
        <div className="leftTopbar">
          <span className="logo">VIBEZ</span>
            <div className='searchBarContainer'>
              <div className="searchBar">
                <Search className='searchIcon'/>
                <input
                    placeholder='Caută pe Vibez'
                    className="searchInput"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
              </div>
              {showResults && searchResults.length > 0 && (
                <div className='searchResults'>
                  {searchResults.map((item) => (
                    <Link
                      to={`/myprofile/${item._id}`}
                      className="searchResultItem"
                      key={item._id}
                      onClick={handleResultClick}
                    >
                      <img
                        src={item.profileImage ? FLDR + item.profileImage : "/assets/users/defaultProfileImage.png"}
                        alt="profile"
                      />
                      <div className="searchText">
                        <span className="name"> {item.lastname} {item.firstname}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
              <CircleNotifications onClick={() => setNotificationsOpen(!notificationsOpen)} />
              <span className="item">{notifications.length}</span>
            </div>
          </div>

          {notificationsOpen && (
              <div className="notificationsDropdown">
                  {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                          <div key={index} className="notificationItem">
                              <span>{notification.message}</span>
                          </div>
                      ))
                  ) : (
                      <div>Nu ai notificări noi.</div>
                  )}
              </div>
          )}
          
          <div className='moreAndProfile'>
            <Link to='/myprofile'>
                <img src={user.profileImage ? FLDR+user.profileImage : "/assets/users/defaultProfileImage.png"} alt="" className="profileImg" />
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
                  <button className="dropdownItem" onClick={handleLogout}>
                      <LogoutIcon />
                      <span>Deconectare</span>
                  </button>
                </div>
              )}
          </div>
          </div>
        </div>   
    </div>
  )
}
