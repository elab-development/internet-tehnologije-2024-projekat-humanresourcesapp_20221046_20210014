import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  const effectHasRun = useRef(false);

  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ users: 0, payrolls: 0, salaries: 0, bonuses: 0 });
  const [animatedCounts, setAnimatedCounts] = useState({ users: 0, payrolls: 0, salaries: 0, bonuses: 0 });

  const [payrollsData, setPayrollsData] = useState([]);
  const [salariesData, setSalariesData] = useState([]);
  const [bonusesData, setBonusesData] = useState([]);
  const [usersData, setUsersData] = useState([]); // still used for the dashboard counts

  const [payrollsPage, setPayrollsPage] = useState(0);
  const [salariesPage, setSalariesPage] = useState(0);
  const [bonusesPage, setBonusesPage] = useState(0);

  const userDataStr = sessionStorage.getItem('userData');
  const userData = userDataStr ? JSON.parse(userDataStr) : {};

  // helper: sort by absolute distance to today (closest first)
  const sortByClosestToToday = (arr, dateKey) => {
    const now = new Date();
    const toTime = (d) => {
      const t = Date.parse(d);
      return Number.isFinite(t) ? t : null;
    };
    const withTime = arr
      .map(item => ({ item, t: toTime(item?.[dateKey]) }))
      .sort((a, b) => {
        if (a.t === null && b.t === null) return 0;
        if (a.t === null) return 1;
        if (b.t === null) return -1;
        return Math.abs(a.t - +now) - Math.abs(b.t - +now);
      })
      .map(x => x.item);
    return withTime;
  };

  const paginate = (data, page) => data.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const totalPages = (data) => Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const getPageLabel = (data, page) => `Page ${Math.min(page + 1, totalPages(data))} of ${totalPages(data)}`;

  useEffect(() => {
    if (effectHasRun.current) return;
    effectHasRun.current = true;

    const fetchCountsAndData = async () => {
      const token = sessionStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

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

        setCounts({
          users: usersArr.length,
          payrolls: payrollsArr.length,
          salaries: salariesArr.length,
          bonuses: bonusesArr.length
        });

        // Save raw for counts
        setUsersData(usersArr);

        // Sort each list by "closest to today"
        setPayrollsData(sortByClosestToToday(payrollsArr, 'issue_date'));
        setSalariesData(sortByClosestToToday(salariesArr, 'date_issued'));
        setBonusesData(sortByClosestToToday(bonusesArr, 'date_awarded'));

        // animate counts
        Object.entries({
          users: usersArr.length,
          payrolls: payrollsArr.length,
          salaries: salariesArr.length,
          bonuses: bonusesArr.length
        }).forEach(([key, end]) => {
          let start = 0;
          const duration = 1500;
          const steps = Math.min(end || 1, Math.ceil(duration / 50));
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navCards = useMemo(() => ([
    { title: 'Salaries', icon: <FaMoneyBillWave size={44} />, route: '/salaries', count: animatedCounts.salaries },
    { title: 'Bonuses', icon: <FaGift size={44} />, route: '/bonuses', count: animatedCounts.bonuses },
    { title: 'Payrolls', icon: <FaFileInvoiceDollar size={44} />, route: '/payrolls', count: animatedCounts.payrolls },
    { title: 'Users', icon: <FaUsers size={44} />, route: '/users', count: animatedCounts.users },
    { title: 'My Profile', icon: <FaUserCircle size={44} />, route: '/my-profile', count: '' }
  ]), [animatedCounts]);

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

      <Map />

      <div className="info-cards-grid">
        {[
          {
            title: 'Latest Payrolls',
            data: payrollsData,
            page: payrollsPage,
            setPage: setPayrollsPage,
            icon: <FaArrowRight />,
            display: item => `${item.user?.name ?? '—'} - ${item.issue_date ?? '—'}`
          },
          {
            title: 'Latest Salaries',
            data: salariesData,
            page: salariesPage,
            setPage: setSalariesPage,
            icon: <FaMoneyBillWave />,
            display: item => `${item.user?.name ?? '—'} - ${item.amount ?? '—'} ${item.currency ?? ''} (${item.date_issued ?? '—'})`
          },
          {
            title: 'Latest Bonuses',
            data: bonusesData,
            page: bonusesPage,
            setPage: setBonusesPage,
            icon: <FaCheckCircle />,
            display: item => `${item.user?.name ?? '—'} - ${item.amount ?? '—'} (${item.reason ?? '—'})`
          }
        ].map(({ title, data, page, setPage, icon, display }) => {
          const pages = totalPages(data);
          return (
            <div key={title} className="info-card modern-card">
              <h3 className="info-card-title">{title}</h3>
              <ul className="info-list">
                {paginate(data, page).map((item) => (
                  <li key={item.id}>{icon} {display(item)}</li>
                ))}
              </ul>
              <hr className="divider" />
              <div className="pagination-controls bottom">
                <IoIosArrowDropleftCircle
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  className="pagination-icon"
                />
                <span className="page-label" style={{ color: '#D6232A' }}>{getPageLabel(data, page)}</span>
                <IoIosArrowDroprightCircle
                  onClick={() => setPage((prev) => Math.min(prev + 1, pages - 1))}
                  className="pagination-icon"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Landing;
