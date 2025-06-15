import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {RegistrationContextProvider} from "./context/RegistrationContext"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RegistrationContextProvider>
      <App />
    </RegistrationContextProvider>

  </React.StrictMode>
);
//Reprezinta punctul de intrare al aplicatiei

