import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import './projectTask.css';

const Record = (props) => (
 <tr>
   <td>{props.record.status}</td>
   <td>{props.record.summary}</td>
   <td>{props.record.priority}</td>

   <td>
     <Link className="btn btn-danger" style={{"margin-right":"10px"}} to={`/edit/${props.record._id}`}>Edit</Link>
     <button className="btn btn-secondary" onClick={() => {props.deleteRecord(props.record._id)}}>
       Delete
     </button>
   </td>
 </tr>
);
 
const Task = (props) => (
    <div id="container3">
          <p>{props.record.summary}</p>
          <p>{props.record.priority}</p>
    </div>
   );

export default function RecordList() {
 const [records, setRecords] = useState([]);
 const params = useParams();
 const navigate = useNavigate();
 const [form, setForm] = useState({
    name: "",
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
 function recordList() {
   return records.map((record) => {
       if(form.name == record.project){
        return (
            <Record
              record={record}
              deleteRecord={() => deleteRecord(record._id)}
              key={record._id}
            />
          );
       }
   });
 }

 function todoList() {
    return records.map((record) => {
        if(record.status == "Todo"){
         return (
             <Task
               record={record}
               key={record._id}
             />
           );
        }
    });
  }
 
 // This following section will display the table with the records of individuals.
 return (
   <div>
     <div style={{"justify-content": "space-between", "display":"flex", "margin":"10px"}}>
       <h3>{form.name}</h3>
       <button className="btn btn-danger" onClick={()=>navigate(`/createTask/${form._id}`)}>Create Task</button>
       </div>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Status</th>
           <th>Summary</th>
           <th>Priority</th>
           <th>Action</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>

     <div id="container">
        <div>
            <p>Todo</p>
            <div id="container2">
                {todoList()}
            </div>
        </div>

        <div>
           <p>In Progress</p>
           <div id="container2">
             {todoList()}
            </div>
        </div>
        <div> 
           <p>Done</p>
           <div id="container2">
           {todoList()}
            </div>
        </div>
     </div>

   </div>
 );
}