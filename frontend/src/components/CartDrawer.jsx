import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, toggleCart } from '../store/cartSlice';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import './CartDrawer.css';

const FREE_SHIPPING = 1500;

const CartDrawer = () => {
  const { items, isOpen } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const freeShippingPct = Math.min((subtotal / FREE_SHIPPING) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => dispatch(toggleCart())} />
          <motion.div className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}>
            <div className="cd-header">
              <h2>Cart ({items.length})</h2>
              <button onClick={() => dispatch(toggleCart())}><FiX size={22} /></button>
            </div>

            {subtotal < FREE_SHIPPING && (
              <div className="cd-shipping-bar">
                <p>Add ₹{(FREE_SHIPPING - subtotal).toLocaleString()} for free shipping</p>
                <div className="shipping-track"><div className="shipping-fill" style={{ width: `${freeShippingPct}%` }} /></div>
              </div>
            )}

            <div className="cd-items">
              {items.length === 0 ? <p className="cd-empty">Your cart is empty</p> :
                items.map(item => (
                  <div className="cd-item" key={item.id}>
                    <div className="cd-item-img">{item.imageUrl && <img src={item.imageUrl} alt="" />}</div>
                    <div className="cd-item-info">
                      <strong>{item.name}</strong>
                      <span className="cd-item-price">₹{item.price.toLocaleString()}</span>
                      <div className="cd-qty">
                        <button onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item.id))}><FiMinus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}><FiPlus size={14} /></button>
                      </div>
                    </div>
                    <button className="cd-remove" onClick={() => dispatch(removeFromCart(item.id))}><FiTrash2 size={16} /></button>
                  </div>
                ))
              }
            </div>

            {items.length > 0 && (
              <div className="cd-footer">
                <div className="cd-total"><span>Total</span><span>₹{subtotal.toLocaleString()}</span></div>
                <Link to="/checkout" className="btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={() => dispatch(toggleCart())}>Checkout</Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
