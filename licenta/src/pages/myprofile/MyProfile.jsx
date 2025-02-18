import React from 'react'

import "./myprofile.css"

import Tbar from '../../components/tbar/Tbar'
import PostsByMe from '../../components/postsbyme/PostsByMe'

import {MyPosts} from "../../postsFile"

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';



export default function MyProfile() {
  return (
    <>
    <div className="tBar"><Tbar/></div>
    <div className="myProfilePageContainer">
      <div className="background">
        <div className="upperProfile">
          <img className="myCoverImg" src="./assets/cover.jpg"></img>
          <div className="myProfileContainer">
            <img className="myProfileImg" src="./assets/users/me.jpg"></img>
            <span className="myName">Cornelia Jurca</span>
          </div>
        </div>
      </div>
      
      <div className="lowProfile">
        <div className="myPosts">
            {MyPosts.map((post) => (<PostsByMe key={post.id} mypost={post} />))}
        </div>


        <div className="rightLowProfile">


          <div className="descriptionMyProfile">
            <div className="upDescription">
              <span className='title'>Descriere</span>
              <div className="more">
                <MoreHorizIcon/>
              </div>
            </div>
            <span className='text'>Vă doresc o zi bună tuturor</span>
          </div>

          <div className="oldPhotosContainer">
            <div className="upperOldPhotosContainer">
              <span className='oldtitle'>Postările tale</span>
              <span className='seeAllOldPosts'>Vezi toate postările </span>
              <span className='allOldPostNumber'>3 postări</span>
            </div>

            <div className="lowOldPhotosContainer">
              <div className="oldphotos">
                  <img src="./assets/myposts/mp1.jpg" className='oldPhoto' alt="img" />
              </div>
              <div className="oldphotos">
                  <img src="./assets/myposts/mp2.jpg" className='oldPhoto' alt="img" />
              </div>

              <div className="oldphotos">
                  <img src="./assets/myposts/mp3.jpg" className='oldPhoto' alt="img" />
              </div>
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
