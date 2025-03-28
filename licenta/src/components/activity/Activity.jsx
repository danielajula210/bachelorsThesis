import {React, useState, useEffect} from 'react'
import axios from 'axios'
import "./activity.css"

import Postmaker from '../postmaker/Postmaker'
import Post from '../post/Post'

export default function Activity({userId}) {
  const[posts, setPosts]= useState([]);

  useEffect(()=>{
    const fetchPosts= async()=>{
      const response = userId 
      ? await axios.get(`/postsRoute/gettingprofileposts/${userId}`)
      : await axios.get("/postsRoute/gettingposts/67b642f93202c0b7f2287fbc")
      setPosts(response.data)
    };
    fetchPosts();
  },[userId]);

  return (
    <div className='activity'>
      <div className="activityContainer">
        <Postmaker/>
        {posts.map( (p) => (<Post key={p._id} post={p}/>) )} 
      </div>
    </div>
  );
}
