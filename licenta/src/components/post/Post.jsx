import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import axios from 'axios'
import {format} from "timeago.js"

import "./post.css"

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';


export default function Post({post}) {
    const FLDR = process.env.REACT_APP_POSTS_FOLDER;

    const [like,setLike]=useState(post.likes);
    const [liked,setLiked]=useState(false);

    const [user,setUsers]=useState({});


    const likesHandler = () => {
        setLike((oldLikes) => (liked ? oldLikes-1 : oldLikes+1));
        setLiked(!liked);
    };

    useEffect(()=>{
        const fetchUsers= async () =>{
            const response=await axios.get(`/usersRoute?userId=${post.userId}`);
            setUsers(response.data);
        };
        fetchUsers();
    },[post.userId]);

    return (
        <div className="post">
            <div className='postContainer'>
                <div className="upPart">
                    <div className="leftUpPart">
                        <Link to={`MyProfile`}><img className="profileImgInPost"src={user.profileImage || FLDR+"users/defaultProfileImage.png"} alt="img" /></Link>
                        <span className="usernameInPost">{user.lastname} {user.firstname}</span>
                        <span className="dateInPost">{format(post.createdAt)}</span>
                    </div>

                    <div className="rightUpPart">
                        <MoreHorizIcon/>
                    </div>
                </div>

                <div className="middlePart">
                    <span className='description'>{post?.description}</span>
                    <img className="photo"src={FLDR+post.postImage} alt="img" />
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
