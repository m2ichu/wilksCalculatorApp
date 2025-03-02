import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar"
import {Routes, Route } from 'react-router-dom';
import RegisterForm from "./components/Register";
import LoginForm from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
  
}

export default App
