import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import JobDetail from "./pages/JobDetail";
import AddJob from "./pages/AddJob";
import MyJobs from "./pages/MyJobs";
import EditJob from "./pages/EditJob";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import Applications from "./pages/Applications";
import EmployerChat from "./pages/EmployerChat";
import MyApplications from "./pages/MyApplications";
import AllApplications from "./pages/AllApplications";
import RoleSelect from "./pages/RoleSelect";
import RegisterEmployer from "./pages/RegisterEmployer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import WorkerDetail from "./pages/WorkerDetail";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
function App() {

          const [user, setUser] = useState(
            JSON.parse(localStorage.getItem("user"))
            );

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/profile" element={<Profile />} />
         <Route path="/" element={<Home />} />
        <Route path="/job/:id" element={<JobDetail />} />
        <Route path="/add" element={<AddJob />} />
        <Route path="/my" element={<MyJobs />} />
        <Route path="/edit/:id" element={<EditJob />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apps/:id" element={<Applications />} />
        <Route path="/myapps" element={<MyApplications />} />
        <Route path="/allapps" element={<AllApplications />} />
        <Route path="/select-role" element={<RoleSelect />} />
        <Route path="/register-employer" element={<RegisterEmployer />} />
        <Route path="/chat/:id" element={<Chat/>}/>
       <Route path="/roleselect" element={<RoleSelect />} />
       <Route path="/chat/:job_id/:user_id" element={<Chat />} />
        <Route path="/employer-chat/:job_id" element={<EmployerChat />} />
        <Route path="/worker/:id" element={<WorkerDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
