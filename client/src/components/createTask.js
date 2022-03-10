import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
 
export default function Create() {
 const [form, setForm] = useState({
   summary: "",
   description: "",
   priority: "",
   status:"Todo",
   project:"",
 });
 const [records, setRecords] = useState({
   name:"",
 });
 const navigate = useNavigate();
 const params = useParams();

 useEffect(() => { //get project data
  async function fetchData() {
    const id = params.id.toString();
    const response = await fetch(`http://localhost:5000/project/${params.id.toString()}`);
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
    setRecords(record);
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
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
   form.project = records.name;
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };
 
   await fetch("http://localhost:5000/record/add", {
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
   setForm({ summary: "", description: "", priority: "",status:"Todo",project:""});
   navigate(`/projectTask/${records._id}`)
 }


 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create {records.name} Task</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">summary</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.summary}
           onChange={(e) => updateForm({ summary: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="position">description</label>
         <input
           type="text"
           className="form-control"
           id="position"
           value={form.description}
           onChange={(e) => updateForm({ description: e.target.value })}
         />
       </div>
       <label htmlFor="position">priority</label>
       <div className="form-group">
       <select class="form-select" name="priority" onChange={(e) => updateForm({ priority: e.target.value})}>
          <option disabled selected value> -- select -- </option>
          <option value="Lowest">Lowest</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Highest">Highest</option>
       </select>
      </div>
       <div className="form-group">
         <input
           type="submit"
           value="Create"
           className="btn btn-danger"
         />
        <button className="btn btn-secondary" style={{"margin-left":"10px"}} onClick={()=>navigate(`/projectTask/${records._id}`)}>Cancel</button>
       </div>
     </form>
   </div>
 );
}