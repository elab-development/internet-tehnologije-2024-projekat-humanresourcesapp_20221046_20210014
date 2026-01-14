import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../reusable-components/Loading';
import useRandomQuote from '../custom-hooks/useRandomQuote'; // <-- add

const LandingRegularWorker = () => {
  const [salary, setSalary] = useState(null);
  const [bonuses, setBonuses] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  const { quote, author, loading: quoteLoading, refresh } = useRandomQuote(); // <-- add

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

        setSalary(salaryRes.data.data);
        setBonuses(bonusRes.data.data);
        setPayslips(payslipRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch worker data:', err);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="landing-container">
      <div className="profile-card centered-card" style={{maxWidth:"4500px", width:"103%"}}>
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

      {/* --- Quote box (fits in the highlighted space) --- */}
      <div className="modern-card" style={{
        width: "103%",
        margin: "12px 0 4px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12
      }}>
        <div style={{maxWidth: '82%'}}>
          <h3 className="info-card-title" style={{marginBottom: 6}}>Today’s Work Quote</h3>
          <p style={{fontStyle: 'italic', color: '#d1d1d1'}}>
            {quoteLoading ? 'Fetching inspiration…' : `“${quote}”`}
          </p>
          {!quoteLoading && <p style={{marginTop: 4, color: '#9ea0a3'}}>— {author}</p>}
        </div>
        <button className="btn btn-ghost" onClick={refresh} title="Another one">
          New Quote
        </button>
      </div>

      <div className="info-cards-grid">
        <div className="info-card modern-card" style={{height:"200px", width:"350px"}}>
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

        <div className="info-card modern-card" style={{height:"200px", width:"400px", marginLeft:"-25px"}}>
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

        <div className="info-card modern-card" style={{height:"200px", width:"350px"}}>
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
