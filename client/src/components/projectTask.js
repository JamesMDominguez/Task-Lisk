import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import './projectTask.css';

export default function RecordList() {
 const [records, setRecords] = useState([]);
 const params = useParams();
 const navigate = useNavigate();
 const [myProject, SetMyProject] = useState({
    name: "",
  });
  const [selectedRecord, setTaskAdd] = useState({
    summary: "",
    description: "",
    priority: "",
    status:"",
    project:"",
    _id:"",
  });
  const [show, setShow] = useState("none");
  let myTask = {
    summary: "",
    description: "",
    priority: "",
    status:"",
    project:"",
    _id:"",
  };

 const Task = (props) => (
  <div 
  onClick={()=>{
    setTaskAdd(props.record)
    setShow("block");
  }}
  id="container3" 
  draggable="true" 
  onDragStart={()=>{
    myTask = props.record
    }}>
        <p>{props.record.summary}</p>
        <p>{props.record.priority}</p>
  </div>
 );
 
 useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`http://localhost:5000/project/${params.id.toString()}`);
  
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
  
      const project = await response.json();
      if (!project) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      SetMyProject(project);
    }
    fetchData();
    return;
  }, [params.id, navigate]);
 
 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5000/record/`);
 
     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const records = await response.json();
     setRecords(records);
   }
 
   getRecords();
 
   return;
 }, [records.length]);
 
 // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`http://localhost:5000/${id}`, {
     method: "DELETE"
   });
 
   const newRecords = records.filter((el) => el._id !== id);
   setRecords(newRecords);
 }
 
 
 // This method will map out the records on the table


 function todoList(myStatus) {
    return records.map((record) => {
        if(record.status === myStatus && myProject._id === record.project){
         return (
             <Task
               record={record}
               key={record._id}
             />
           );
        }
    });
  }

async function updateRecord(updatedTask){
  await fetch(`http://localhost:5000/update/${updatedTask._id}`, {
    method: "POST",
    body: JSON.stringify(updatedTask),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  console.log("Item updated");
  setTaskAdd({});
  setShow("none")
}



 // This following section will display the table with the records of individuals.
 return (
   <>
       <h3 style={{"marginLeft":"6.5%"}}>{myProject.name}</h3>

     <div id="container">
        <div
           onDragOver={(e)=>{e.preventDefault()}}
           onDragEnter={()=>{myTask.status="Todo"}}
           onDrop={()=>{updateRecord(myTask)}}
        >
            <p>Todo</p>
            <div id="container2">
                {todoList("Todo")}
            </div>
            <button 
            className="btn btn-danger" 
            style={{"width":"100%","borderRadius":"10px"}} 
            onClick={()=>navigate(`/createTask/${myProject._id}`)}>
              Create Task
            </button>

        </div>

        <div
           onDragOver={(e)=>{e.preventDefault()}}
           onDragEnter={()=>{myTask.status="In Progress"}}
           onDrop={()=>{updateRecord(myTask)}}
        >
           <p>In Progress</p>
           <div id="container2">
             {todoList("In Progress")}
            </div>
        </div>
        <div            
            onDragOver={(e)=>{e.preventDefault()}}
            onDragEnter={()=>{myTask.status="Done"}}
            onDrop={()=>{updateRecord(myTask)}}
            > 
           <p>Done</p>
            <div id="container2">
             {todoList("Done")}
            </div>
        </div>
     </div>

     <div id="overlay" style={{"display":show}} onClick={()=>{setShow("none")}}>
         <div id="text" onClick={(e)=>{e.stopPropagation()}}> 
       <div className="form-group">
         <label htmlFor="name">summary: </label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={selectedRecord.summary}
           onChange={(e) => selectedRecord.summary = e.target.value }
         />
       </div>
       <div className="form-group">
         <label htmlFor="position">description: </label>
         <textarea
           className="form-control"
           id="position"
           value={selectedRecord.description}
           onChange={(e) => selectedRecord.description = e.target.value}
         />
       </div>
       <div className="form-group">
       <label htmlFor="name">priority: </label>
       <select className="form-select" name="priority" onChange={(e) => selectedRecord.priority = e.target.value}>
          <option disabled selected value> {selectedRecord.priority} </option>
          <option value="Lowest">Lowest</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Highest">Highest</option>
       </select>
      </div>
      <div className="form-group">
      <label htmlFor="name">status: </label>
       <select className="form-select" name="status" onChange={(e) => selectedRecord.status = e.target.value}>
          <option disabled selected value> {selectedRecord.status} </option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
       </select>
      </div>
       <br />
       <div className="form-group" style={{"justifyContent":"space-evenly","display":"flex"}}>
         <button className="btn btn-danger"
           onClick={()=>{updateRecord(selectedRecord)}}>Save</button>
          <button className="btn btn-secondary" onClick={() => {deleteRecord(selectedRecord._id)}}>
               Delete
          </button>
         </div>
        </div>
     </div>
   </>
 );
}