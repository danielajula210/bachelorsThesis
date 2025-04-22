import React, { useState, useEffect,useContext } from 'react'
import axios from 'axios'

import "./myprofile.css"

import Tbar from '../../components/tbar/Tbar'
import Post from '../../components/post/Post'
import { RegistrationContext } from '../../context/RegistrationContext'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';



export default function MyProfile() {
  const FLDR = process.env.REACT_APP_POSTS_FOLDER;
  const [user,setUsers]=useState({});
  const {user:loggedInUser}= useContext(RegistrationContext);
  const [myPosts, setMyPosts] = useState([]); 
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/usersRoute?userId=${loggedInUser._id}`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Failed to load user data. Please try again later.");
      }
    };
  
    fetchUser();
  }, []);
  
  useEffect(() => {
    if (user._id) {  
      const fetchMyPosts = async () => {
        try {
          const response = await axios.get(`/postsRoute/gettingprofileposts/${user._id}`); 
          console.log("Postări primite:", response.data);
          setMyPosts(response.data); 
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchMyPosts();
    }
  }, [user._id]);

  useEffect(() => {
    if (user._id) {
      const fetchFriends = async () => {
        try {
          const response = await axios.get(`/usersRoute/getFriends/${user._id}`);
          setFriends(response.data); 
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
  
      fetchFriends();
    }
  }, [user._id]);
  console.log(friends);

  console.log(user);
  return (
    <>
    <div className="tBar"><Tbar/></div>
    <div className="myProfilePageContainer">
      <div className="background">
        <div className="upperProfile">
          <img className="myCoverImg" src={user.coverImage ? FLDR+user.coverImage : "/assets/posts/defaultCoverImage.png"}  alt=""></img>
          <div className="myProfileContainer">
            <img className="myProfileImg"   src={user.profileImage ? FLDR+user.profileImage : "/assets/users/defaultProfileImage.png"} alt=""></img>
            <span className="myName">{user.lastname} {user.firstname}</span>
          </div>
        </div>
      </div>
      
      <div className="lowProfile">
        <div className="myPosts">
                {myPosts.map( (p) => (<Post key={p._id} post={p}/>) )} 
        </div>


        <div className="rightLowProfile">


          <div className="descriptionMyProfile">
            <div className="upDescription">
              <span className='title'>Descriere</span>
              <div className="more">
                <MoreHorizIcon/>
              </div>
            </div>
            <span className='text'>{user.description}</span>
          </div>

          <div className="oldPhotosContainer">
            <div className="upperOldPhotosContainer">
              <span className='oldtitle'>Postările tale</span>
              <span className='seeAllOldPosts'>Vezi toate postările </span>
              <span className='allOldPostNumber'>{myPosts.filter(post => post.postImage).length}</span>
            </div>

            <div className="lowOldPhotosContainer">
                {myPosts.map((post) => (
                  post.postImage && (
                    <div className="oldphotos" key={post._id}>
                      <img src={FLDR + post.postImage} className="oldPhoto" alt="img" />
                    </div>)
                ))}
            </div>

          </div>

          <div className="friendsList">
            <div className="upFriendsList">
              <span className='allFriends'>Lista ta de prieteni</span>
              <span className='seeAllFriends'>Vezi intreaga listă </span>
              <span className='allFriendsNumber'>{friends.length}</span>
            </div>
            
            <div className="lowFriendsList">
                {friends.map((friend) => (
                  <div className="friends" key={friend._id}>
                    <img src={friend.profileImage ? FLDR+friend.profileImage : "/assets/users/defaultProfileImage.png"} className='friendPhoto' alt="img" />
                    <span className="friendName">{friend.lastname} {friend.firstname}</span>
                  </div>
                ))}
            </div>

          </div>
        </div>

      </div>
    </div>
    </>
  )
}
