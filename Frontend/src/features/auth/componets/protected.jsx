import{useAuth } from "../hooks/useAuth";
import{Navigate } from "react-router-dom";

import React from 'react'

const Protected =({children})=>{
    const {loading,user}=useAuth();
    console.log("Protected:", { loading, user });


    if(loading){
        return(<main><h1>Loading.....</h1></main>)
    }
        if(!user){
          return <Navigate to ={'/login'} />

        }
        return children

}
export default Protected