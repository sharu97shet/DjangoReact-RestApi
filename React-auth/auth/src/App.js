import logo from './logo.svg';
import './App.css';


import { ToastContainer} from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './Components/Profile';
import Signup from './Components/Signup';
import Login from './Components/Login';
import VerifyEmail from './Components/VerifyEmail';
import ResetPassword from './Components/ResetPassword';
import PasswordResetRequest from './Components/PasswordResetRequest';


function App() {
 

  return (


    <div className="App">
      <Router>
     
          <Routes>
            <Route path='/' element={<Signup/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/dashboard' element={<Profile/>}/>
            <Route path='/otp/verify' element={<VerifyEmail/>}/>
            <Route path='/forgot-password' element={<PasswordResetRequest/>}/>
            <Route path='/password-reset-confirm/:uid/:token' element={<ResetPassword/>}/>
            
          </Routes>
      </Router>
    </div>
  );
}

export default App;
