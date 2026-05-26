import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../api/customerApi';
import { useFetch } from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ErrorBox from '../components/ErrorBox';

const INIT = { name: '', email: '', phone: '', company: '', status: 'LEAD', notes: '' };

export default function Customers() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INIT);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: customers, meta, loading, error, refetch } = useFetch(() => customerApi.getAll(page, 20), [page]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const close = () => { if (!saving) { setShowModal(false); setForm(INIT); setFormError(null); } };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    setFormError(null);
    setSaving(true);
    try {
      await customerApi.create(form);
      close();
      setPage(1);
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Could not create customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Customers</div>
          <div className="topbar-sub">{meta?.total ?? 0} customers tracked</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Customer</button>
      </div>
      <div className="page-body">
        <ErrorBox message={error} onRetry={refetch} />
        <div className="card">
          {loading ? (
            <div className="loading"><div className="spinner" /> Loading customers...</div>
          ) : customers?.length === 0 ? (
            <div className="empty">No customers yet.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Status</th></tr></thead>
                  <tbody>
                    {customers?.map(c => (
                      <tr key={c.id} onClick={() => navigate(`/customers/${c.id}`)} style={{ cursor: 'pointer' }}>
                        <td><div style={{ fontWeight: 600 }}>{c.name}</div></td>
                        <td>{c.company || '—'}</td>
                        <td style={{ fontSize: 12 }}>{c.email || '—'}</td>
                        <td><StatusBadge value={c.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination meta={meta} page={page} onPage={setPage} />
            </>
          )}
        </div>
      </div>

      {showModal && (
        <Modal title="Add Customer" onClose={close}>
          <form className="form-grid" onSubmit={handleCreate}>
            {formError && <div className="form-error">{formError}</div>}
            <label className="field">
              <span>Name</span>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" autoFocus />
            </label>
            <label className="field">
              <span>Status</span>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="LEAD">Lead</option>
                <option value="PROSPECT">Prospect</option>
                <option value="ACTIVE">Active</option>
                <option value="CHURNED">Churned</option>
              </select>
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" />
            </label>
            <label className="field">
              <span>Phone</span>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 0100" />
            </label>
            <label className="field field-full">
              <span>Company</span>
              <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Corp" />
            </label>
            <label className="field field-full">
              <span>Notes</span>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Optional notes" />
            </label>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={close} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Customer'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
