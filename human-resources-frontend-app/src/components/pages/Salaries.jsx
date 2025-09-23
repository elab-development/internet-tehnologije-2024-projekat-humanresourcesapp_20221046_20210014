import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../reusable-components/Table';

const API = 'http://127.0.0.1:8000/api';

const Salaries = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);

  // modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // row or null
  const [form, setForm] = useState({ user_id: '', amount: '', currency: 'USD', date_issued: '' });

  const headers = () => {
    const token = sessionStorage.getItem('token');
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  };

  const fetchAll = async () => {
    try {
      const [salRes, usersRes] = await Promise.all([
        axios.get(`${API}/salaries`, { headers: headers() }),
        axios.get(`${API}/users`, { headers: headers() }),
      ]);

      const salaries = salRes.data?.data ?? [];
      setRows(salaries.map(s => ({
        id: s.id,
        amount: s.amount,
        currency: s.currency,
        date_issued: s.date_issued,
        userName: s.user ? s.user.name : '',
        user_id: s.user ? s.user.id : '',
      })));
      setUsers((usersRes.data?.data ?? []).map(u => ({ id: u.id, name: u.name })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Currency', accessor: 'currency' },
    { Header: 'Date Issued', accessor: 'date_issued' },
    { Header: 'User', accessor: 'userName' }
  ];

  const openCreate = () => {
    setEditing(null);
    setForm({ user_id: '', amount: '', currency: 'USD', date_issued: '' });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      user_id: row.user_id || '',
      amount: row.amount ?? '',
      currency: row.currency ?? 'USD',
      date_issued: row.date_issued || '',
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // EDIT: only amount & currency are allowed and PATCH must be used
        const payload = {
          amount: form.amount === '' ? null : Number(form.amount),
          currency: form.currency || null,
        };
        await axios.patch(
          `${API}/salaries/${editing.id}/updateCurrencyAndAmount`,
          payload,
          { headers: headers() }
        );
      } else {
        // CREATE: full payload
        const payload = {
          user_id: form.user_id,
          amount: Number(form.amount),
          currency: form.currency,
          date_issued: form.date_issued,
        };
        await axios.post(`${API}/salaries`, payload, { headers: headers() });
      }
      setOpen(false);
      await fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete salary #${row.id}?`)) return;
    try {
      await axios.delete(`${API}/salaries/${row.id}`, { headers: headers() });
      await fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const isEditing = !!editing;

  return loading ? (
    <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
  ) : (
    <div className="table-page-container">
      <h2 className="table-page-title">Salaries</h2>

      <Table
        columns={columns}
        data={rows}
        showSearch={true}
        searchPlaceholder="Search Salaries By User..."
        defaultSortKey="amount"
        onCreate={openCreate}
        createLabel="New Salary"
        actionsRenderer={(row) => (
          <div className="actions-wrap">
            <button className="btn btn-ghost" onClick={() => openEdit(row)}>Edit</button>
            <button className="btn btn-danger" onClick={() => remove(row)}>Delete</button>
          </div>
        )}
      />

      {open && (
        <div className="modal">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Salary' : 'Create Salary'}</h3>
              <button className="icon-btn" onClick={() => setOpen(false)}>✕</button>
            </div>

            <form className="form-grid" onSubmit={save}>
              <label>User</label>
              <select
                value={form.user_id}
                onChange={e => setForm({ ...form, user_id: e.target.value })}
                required={!isEditing}
                disabled={isEditing}
              >
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>

              <label>Amount</label>
              <input
                type="number" step="0.01"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
              />

              <label>Currency</label>
              <input
                type="text"
                value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
                required
              />

              <label>Date Issued</label>
              <input
                type="date"
                value={form.date_issued}
                onChange={e => setForm({ ...form, date_issued: e.target.value })}
                required={!isEditing}
                disabled={isEditing}
              />

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salaries;
