import axios from 'axios';

 //Reptrezinta o funcție asincronă care face un apel către un API pentru a autentifica un utilizator si folosește dispatch pentru a actualiza starea aplicației (
export const loginCall = async (userCredentials,dispatch)=>{
    dispatch({type:"LOGIN_START"});
    try{
        const response = await axios.post("authentificationRoute/login",userCredentials);
        dispatch({type: "LOGIN_SUCCESSFULLY",payload:response.data});
        localStorage.setItem("user", JSON.stringify(response.data));
    }catch(error){
        dispatch({type: "LOGIN_FAILURE",payload:error});
    }
};