import { useParams, useNavigate, Link } from 'react-router-dom';
import { customerApi } from '../api/customerApi';
import { useFetch } from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';

function fmt(d) { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, loading, error } = useFetch(() => customerApi.getOne(id), [id]);

  if (loading) return <div className="loading"><div className="spinner" /> Loading...</div>;
  if (error) return <div className="page-body"><div className="error-box">&#9888; {error}</div></div>;
  if (!customer) return null;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">{customer.name}</div>
          <div className="topbar-sub">{customer.company || 'Customer'}</div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>&larr; Back</button>
      </div>
      <div className="page-body">
        <div className="breadcrumb">
          <Link to="/customers">Customers</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{customer.name}</span>
        </div>

        <div className="detail-header">
          <div className="detail-avatar" style={{ fontSize: 28 }}>&#x1F464;</div>
          <div style={{ flex: 1 }}>
            <div className="detail-name">{customer.name}</div>
            <div className="detail-meta">
              {customer.company && <span>&#x1F3E2; {customer.company}</span>}
              {customer.email && <span>&#x2709; {customer.email}</span>}
              {customer.phone && <span>&#x1F4DE; {customer.phone}</span>}
              <StatusBadge value={customer.status} />
            </div>
            {customer.notes && <p style={{ fontSize: 13, color: 'var(--light)', marginTop: 10 }}>{customer.notes}</p>}
            <div style={{ fontSize: 11, color: 'var(--light)', marginTop: 8 }}>Added: {fmt(customer.createdAt)}</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header"><span className="card-title">Details</span></div>
          <div className="card-body">
            <table>
              <tbody>
                <tr><td style={{ fontWeight: 600, width: 140, paddingLeft: 0 }}>Name</td><td>{customer.name}</td></tr>
                <tr><td style={{ fontWeight: 600, paddingLeft: 0 }}>Email</td><td>{customer.email || '—'}</td></tr>
                <tr><td style={{ fontWeight: 600, paddingLeft: 0 }}>Phone</td><td>{customer.phone || '—'}</td></tr>
                <tr><td style={{ fontWeight: 600, paddingLeft: 0 }}>Company</td><td>{customer.company || '—'}</td></tr>
                <tr><td style={{ fontWeight: 600, paddingLeft: 0 }}>Status</td><td><StatusBadge value={customer.status} /></td></tr>
                <tr><td style={{ fontWeight: 600, paddingLeft: 0 }}>Notes</td><td>{customer.notes || '—'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
