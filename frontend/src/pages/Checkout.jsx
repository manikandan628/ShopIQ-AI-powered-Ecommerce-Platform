import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { addToast } from '../store/uiSlice';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Checkout = () => {
  const { items } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const total = subtotal - discount;

  useEffect(() => { api.get('/api/addresses').then(r => setAddresses(r.data.data)).catch(() => {}); }, []);

  const applyCoupon = async () => {
    try {
      const r = await api.post('/api/coupons/validate', { code: coupon, orderTotal: subtotal });
      const c = r.data.data;
      const d = c.type === 'PERCENTAGE' ? subtotal * (c.discount / 100) : c.discount;
      setDiscount(d);
      dispatch(addToast({ type: 'success', message: `Coupon applied! -₹${d.toLocaleString()}` }));
    } catch (err) { dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Invalid coupon' })); }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      await api.post('/api/orders', { addressId: selectedAddr, couponCode: coupon || null });
      dispatch(clearCart());
      dispatch(addToast({ type: 'success', message: 'Order placed successfully!' }));
      setStep(3);
    } catch (err) { dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Failed' })); }
    finally { setLoading(false); }
  };

  const S = { page: { padding: '3rem 2rem', maxWidth: '700px', margin: '0 auto' }, steps: { display: 'flex', gap: '0.5rem', marginBottom: '3rem' }, stepDot: (active) => ({ flex: 1, height: 4, background: active ? 'var(--text-primary)' : 'var(--border-color)' }), section: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '2rem', marginBottom: '1.5rem' } };

  return (
    <div style={S.page}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Checkout</h1>
      <div style={S.steps}><div style={S.stepDot(step >= 1)} /><div style={S.stepDot(step >= 2)} /><div style={S.stepDot(step >= 3)} /></div>

      {step === 1 && (<div style={S.section}>
        <h2 style={{ marginBottom: '1.5rem' }}>Select Address</h2>
        {addresses.map(a => (<label key={a.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', marginBottom: '0.5rem', cursor: 'pointer', background: selectedAddr === a.id ? 'var(--bg-secondary)' : 'transparent' }}><input type="radio" name="addr" checked={selectedAddr === a.id} onChange={() => setSelectedAddr(a.id)} /><div><strong>{a.label}</strong><br /><span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{a.street}, {a.city}, {a.state} {a.zip}</span></div></label>))}
        {addresses.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No addresses. <a href="/profile" style={{ textDecoration: 'underline' }}>Add one</a></p>}
        <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setStep(2)}>Continue to Payment</button>
      </div>)}

      {step === 2 && (<div style={S.section}>
        <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
        {items.map(i => <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}><span>{i.name} × {i.quantity}</span><span>₹{(i.price * i.quantity).toLocaleString()}</span></div>)}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}><input className="input-field" placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} /><button className="btn-outline" onClick={applyCoupon}>Apply</button></div>
        {discount > 0 && <p style={{ color: 'var(--success)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Discount: -₹{discount.toLocaleString()}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '1.25rem', fontWeight: 800 }}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={placeOrder} disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</button>
      </div>)}

      {step === 3 && (<div style={{ ...S.section, textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
        <h2>Order Placed!</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>Thank you for your purchase.</p>
        <button className="btn-primary" onClick={() => navigate('/orders')}>View Orders</button>
      </div>)}
    </div>
  );
};
export default Checkout;
