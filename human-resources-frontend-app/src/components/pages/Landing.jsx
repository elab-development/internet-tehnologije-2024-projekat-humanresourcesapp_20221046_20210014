import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaGift, FaFileInvoiceDollar, FaUsers, FaUserCircle, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const Landing = () => {
  const navigate = useNavigate();

  const navCards = [
    { title: 'Salaries', icon: <FaMoneyBillWave />, route: '/salaries' },
    { title: 'Bonuses', icon: <FaGift />, route: '/bonuses' },
    { title: 'Payrolls', icon: <FaFileInvoiceDollar />, route: '/payrolls' },
    { title: 'Users', icon: <FaUsers />, route: '/users' },
    { title: 'My Profile', icon: <FaUserCircle />, route: '/my-profile' },
  ];

  const latestPayrolls = ['Payroll #235', 'Payroll #234', 'Payroll #233', 'Payroll #232', 'Payroll #231'];
  const latestRecruitments = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Davis', 'William Brown'];
  const latestBonuses = ['John Doe - $500', 'Jane Smith - $450', 'Emily Davis - $400', 'William Brown - $350', 'Mike Johnson - $300'];

  return (
    <div className="landing-container">
      <div className="nav-cards-grid">
        {navCards.map((card) => (
          <div key={card.title} className="nav-card-small" onClick={() => navigate(card.route)}>
            <div className="card-icon-small">{card.icon}</div>
            <p className="card-title-small">{card.title}</p>
          </div>
        ))}
      </div>

      <div className="info-cards-grid">
        <div className="info-card">
          <h3 className="info-card-title">Latest Payrolls</h3>
          <ul>
            {latestPayrolls.map((payroll, index) => (
              <li key={index}><FaArrowRight /> {payroll}</li>
            ))}
          </ul>
        </div>

        <div className="info-card">
          <h3 className="info-card-title">Latest Recruitments</h3>
          <ul>
            {latestRecruitments.map((recruit, index) => (
              <li key={index}><FaUsers /> {recruit}</li>
            ))}
          </ul>
        </div>

        <div className="info-card">
          <h3 className="info-card-title">Latest Bonuses</h3>
          <ul>
            {latestBonuses.map((bonus, index) => (
              <li key={index}><FaCheckCircle /> {bonus}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Landing;