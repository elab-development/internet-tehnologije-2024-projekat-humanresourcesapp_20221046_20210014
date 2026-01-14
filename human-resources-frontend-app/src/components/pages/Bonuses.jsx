import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../reusable-components/Table';

const API = 'http://127.0.0.1:8000/api';

// Fixed list of allowed reasons (combo box)
const REASONS = [
  'Holiday Bonus',
  'Yearly Performance Bonus',
  'Project Completion Reward',
  'Employee of the Month',
  'Exceptional Work Quality',
];

const Bonuses = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // row or null
  const [form, setForm] = useState({
    user_id: '',
    amount: '',
    reason: '',
    date_awarded: ''
  });

  const headers = () => {
    const token = sessionStorage.getItem('token');
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  };

  const fetchAll = async () => {
    try {
      const [bonRes, usersRes] = await Promise.all([
        axios.get(`${API}/bonuses`, { headers: headers() }),
        axios.get(`${API}/users`, { headers: headers() }),
      ]);

      const bonuses = bonRes.data?.data ?? [];
      setRows(
        bonuses.map(b => ({
          id: b.id,
          amount: b.amount,
          reason: b.reason,
          date_awarded: b.date_awarded,
          userName: b.user ? b.user.name : '',
          user_id: b.user ? b.user.id : '',
        }))
      );

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
    { Header: 'Reason', accessor: 'reason' },
    { Header: 'Date Awarded', accessor: 'date_awarded' },
    { Header: 'User', accessor: 'userName' },
  ];

  const openCreate = () => {
    setEditing(null);
    setForm({ user_id: '', amount: '', reason: '', date_awarded: '' });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      user_id: row.user_id || '',
      amount: row.amount ?? '',
      reason: REASONS.includes(row.reason) ? row.reason : '',
      date_awarded: row.date_awarded || '',
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // UPDATE: send only amount and reason (as per controller)
        const payload = {
          amount: form.amount === '' ? null : Number(form.amount),
          reason: form.reason || null,
        };
        await axios.patch(`${API}/bonuses/${editing.id}/updateReasonAndAmount`, payload, { headers: headers() });
      } else {
        // CREATE: keep full payload (user, amount, reason, date)
        const payload = {
          user_id: form.user_id,
          amount: Number(form.amount),
          reason: form.reason,
          date_awarded: form.date_awarded,
        };
        await axios.post(`${API}/bonuses`, payload, { headers: headers() });
      }
      setOpen(false);
      await fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete bonus #${row.id}?`)) return;
    try {
      await axios.delete(`${API}/bonuses/${row.id}`, { headers: headers() });
      await fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  return loading ? (
    <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
  ) : (
    <div className="table-page-container">
      <h2 className="table-page-title">Bonuses</h2>

      <Table
        columns={columns}
        data={rows}
        showSearch={true}
        showFilter={true}
        filterLabel="Filter by Reason"
        filterAccessor="reason"
        filterOptions={REASONS}
        defaultSortKey="amount"
        onCreate={openCreate}
        createLabel="New Bonus"
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
              <h3>{editing ? 'Edit Bonus' : 'Create Bonus'}</h3>
              <button className="icon-btn" onClick={() => setOpen(false)}>✕</button>
            </div>

            <form className="form-grid" onSubmit={save}>
              {/* User only needed for create; keep disabled when editing */}
              <label>User</label>
              <select
                value={form.user_id}
                onChange={e => setForm({ ...form, user_id: e.target.value })}
                required={!editing}
                disabled={!!editing}
              >
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>

              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
              />

              <label>Reason</label>
              <select
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                required
              >
                <option value="">Select reason</option>
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <label>Date Awarded</label>
              <input
                type="date"
                value={form.date_awarded}
                onChange={e => setForm({ ...form, date_awarded: e.target.value })}
                required={!editing}
                disabled={!!editing}
              />

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bonuses;
