import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
 
export default function Edit() {
 const [form, setForm] = useState({
   summary: "",
   description: "",
   priority: "",
   status:"",
   project:"",
   _id:"",
 });
 const params = useParams();
 const navigate = useNavigate();



 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:5000/record/${id}`);
 
     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
     const record = await response.json();
     if (!record) {
       window.alert(`Record with id ${id} not found`);
       navigate("/");
       return;
     }
     setForm(record);
   }
   fetchData();
   return;
 }, [params.id, navigate]);

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 async function onSubmit(e) {
   e.preventDefault();
   const task = {
     summary: form.summary,
     description: form.description,
     priority: form.priority,
     status: form.status,
     project: form.project,
   };
 
   // This will send a post request to update the data in the database.
   await fetch(`http://localhost:5000/update/${params.id}`, {
     method: "POST",
     body: JSON.stringify(task),
     headers: {
       'Content-Type': 'application/json'
     },
   });
 
   navigate(`/projectTask/${form.project}`);
 }
 
 // This following section will display the form that takes input from the user to update the data.
 return (
   <div>
     <h3>Update Record</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">summary: </label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.summary}
           onChange={(e) => updateForm({ summary: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="position">description: </label>
         <textarea
           className="form-control"
           id="position"
           value={form.description}
           onChange={(e) => updateForm({ description: e.target.value })}
         />
       </div>
       <div className="form-group">
       <label htmlFor="name">priority: </label>
       <select class="form-select" name="priority" onChange={(e) => updateForm({ priority: e.target.value})}>
          <option disabled selected value> {form.priority} </option>
          <option value="Lowest">Lowest</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Highest">Highest</option>
       </select>
      </div>
      <div className="form-group">
      <label htmlFor="name">status: </label>
       <select class="form-select" name="status" onChange={(e) => updateForm({ status: e.target.value})}>
          <option disabled selected value> {form.status} </option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
       </select>
      </div>
       <br />
       <div className="form-group">
         <input
           type="submit"
           value="Save"
           className="btn btn-danger"
         />
         <button className="btn btn-secondary" style={{"marginLeft":"10px"}} onClick={()=>{navigate(`/projectTask/${form.project}`)}}>Cancel</button>
       </div>
     </form>
   </div>
 );
}