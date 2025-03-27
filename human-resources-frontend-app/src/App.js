import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/authentification/Login';
import Register from './components/authentification/Register';
import Landing from './components/pages/Landing';
import Bonuses from './components/pages/Bonuses';
import Payrolls from './components/pages/Payrolls';
import Salaries from './components/pages/Salaries';
import Users from './components/pages/Users';
import LandingWorker from './components/pages/LandingWorker';
import MyProfile from './components/pages/MyProfile';
import NavMenu from './components/reusable-components/NavMenu';
import Footer from './components/reusable-components/Footer';
import './App.css';

const App = () => {
  // Parse user data safely
  const storedUser = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null;
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedUser);
  const [isHr, setIsHr] = useState(storedUser?.role);

  useEffect(() => {
    const interval = setInterval(() => {
      const userStr = sessionStorage.getItem('userData');
      const user = userStr ? JSON.parse(userStr) : null;
      setIsAuthenticated(!!user);
      setIsHr(user?.role);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      {isAuthenticated && <NavMenu />}
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/landing" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/landing" />} />
        
        {/* HR Worker routes */}
        {isHr === "HR Worker" ? (
          <>
            <Route path="/landing" element={<Landing />} />
            <Route path="/salaries" element={<Salaries />} />
            <Route path="/bonuses" element={<Bonuses />} />
            <Route path="/payrolls" element={<Payrolls />} />
            <Route path="/users" element={<Users />} />
            <Route path="/my-profile" element={<MyProfile />} />
          </>
        ) : (
          // If authenticated but not HR Worker, redirect to landing or a "Not Authorized" page.
          isAuthenticated && <Route path="/landing-worker" element={<LandingWorker />} />
        )}
      </Routes>
      {isAuthenticated && <Footer />}
    </BrowserRouter>
  );
};

export default App;
