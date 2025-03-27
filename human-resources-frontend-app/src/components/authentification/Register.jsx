import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../images/logo.png';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isHr: false,        // boolean in state
    position: '',
    gender: 'male',
    date_of_birth: '',
    contract_start_date: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Transform data before sending:
      const finalData = {
        ...formData,
        isHr: formData.isHr ? 1 : 0, // Convert boolean to 1 or 0
        position: formData.isHr ? 'Human Resources' : formData.position,
      };

      await axios.post('http://127.0.0.1:8000/api/register', finalData);

      alert('Register successful! Redirecting to the login page...');
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Check your inputs.');
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="HR App Logo" className="logo" />

      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <label className="checkbox-container">
          Are you an HR Worker?
          <input
            type="checkbox"
            name="isHr"
            checked={formData.isHr}
            onChange={handleChange}
          />
          <span className="checkmark"></span>
        </label>

        {/* Only show position field if NOT HR */}
        {!formData.isHr && (
          <input
            type="text"
            name="position"
            placeholder="Position"
            required={!formData.isHr}
            value={formData.position}
            onChange={handleChange}
          />
        )}

        <div className="select-wrapper">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <label className="label-date">Date of Birth:</label>
        <input
          type="date"
          name="date_of_birth"
          required
          value={formData.date_of_birth}
          onChange={handleChange}
        />

        <label className="label-date">Contract Start Date:</label>
        <input
          type="date"
          name="contract_start_date"
          required
          value={formData.contract_start_date}
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>

      <p className="form-link">
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
