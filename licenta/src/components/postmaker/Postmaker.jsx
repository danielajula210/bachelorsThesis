import React, {useEffect,useState, useContext, useRef } from 'react';  //Se importa React, hook-urile de baza si contextul pentru utilizatorul curent
import axios from 'axios'

import "./postmaker.css"//Se importa css-ul corespunzător pentru stilizare
import { RegistrationContext } from '../../context/RegistrationContext';//Se utilizeaza pentru starea globală a utilizatorului

//Se importa librarii externe pentru iconitele folosite
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CancelIcon from '@mui/icons-material/Cancel';


export default function Postmaker() {
  const FLDR = process.env.REACT_APP_POSTS_FOLDER;//Reprezinta locul unde se salveaza imaginile pe serverul local

  // State pentru datele utilizatorului, fisierul selectat si contextul user-ului logat
  const [user,setUsers]=useState({});
  const {user:loggedInUser}= useContext(RegistrationContext);

  // Referinta pentru campul de descriere
  const description = useRef();
  const [file,setFile] = useState(null);//Utilizat pentru imaginea atasata


   // La montarea componentei, preluam datele utilizatorului
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

  //Expresii regulate pentru detectarea continutului interzis
  const prohibitedPatterns = [
      /https?:\/\/\S+/gi,
      /www\.\S+/gi,
      /\.(com|ro|net|info|biz|xyz|top|online|click|link)/gi,
      /\b(socant|viral|bomba|link|incredibil|uimitor|senzational|uluitor|exploziv|nu vei crede|in sfarsit|adevarul despre|rusinos|cutremurator|scandalos|interzis|click aici|vezi acum|distribuie rapid|share|like|da mai departe|nu ignora|citeste pana la capat|medicii ascund|secret guvernamental|s-a aflat|in premiera|exclusiv|dezvaluire|castiga bani rapid|lucreaza de acasa|gratis|100% garantat|fara efort|truc simplu|pastile minune|detoxifiere|slabesti|bitcoin|investitie sigura)\b/gi,
      /\d{10,}/gi
  ];

  //Functie pentru eliminarea diacriticelor din textul scris
  function removeDiacritics(str) {
      return str
          .replace(/ș|ş|Ș|Ş/g, 's')
          .replace(/ț|ţ|Ț|Ţ/g, 't')
          .replace(/ă|Ă/g, 'a')
          .replace(/â|Â/g, 'a')
          .replace(/î|Î/g, 'i');
  }

  //Verifica daca textul contine continut interzis
  function containsProhibitedContent(text) {
      const cleanText = removeDiacritics(text.toLowerCase());
      return prohibitedPatterns.some(pattern => pattern.test(cleanText));
  }

  //Functia pentru trimiterea postarii
  const handleSubmit= async (e)=>{
    e.preventDefault();

    const postDescription = description.current.value;

    //Validăm conținutul textului
    if (containsProhibitedContent(postDescription)) {
        alert("Postarea conține linkuri sau cuvinte interzise. Te rugăm să editezi descrierea.");
        return;
    }

    // Cream un obiect de tip newPost
    const newPost={
      userId:user._id,
      postDescription: description.current.value
    }

     //Dacă este atasat un fișier, il incarcam pe server
    if(file){
      const formData=new FormData();
      const filename= file.name;

      formData.append("file",file);
      formData.append("name", filename);
      newPost.postImage=filename;
      try{
        await axios.post("/upload",formData,);// Trimitem cererea de tip POST către backend
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

        {/* Secțiunea de creare a unei postări */}
        <div className="upperPart">
          <img className="postMakerProfileImg" src={user.profileImage ? FLDR+user.profileImage : "/assets/users/defaultProfileImage.png"}  alt="img" />
          <input placeholder={"Ce ai dori să distribui astăzi, "+ user.firstname+"?" }className='text' ref={description}/>
        </div>

        <hr className="downpartSeparater"/>
        {/* Afișăm preview-ul imaginii daca a fost selectata */}
        {file && (
          <div className="postingContainer">
            <img  src={URL.createObjectURL(file)} className="postingImage" ></img>
            <CancelIcon className="postCancel" onClick={()=>setFile(null)}/>
          </div>
        )}
        {/* Formularul pentru crearea postării */}
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
