import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import './projectTask.css';


 
export default function ProjectList() {

  const Project = (props) => (
    <div>
     <h3 onClick={()=>props.navigate(`/projectTask/${props.project._id}`)}>{props.project.name}</h3>
     <div style={{"justifyContent":"space-between","display":"flex"}}>
     <button className="btn btn-danger" style={{"marginRight":"10px"}} onClick={()=>navigate(`/editProject/${props.project._id}`)}>Edit</button>
     <button className="btn btn-secondary" onClick={() => {props.deleteProject(props.project._id)}}> 
       Delete
     </button>
     </div>
    </div>
);

 const [projects, setProjects] = useState([]);
 const navigate = useNavigate();

 // This method fetches the projects from the database.
 useEffect(() => {
   async function getProjects() {
     const response = await fetch(`http://localhost:5000/project/`);
 
     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const projects = await response.json();
     setProjects(projects);
   }
 
   getProjects();
 
   return;
 }, [projects.length]);
 
 // This method will delete a project
 async function deleteProject(id) {
   await fetch(`http://localhost:5000/deleteProject/${id}`, {
     method: "DELETE"
   });
 
   const newProjects = projects.filter((el) => el._id !== id);
   setProjects(newProjects);
 }
 
 // This method will map out the Projects on the table
 function projectList() {
   return projects.map((project) => {
     return (
       <Project
         project={project}
         deleteProject={() => deleteProject(project._id)}
         key={project._id}
         navigate={()=> navigate(`/projectTask/${project._id}`)}
       />
     );
   });
 }

 
 // This following section will display the table with the projects of individuals.
 return (
   <>
  <h3 style={{"marginLeft":"6.5%"}}>Project List</h3>
       <div id="container">{projectList()}</div>
   </>
 );
}