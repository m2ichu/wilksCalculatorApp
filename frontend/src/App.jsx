import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar"
import {Routes, Route } from 'react-router-dom';
import RegisterForm from "./components/Register";
import LoginForm from "./components/Login";
import Dashboard from "./components/Dashboard";
import Unconfirmed from "./components/admin/Unconfirmed";
import BestResults from "./components/admin/BestResults";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/unconfirmed" element={<Unconfirmed />} />
        <Route path="/bestResults" element={<BestResults />} />
      </Routes>
    </>
  )
  
}

export default App
