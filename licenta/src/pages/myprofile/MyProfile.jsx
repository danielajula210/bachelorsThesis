import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "./myprofile.css"

import Tbar from '../../components/tbar/Tbar'
import Post from '../../components/post/Post'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';



export default function MyProfile() {
  const FLDR = process.env.REACT_APP_POSTS_FOLDER;
  const [user,setUsers]=useState({});
  const [myPosts, setMyPosts] = useState([]); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/usersRoute?userId=67b6216dac13e65be5017f3c`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
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


  return (
    <>
    <div className="tBar"><Tbar/></div>
    <div className="myProfilePageContainer">
      <div className="background">
        <div className="upperProfile">
          <img className="myCoverImg" src={user.coverImage || FLDR+"posts/defaultCoverImage.png"} alt=""></img>
          <div className="myProfileContainer">
            <img className="myProfileImg" src={user.profileImage || FLDR+"users/defaultProfileImage.png"} alt=""></img>
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
              <span className='allOldPostNumber'>3 postări</span>
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
              <span className='allFriendsNumber'>3 prieteni</span>
            </div>
            
            <div className="lowFriendsList">
              <div className="friends">
                <img src="./assets/users/u1.jpg" className='friendPhoto' alt="img" />
                <span className="friendName">Alina Caragea</span>
              </div>

              <div className="friends">
                <img src="./assets/users/u2.jpg" className='friendPhoto' alt="img" />
                <span className="friendName">Bianca Gligor</span>
              </div>

              <div className="friends">
                <img src="./assets/users/u3.jpg" className='friendPhoto' alt="img" />
                <span className="friendName">Ioan Mihai</span>
              </div>
            </div>

          </div>

          

        </div>

      </div>
    </div>
    </>
  )
}
