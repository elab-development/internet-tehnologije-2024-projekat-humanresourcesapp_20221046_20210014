import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaMoneyBillWave,
  FaGift,
  FaFileInvoiceDollar,
  FaUsers,
  FaUserCircle,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';
import {
  IoIosArrowDroprightCircle,
  IoIosArrowDropleftCircle
} from 'react-icons/io';

import Loading from '../reusable-components/Loading';

import Map from '../reusable-components/Map';

const ITEMS_PER_PAGE = 5;

const Landing = () => {
  const navigate = useNavigate();
  const effectHasRun = useRef(false); // Prevent duplicate animation in StrictMode

  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ users: 0, payrolls: 0, salaries: 0, bonuses: 0 });
  const [animatedCounts, setAnimatedCounts] = useState({ users: 0, payrolls: 0, salaries: 0, bonuses: 0 });
  const [usersData, setUsersData] = useState([]);
  const [payrollsData, setPayrollsData] = useState([]);
  const [bonusesData, setBonusesData] = useState([]);

  const [payrollsPage, setPayrollsPage] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const [bonusesPage, setBonusesPage] = useState(0);

  const userDataStr = sessionStorage.getItem('userData');
  const userData = userDataStr ? JSON.parse(userDataStr) : {};

  useEffect(() => {
    if (effectHasRun.current) return;
    effectHasRun.current = true;

    const fetchCountsAndData = async () => {
      const token = sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      };

      try {
        const [usersRes, payrollsRes, salariesRes, bonusesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/users', { headers }),
          axios.get('http://127.0.0.1:8000/api/payslips', { headers }),
          axios.get('http://127.0.0.1:8000/api/salaries', { headers }),
          axios.get('http://127.0.0.1:8000/api/bonuses', { headers })
        ]);

        const usersArr = usersRes.data.data || [];
        const payrollsArr = payrollsRes.data.data || [];
        const salariesArr = salariesRes.data.data || [];
        const bonusesArr = bonusesRes.data.data || [];

        const newCounts = {
          users: usersArr.length,
          payrolls: payrollsArr.length,
          salaries: salariesArr.length,
          bonuses: bonusesArr.length
        };

        setCounts(newCounts);
        setUsersData(usersArr);
        setPayrollsData(payrollsArr);
        setBonusesData(bonusesArr);

        Object.entries(newCounts).forEach(([key, end]) => {
          let start = 0;
          const duration = 1500;
          const steps = Math.min(end, duration / 50);
          const increment = end / steps;
          let frame = 0;

          const timer = setInterval(() => {
            frame++;
            start += increment;
            if (frame >= steps) {
              clearInterval(timer);
              setAnimatedCounts(prev => ({ ...prev, [key]: end }));
            } else {
              setAnimatedCounts(prev => ({ ...prev, [key]: Math.round(start) }));
            }
          }, 50);
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching counts and data:', error);
      }
    };

    if (userData.role === 'HR Worker') {
      fetchCountsAndData();
    }
  }, []);

  const navCards = [
    { title: 'Salaries', icon: <FaMoneyBillWave size={44} />, route: '/salaries', count: animatedCounts.salaries },
    { title: 'Bonuses', icon: <FaGift size={44} />, route: '/bonuses', count: animatedCounts.bonuses },
    { title: 'Payrolls', icon: <FaFileInvoiceDollar size={44} />, route: '/payrolls', count: animatedCounts.payrolls },
    { title: 'Users', icon: <FaUsers size={44} />, route: '/users', count: animatedCounts.users },
    { title: 'My Profile', icon: <FaUserCircle size={44} />, route: '/my-profile', count: '' }
  ];

  const paginate = (data, page) => data.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const getPageLabel = (data, page) => {
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
    return `Page ${page + 1} of ${totalPages}`;
  };

  if (loading) return <Loading />;

  return (
    <div className="landing-container">
      <div className="nav-cards-grid">
        {navCards.map((card) => (
          <div key={card.title} className="nav-card-small modern-card" onClick={() => navigate(card.route)}>
            <div className="icon-count-wrapper" style={{ color: '#D6232A' }}>
              <div className="card-icon-small">{card.icon}</div>
              {card.count !== '' && <span className="card-count-indicator" style={{ color: '#D6232A' }}>{card.count}</span>}
            </div>
            <p className="card-title-small">{card.title}</p>
          </div>
        ))}
      </div>

      <Map></Map>

      <div className="info-cards-grid">
        {[
          {
            title: 'Latest Payrolls',
            data: payrollsData,
            page: payrollsPage,
            setPage: setPayrollsPage,
            icon: <FaArrowRight />,
            display: item => `${item.user.name} - ${item.issue_date}`
          },
          {
            title: 'Latest Recruitments',
            data: usersData,
            page: usersPage,
            setPage: setUsersPage,
            icon: <FaUsers />,
            display: item => `${item.name} - ${item.position}`
          },
          {
            title: 'Latest Bonuses',
            data: bonusesData,
            page: bonusesPage,
            setPage: setBonusesPage,
            icon: <FaCheckCircle />,
            display: item => `${item.user.name} - ${item.amount} (${item.reason})`
          }
        ].map(({ title, data, page, setPage, icon, display }) => (
          <div key={title} className="info-card modern-card">
            <h3 className="info-card-title">{title}</h3>
            <ul className="info-list">
              {paginate(data, page).map((item) => (
                <li key={item.id}>{icon} {display(item)}</li>
              ))}
            </ul>
            <hr className="divider" />
            <div className="pagination-controls bottom">
              <IoIosArrowDropleftCircle onClick={() => setPage((prev) => Math.max(prev - 1, 0))} className="pagination-icon" />
              <span className="page-label" style={{ color: '#D6232A' }}>{getPageLabel(data, page)}</span>
              <IoIosArrowDroprightCircle onClick={() => setPage((prev) => Math.min(prev + 1, Math.floor(data.length / ITEMS_PER_PAGE)))} className="pagination-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
