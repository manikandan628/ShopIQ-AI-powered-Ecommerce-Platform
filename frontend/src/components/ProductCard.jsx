import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { addToast } from '../store/uiSlice';
import { FiShoppingBag } from 'react-icons/fi';
import StarRating from './StarRating';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const stockStatus = product.stock > 10 ? 'in_stock' : product.stock > 0 ? 'low_stock' : 'out_of_stock';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(addToast({ type: 'success', message: `${product.name} added to cart` }));
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="pc-image-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="pc-image" loading="lazy" />
        ) : (
          <div className="pc-placeholder">{product.category}</div>
        )}
        {discount > 0 && <span className="pc-sale-badge">-{discount}%</span>}
        <button className="pc-quick-add" onClick={handleAddToCart} title="Add to cart">
          <FiShoppingBag size={18} />
        </button>
      </div>
      <div className="pc-info">
        <span className="pc-category">{product.category}</span>
        <h3 className="pc-name">{product.name}</h3>
        <div className="pc-rating-row">
          <StarRating rating={product.averageRating || 0} readOnly size={14} />
          <span className="pc-review-count">({product.reviewCount || 0})</span>
        </div>
        <div className="pc-price-row">
          <span className="pc-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && <span className="pc-original-price">₹{product.originalPrice.toLocaleString()}</span>}
        </div>
        <div className={`pc-stock ${stockStatus}`}>
          {stockStatus === 'in_stock' && '● In Stock'}
          {stockStatus === 'low_stock' && `● Only ${product.stock} left`}
          {stockStatus === 'out_of_stock' && '● Out of Stock'}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
