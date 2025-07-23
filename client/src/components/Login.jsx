import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';

import {useNavigate} from 'react-router-dom'
const Login = () => {
    const {setShowLogin ,setUser,setToken,setCredits}=useContext(AppContext);
    const [state,setState]=useState('Login');
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    
    const navigate=useNavigate();

    const onSubmitHanlder=async(e)=>{
        e.preventDefault();

        try{
       if(state==='Login'){
            const res=await fetch(`${backendUrl}/api/v1/user/login`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({email,password})
            });

            const data=await res.json();
            if(res.status===200){
                console.log(data);
                setUser(data.user);
                setCredits(data.user.credits);
                setToken(data.token);
                localStorage.setItem('token',data.token);
                setShowLogin(false);
                navigate('/result');
            }else{
                alert(data.message);
            }
          }else{
            const res=await fetch(`${backendUrl}/api/v1/user/signup`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({name,email,password})
            });

            const data=await res.json();
            if(res.status===200){
               
                setState('Login');
                setShowLogin(true);
            }else{
                alert(data.message);
            }
          }

        }catch(err){
            console.error(err);
        }
    }
    useEffect(()=>{
       document.body.style.overflow='hidden';

       return ()=>{
         document.body.style.overflow='unset'
       }
    },[])
    
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <form onSubmit={onSubmitHanlder} className=' relative rounded-xl bg-white p-10 text-slate-500' >
            <h1 className=' text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue!</p>

            {state !=='Login'&& <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img width={25} src={assets.profile_icon}/>
                <input onChange={(e)=>{setName(e.target.value)}} value={name}  className=' outline-none text-sm' type='text' placeholder='Full Name' required />
            </div>}

             <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.email_icon}/>
                <input onChange={(e)=>{setEmail(e.target.value)}} value={email} className=' outline-none text-sm' type='email' placeholder='Email id' required />
            </div>


             <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img  src={assets.lock_icon}/>
                <input onChange={(e)=>{setPassword(e.target.value)}} value={password} className=' outline-none text-sm' type='password' placeholder='Password' required />
            </div>
            <p className='text-sm text-blue-600 cursor-pointer my-4'>Forgot Password?</p>
            <button className='w-full bg-blue-600 text-white py-2 rounded-full cursor-pointer'>{state==='Login'?'Login':'create account'}</button>
           {state==='Login'? <p onClick={()=>{setState('Sign Up')}} className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer'>Sign Up</span></p>
            :<p onClick={()=>{setState('Login')}}  className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer'>Login</span></p>}
          <img onClick={()=>{setShowLogin(false)}} src={assets.cross_icon} className=' absolute top-5 right-5 cursor-pointer'/>
        </form>
      
    </div>
  )
}

export default Login