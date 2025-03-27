import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LandingRegularWorker = () => {
  const [salary, setSalary] = useState(null);
  const [bonuses, setBonuses] = useState([]);
  const [payslips, setPayslips] = useState([]);

  const userDataStr = sessionStorage.getItem('userData');
  const userData = userDataStr ? JSON.parse(userDataStr) : {};

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    };

    const fetchData = async () => {
      try {
        const [salaryRes, bonusRes, payslipRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/my-salary', { headers }),
          axios.get('http://127.0.0.1:8000/api/my-bonuses', { headers }),
          axios.get('http://127.0.0.1:8000/api/my-payslips', { headers })
        ]);

        console.log(salaryRes, bonusRes, payslipRes);

        setSalary(salaryRes.data.data);
        setBonuses(bonusRes.data.data);
        setPayslips(payslipRes.data.data);
      } catch (err) {
        console.error('Failed to fetch worker data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="landing-container">
      <div className="profile-card centered-card">
        <h2 className="profile-title">Welcome, {userData.name}</h2>
        <div className="profile-details">
          <div className="profile-row">
            <span className="profile-label">Position:</span>
            <span className="profile-value">{userData.position}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{userData.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Gender:</span>
            <span className="profile-value">{userData.gender}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Contract Start:</span>
            <span className="profile-value">{userData.contract_start_date}</span>
          </div>
        </div>
      </div>

      <div className="info-cards-grid">
        <div className="info-card modern-card">
        <h3 className="info-card-title">My Salaries</h3>
        {salary && salary.length > 0 ? (
            salary.map((s, index) => (
            <div key={s.id || index} className="profile-row">
                <span className="profile-value">{s.amount} {s.currency}</span>
                <span className="profile-label">{s.date_issued}</span>
            </div>
            ))
        ) : (
            <p>No salary data available.</p>
        )}
        </div>

        <div className="info-card modern-card">
          <h3 className="info-card-title">My Bonuses</h3>
          {bonuses.length > 0 ? (
            bonuses.map(b => (
              <div key={b.id} className="profile-row">
                <span className="profile-value">{b.amount} ({b.reason})</span>
                <span className="profile-label">{b.date_awarded}</span>
              </div>
            ))
          ) : (
            <p>No bonuses available.</p>
          )}
        </div>

        <div className="info-card modern-card">
          <h3 className="info-card-title">My Payslips</h3>
          {payslips.length > 0 ? (
            payslips.map(p => (
              <div key={p.id} className="profile-row">
                <span className="profile-value">{p.total_amount}</span>
                <span className="profile-label">{p.issue_date}</span>
              </div>
            ))
          ) : (
            <p>No payslips available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingRegularWorker;