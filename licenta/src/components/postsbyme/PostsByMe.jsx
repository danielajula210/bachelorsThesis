import React from 'react'
import {useState} from 'react'

import "./postsbyme.css"

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

export default function PostsByMe({ mypost }) {
    const [mlike, setLike] = useState(mypost.mylikes);
    const [mliked, setLiked] = useState(false);

    const mlikesHandler = () => {
        setLike((moldLikes) => (mliked ? moldLikes - 1 : moldLikes + 1));
        setLiked(!mliked);
    };

    return (
        <div className="postByMe">
            <div className='postByMeContainer'>
                <div className="upPart">
                    <div className="leftUpPart">
                        <img className="profileImgInMyPost"src="./assets/users/me.jpg" alt="img" />
                        <span className="usernameInMyPost">Cornelia Jurca</span>
                        <span className="dateInMyPost">{mypost.mytime}</span>
                    </div>

                    <div className="rightUpPart">
                        <MoreHorizIcon/>
                    </div>
                </div>

                <div className="middlePart">
                    <span className='descriptionInMyPost'>{mypost?.mydescription}</span>
                        <img className="photoInMyPost" src={mypost.myimage} alt="img" />
                    </div>

                <div className="lowPart">
                    <div className="leftLowPart">
                        <FavoriteIcon htmlColor='red' className="like" onClick={mlikesHandler}/>
                        <HeartBrokenIcon htmlColor='black' className="dislike"/>
                        <span className='mycounter'>Apreciată de {mlike} persoane</span>
                    </div>
                    <div className="rightLowPart">
                            <span className='mycomment'>{mypost.mycomments} Comentarii</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
