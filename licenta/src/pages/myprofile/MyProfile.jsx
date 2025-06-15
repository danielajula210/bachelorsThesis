import React, { useState, useEffect,useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import {Link} from 'react-router-dom'

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

  const [coverImageFile, setCoverImageFile] = useState(null);//Se utilizeaza pentru editarea pozei de coperta
  const [profileImageFile, setProfileImageFile] = useState(null);//Se utilizeaza pentru editarea pozei de profil
  
  const params = useParams();//Se utilizeaza  pentru a extrage parametrii din URL, pentru navigarea facila intre profilurile utilizatorilor
  const userId = params.userId || (loggedInUser ? loggedInUser._id : null);

  const [isEditingDesc, setIsEditingDesc] = useState(false);//Se utilizeaza pentru editarea descrierii
  const [editedDescription, setEditedDescription] = useState("");


  //Se utilizeaza pentru panoul de insigne
  const [badges, setBadges]= useState([]);
  const [showBadges, setShowBadges] = useState(false);


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

  if (userId) fetchUser();
}, [userId]); 


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
  if (!loggedInUser?.friends || !user._id) return;
  setFriend(loggedInUser?.friends?.includes(user._id));
}, [loggedInUser, user._id]);


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

  console.log("USER ID: ",userId);
  console.log("FRIEND STATE: ",loggedInUser?.friends?.includes(userId));

  //Functie care gestioneaza functionalitatea de urmarire
const handleClick = async () => {
    if (!loggedInUser || !user?._id) return;
    try {
      if (friend) {
        await axios.put("/usersRoute/"+user._id+"/unfollow", {userId: loggedInUser._id});
        dispatch({type: "UNFRIEND", payload: user._id});
      } else {
        await axios.put("/usersRoute/"+user._id+"/follow", {userId: loggedInUser._id});
        dispatch({type: "FRIEND", payload: user._id});
      }
      setFriend(!friend);
    } catch (error) {
      console.log(error);
    }
  };


//Functie care gestioneaza actualizarea pozei de coperta
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
  
//Functie care gestioneaza actualizarea pozei de coperta
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
  
  //Functie care gestioneaza actualizarea descrierii
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


  //Functie care gestioneaza aparitia insignelor
  useEffect(() => {
    if (!user._id) return;
    const fetchBadges = async () => {
      try {
        const res = await axios.get(`/usersRoute/badges/${user._id}`);
        setBadges(res.data);
      } catch (err) {
        console.error("Eroare la preluarea badge-urilor:", err);
      }
    };
  
    fetchBadges();
  }, [user._id]);
  
  const [showAllPosts, setShowAllPosts] = useState(false);

  const [showFriendsPopup, setShowFriendsPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = friends.filter(friend => 
    `${friend.firstname} ${friend.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //Functie care comuta sectiunea de vizlizare integrala a listei de urmaritori
  const toggleFriendsPopup = () => {
    setShowFriendsPopup(!showFriendsPopup);
  };

  const [followers,setFollowers] = useState([]);
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
    const toggleFollowersPopup = () => {
    setShowFollowersPopup(!showFollowersPopup);
  };

  //Functie care preia datele urmaritorilor
  useEffect(() => {
  if (user._id) {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`/usersRoute/getFollowers/${user._id}`);
        setFollowers(res.data);
      } catch (err) {
        console.error("Eroare la preluarea urmăritorilor:", err);
      }
    };

    fetchFollowers();
  }
  }, [user._id]);
  
  const [searchFollowers, setSearchFollowers] = useState("");
  const filteredFollowers = followers.filter(follower => 
  `${follower.firstname} ${follower.lastname}`.toLowerCase().includes(searchFollowers.toLowerCase())
  );

  const handleSearchFollowersChange = (e) => {
    setSearchFollowers(e.target.value);
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
          <div className="badgesSection">
            <div className="badgesHeader">
              <span className="badgesTitle">
                {loggedInUser?._id === user._id ? "Insignele tale" : "Insigne"}
              </span>
              <span className="seeAllBadges" onClick={() => setShowBadges(true)}>Vezi toate insignele</span>
            </div>

            <div className="badgesContainer">
              {badges.length > 0 ? (
                badges.slice().reverse().slice(0, 3).map((badge, index) => (
                  <div className="badgeItem" key={index}>
                    <img src={FLDR + badge.image} alt={badge.name} className="badgeImage" />
                    <span className="badgeName">{badge.name}</span>
                  </div>
                ))
              ) : (
                <span className="noBadges">Nu ai insigne momentan.</span>
              )}
            </div>
          </div>
          
          {showBadges && (
            <div className="popupOverlay" onClick={() => setShowBadges(false)}>
              <div className="popupContent" onClick={(e) => e.stopPropagation()}>
                <h2>Toate insignele</h2>
                <div className="badgesContainer">
                  {badges.slice().reverse().map((badge, index) => (
                    <div className="badgeItem" key={index}>
                      <img src={FLDR + badge.image} alt={badge.name} className="badgeImage" />
                      <span className="badgeName">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
              <span className='oldtitle'>
              {loggedInUser?._id === user._id ? "Postările tale" : "Postări"}
              </span>
              <span className='seeAllOldPosts' onClick={() => setShowAllPosts(true)}>Vezi toate postările</span>
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

          {showAllPosts && (
            <div className="popupPost" onClick={() => setShowAllPosts(false)}>
              <div className="popupContent allPostsPopup" onClick={(e) => e.stopPropagation()}>
                <h2>Toate postările</h2>
                <div className="allPostsInPopup">
                  {myPosts.slice().reverse().map((p) => (
                    <div className="postInPopup" key={p._id}>
                      <Post post={p} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="friendsList">
            <div className="upFriendsList">
              <span className='allFriends'>
                {loggedInUser?._id === user._id ? "Lista ta de urmăriri" : "Lista de urmăriri"}
              </span>
              <span className='seeAllFriends'onClick={toggleFriendsPopup}>Vezi intreaga listă </span>
              <span className='allFriendsNumber'>{friends.length}</span>
            </div>
            
            <div className="lowFriendsList">
                {friends.slice(0, 3).map((friend) => (
                <Link to={`/myprofile/${friend._id}`}  className="friends" key={friend._id}>
                  <img src={friend.profileImage ? FLDR + friend.profileImage : "/assets/users/defaultProfileImage.png"} className='friendPhoto' alt="img" />
                  <span className="friendName">{friend.lastname} {friend.firstname}</span>
                </Link>
                ))}
            </div>  
          </div>
          {showFriendsPopup && (
            <div className="popupOverlay" onClick={toggleFriendsPopup}>
              <div className="popupContent friendsPopup" onClick={(e) => e.stopPropagation()}>
                <h2>Toate urmăririle</h2>
                <input 
                  type="text" 
                  placeholder="Căutare urmăriri..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="searchFriendsInput"
                />
                <div className="allFriendsContainer">
                  {filteredFriends.length > 0 ? (
                    <div className="friendsListInPopup">
                      {filteredFriends.map(friend => (
                        <Link to={`/myprofile/${friend._id}`} key={friend._id} className="friendItemInPopup" onClick={() => setShowFriendsPopup(false)}>
                          <img 
                            src={friend.profileImage ? FLDR + friend.profileImage : "/assets/users/defaultProfileImage.png"} 
                            className="friendPhotoPopup" 
                            alt="img" 
                          />
                          <span className="friendNamePopup">{friend.lastname} {friend.firstname}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span className="noFriends">Nu ai prieteni care se potrivesc cu această căutare.</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="followersList">
            <div className="upFollowersList">
              <span className='allFollowers'>
                {loggedInUser?._id === user._id ? "Lista ta de urmăritori" : "Lista de urmăritori"}
              </span>
              <span className='seeAllFollowers'onClick={toggleFollowersPopup}>Vezi intreaga listă </span>
              <span className='allFollowersNumber'>{followers.length}</span>
            </div>
            
            <div className="lowFollowersList">
                {followers.slice(0, 3).map((follower) => (
                <Link to={`/myprofile/${follower._id}`}  className="followers" key={follower._id}>
                  <img src={follower.profileImage ? FLDR + follower.profileImage : "/assets/users/defaultProfileImage.png"} className='followerPhoto' alt="img" />
                  <span className="followerName">{follower.lastname} {follower.firstname}</span>
                </Link>
                ))}
            </div>
          </div>
          {showFollowersPopup && (
            <div className="popupOverlay" onClick={toggleFollowersPopup}>
              <div className="popupContent followersPopup" onClick={(e) => e.stopPropagation()}>
                <h2>Toți urmăritorii</h2>
                <input
                  type="text"
                  placeholder="Căutare urmăritori..."
                  value={searchFollowers}
                  onChange={handleSearchFollowersChange}
                  className="searchFollowersInput"
                />
                <div className="allFollowersContainer">
                  {filteredFollowers.length > 0 ? (
                    <div className="followersListInPopup">
                      {filteredFollowers.map(follower => (
                        <Link
                          to={`/myprofile/${follower._id}`}
                          key={follower._id}
                          className="followerItemInPopup"
                          onClick={() => setShowFollowersPopup(false)}
                        >
                          <img
                            src={follower.profileImage ? FLDR + follower.profileImage : "/assets/users/defaultProfileImage.png"}
                            className="followerPhotoPopup"
                            alt="img"
                          />
                          <span className="followerNamePopup">{follower.lastname} {follower.firstname}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span className="noFollowers">Nu ai urmăritori care se potrivesc cu această căutare.</span>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
    </>
  )
}
