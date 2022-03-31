import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { MyContext } from "../App.js";
import "./projectTask.css";
import { useAuth0 } from "@auth0/auth0-react";
import { ButtonContex } from "../App.js";

export default function ProjectList() {
  const { user, isAuthenticated } = useAuth0();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const isDarkMode = useContext(MyContext);
  const { currentPage, setCurrentPage } = useContext(ButtonContex);
  // This method fetches the projects from the database.

  useEffect(() => {
    async function getProjects() {
      const response = await fetch(
        `https://sheltered-depths-34196.herokuapp.com/project/`
      );

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
    await fetch(
      `https://sheltered-depths-34196.herokuapp.com/deleteProject/${id}`,
      {
        method: "DELETE",
      }
    );

    const newProjects = projects.filter((el) => el._id !== id);
    setProjects(newProjects);
  }

  const Project = (props) => (
    <div
      style={{
        backgroundColor: isDarkMode ? "#3a3a3a" : "#e4e4e4",
        color: isDarkMode ? "white" : "#1f1f1f",
      }}
    >
      <h3
        onClick={() => {
          setCurrentPage("createTask");
          props.navigate(`/projectTask/${props.project._id}`);
        }}
      >
        {props.project.name}
      </h3>
      <div style={{ justifyContent: "space-between", display: "flex" }}>
        <button
          className="btn btn-danger"
          style={{ marginRight: "10px" }}
          onClick={() => navigate(`/editProject/${props.project._id}`)}
        >
          Edit
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            props.deleteProject(props.project._id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  // This method will map out the Projects on the table
  function projectList() {
    return projects.map((project) => {
      if (isAuthenticated) {
        if (project.user === user.email) {
          return (
            <Project
              project={project}
              deleteProject={() => deleteProject(project._id)}
              key={project._id}
              navigate={() => navigate(`/projectTask/${project._id}`)}
            />
          );
        }
      } else if (project.user === "") {
        return (
          <Project
            project={project}
            deleteProject={() => deleteProject(project._id)}
            key={project._id}
            navigate={() => navigate(`/projectTask/${project._id}`)}
          />
        );
      }
    });
  }

  // This following section will display the table with the projects of individuals.
  return (
    <>
      <h3
        style={{
          marginLeft: "2%",
          color: isDarkMode ? "white" : "#3a3a3a",
          marginTop: "15px",
        }}
      >
        Projects
      </h3>
      <div id="containerPro">{projectList()}</div>
    </>
  );
}
