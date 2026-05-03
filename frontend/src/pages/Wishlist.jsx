import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import { addToast } from '../store/uiSlice';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';

const Wishlist = () => {
  const { items } = useSelector(s => s.wishlist);
  const dispatch = useDispatch();

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Wishlist</h1>
      {items.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Your wishlist is empty.</p>}
      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <Link to={`/product/${item.id}`}><div style={{ width: 80, height: 100, background: 'var(--bg-secondary)' }}>{item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div></Link>
          <div style={{ flex: 1 }}>
            <Link to={`/product/${item.id}`}><strong>{item.name}</strong></Link>
            <p style={{ fontWeight: 700, marginTop: '0.25rem' }}>₹{item.price?.toLocaleString()}</p>
          </div>
          <button className="btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => { dispatch(addToCart(item)); dispatch(addToast({ type: 'success', message: 'Added to cart' })); }}><FiShoppingBag size={16} /></button>
          <button style={{ color: 'var(--error)', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => dispatch(removeFromWishlist(item.id))}><FiTrash2 size={18} /></button>
        </div>
      ))}
    </div>
  );
};
export default Wishlist;
