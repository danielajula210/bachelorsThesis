import {React, useState, useEffect,useContext} from 'react' //Se importă React, hook-urile de bază și axios pentru apeluri HTTP.
import axios from 'axios'

import "./activity.css" //se importa css-ul corespunzător pentru stilizare

import Postmaker from '../postmaker/Postmaker'
import Post from '../post/Post'
import {RegistrationContext} from "../../context/RegistrationContext"

export default function Activity({userId}) {
  //Se definesc două stări: postările proprii și cele sugerate.

  const[posts, setPosts]= useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const{user}=useContext(RegistrationContext);//Se extrage utilizatorul curent din context

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("/postsRoute/gettingposts/" + user._id);//se creeaza o cerere HTTP pentru preluarea postarilor
      setPosts(response.data);
    };

    const fetchSuggested = async () => {
      const response = await axios.get("/postsRoute/suggestedposts/" + user._id);//se creeaza o cerere HTTP pentru preluarea postarilor sugerate
      setSuggestedPosts(response.data);
    };

    fetchPosts();
    fetchSuggested();
  }, [user]);

  return (
    <div className='activity'>
      <div className="activityContainer">
        <Postmaker/> {/*Se afișează componenta pentru a crea postări.*/}
        {posts.slice().reverse().map( (p) => (<Post key={p._id} post={p}/>) )} {/*Se afișează lista postărilor in ordine invers cronologică.*/}
        {suggestedPosts.length > 0 && (
          <>
            <h3 className="suggestedPosts">Postări sugerate pentru tine</h3>{/*Dacă există postari sugerate se afișează și acestea în aceeași manieră.*/}
            {suggestedPosts.map(p => <Post key={p._id} post={p} />)}
          </>
        )}
      </div>
    </div>
  );
}
