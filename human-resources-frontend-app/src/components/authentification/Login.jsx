import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../images/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });

      const userData = response.data.user;
      const token = response.data.token;

      sessionStorage.setItem('userData', JSON.stringify(userData));
      sessionStorage.setItem('token', token);

      alert("Login successful! Welcome to HR Dashboard app!");
      navigate('/landing');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="HR App Logo" className="logo" />
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>

      <p className="form-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
