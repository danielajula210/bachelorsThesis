import React, {useEffect,useState, useContext, useRef } from 'react';
import axios from 'axios'

import "./postmaker.css"
import { RegistrationContext } from '../../context/RegistrationContext';

import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CancelIcon from '@mui/icons-material/Cancel';


export default function Postmaker() {
  const FLDR = process.env.REACT_APP_POSTS_FOLDER;
  const [user,setUsers]=useState({});
  const {user:loggedInUser}= useContext(RegistrationContext);
  const description = useRef();
  const [file,setFile] = useState(null);

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

  const prohibitedPatterns = [
      /https?:\/\/\S+/gi,
      /www\.\S+/gi,
      /\.(com|ro|net|info|biz|xyz|top|online|click|link)/gi,
      /\b(socant|viral|bomba|link|incredibil|uimitor|senzational|uluitor|exploziv|nu vei crede|in sfarsit|adevarul despre|rusinos|cutremurator|scandalos|interzis|click aici|vezi acum|distribuie rapid|share|like|da mai departe|nu ignora|citeste pana la capat|medicii ascund|secret guvernamental|s-a aflat|in premiera|exclusiv|dezvaluire|castiga bani rapid|lucreaza de acasa|gratis|100% garantat|fara efort|truc simplu|pastile minune|detoxifiere|slabesti|bitcoin|investitie sigura)\b/gi,
      /\d{10,}/gi
  ];

  function removeDiacritics(str) {
      return str
          .replace(/ș|ş|Ș|Ş/g, 's')
          .replace(/ț|ţ|Ț|Ţ/g, 't')
          .replace(/ă|Ă/g, 'a')
          .replace(/â|Â/g, 'a')
          .replace(/î|Î/g, 'i');
  }

  function containsProhibitedContent(text) {
      const cleanText = removeDiacritics(text.toLowerCase());
      return prohibitedPatterns.some(pattern => pattern.test(cleanText));
  }


  const handleSubmit= async (e)=>{
    e.preventDefault();

    const postDescription = description.current.value;

    if (containsProhibitedContent(postDescription)) {
        alert("Postarea conține linkuri sau cuvinte interzise. Te rugăm să editezi descrierea.");
        return;
    }

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
        {file && (
          <div className="postingContainer">
            <img  src={URL.createObjectURL(file)} className="postingImage" ></img>
            <CancelIcon className="postCancel" onClick={()=>setFile(null)}/>
          </div>
        )}
        <form className="downPart" onSubmit={handleSubmit}>
            <div className="postingMakerOptions">
              
              <label htmlFor="inputFile" className="postMakerOption">
                <InsertPhotoIcon htmlColor='green' className="photoIcon"/>
                <span className='photoText'>Poză</span>
                <input style={{display:"none"}} type="file" id="inputFile" accept=".jpeg,.png,.jpg,.gif" onChange={(e)=>setFile(e.target.files[0])}/>
              </label>
            </div>

        <button className='postMakerButton' type="submit">Postează</button>

        </form>
      </div>
    </div>
  )
}
