import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../reusable-components/Table';

const Payrolls = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
        const response = await axios.get('http://127.0.0.1:8000/api/payslips', { headers });
        const payslips = response.data.data || [];
        const flattened = payslips.map(p => ({
          id: p.id,
          issue_date: p.issue_date,
          total_amount: p.total_amount,
          userName: p.user ? p.user.name : '',
          salaryAmount: p.salary ? p.salary.amount : '',
          salaryCurrency: p.salary ? p.salary.currency : '',
          bonusAmount: p.bonus ? p.bonus.amount : '',
          bonusReason: p.bonus ? p.bonus.reason : ''
        }));
        setData(flattened);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPayrolls();
  }, []);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Issue Date', accessor: 'issue_date' },
    { Header: 'Total Amount', accessor: 'total_amount' },
    { Header: 'User', accessor: 'userName' },
    { Header: 'Salary Amount', accessor: 'salaryAmount' },
    { Header: 'Salary Currency', accessor: 'salaryCurrency' },
    { Header: 'Bonus Amount', accessor: 'bonusAmount' },
    { Header: 'Bonus Reason', accessor: 'bonusReason' }
  ];

  return loading ? (
    <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
  ) : (
    <div className="table-page-container">
      <h2 className="table-page-title">Payrolls</h2>
      <Table
        columns={columns}
        data={data}
        showSearch={false} // or true if you want global search
        showFilter={false} // no filter needed
        defaultSortKey="total_amount"
      />
    </div>
  );
};

export default Payrolls;
