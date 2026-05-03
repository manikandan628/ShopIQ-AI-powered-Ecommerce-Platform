import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice';
import { FiPackage, FiX } from 'react-icons/fi';

const STEPS = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => { api.get('/api/orders').then(r => setOrders(r.data.data)).finally(() => setLoading(false)); }, []);

  const cancelOrder = async (id) => {
    await api.put(`/api/orders/${id}/cancel`);
    const r = await api.get('/api/orders'); setOrders(r.data.data);
    dispatch(addToast({ type: 'success', message: 'Order cancelled' }));
  };

  const S = { page: { padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }, card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '2rem', marginBottom: '1.5rem' }, row: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }, timeline: { display: 'flex', gap: '0.5rem', margin: '1.5rem 0' }, step: (active, done) => ({ flex: 1, height: '4px', background: done ? 'var(--success)' : active ? 'var(--warning)' : 'var(--border-color)', transition: 'background 300ms' }), labels: { display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' } };

  if (loading) return <div style={S.page}><p>Loading orders...</p></div>;

  return (
    <div style={S.page}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>My Orders</h1>
      {orders.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>}
      {orders.map(o => {
        const currentIdx = o.status === 'CANCELLED' ? -1 : STEPS.indexOf(o.status);
        return (
          <div key={o.id} style={S.card}>
            <div style={S.row}>
              <div><strong style={{ fontSize: '1.1rem' }}>Order #{o.id}</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.orderDate).toLocaleDateString()}</span></div>
              <div style={{ textAlign: 'right' }}><strong>₹{o.totalAmount?.toLocaleString()}</strong><br /><span style={{ fontSize: '0.8rem', color: o.status === 'CANCELLED' ? 'var(--error)' : 'var(--success)' }}>{o.status}</span></div>
            </div>
            {o.status !== 'CANCELLED' && (<><div style={S.timeline}>{STEPS.map((s, i) => <div key={s} style={S.step(i === currentIdx, i < currentIdx)} />)}</div><div style={S.labels}>{STEPS.map(s => <span key={s}>{s.replace('_', ' ')}</span>)}</div></>)}
            {o.items?.map(item => <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem', marginTop: '0.5rem' }}><span>{item.productName} × {item.quantity}</span><span>₹{(item.price * item.quantity).toLocaleString()}</span></div>)}
            {o.status === 'PLACED' && <button className="btn-outline" onClick={() => cancelOrder(o.id)} style={{ marginTop: '1rem', color: 'var(--error)', borderColor: 'var(--error)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FiX /> Cancel Order</button>}
          </div>
        );
      })}
    </div>
  );
};
export default Orders;
