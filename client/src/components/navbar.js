import React from "react";
import { useContext } from "react"; 
import {MyContext} from "../App.js";
import LoginButton from "./login.js"
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router";
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 

// Here, we display our Navbar
export default function Navbar() {
  const isDarkMode = useContext(MyContext);
 return (
     <nav style={{"display":"flex","justifyContent":"space-between","backgroundColor":isDarkMode?"#838383":"#eeeeee","color":isDarkMode?"white":"#1f1f1f"}}>
       <NavLink className="navbar-brand" to="/">
       <img style={{"width" :"40px","marginLeft":"5px"}} src="http://www.powerpac.org/wp-content/uploads/2017/07/checklist.png"></img>
       </NavLink>
       <div style={{"display":"flex","justifyContent":"space-between","width":"53%"}}>
         <NavLink to="/createProject">
        <button className="btn btn-danger" style={{"margin":"5px"}}>Create</button> 
       </NavLink>
         <LoginButton/>
       </div>
     </nav>
 );
}