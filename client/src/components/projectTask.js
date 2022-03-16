import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import './projectTask.css';

export default function RecordList() {
 const [records, setRecords] = useState([]);
 const params = useParams();
 const navigate = useNavigate();
 const [form, setForm] = useState({
    name: "",
  });
  const [taskAdd, setTaskAdd] = useState({});
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
      setForm(project);
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
        if(record.status === myStatus && form._id === record.project){
         return (
             <Task
               record={record}
               key={record._id}
             />
           );
        }
    });
  }

async function handleDrop(){
  setTaskAdd("true"+taskAdd);
  await fetch(`http://localhost:5000/update/${myTask._id}`, {
    method: "POST",
    body: JSON.stringify(myTask),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  console.log("Item updated");
}

 // This following section will display the table with the records of individuals.
 return (
   <>
     <div style={{"justifyContent": "space-between", "display":"flex", "margin":"10px"}}>
       <h3>{form.name}</h3>
       <button className="btn btn-danger" onClick={()=>navigate(`/createTask/${form._id}`)}>Create Task</button>
       </div>


     <div id="container">
        <div
           onDragOver={(e)=>{e.preventDefault()}}
           onDragEnter={()=>{myTask.status="Todo"}}
           onDrop={()=>{handleDrop()}}
        >
            <p>Todo</p>
            <div id="container2">
                {todoList("Todo")}
            </div>
        </div>

        <div
           onDragOver={(e)=>{e.preventDefault()}}
           onDragEnter={()=>{myTask.status="In Progress"}}
           onDrop={()=>{handleDrop()}}
        >
           <p>In Progress</p>
           <div id="container2">
             {todoList("In Progress")}
            </div>
        </div>
        <div            
            onDragOver={(e)=>{e.preventDefault()}}
            onDragEnter={()=>{myTask.status="Done"}}
            onDrop={()=>{handleDrop()}}
            > 
           <p>Done</p>
            <div id="container2">
             {todoList("Done")}
            </div>
        </div>
     </div>

     <div id="overlay" style={{"display":show}} onClick={()=>{setShow("none")}}>
         <div id="text"> 
            <p>Summary: {taskAdd.summary}</p>
            <p>Description: {taskAdd.description}</p>
            <p>Priority: {taskAdd.priority}</p>
            <p>Status: {taskAdd.status}</p>
            <div style={{"justifyContent":"space-between", "display":"flex"}}>
            <Link className="btn btn-danger" style={{"marginRight":"10px"}} to={`/edit/${taskAdd._id}`} >Edit</Link>
             <button className="btn btn-secondary" onClick={() => {deleteRecord(taskAdd._id)}}>
               Delete
             </button>
            </div>
        </div>
     </div>
   </>
 );
}