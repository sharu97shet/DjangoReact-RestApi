import React, {useEffect, useState} from 'react'
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios"
import axiosInstance from '../utils/AxiosInstance';
import { toast } from "react-toastify";

const Signup = () => {

  const navigate=useNavigate()
  const [searchparams] = useSearchParams()
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
  console.log('status', response.status)
  const result=response.data

  
    if (response.status === 201) {
      //navigate("/otp/verify")
      alert(response.data)
      alert(response.data.message)
      navigate("/otp/verify")
      //toast.success(result.message)
   }



 console.log(formdata)
 
}


const apiUrl = process.env.REACT_APP_GOOGLECLIENTID;

console.log(apiUrl)

const handleLoginWithGithub =()=>{
  window.location.assign(`https://github.com/login/oauth/authorize/?client_id=8b8ae1b369644e173db7`)
}




const handleSigninWithGoogle = async (response)=>{
  const payload=response.credential
  const server_res= await axios.post("http://127.0.0.1:8000/socialapi/google/", {'access_token':payload})
  console.log(server_res.data)

  const user={
    "email":server_res.data.email,
    "names":server_res.data.full_name,

    "access":server_res.data.access_token,
    "refresh":server_res.data.refresh_token,
  }

 console.log(user)

  if (server_res.status===200)
  {
    alert("g-auth is status 200")
    localStorage.setItem('token', JSON.stringify(server_res.data.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(server_res.data.refresh_token))
      localStorage.setItem('user', JSON.stringify(user))

    navigate('/dashboard')
  }

}



const  send_github__code_to_server = async()=>{
  if (searchparams) {
    alert(searchparams)
      try {
        alert('try'+searchparams)
      const urlparam = searchparams.get('code')  
      const resp = await axios.post('http://127.0.0.1:8000/socialapi/github/', {'code':urlparam})
      const result = resp.data
      console.log('server res: ',result)
      if (resp.status===200) {
          const user ={
          'email':result.email,
          'names':result.full_name
      }
      localStorage.setItem('token', JSON.stringify(result.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(result.refresh_token))
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/dashboard')
      toast.success('login successful')
      }
    } catch (error) {
      alert(error)
      if (error.response) {
          
          console.log(error.response.data);
          toast.error(error.response.data.detail)
        } 
      }  
    }

} 


let code =searchparams.get('code')
    useEffect(() => {
        if (code) {
          alert('yes')
           send_github__code_to_server()  
        }   
    }, [code])


useEffect(() => {
  /* global google */
  google.accounts.id.initialize({
    client_id:'933995505352-6069mmvdd4lh5afnrn7t3so7qlbbe47g.apps.googleusercontent.com',
    callback: handleSigninWithGoogle
  });
  google.accounts.id.renderButton(
    document.getElementById("signInDiv"),
    {theme:"outline", size:"large", text:"continue_with", shape:"circle", width:"280"}
  );
    
}, [])


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
            <button onClick={handleLoginWithGithub}>Sign in with Github</button>
            </div>
            <div className='googleContainer'>
               
            <div id="signInDiv" className='gsignIn'>
                <button>Sign up with Google</button>
                </div>
            </div>
           </div>
        </div>

    </div>
   
  )
}

export default Signup