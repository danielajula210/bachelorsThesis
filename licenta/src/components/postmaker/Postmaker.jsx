import React, {useEffect,useState, useContext, useRef } from 'react';
import axios from 'axios'

import "./postmaker.css"
import { RegistrationContext } from '../../context/RegistrationContext';

import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';


export default function Postmaker() {
  const FLDR = process.env.REACT_APP_POSTS_FOLDER;
  const [user,setUsers]=useState({});
  const {user:loggedInUser}= useContext(RegistrationContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/usersRoute?userId=${loggedInUser._id}`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    fetchUser();
  }, []);

  const description = useRef();
  const [file,setFile] = useState(null);

  const handleSubmit= async (e)=>{
    e.preventDefault();
    const newPost={
      userId:user._id,
      postDescription: description.current.value
    }

    if(file){
      const formData=new FormData();
      const filename= file.name;

      formData.append("file",file);
      formData.append("name", filename);
      newPost.postImage=filename;
      try{
        await axios.post("/upload",formData,);
      }catch(error){
        console.log(error);
      }
    }

    try{
      await axios.post("/postsRoute",newPost);
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className='postMaker'>
      <div className="postMakerContainer">

        <div className="upperPart">
          <img className="postMakerProfileImg" src={user.profileImage ? FLDR+user.profileImage : "/assets/users/defaultProfileImage.png"}  alt="img" />
          <input placeholder={"Ce ai dori să distribui astăzi, "+ user.firstname+"?" }className='text' ref={description}/>
        </div>

        <hr className="downpartSeparater"/>
        <form className="downPart" onSubmit={handleSubmit}>
            <div className="postingMakerOptions">
              
              <label htmlFor="inputFile" className="postMakerOption">
                <InsertPhotoIcon htmlColor='green' className="photoIcon"/>
                <span className='photoText'>Poză</span>
                <input style={{display:"none"}} type="file" id="inputFile" accept=".jpeg,.png,.jpg,.gif" onChange={(e)=>setFile(e.target.files[0])}/>
              </label>

              <div className="postMakerOption">
                <InsertEmoticonIcon htmlColor='orange' className="emojiIcon"/>
                <span className='emojiText'>Stare</span>
              </div>
            </div>

        <button className='postMakerButton' type="submit">Postează</button>

        </form>
      </div>
    </div>
  )
}
