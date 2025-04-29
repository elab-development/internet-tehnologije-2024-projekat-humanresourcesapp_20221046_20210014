import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../reusable-components/Table';

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
        const response = await axios.get('http://127.0.0.1:8000/api/users', { headers });
        const users = response.data.data || [];
        setData(users);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Extract unique genders for the filter dropdown
  const genderSet = new Set(data.map(u => u.gender).filter(Boolean));
  const genderOptions = Array.from(genderSet);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Role', accessor: 'role' },
    { Header: 'Gender', accessor: 'gender' },
    { Header: 'DOB', accessor: 'date_of_birth' },
    { Header: 'Contract Start', accessor: 'contract_start_date' },
    { Header: 'Position', accessor: 'position' }
  ];

  return loading ? (
    <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
  ) : (
    <div className="table-page-container">
      <h2 className="table-page-title">Users</h2>
      <Table
        columns={columns}
        data={data}
        showSearch={true}
        searchPlaceholder="Search Users..."
        showFilter={true}
        filterLabel="Filter by Gender"
        filterAccessor="gender"
        filterOptions={genderOptions}
        defaultSortKey="contract_start_date"
      />
    </div>
  );
};

export default Users;
