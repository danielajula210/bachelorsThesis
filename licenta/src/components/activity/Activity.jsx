import React from 'react'
import "./activity.css"

import Postmaker from '../postmaker/Postmaker'
import Post from '../post/Post'

import {Posts} from "../../postsFile"


export default function Activity() {
  return (
    <div className='activity'>
      <div className="activityContainer">
        <Postmaker/>
        {Posts.map( (p) => (<Post key={p.id} post={p}/>) )}
      </div>
    </div>
  )
}
