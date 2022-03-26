import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

export default function Create() {
 const { user, isAuthenticated } = useAuth0();
 const [form, setForm] = useState({
   name: "",
   user:isAuthenticated?user.email:"",
 });
 const navigate = useNavigate();

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };
 
   await fetch("http://localhost:5000/project/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ name: "" });
   navigate("/");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3 style={{"marginLeft":"5%"}}>Create New Project</h3>
     <form onSubmit={onSubmit} className="container">
       <div className="form-group">
       <label>Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value, user:isAuthenticated?user.email:""})}
         />
       </div>
       <div className="form-group" style={{"marginTop":"10px"}}>
         <input
           type="submit"
           value="Create"
           className="btn btn-danger"
         />
        <button className="btn btn-secondary" style={{"marginLeft":"10px"}} onClick={()=>navigate(`/`)}>Cancel</button>
       </div>
     </form>
   </div>
 );
}