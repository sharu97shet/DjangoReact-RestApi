import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios" 
import axiosInstance from '../utils/AxiosInstance';
//import Axiosinstance from "../utils/AxiosInstance.js";

const Profile = () => {
  const jwt=localStorage.getItem('token')
  const access=localStorage.getItem('access')
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();

   useEffect(() => {
     if (jwt === null && !user) {
         navigate('/login')
     }else{
      alert("Your Profile Details is Fetching ,please have patience")
      // getSomeData()
     }
     
   }, [jwt, user])

   
   const refresh=JSON.parse(localStorage.getItem('refresh_token'))


    const handleLogout = async () => {
      alert('123'+refresh)
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/logout/', {
                refresh_token: refresh,
            },
            
            );

            if (response.status === 200) {
              localStorage.removeItem('token')
              localStorage.removeItem('refresh_token');
              axiosInstance.defaults.headers['Authorization'] = null;
                
              console.log(response.data);
              navigate('/login')
         }
         else{
          alert('somethingwork'+response.status)
         }


          
        
            // Handle success
        } catch (error) {
          alert(error)
            console.log(error); // Handle error
        }
    };
  

   

  // const handleLogout = async ()=>{
  //   alert("logout work is still in progress")
  //   const response = await axios.post('http://127.0.0.1:8000/api/logout/',refresh)
  //   //const res = await AxiosInstance.post('/logout/', {'refresh_token':refresh})
  //   if (response.status === 200) {
  //        localStorage.removeItem('token')
  //        localStorage.removeItem('refresh_token')
  //        localStorage.removeItem('user')
  //        navigate('/login')
        
  //   }
  // }

  return (
   
    <div className='container'>
       <div>Profile</div>
    <h2> {user && user.full_name}</h2>
    <h2> {user.email && user.names}</h2>
    <p style={{textAlign:'center',}}>welcome to your profile</p>
    <button onClick={handleLogout} className='logout-btn'>Logout</button>
</div>
  )
}

export default Profile