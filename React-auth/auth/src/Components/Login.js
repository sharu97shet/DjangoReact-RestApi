
import React, {useEffect, useState} from 'react'
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios" 
import axiosInstance from '../utils/AxiosInstance';

const Login = () => {

  const navigate=useNavigate()
  const [searchparams] = useSearchParams()

 const [logindata, setLogindata]=useState({
    email:"",
    password:""
})

const handleOnchange=(e)=>{
    setLogindata({...logindata, [e.target.name]:e.target.value})
}

const handleSubmit = async(e)=>{
  e.preventDefault()

  
const response = await axiosInstance.post('http://127.0.0.1:8000/api/login/',logindata)
console.log(response)
    console.log(response.data)
    const result=response.data
    //console.log(result)
        

    alert(result.email)
    

    if (result.email==='')
    {
      alert("Email or Password didn't matched please try again")
        navigate('/login')
        

    }
    else{
      const user={
            'full_name':result.full_name,
            'email':result.email
         }
      localStorage.setItem('token', JSON.stringify(result.access_token))
        localStorage.setItem('refresh_token', JSON.stringify(result.refresh_token))
        localStorage.setItem('user', JSON.stringify(user))
  
        axiosInstance.defaults.headers['Authorization'] =
            'JWT ' + localStorage.getItem('token')
  
      toast.success("Login Successful")
      alert(result.email+' '+result.access_token) 
      navigate('/dashboard')
      return

    }



}

  return (
    
    <div>
      <div className='form-container'>
            <div style={{width:"100%"}} className='wrapper'>
            <h2>Login into your account</h2>
            <form action="" onSubmit={handleSubmit}>
                <div className='form-group'>
                 <label htmlFor="">Email Address:</label>
                 <input type="text"
                  className='email-form'
                   value={logindata.email}  
                   name="email"
                   onChange={handleOnchange}/>
                   
               </div>
               
               <div className='form-group'>
                 <label htmlFor="">Password:</label>
                 <input type="text" 
                 className='email-form' 
                 value={logindata.password}
                  name="password"
                 onChange={handleOnchange}/>
               </div>
               
               <input type="submit" value="Login" className="submitButton" />

              <p><span className='pass-link'><Link to={'/forgot-password'}>forgot password</Link>
                      
                        </span>
                </p> 
                        
                </form>

                 <h3 className='text-option'>Or</h3>
            <div className='githubContainer'>
                <button >Sign in with Github</button>
            </div>
            <div className='googleContainer'>
                <div id="signInDiv" className='gsignIn'></div>
            </div>
           </div>
        </div>


    
        </div>
      )
    
  }


export default Login