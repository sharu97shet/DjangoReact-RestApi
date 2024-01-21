import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios"
import axiosInstance from '../utils/AxiosInstance';
import { toast } from "react-toastify";

const Signup = () => {

  const navigate=useNavigate()
  const [formdata, setFormdata]=useState({
    email:"",
    first_name:"",
    last_name:"",
    password:"",
    password2:""
})

const [error, setError]=useState('')

const handleOnchange = (e)=>{
    setFormdata({...formdata, [e.target.name]:e.target.value})
}

const {email, first_name, last_name, password, password2}=formdata

const handleSubmit =async (e)=>{
  e.preventDefault()

  const response = await axiosInstance.post('http://127.0.0.1:8000/api/register/',formdata)
  console.log(response.data)
  const result=response.data
  if (response.status === 201) {
     //navigate("/otp/verify")
     alert(response.data)
     navigate("/otp/verify")
     toast.success(result.message)
  }


  console.log(formdata)
 
}


  return (
    <div>
        <div className='form-container'>
            <div style={{width:"100%"}} className='wrapper'>
            <h2>create account</h2>
            <form action="" onSubmit={handleSubmit}>
                <div className='form-group'>
                 <label htmlFor="">Email Address:</label>
                 <input type="text"
                  className='email-form'  
                  name="email" 
                  value={email}  
                  onChange={handleOnchange} />
               </div>
               <div className='form-group'>
                 <label htmlFor="">First Name:</label>
                 <input type="text"
                  className='email-form'
                  name="first_name" 
                  value={first_name} 
                  onChange={handleOnchange}/>
               </div>
               <div className='form-group'>
                 <label htmlFor="">Last Name:</label>
                 <input type="text" 
                 className='email-form'  
                 name="last_name" 
                 value={last_name} 
                 onChange={handleOnchange}/>
               </div>
               <div className='form-group'>
                 <label htmlFor="">Password:</label>
                 <input type="text" 
                 className='email-form'  
                 name="password" 
                 value={password} 
                 onChange={handleOnchange}/>
               </div>
               <div className='form-group'>
                 <label htmlFor="">Confirm Password:</label>
                 <input type="text" 
                 className='p'  
                 name="password2" 
                 value={password2} 
                 onChange={handleOnchange}/>
               </div>
               <input type="submit" value="Submit" className="submitButton" />

                </form>
                 <h3 className='text-option'>Or</h3>
            <div className='githubContainer'>
                <button>Sign up with Github</button>
            </div>
            <div className='googleContainer'>
                <div id="signInDiv" className='gsignIn'></div>
            </div>
           </div>
        </div>

    </div>
   
  )
}

export default Signup