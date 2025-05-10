import React, { useState, useEffect,useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'

import "./myprofile.css"

import Tbar from '../../components/tbar/Tbar'
import Post from '../../components/post/Post'
import { RegistrationContext } from '../../context/RegistrationContext'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import WallpaperIcon from '@mui/icons-material/Wallpaper';


export default function MyProfile() {
  const FLDR = process.env.REACT_APP_POSTS_FOLDER;
  const [user,setUsers]=useState({});
  const {user:loggedInUser,dispatch}= useContext(RegistrationContext);
  const [myPosts, setMyPosts] = useState([]); 
  const [friends, setFriends] = useState([]);
  const [friend, setFriend] = useState(false);

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  
  const params = useParams();
  const userId = params.userId || (loggedInUser ? loggedInUser._id : null);

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/usersRoute?userId=${userId}`);
        setEditedDescription(response.data.description || "");
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
  }, [user && user._id]);

  useEffect(() => {
    if (loggedInUser && user?._id) {
      setFriend(loggedInUser.friends?.includes(user._id));
    }
  }, [loggedInUser, user]);
  

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

  console.log(loggedInUser);

  const handleClick = async () => {
    if (!loggedInUser || !user?._id) return;
    try {
      if (friend) {
        await axios.put("/usersRoute/"+user._id+"/unfriend", {userId: loggedInUser._id});
        dispatch({type: "UNFRIEND", payload: user._id});
      } else {
        await axios.put("/usersRoute/"+user._id+"/friends", {userId: loggedInUser._id});
        dispatch({type: "FRIEND", payload: user._id});
      }
      setFriend(!friend);
    } catch (error) {
      console.log(error);
    }
  };


const handleCoverImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setCoverImageFile(file);
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    await axios.post("/upload", formData);
    const response = await axios.put(`/usersRoute/${user._id}/updateCoverImage`, formData);

    if (response.status === 200) {
      setUsers((prevUser) => ({
        ...prevUser,
        coverImage: response.data.coverImage,
      }));
    }
    window.location.reload();
  } catch (error) {
    console.error('Error uploading cover image:', error);
  }
};
  

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImageFile(file);
    
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await axios.post("/upload", formData);
      const response = await axios.put(`/usersRoute/${user._id}/updateProfileImage`, formData);
  
      if (response.status === 200) {
        setUsers((prevUser) => ({
          ...prevUser,
          profileImage: response.data.profileImage,
        }));
      }
      window.location.reload();
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };
  
  const handleDescription = async () => {
    try {
      const res = await axios.put(`/usersRoute/updateDescription/${user._id}`, {
        description: editedDescription,
      });
      setUsers((prev) => ({ ...prev, description: res.data.description }));
      setIsEditingDesc(false);
    } catch (error) {
      console.error("Failed to update description:", error);
      alert("A apărut o eroare. Încearcă din nou.");
    }
  };
  
  return (
    <>
    <div className="tBar"><Tbar/></div>
    <div className="myProfilePageContainer">
      <div className="background">
        <div className="upperProfile">
          <div className="imageWrapperCover">
              <img
                className="myCoverImg"
                src={user.coverImage ? FLDR + user.coverImage : "/assets/posts/defaultCoverImage.png"}
                alt=""
              />
              {loggedInUser?._id === user._id && (
                <>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleCoverImageChange}
                    id="coverImageInput"
                  />
                  <WallpaperIcon
                    className="cornerIconCover"
                    onClick={() => document.getElementById('coverImageInput').click()}
                  />
                </>
              )}
          </div>
          <div className="myProfileContainer">
            <div className="imageWrapper">
              <img
                className="myProfileImg"
                src={user.profileImage ? FLDR + user.profileImage : "/assets/users/defaultProfileImage.png"}
                alt=""
              />
            {loggedInUser?._id === user._id && (
              <>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleProfileImageChange}
                  id="profileImageInput"
                />
                <WallpaperIcon
                  className="cornerIcon"
                  onClick={() => document.getElementById('profileImageInput').click()}
                />
              </>
            )}
          </div>
            <span className="myName">{user.lastname} {user.firstname}</span>
          </div>
        </div>
      </div>
      
      <div className="lowProfile">
        <div className="myPosts">
          {myPosts.slice().reverse().map((p) => (<Post key={p._id} post={p} />))}
        </div>

        <div className="rightLowProfile">
          {loggedInUser && user._id && user._id !== loggedInUser._id && (
            <button className="followBtn" onClick={handleClick}>
              {friend ? "Nu mai urmări" : "Urmărește"}
            </button>
          )}
          <div className="descriptionMyProfile">
            <div className="upDescription">
              <span className='title'>Descriere</span>
              {loggedInUser?._id === user._id && (
                <div className="more">
                  <MoreHorizIcon onClick={() => setIsEditingDesc(!isEditingDesc)} />
                </div>
              )}
            </div>
            {isEditingDesc ? (
            <div className="editDescArea">
              <div className="textAreaWrapper">
                  <textarea
                    className="descriptionTextarea"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={3}
                  />
              </div>
              <button className="saveDescriptionBtn" onClick={handleDescription}>Salvează</button>
            </div>
          ) : (
            <span className='text'>{user.description || "Fără descriere momentan."}</span>
          )}

          </div>

          <div className="oldPhotosContainer">
            <div className="upperOldPhotosContainer">
              <span className='oldtitle'>Postările tale</span>
              <span className='seeAllOldPosts'>Vezi toate postările </span>
              <span className='allOldPostNumber'>{myPosts.filter(post => post.postImage).length}</span>
            </div>

            <div className="lowOldPhotosContainer">
            {myPosts
                .filter(post => post.postImage) 
                .slice() 
                .reverse() 
                .slice(0, 3)
                .map((post) => (
                  <div className="oldphotos" key={post._id}>
                    <img src={FLDR + post.postImage} className="oldPhoto" alt="img" />
                  </div>
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
                {friends.slice(0, 3).map((friend) => (
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
