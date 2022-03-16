import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import Edit from "./components/edit";
import EditProject from "./components/editProject";
import CreateTask from "./components/createTask";
import CreateProject from "./components/createProject";
import ProjectList from "./components/projectList";
import ProjectTask from "./components/projectTask";

const App = () => {
 return (
   <div>
     <Navbar />
     <Routes>
       <Route exact path="/" element={<ProjectList />} />
       <Route path="/edit/:id" element={<Edit />} />
       <Route path="/createTask/:id" element={<CreateTask />} />
       <Route path="/createProject" element={<CreateProject />} />
       <Route path="/editProject/:id" element={<EditProject />} />
       <Route path="/projectTask/:id" element={<ProjectTask />} />
     </Routes>
   </div>
 );
};
 
export default App;