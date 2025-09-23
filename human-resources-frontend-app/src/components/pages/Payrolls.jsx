import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Table from '../reusable-components/Table';

const API = 'http://127.0.0.1:8000/api';

const Payrolls = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [allSalaries, setAllSalaries] = useState([]); // raw with user_id
  const [allBonuses, setAllBonuses] = useState([]);   // raw with user_id

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    user_id: '',
    salary_id: '',
    bonus_id: '',
    issue_date: '',
  });

  const headers = () => {
    const token = sessionStorage.getItem('token');
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  };

  const fetchAll = async () => {
    try {
      const [pRes, uRes, sRes, bRes] = await Promise.all([
        axios.get(`${API}/payslips`, { headers: headers() }),
        axios.get(`${API}/users`, { headers: headers() }),
        axios.get(`${API}/salaries`, { headers: headers() }),
        axios.get(`${API}/bonuses`, { headers: headers() }),
      ]);

      const payslips = pRes.data?.data ?? [];
      setRows(
        payslips.map(p => ({
          id: p.id,
          issue_date: p.issue_date,
          total_amount: p.total_amount,
          userName: p.user ? p.user.name : '',
          user_id: p.user ? p.user.id : '',
          salary_id: p.salary ? p.salary.id : '',
          salaryAmount: p.salary ? p.salary.amount : '',
          salaryCurrency: p.salary ? p.salary.currency : '',
          bonus_id: p.bonus ? p.bonus.id : '',
          bonusAmount: p.bonus ? p.bonus.amount : '',
          bonusReason: p.bonus ? p.bonus.reason : '',
        }))
      );

      setUsers((uRes.data?.data ?? []).map(u => ({ id: u.id, name: u.name })));

      setAllSalaries(
        (sRes.data?.data ?? []).map(s => ({
          id: s.id,
          user_id: s.user ? s.user.id : '',
          amount: s.amount,
          currency: s.currency,
          label: `#${s.id} • ${s.amount} ${s.currency}`,
        }))
      );

      setAllBonuses(
        (bRes.data?.data ?? []).map(b => ({
          id: b.id,
          user_id: b.user ? b.user.id : '',
          amount: b.amount,
          reason: b.reason,
          label: b.amount
            ? `#${b.id} • ${b.amount}${b.reason ? ` (${b.reason})` : ''}`
            : `#${b.id}`,
        }))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Filter salary/bonus options by selected user
  const filteredSalaries = useMemo(() => {
    if (!form.user_id) return [];
    return allSalaries.filter(s => String(s.user_id) === String(form.user_id));
  }, [allSalaries, form.user_id]);

  const filteredBonuses = useMemo(() => {
    if (!form.user_id) return [];
    return allBonuses.filter(b => String(b.user_id) === String(form.user_id));
  }, [allBonuses, form.user_id]);

  // If user changes, clear salary/bonus if invalid
  useEffect(() => {
    if (!form.user_id) {
      setForm(f => ({ ...f, salary_id: '', bonus_id: '' }));
      return;
    }
    setForm(f => ({
      ...f,
      salary_id: f.salary_id && filteredSalaries.some(s => String(s.id) === String(f.salary_id)) ? f.salary_id : '',
      bonus_id: f.bonus_id && filteredBonuses.some(b => String(b.id) === String(f.bonus_id)) ? f.bonus_id : '',
    }));
  }, [form.user_id, filteredSalaries, filteredBonuses]);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Issue Date', accessor: 'issue_date' },
    { Header: 'Total Amount', accessor: 'total_amount' },
    { Header: 'User', accessor: 'userName' },
    { Header: 'Salary Amount', accessor: 'salaryAmount' },
    { Header: 'Salary Currency', accessor: 'salaryCurrency' },
    { Header: 'Bonus Amount', accessor: 'bonusAmount' },
    { Header: 'Bonus Reason', accessor: 'bonusReason' },
  ];

  const openCreate = () => {
    setForm({ user_id: '', salary_id: '', bonus_id: '', issue_date: '' });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/payslips`, form, { headers: headers() });
      setOpen(false);
      await fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete payslip #${row.id}?`)) return;
    try {
      await axios.delete(`${API}/payslips/${row.id}`, { headers: headers() });
      await fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const exportCsv = async () => {
    try {
      const res = await axios.get(`${API}/payslips/export/csv`, {
        headers: headers(),
        responseType: 'blob',
      });

      // Try to extract filename from header; fallback if missing
      const cd = res.headers['content-disposition'] || '';
      const match = /filename="?([^"]+)"?/i.exec(cd);
      const filename = match?.[1] || `payslips_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export CSV:', e);
      alert('Could not export CSV. Please try again.');
    }
  };

  return loading ? (
    <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
  ) : (
    <div className="table-page-container">
      <h2 className="table-page-title">Payrolls</h2>

      {/* Toolbar with Create + Export */}
      <div className="table-controls" style={{ marginBottom: 8 }}>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={openCreate}>New Payroll</button>
          <button className="btn btn-ghost" onClick={exportCsv}>Export Payrolls into CSV</button>
        </div>
      </div>

      <Table
        columns={columns}
        data={rows}
        defaultSortKey="total_amount"
        // we render our own toolbar; keep Table simple
        actionsRenderer={(row) => (
          <div className="actions-wrap">
            <button className="btn btn-danger" onClick={() => remove(row)}>Delete</button>
          </div>
        )}
      />

      {open && (
        <div className="modal">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Create Payroll</h3>
              <button className="icon-btn" onClick={() => setOpen(false)}>✕</button>
            </div>

            <form className="form-grid" onSubmit={save}>
              <label>User</label>
              <select
                value={form.user_id}
                onChange={e => setForm({ ...form, user_id: e.target.value })}
                required
              >
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>

              <label>Salary</label>
              <select
                value={form.salary_id}
                onChange={e => setForm({ ...form, salary_id: e.target.value })}
                required
                disabled={!form.user_id}
              >
                <option value="">{form.user_id ? 'Select salary' : 'Choose user first'}</option>
                {filteredSalaries.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>

              <label>Bonus (optional)</label>
              <select
                value={form.bonus_id}
                onChange={e => setForm({ ...form, bonus_id: e.target.value })}
                disabled={!form.user_id}
              >
                <option value="">{form.user_id ? 'No bonus' : 'Choose user first'}</option>
                {filteredBonuses.map(b => (
                  <option key={b.id} value={b.id}>{b.label}</option>
                ))}
              </select>

              <label>Issue Date</label>
              <input
                type="date"
                value={form.issue_date}
                onChange={e => setForm({ ...form, issue_date: e.target.value })}
                required
              />

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payrolls;
