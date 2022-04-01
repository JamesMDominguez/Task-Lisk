import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import {MyContext} from "../App.js";
import './projectTask.css';
import { useAuth0 } from "@auth0/auth0-react";
import {ButtonContex} from "../App.js";


 
export default function ProjectList() {
  const { user,isAuthenticated } = useAuth0();
 const [projects, setProjects] = useState([]);
 const [update,setUpdate] = useState(false);
 const [showCreate, setShowCreate] = useState("none");
 const [project,setMyProject] = useState({
   name:"",
   user:isAuthenticated?user.email:"",
 });
 const navigate = useNavigate();
 const isDarkMode = useContext(MyContext);
 const [ show, setShow] = useState("none");
 const {currentPage,setCurrentPage} = useContext(ButtonContex);
 // This method fetches the projects from the database.

 useEffect(()=>{
  if(currentPage==="create"){
    setMyProject({
      name: "",
    })
    setShow("block")
    setShowCreate("block")
    return
  }
},[currentPage]);

 useEffect(() => {
   async function getProjects() {
     const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/project/`);
 
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
 }, [update]);
 
 // This method will delete a project
 async function deleteProject(id) {
   await fetch(`${process.env.REACT_APP_SERVER_URL}/deleteProject/${id}`, {
     method: "DELETE"
   });
   const newProjects = projects.filter((el) => el._id !== id);
   setProjects(newProjects);
 }

 const Project = (props) => (
  <div style={{"backgroundColor":isDarkMode?"#3a3a3a":"#e4e4e4","color":isDarkMode?"white":"#1f1f1f","display":"flex","justifyContent":"space-between"}}>
   <h3 onClick={()=>{
    navigate(`/projectTask/${props.project._id}`)
   }}>{props.project.name}</h3>
   <button className="btn btn-danger" onClick={()=>{
     setShow("block")
     setShowCreate("none")
     setMyProject(props.project)
     }}>Edit</button>
  </div>
);
 // This method will map out the Projects on the table
 function projectList() {
   return projects.map((project) => {
if(isAuthenticated){
  if(project.user===user.email){
    return (
      <Project
        project={project}
        key={project._id}
      />
    )
  }
} else if(project.user===""){
  return (
    <Project
      project={project}
      key={project._id}
    />
  )
}
   }
   );
 }

 function updateForm(value) {
  return setMyProject((prev) => {
    return { ...prev, ...value };
  });
}

async function onSubmit(e) {
  e.preventDefault();
  // This will send a post request to update the data in the database.
  await fetch(`${process.env.REACT_APP_SERVER_URL}/updateProject/${project._id}`, {
    method: "POST",
    body: JSON.stringify(project),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  setMyProject({
    name:"",
  });
  setUpdate((prev)=>!prev)
}

async function createMyProject(e) {
  e.preventDefault();
  // When a post request is sent to the create url, we'll add a new record to the database.
  await fetch(`${process.env.REACT_APP_SERVER_URL}/project/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  })
  .catch(error => {
    window.alert(error);
    return;
  });
  setUpdate((prev)=>!prev)
}

 function editForm(){
  return(
    <div id="overlay" style={{"display":show}} onClick={()=>{
      setCurrentPage("nope")
      setShow("none")
      }}>
    <div id="text" style={{"backgroundColor":isDarkMode?"#838383":"white","color":isDarkMode?"white":"#1f1f1f"}} onClick={(e)=>{e.stopPropagation()}}> 
  <div className="form-group">
    <label htmlFor="name">name: </label>
    <input
      type="text"
      className="form-control"
      id="name"
      value={project.name}
      onChange={(e)=>updateForm({name:e.target.value,user:isAuthenticated?user.email:""})}
    />
  </div>

    <div className="form-group" style={{"display":showCreate==="block"?"none":"flex","justifyContent":"space-between","paddingTop":"10px"}}>
     <button className="btn btn-danger" onClick={(e)=>{onSubmit(e); setShow("none")}}>Save</button>
     <button className="btn btn-secondary" onClick={()=>{deleteProject(project._id); setShow("none")}}>Delete</button>
    </div>
    <button className="btn btn-danger" style={{"width":"100%","display":showCreate,"marginTop":"10px"}} onClick={(e)=>{
      createMyProject(e)
      setCurrentPage("nope")
      setShow("none")
      setUpdate((prev)=>!prev)
    }}>Create</button>
   </div>
</div>
  )
}
 
 return (
   <>
  <h3 style={{"marginLeft":"2%","color":isDarkMode?"white":"#3a3a3a","marginTop":"15px"}}>Projects</h3>
       <div id="containerPro">{projectList()}</div>
       {editForm()}
   </>
 );
}