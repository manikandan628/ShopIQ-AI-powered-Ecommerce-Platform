import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { addToast, addRecentlyViewed } from '../store/uiSlice';
import api from '../utils/api';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { ProductDetailSkeleton } from '../components/Skeleton';
import { FiArrowLeft, FiShoppingBag, FiHeart } from 'react-icons/fi';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/api/products/${id}`),
      api.get(`/api/reviews/product/${id}`),
      api.get(`/api/reviews/product/${id}/stats`),
      api.get(`/api/products/${id}/related`),
    ]).then(([pRes, rRes, sRes, relRes]) => {
      setProduct(pRes.data.data);
      setReviews(rRes.data.data);
      setReviewStats(sRes.data.data);
      setRelated(relRes.data.data);
      dispatch(addRecentlyViewed(pRes.data.data));
    }).catch(console.error).finally(() => setLoading(false));
  }, [id, dispatch]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.rating) return;
    setSubmitting(true);
    try {
      await api.post(`/api/reviews/product/${id}`, newReview);
      const [rRes, sRes] = await Promise.all([
        api.get(`/api/reviews/product/${id}`),
        api.get(`/api/reviews/product/${id}/stats`),
      ]);
      setReviews(rRes.data.data);
      setReviewStats(sRes.data.data);
      setNewReview({ rating: 0, comment: '' });
      dispatch(addToast({ type: 'success', message: 'Review submitted!' }));
    } catch { dispatch(addToast({ type: 'error', message: 'Failed to submit review' })); }
    finally { setSubmitting(false); }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Product not found</div>;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="pd-page">
      <div className="pd-main container">
        <div className="pd-image-section">
          <Link to="/products" className="pd-back"><FiArrowLeft /> Back</Link>
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="pd-img" />
            : <div className="pd-placeholder">{product.category}</div>}
        </div>
        <div className="pd-info-section">
          <span className="pd-category">{product.category} · {product.brand}</span>
          <h1 className="pd-name">{product.name}</h1>
          <div className="pd-rating-row">
            <StarRating rating={product.averageRating || 0} readOnly size={18} />
            <span>({product.reviewCount || 0} reviews)</span>
          </div>
          <div className="pd-price-row">
            <span className="pd-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="pd-original">₹{product.originalPrice.toLocaleString()}</span>}
            {discount > 0 && <span className="pd-discount">-{discount}%</span>}
          </div>
          <p className="pd-desc">{product.description}</p>
          <div className="pd-actions">
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => { dispatch(addToCart(product)); dispatch(addToast({ type: 'success', message: 'Added to cart!' })); }}>
              <FiShoppingBag /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <section className="pd-reviews container">
        <h2>Reviews</h2>
        {reviewStats && (
          <div className="review-stats">
            <div className="stats-avg"><span className="avg-num">{reviewStats.averageRating}</span><StarRating rating={reviewStats.averageRating} readOnly size={16} /><span>{reviewStats.totalReviews} reviews</span></div>
            <div className="stats-bars">
              {[5,4,3,2,1].map(star => {
                const count = reviewStats.breakdown?.[star] || 0;
                const pct = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                return (<div className="bar-row" key={star}><span>{star}★</span><div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%` }} /></div><span>{count}</span></div>);
              })}
            </div>
          </div>
        )}
        {isAuthenticated && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Write a Review</h3>
            <StarRating rating={newReview.rating} onRate={r => setNewReview(p => ({ ...p, rating: r }))} size={24} />
            <textarea className="input-field" rows="3" placeholder="Share your experience..." value={newReview.comment} onChange={e => setNewReview(p => ({ ...p, comment: e.target.value }))} />
            <button className="btn-primary" type="submit" disabled={submitting || !newReview.rating}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
          </form>
        )}
        <div className="reviews-list">
          {reviews.map(r => (
            <div className="review-card" key={r.id}>
              <div className="review-header"><strong>{r.userName}</strong>{r.isVerified && <span className="verified-badge">✓ Verified</span>}</div>
              <StarRating rating={r.rating} readOnly size={14} />
              <p>{r.comment}</p>
              <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="pd-related container">
          <h2>You May Also Like</h2>
          <div className="products-grid">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
