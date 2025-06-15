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
    const [searchTerm, setSearchTerm] = useState("");//Utilizat pentru inputu-ul barei de căutare
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(RegistrationContext);//Pentru a prelua starea exacta a utilizatorului
    const [notificationsOpen, setNotificationsOpen] = useState(false);//Uilizat pentru a da toggle notificarilor
    const [notifications, setNotifications] = useState([]);//Utilizate ptrnu gestionarea notificărilor
    const [showSettings, setShowSettings] = useState(false);//Utilizate pentru afișarea setărilor
    const searchRef = useRef(null);
  
    useEffect(() => {
      const fetchUser = async () => {
        if (!loggedInUser || !loggedInUser._id) return;
        try {
          const response = await axios.get(`/usersRoute?userId=${loggedInUser._id}`);
          setUsers(response.data);
          //Datele necesare in formularul care permite actualizarea datelor personale
          setFormData({
            firstname: response.data.firstname || '',
            lastname: response.data.lastname || '',
            email: response.data.email || '',
            password: '',
            birthdate: response.data.birthdate?.split("T")[0] || ''
          });
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

    
    //Functia care se ocupă de afisarea utilizatorilor in bara de cautare
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
          const filteredResults = res.data.filter(user => !user.theAdmin);
          setSearchResults(filteredResults); 
          setShowResults(filteredResults.length > 0);
      } catch (err) {
          console.error("Search error:", err);
          setShowResults(false);
      }
    };

    const handleResultClick = () => {
        setShowResults(false);
        setSearchTerm("");
    };

    //Functia care se ocupa de deconectarea utilizatorului
    const handleLogout = (e) => {
      e?.preventDefault?.();
      dispatch(Logout()); 
      localStorage.removeItem("user");
      navigate("/login");
    };

    //Se preiuau notificarile utilizatorului pentru a fi afisate
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

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    birthdate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //Functie care salveaza datele actualizate ale utilizatorului
  const handleSettingsSave = async () => {
    try {
      const dataToSend = {
        ...formData,
        userId: loggedInUser._id
      };
  
      if (!formData.password) {
        delete dataToSend.password;
      }
  
      await axios.put(`/usersRoute/${loggedInUser._id}`, dataToSend);
      alert("Setările au fost actualizate cu succes!");
      setShowSettings(false); 
      window.location.reload();
    } catch (error) {
      console.error("Eroare la actualizarea setărilor:", error);
      alert("Eroare la actualizare!");
    }
  };


  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, []);
    
  return (
    <>
    <div className='tbarContainer'>
        <div className="leftTopbar">
          <span className="logo">VIBEZ</span>
            <div className='searchBarContainer'>
              {/*Secțiunea pentru bara de căutare */}
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
                <div className='searchResults' ref={searchRef}>
                  {searchResults.map((item) => (
                    <Link
                      to={`/myprofile/${item._id}`}//Dacă se apasă pe poza sau pe numele utilizatorului, se navigheaza pe profilul acestuia
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
            <HomeIcon className="homeLink"/>{/*Inconita de home, care duce la fluxul de activitate*/}
          </Link>
          <div className="iconList">
            <div className="icons">
              <CircleNotifications onClick={() => setNotificationsOpen(!notificationsOpen)} />{/*Inconita pentru notificări*/}
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
          
          {/*Sectiunea de unde se pot accesa setările și butonul de deconectare*/}
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
                  <div className="dropdownItem" onClick={() => setShowSettings(!showSettings)}>
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

    {/*Secțiunea cu formularul care permite actualizarea datelor*/}
    {showSettings && (
      <div className="settingsPanel">
        <h2>Actualizează date</h2>
        <form className="settingsForm">
          <label>Nume:
            <input name="lastname" value={formData.lastname} onChange={handleInputChange} />
          </label>
          <label>Prenume:
            <input name="firstname" value={formData.firstname} onChange={handleInputChange} />
          </label>
          <label>Email:
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} />
          </label>
          <label>Parolă:
            <input name="password" type="password" value={formData.password} onChange={handleInputChange} />
          </label>
          <label>Data Nașterii:
            <input name="birthdate" type="date" value={formData.birthdate} onChange={handleInputChange} />
          </label>
          <button type="button" onClick={handleSettingsSave}>Salvează</button>
        </form>
      </div>
    )}
    </>
  )
}
