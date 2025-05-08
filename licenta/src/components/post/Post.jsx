import React, { useState, useEffect,useContext } from "react";
import {Link} from 'react-router-dom'
import axios from 'axios'
import {format} from "timeago.js"

import "./post.css"

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import DeleteIcon from '@mui/icons-material/Delete';

import { RegistrationContext } from "../../context/RegistrationContext";


export default function Post({post,onDelete }) {
    const FLDR = process.env.REACT_APP_POSTS_FOLDER;

    const [like,setLike]=useState(Number(post.likes) || 0);
    const [liked,setLiked]=useState(false);

    const [user,setUsers]=useState({});
    const {user:currentuser}=useContext(RegistrationContext)

    const [showMenu, setShowMenu] = useState(false);

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");


    useEffect(()=>{
        const fetchUsers= async () =>{
            const response=await axios.get(`/usersRoute?userId=${post.userId}`);
            setUsers(response.data);
        };
        fetchUsers();
    },[post.userId]);

    const likesHandler = async () => {
        try {
            setLiked((prev) => !prev);
            setLike((prev) => liked ? prev - 1 : prev + 1);
    
            await axios.put(`/postsRoute/${post._id}/liking`, { userId: currentuser._id });
    
            if (!liked) {
                await axios.post(`/usersRoute/${post.userId}/notifications/create`, {
                    userId: post.userId, 
                    type: 'like',
                    message: `${currentuser.firstname} ți-a apreciat postarea.`,
                    postId: post._id,
                });
            }
    
        } catch (error) {
            console.error("Eroare la apreciere:", error);
        }
    };
    

    useEffect(() => {
        if (Array.isArray(post.postLikes) && currentuser?._id) {
            setLiked(post.postLikes.includes(currentuser._id));
            setLike(post.postLikes.length);
        } else {
            setLiked(false);
            setLike(0);
        }
    }, [post, currentuser?._id]);
    
    console.log("Post primit:", post);

    const handleDelete = async () => {
        try {
            if (currentuser.theAdmin) {
                await axios.delete(`/postsRoute/deletefromadmin/${post._id}`);
            } else {
                await axios.delete(`/postsRoute/${post._id}`, {
                    data: { userId: currentuser._id }
                });
            }
            onDelete?.(post._id); 
        } catch (err) {
            console.error("Eroare la ștergerea postării:", err);
        }
        window.location.reload();
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/postsRoute/${post._id}`);
            setComments(response.data.postComments || []);
        } catch (err) {
            console.error("Eroare la încărcarea comentariilor:", err);
        }
    };
    
    const handleAddComment = async () => {
        if (newComment.trim() === "") return;
    
        try {
            await axios.put(`/postsRoute/${post._id}/addComment`, {
                userId: currentuser._id,
                lastname: `${currentuser.lastname}`,
                firstname: `${currentuser.firstname}`,
                profileImage: `${currentuser.profileImage}`,
                text: newComment
            });
    
            setNewComment("");
            fetchComments();
    
            await axios.post(`/usersRoute/${post.userId}/notifications/create`, {
                userId: post.userId, 
                type: 'comment',
                message: `${currentuser.firstname} a comentat la postarea ta.`,
                postId: post._id,
            });
    
        } catch (err) {
            console.error("Eroare la adăugarea comentariului:", err);
        }
    };
    

    const toggleComments = () => {
        if (!showComments) fetchComments();
        setShowComments(prev => !prev);
    };
    
    
    return (
        <div className="post">
            <div className='postContainer'>
                <div className="upPart">
                    <div className="leftUpPart">
                        <Link to={`/myprofile/${user._id}`}><img className="profileImgInPost"src={user.profileImage ? FLDR+user.profileImage : "/assets/users/defaultProfileImage.png"} alt="img" /></Link>
                        <span className="usernameInPost">{user.lastname} {user.firstname}</span>
                        <span className="dateInPost">{format(post.createdAt)}</span>
                    </div>

                    <div className="rightUpPart"style={{ position: "relative" }}>
                        <MoreHorizIcon onClick={() => setShowMenu(!showMenu)} />
                            {showMenu && (
                            <div className="postDropdown">
                                {(currentuser._id === post.userId || currentuser.theAdmin) && (
                                    <div className="dropdownItem" onClick={handleDelete}>
                                        <DeleteIcon fontSize="small" />
                                        <span>Șterge</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="middlePart">
                    <span className='description'>{post?.postDescription}</span>
                    <img className="photo"src={FLDR+post.postImage} alt="img" />
                </div>

                <div className="lowPart">
                    <div className="leftLowPart">
                        <FavoriteIcon htmlColor='red' className="like" onClick={likesHandler}/>
                        <HeartBrokenIcon htmlColor='black' className="dislike"/>
                        <span className='counter'>Apreciată de {like} persoane</span>
                    </div>
                    <div className="rightLowPart">
                        <span className='comment' onClick={toggleComments} style={{ cursor: "pointer" }}>
                            Comentarii {post.postComments.length}
                        </span>
                    </div>
                </div>

            </div>
            {showComments && (
                <div className="commentsSection">
                    <div className="existingComments">
                        {comments.length === 0 ? (
                            <p>Nu există comentarii încă.</p>
                        ) : (
                            comments.map((c, index) => (
                                <div key={index} className="commentItem">
                                    <div className="commentHeader">
                                        <img 
                                            src={c.profileImage ? FLDR + c.profileImage : "/assets/users/defaultProfileImage.png"} 
                                            alt="img" 
                                            className="commentProfileImg"
                                        />
                                        <span>{c.lastname} {c.firstname}</span>
                                    </div>
                                    <div className="commentText">{c.text}</div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="addComment">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Adaugă un comentariu..."
                        />
                        <button onClick={handleAddComment}>Trimite</button>
                    </div>
                </div>
            )}

        </div>
    )
}
