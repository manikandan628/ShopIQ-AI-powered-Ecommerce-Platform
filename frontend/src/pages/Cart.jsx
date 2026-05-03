import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items } = useSelector(s => s.cart);
  const total = items.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Your Cart</h1>
      {items.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Cart is empty.</p> :
        <>
          {items.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>{i.name} × {i.quantity}</span>
              <span style={{ fontWeight: 700 }}>₹{(i.price * i.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', fontSize: '1.25rem', fontWeight: 800 }}>
            <span>Total</span><span>₹{total.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>Proceed to Checkout</Link>
        </>
      }
    </div>
  );
};
export default Cart;
