import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../reusable-components/Table';

const Bonuses = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
        const response = await axios.get('http://127.0.0.1:8000/api/bonuses', { headers });
        const bonuses = response.data.data || [];
        const flattened = bonuses.map(b => ({
          id: b.id,
          amount: b.amount,
          reason: b.reason,
          date_awarded: b.date_awarded,
          userName: b.user ? b.user.name : ''
        }));
        setData(flattened);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchBonuses();
  }, []);

  // Distinct reasons for filter
  const reasonSet = new Set(data.map(b => b.reason).filter(Boolean));
  const reasonOptions = Array.from(reasonSet);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Reason', accessor: 'reason' },
    { Header: 'Date Awarded', accessor: 'date_awarded' },
    { Header: 'User', accessor: 'userName' }
  ];

  return loading ? (
    <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
  ) : (
    <div className="table-page-container">
      <h2 className="table-page-title">Bonuses</h2>
      <Table
        columns={columns}
        data={data}
        showSearch={false}  // or true if you also want search
        showFilter={true}
        filterLabel="Filter by Reason"
        filterAccessor="reason"
        filterOptions={reasonOptions}
        defaultSortKey="amount"
      />
    </div>
  );
};

export default Bonuses;
