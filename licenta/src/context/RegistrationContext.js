import {createContext,useReducer} from 'react';
import RegistrationReducer from './RegistrationReducer';

//Se tulizează pentru gestionarea starii globale ale utilizatorului

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
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