import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import './projectTask.css';

export default function RecordList() {
 const [records, setRecords] = useState([]);
 const params = useParams();
 const navigate = useNavigate();
 const [update, setUpdate] = useState(false);
 const [myProject, SetMyProject] = useState({
    name: "",
  });
 const [show, setShow] = useState("none");
 const [status] = useState(["Todo","In Progress","done"]);
 const [myTask, setMyTask] = useState({
  description: "",
  priority: "",
  project:"",
  summary: "",
  status:"",
  _id:"",
});

 
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
 }, [update]);
 
 // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`http://localhost:5000/${id}`, {
     method: "DELETE"
   });
 
   const newRecords = records.filter((el) => el._id !== id);
   setRecords(newRecords);
 }
 
 
 // This method will map out the records on the table

async function updateRecord(updatedTask){
  setUpdate((prev)=>!prev)
  await fetch(`http://localhost:5000/update/${updatedTask._id}`, {
    method: "POST",
    body: JSON.stringify(updatedTask),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  
  console.log("Item updated");
  setShow("none");
}

function updateForm(value) {
  return setMyTask((prev) => {
    return { ...prev, ...value };
  });
}


function todoListBuckets() {
    let showCreateTask= "none"; 
    let selectedTask = {}
    return status.map((myStatus) => {
      if((myStatus==="Todo")){
        showCreateTask="block"
      }else{
        showCreateTask="none"
      }
      return(
      <div
      key={myStatus}
      onDragOver={(e)=>{e.preventDefault()}}
      onDragEnter={()=>{
        selectedTask.status = myStatus;
       }}
      onDrop={()=>{
        updateRecord(selectedTask)
        console.log("record droped")
      }}
   >
       <p>{myStatus}</p>
       <div id="container2">  {/*Todo List*/}
     {records.map((record) => {
      if(record.status === myStatus && myProject._id === record.project){
       return (
        <div 
        key={record._id}
        onClick={()=>{
          setMyTask(record)
          setShow("block")
        }}
        id="container3" 
        draggable = "true"
        onDragStart={()=>{
          selectedTask={...record}
          console.log(selectedTask);
          console.log("drag start");
        }}>
              <p>{record.summary}</p>
              <p>{record.priority}</p>
        </div>
         )}})}  {/*Todo List*/}
       </div>  
       <button 
       className="btn btn-danger" 
       style={{"width":"100%","borderRadius":"10px","display":showCreateTask}} 
       onClick={()=>navigate(`/createTask/${myProject._id}`)}>
         Create Task
       </button>
   </div>
     )});
  }


 // This following section will display the table with the records of individuals.
 return (
   <>
       <h3 style={{"marginLeft":"6.5%"}}>{myProject.name}</h3>

     <div id="container">
       {todoListBuckets()}
     </div>

     <div id="overlay" style={{"display":show}} onClick={()=>{setShow("none")}}>
         <div id="text" onClick={(e)=>{e.stopPropagation()}}> 
       <div className="form-group">
         <label htmlFor="name">summary: </label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={myTask.summary}
           onChange={(e)=>updateForm({summary:e.target.value})}
         />
       </div>
       <div className="form-group">
         <label htmlFor="position">description: </label>
         <textarea
           className="form-control"
           id="position"
           value={myTask.description}
           onChange={(e) => {updateForm({description:e.target.value})}}
         />
       </div>
       <div className="form-group">
       <label htmlFor="name">priority: </label>
       <select className="form-select" name="priority" onChange={(e)=>updateForm({priority:e.target.value})}>
          <option disabled selected value> {myTask.priority} </option>
          <option value="Lowest">Lowest</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Highest">Highest</option>
       </select>
      </div>
      <div className="form-group">
      <label htmlFor="name">status: </label>
       <select className="form-select" name="status" onChange={(e) =>{updateForm({status:e.target.value})
          }}>
          <option disabled selected value> {myTask.status} </option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="done">Done</option>
       </select>
      </div>
       <br />
       <div className="form-group" style={{"justifyContent":"space-evenly","display":"flex"}}>
       <button className="btn btn-danger" onClick={()=>updateRecord(myTask)}>Save</button>
          <button className="btn btn-secondary" onClick={() => {
            deleteRecord(myTask._id)
            }}>Delete</button>
         </div>
        </div>
     </div>
   </>
 );
}