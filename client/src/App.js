import React, { useState } from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import EditProject from "./components/editProject";
import CreateProject from "./components/createProject";
import ProjectList from "./components/projectList";
import ProjectTask from "./components/projectTask";
import "./components/projectTask.css";
import { Auth0Provider } from "@auth0/auth0-react";
export const MyContext = React.createContext();
export const ButtonContex = React.createContext();
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("/createProject");
  const togleDarkMode = () => {
    setIsDarkMode((isDarkMode) => !isDarkMode);
  };
  const value = { currentPage, setCurrentPage };
  return (
    <div
      id="overlay2"
      style={{ backgroundColor: isDarkMode ? "rgb(99, 99, 99)" : "white" }}
    >
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        redirectUri={window.location.origin}
      >
        <ButtonContex.Provider value={value}>
          <MyContext.Provider value={isDarkMode}>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<ProjectList />} />
              <Route path="/createProject" element={<CreateProject />} />
              <Route path="/editProject/:id" element={<EditProject />} />
              <Route path="/projectTask/:id" element={<ProjectTask />} />
            </Routes>
            <div
              className="footer"
              style={{
                backgroundColor: isDarkMode ? "#838383" : "#eeeeee",
                color: isDarkMode ? "white" : "#1f1f1f",
              }}
            >
              <h3 style={{ margin: "10px" }}>
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </h3>
              <label className="switch">
                <input type="checkbox" onChange={togleDarkMode} />
                <span className="slider round"></span>
              </label>
            </div>
          </MyContext.Provider>
        </ButtonContex.Provider>
      </Auth0Provider>
    </div>
  );
};

export default App;
