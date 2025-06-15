import React, { useState, useEffect,useContext } from "react"; //Se importa React, hook-urile de baza si contextul pentru utilizatorul curent
import {Link} from 'react-router-dom'//Se importa pentru navigare, routing intre pagini
import axios from 'axios'
import {format} from "timeago.js" //Se importa pentru afiaarea timpului relativ

import "./post.css"//Se importa css-ul corespunzător pentru stilizare

//Se importa librarii externe pentru iconitele folosite
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';

import { RegistrationContext } from "../../context/RegistrationContext";//Se utilizeaza pentru starea globală a utilizatorului


export default function Post({post,onDelete }) {
    const FLDR = process.env.REACT_APP_POSTS_FOLDER; //Reprezinta locul unde se salveaza imaginile pe serverul local

    // Se creeaza 2 stari like, liked si 2 funcții setLike si setLiked care se ocupă de gestionarea aprecierilor 
    const [like,setLike]=useState(Number(post.likes) || 0);
    const [liked,setLiked]=useState(false);

    const [user,setUsers]=useState({});   // Datele autorului postării
    const {user:currentuser}=useContext(RegistrationContext)// Extragem utilizatorul curent din context

    const [showMenu, setShowMenu] = useState(false); // Gestionarea meniului dropdown pentru setări

    // Gestionarea comentariilor (afișare și adăugare)
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // Când componenta se încarcă sau când se schimbă userId-ul postării, se incarcă datele autorului
    useEffect(()=>{
        const fetchUsers= async () =>{
            const response=await axios.get(`/usersRoute?userId=${post.userId}`);
            setUsers(response.data);
        };
        fetchUsers();
    },[post.userId]);

    // Gestionarea aprecierilor
    const likesHandler = async () => {
        try {
            setLiked((prev) => !prev);
            setLike((prev) => liked ? prev - 1 : prev + 1);// Incrementeaza/decrementeaza aprecierilor
    
            await axios.put(`/postsRoute/${post._id}/liking`, { userId: currentuser._id });// Trimite cererea HTTP către backend
    
            // Daca e un like nou, trimite notificare
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
    

     // La reincarcarea paginii se verifica daca postarea e deja apreciata si cate aprecieri are
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

    // Funcție pentru stergerea postarii
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

    // Se preiau comentariile pentru postare
    const fetchComments = async () => {
        try {
            const response = await axios.get(`/postsRoute/${post._id}`);
            setComments(response.data.postComments || []);
        } catch (err) {
            console.error("Eroare la încărcarea comentariilor:", err);
        }
    };
    
    //Functie pentru adăugarea de comentarii
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
    
            // Trimite notificare autorului postării
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
    
    // Afișează sau ascunde comentariile
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
                        <span className='counter'>Apreciată de {like} persoane</span>
                    </div>
                    <div className="rightLowPart">
                        <span className='comment' onClick={toggleComments} style={{ cursor: "pointer" }}>
                            Comentarii {post.postComments.length}
                        </span>
                    </div>
                </div>

            </div>
            {/* Secțiunea de comentarii */}
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

                    {/* Secțiunea pentru adaugare de comentarii */}
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
