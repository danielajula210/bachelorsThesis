import React, { useState } from "react";
import "./post.css"

import {Users} from "../../postsFile"

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';


export default function Post({post}) {
    const [like,setLike]=useState(post.likes)
    const [liked,setLiked]=useState(false)

    const likesHandler = () => {
        setLike((oldLikes) => (liked ? oldLikes-1 : oldLikes+1));
        setLiked(!liked);
    };

    return (
        <div className="post">
            <div className='postContainer'>
                <div className="upPart">
                    <div className="leftUpPart">
                        <img className="profileImgInPost"src={Users.filter( (u)=>u.id===post.userId)[0].prPicture } alt="img" />
                        <span className="usernameInPost">{Users.filter( (u)=>u.id===post.userId)[0].username }</span>
                        <span className="dateInPost">{post.time}</span>
                    </div>

                    <div className="rightUpPart">
                        <MoreHorizIcon/>
                    </div>
                </div>

                <div className="middlePart">
                    <span className='description'>{post?.description}</span>
                    <img className="photo"src={post.image} alt="img" />
                </div>

                <div className="lowPart">
                    <div className="leftLowPart">
                        <FavoriteIcon htmlColor='red' className="like" onClick={likesHandler}/>
                        <HeartBrokenIcon htmlColor='black' className="dislike"/>
                        <span className='counter'>Apreciată de {like} persoane</span>
                    </div>
                    <div className="rightLowPart">
                        <span className='comment'>{post.comments} Comentarii</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
