import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/authentification/Login';
import Register from './components/authentification/Register';
import Landing from './components/pages/Landing';
import NavMenu from './components/reusable-components/NavMenu';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('userData'));

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAuthenticated(!!sessionStorage.getItem('userData'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
        {isAuthenticated && <NavMenu />}
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/landing" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/landing" />} />
       <Route path="/landing" element={isAuthenticated ? <Landing /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
