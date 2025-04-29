import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import { useContext } from "react";

import Home from "./pages/home/Home";
import MyProfile from "./pages/myprofile/MyProfile.jsx";
import Login from "./pages/login/Login"
import Registration from "./pages/registration/Registration.jsx";
import AdminPanel from './pages/admin/AdminPanel.jsx';

import {RegistrationContext} from "./context/RegistrationContext.js"



function App() {
  const {user}=useContext(RegistrationContext);
  return(
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Registration/>} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/myprofile/:userId" element={<MyProfile />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/registration" element={user ? <Navigate to="/" /> : <Registration />}/>
        <Route path="/admin" element={<AdminPanel/>}/>
      </Routes>
    </Router>
  );

}

export default App;
