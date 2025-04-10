import {React, useState, useEffect,useContext} from 'react'
import axios from 'axios'

import "./activity.css"

import Postmaker from '../postmaker/Postmaker'
import Post from '../post/Post'
import {RegistrationContext} from "../../context/RegistrationContext"

export default function Activity({userId}) {
  const[posts, setPosts]= useState([]);
  const{user}=useContext(RegistrationContext);

  useEffect(()=>{
    const fetchPosts = async () => {
      const response = await axios.get("/postsRoute/gettingposts/" + user._id);
      setPosts(response.data);
    };
    fetchPosts();
  }, [user]);

  return (
    <div className='activity'>
      <div className="activityContainer">
        <Postmaker/>
        {posts.map( (p) => (<Post key={p._id} post={p}/>) )} 
      </div>
    </div>
  );
}
