import { createContext, useState,useEffect } from "react";
import React from "react";
export const AppContext=createContext()

//this use statate of [user,SetUser] can be accessed by any of its children thats why we have wrapperd App inside
//or <AppContextProvider>
   //      <App>
const AppContextProvider=(props)=>{
const[user,setUser]=useState(null);
const [showLogin,setShowLogin]=useState(false);
const [token,setToken]=useState(localStorage.getItem('token'));
//this is the backend url which we will use to make api calls from client side
const [credits,setCredits]=useState(false);
const backendUrl=import.meta.env.VITE_BACKEND_URL;


console.log(import.meta.env);

useEffect(() => {
  const fetchUser = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/user/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setCredits(data.user.credits);
      } else {
        console.warn("Invalid token or session expired");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  fetchUser();
}, [token]);


const value={
    user,setUser,showLogin,setShowLogin,backendUrl,token,setToken,credits,setCredits
}

return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
)
}

export default AppContextProvider;