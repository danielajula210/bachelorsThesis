import React, { useState } from 'react';

import "./postmaker.css"

import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

export default function Postmaker() {
  const FLDR = process.env.REACT_APP_POSTS_FOLDER;
  const [user,setUsers]=useState({});

  return (
    <div className='postMaker'>
      <div className="postMakerContainer">

        <div className="upperPart">
          <img className="postMakerProfileImg" src={user.profileImage || FLDR+"users/defaultProfileImage.png"}  alt="img" />
          <input placeholder='Ce ai dori să distribui astăzi?' className='text'/>
        </div>

        <hr className="downpartSeparater"/>
        <div className="downPart">
            <div className="postingMakerOptions">
              
              <div className="postMakerOption">
                <InsertPhotoIcon htmlColor='green' className="photoIcon"/>
                <span className='photoText'>Poză</span>
              </div>

              <div className="postMakerOption">
                <InsertEmoticonIcon htmlColor='orange' className="emojiIcon"/>
                <span className='emojiText'>Stare</span>
              </div>
            </div>

        <button className='postMakerButton'>Postează</button>

        </div>
      </div>
    </div>
  )
}
