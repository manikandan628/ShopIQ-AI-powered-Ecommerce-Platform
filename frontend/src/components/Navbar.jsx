import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart } from '../store/cartSlice';
import { FiShoppingBag, FiUser, FiHeart, FiMessageSquare, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalItems = items.reduce((t, i) => t + i.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="nav-brand">SHOP IQ</Link>

        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/products" onClick={() => setMobileOpen(false)}>Shop</Link>
          <Link to="/chat" onClick={() => setMobileOpen(false)}>AI Stylist</Link>
          {user?.role === 'ROLE_ADMIN' && <Link to="/admin" onClick={() => setMobileOpen(false)}>Dashboard</Link>}
        </div>

        <div className="nav-actions">
          <Link to="/wishlist" className="nav-icon"><FiHeart size={20} /></Link>
          <Link to={user ? "/profile" : "/login"} className="nav-icon"><FiUser size={20} /></Link>
          <button className="nav-icon cart-icon" onClick={() => dispatch(toggleCart())}>
            <FiShoppingBag size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
