import React from "react";
import { useContext } from "react"; 
import {MyContext} from "../App.js";
import LoginButton from "./login.js"
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
// We import NavLink to utilize the react router.
import {ButtonContex} from "../App.js";
import { useNavigate } from "react-router";

// Here, we display our Navbar
export default function Navbar() {
  const {currentPage,setCurrentPage} = useContext(ButtonContex);
  const isDarkMode = useContext(MyContext);
  const navigate = useNavigate();

 return (
     <nav style={{"display":"flex","justifyContent":"space-between","backgroundColor":isDarkMode?"#838383":"#eeeeee","color":isDarkMode?"white":"#1f1f1f"}}>
       <img className="navbar-brand" style={{"width" :"40px","marginLeft":"5px"}} onClick={()=>{
         navigate("/")
         setCurrentPage("/createProject")
         }} src="http://www.powerpac.org/wp-content/uploads/2017/07/checklist.png"></img>
       <div style={{"display":"flex","justifyContent":"space-between","width":"53%"}}>  
            <button className="btn btn-danger" style={{"margin":"5px"}} onClick={()=>{
              if(currentPage==="/createProject"){
                navigate("/createProject")
              }else{
                setCurrentPage("tasklist")
              }
              }}>Create</button> 
         <LoginButton/>
       </div>
     </nav>
 );
}