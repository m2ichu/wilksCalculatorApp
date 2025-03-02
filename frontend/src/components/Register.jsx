import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    weight: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for password matching
    if (formData.password !== formData.confirmPassword) {
      toast.error('Hasła nie są zgodne', {
        position: 'top-center',
      });
      return;
    }

    try {
      // Create a new data object with the weight converted to a number
      const updatedData = { ...formData, weight: Number(formData.weight) };
      // Remove confirmPassword before sending to the API
      delete updatedData.confirmPassword;

      const res = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Coś poszło nie tak');
      }

      const data = await res.json();
      toast.success(data.message, {
        position: 'top-center',
      });
      // Optionally reset form data after a successful registration
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        weight: '',
        firstName: '',
        lastName: '',
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-indigo-200 p-4">
      <form className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all hover:scale-105" onSubmit={handleSubmit}>
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">Rejestracja</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Login</label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mt-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mt-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mt-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Potwierdź hasło</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mt-6">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Waga</label>
          <input
            type="number"
            id="weight"
            name="weight"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="w-full mt-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
          Zarejestruj się
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterForm;