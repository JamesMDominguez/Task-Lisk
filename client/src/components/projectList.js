import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

const Project = (props) => (
 <tr>
   <td onClick={()=>props.navigate(`/projectTask/${props.project._id}`)}>{props.project.name}</td>
   <td>
     <Link className="btn btn-danger" style={{"marginRight":"10px"}} to={`/editProject/${props.project._id}`}>Edit</Link>
     <button className="btn btn-secondary" onClick={() => {props.deleteProject(props.project._id)}}>
       Delete
     </button>
   </td>
 </tr>
);
 
export default function ProjectList() {
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
   <div>
       <h3 style={{"margin":"10px"}}>Project List</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>name</th>
         </tr>
       </thead>
       <tbody>{projectList()}</tbody>
     </table>
   </div>
 );
}