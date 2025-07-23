import React, { useContext, useState } from 'react'
import {assets} from "../assets/assets"
import { Link, useNavigate } from 'react-router-dom'
import { AppContext} from '../context/AppContext'

const Navbar = () => {
  
    const {user,setShowLogin,credits,setUser,setToken,setCredits}=useContext(AppContext);
   
    
    const navigate=useNavigate();

    

const handleLogout = () => {
  localStorage.removeItem('token');
  setUser(null);
  setToken(null);
  setCredits(false); // or 0
  navigate('/'); // Redirect to homepage or login
};

   
  return (
    <div className='flex justify-between py-4 items-center'>
     <Link to='/'> <img className='w-28 sm:w-32 lg:w-40' src={assets.logo}></img></Link>
     
  
   {
  user ? (
    <div className='flex items-center gap-2 sm:gap-3'>
      <button onClick={()=>{navigate('/buy')}} className='flex items-center gap-2 bg-blue-100 px-4 py-1.5 sm:px-6 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
        <img className='w-5' src={assets.credit_star}/>
        <p className=' text-xs sm:text-sm font-medium text-gray-600'>Credit left:{credits}</p>
      </button>
      <p className=' text-gray-600 max-sm:hidden pl-4'>Hi, {user.name}</p>
      
      <div className='relative group'> 
        <img className='w-10 drop-shadow' src={assets.profile_icon}/>
        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
          <ul className=' list-none m-0 p-2  bg-white rounded-md border text-sm px-2 py-1 pr-10 cursor-pointer'>
            <li onClick={handleLogout} >Logout</li>
          </ul>
        </div>
      </div>  
    </div>
  ) : (
    <div className='flex items-center gap-2 sm:gap-5'>
      <p onClick={()=>{navigate('/buy')}} className='cursor-pointer'>Pricing</p>
      <button onClick={()=>{setShowLogin(true)}} className='bg-zinc-800 cursor-pointer text-white px-7 py-2 sm:px-10 text-sm rounded-full'>Login</button>
    </div>
  )
}
        
       
     </div>


  
  )
}

export default Navbar