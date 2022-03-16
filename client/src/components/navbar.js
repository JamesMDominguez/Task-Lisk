import React from "react";
 
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 

// Here, we display our Navbar
export default function Navbar() {
 return (
   <div>
     <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{"justifyContent":"space-between","marginLeft": "10px","marginRight": "10px"}}>
       <NavLink className="navbar-brand" to="/">
       <img style={{"width" : 8 + '%'}} src="http://www.powerpac.org/wp-content/uploads/2017/07/checklist.png"></img>
       </NavLink>

       <NavLink className="btn btn-danger" to="/createProject">
       Create
       </NavLink>
       
     </nav>
   </div>
 );
}