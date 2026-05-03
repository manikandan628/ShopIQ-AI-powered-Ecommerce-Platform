import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice';
import { FiPackage, FiDollarSign, FiBox, FiUsers, FiTrash2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get('/api/admin/stats').then(r => setStats(r.data.data)).catch(() => dispatch(addToast({ type: 'error', message: 'Admin access required' })));
    api.get('/api/admin/orders').then(r => setOrders(r.data.data)).catch(() => {});
  }, [dispatch]);

  const updateStatus = async (id, status) => {
    await api.put(`/api/admin/orders/${id}/status`, { status });
    const r = await api.get('/api/admin/orders'); setOrders(r.data.data);
    dispatch(addToast({ type: 'success', message: `Order #${id} → ${status}` }));
  };

  const S = { page: { padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }, grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' },
    stat: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    statLabel: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 700 },
    statVal: { fontSize: '2rem', fontWeight: 800 },
    table: { width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)', border: '1px solid var(--border-color)' },
    th: { padding: '1rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 700 },
    td: { padding: '1rem', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' },
    sel: { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', fontSize: '0.8rem' } };

  const statuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  return (
    <div style={S.page}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Admin Dashboard</h1>
      {stats && (
        <div style={S.grid}>
          <div style={S.stat}><span style={S.statLabel}><FiPackage style={{marginRight:4}} /> Total Orders</span><span style={S.statVal}>{stats.totalOrders}</span></div>
          <div style={S.stat}><span style={S.statLabel}><FiDollarSign style={{marginRight:4}} /> Revenue</span><span style={S.statVal}>₹{stats.totalRevenue?.toLocaleString()}</span></div>
          <div style={S.stat}><span style={S.statLabel}><FiBox style={{marginRight:4}} /> Products</span><span style={S.statVal}>{stats.totalProducts}</span></div>
          <div style={S.stat}><span style={S.statLabel}><FiUsers style={{marginRight:4}} /> Users</span><span style={S.statVal}>{stats.totalUsers}</span></div>
        </div>
      )}
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Orders</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead><tr><th style={S.th}>ID</th><th style={S.th}>Total</th><th style={S.th}>Status</th><th style={S.th}>Date</th><th style={S.th}>Action</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={S.td}>#{o.id}</td>
                <td style={S.td}>₹{o.totalAmount?.toLocaleString()}</td>
                <td style={S.td}>{o.status}</td>
                <td style={S.td}>{new Date(o.orderDate).toLocaleDateString()}</td>
                <td style={S.td}><select style={S.sel} value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminDashboard;
