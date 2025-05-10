import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './screenleft.css';

import { RegistrationContext } from '../../context/RegistrationContext';

export default function Screenleft() {
  const FLDR = process.env.REACT_APP_POSTS_FOLDER;
  const { user: loggedInUser } = useContext(RegistrationContext);
  const [suggestedFriends, setSuggestedFriends] = useState([]);


  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await axios.get(`/usersRoute/suggestedFriends/${loggedInUser._id}`);
        setSuggestedFriends(res.data);
        console.log("Sugestii:", res.data);
      } catch (err) {
        console.error("Error fetching suggested friends:", err);
      }
    };
    if (loggedInUser?._id) fetchSuggested();
  }, [loggedInUser]);


  return (
    <div className='screenleft'>
      <div className="suggestedContainer">
        <span className="suggestedTitle">Prieteni sugerați</span>
        <div className="suggestedList">
          {suggestedFriends.slice(0, 5).map((friend) => (
            <div className="suggestedItem" key={friend._id}>
              <Link to={`/myprofile/${friend._id}`}>
                <img
                  src={friend.profileImage ? FLDR + friend.profileImage : "/assets/users/defaultProfileImage.png"}
                  alt=""
                  className="suggestedPhoto"
                />
              </Link>
              <Link to={`/myprofile/${friend._id}`} style={{ textDecoration: 'none' }}>
                <span className="suggestedName">{friend.lastname} {friend.firstname}</span>
              </Link>
              <span className="commonFriendsCount">
                {friend.commonFriendsCount > 0
                  ? `prieteni comuni: ${friend.commonFriendsCount}`
                  : 'Fără prieteni comuni'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
