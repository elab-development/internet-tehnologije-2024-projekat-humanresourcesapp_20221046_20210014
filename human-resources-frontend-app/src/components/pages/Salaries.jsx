import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../reusable-components/Table';

const Salaries = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
        const response = await axios.get('http://127.0.0.1:8000/api/salaries', { headers });
        const salaries = response.data.data || [];
        const flattened = salaries.map(s => ({
          id: s.id,
          amount: s.amount,
          currency: s.currency,
          date_issued: s.date_issued,
          userName: s.user ? s.user.name : ''
        }));
        setData(flattened);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchSalaries();
  }, []);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Currency', accessor: 'currency' },
    { Header: 'Date Issued', accessor: 'date_issued' },
    { Header: 'User', accessor: 'userName' }
  ];

  return loading ? (
    <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
  ) : (
    <div className="table-page-container">
      <h2 className="table-page-title">Salaries</h2>
      <Table
        columns={columns}
        data={data}
        showSearch={true}
        searchPlaceholder="Search Salaries By User..."
        showFilter={false}
        defaultSortKey="amount"
      />
    </div>
  );
};

export default Salaries;
