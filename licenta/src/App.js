import Home from "./pages/home/Home";
import MyProfile from "./pages/myprofile/MyProfile.jsx";
import Login from "./pages/login/Login"
import Registration from "./pages/registration/Registration.jsx";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/registration" element={<Registration/>}/>
      </Routes>
    </Router>
  );

}

export default App;
