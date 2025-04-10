import {createContext,useReducer} from 'react';
import RegistrationReducer from './RegistrationReducer';

const INITIAL_STATE = {
    user:{ 
        _id:"67f78c703b0e1ee1642e6275",
        lastname:"Mira",
        firstname:"Ioana Denisa",
        dateofbirth:"2007-03-17T00:00:00.000+00:00",
        email:"miradenisa21@gmail.com",
        profileImage:"",
        coverImage:"",
        friends:[],
        theAdmin:false
    },
    isFetching: false,
    error: false,
};

export const RegistrationContext = createContext(INITIAL_STATE);

export const RegistrationContextProvider = ({children})=>{
    const[state,dispatch]=useReducer(RegistrationReducer,INITIAL_STATE);
    return(
        <RegistrationContext.Provider 
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch
            }}>{children}
        </RegistrationContext.Provider>
    )
}