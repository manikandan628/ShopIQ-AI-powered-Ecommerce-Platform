import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiTruck, FiShield } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products?size=4&sortBy=createdAt&direction=desc')
      .then(res => setProducts(res.data.data.content || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-inner container">
          <motion.div className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}>
            <span className="hero-label">PRE-ORDER COLLECTION 2025</span>
            <h1 className="hero-title">Good Things<br />Take Time.</h1>
            <p className="hero-desc">Premium essentials without the retail markup. Pre-ordered to eliminate waste, crafted to last a lifetime.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn-primary">Shop Collection <FiArrowRight /></Link>
              <Link to="/chat" className="btn-outline">AI Stylist <FiStar /></Link>
            </div>
          </motion.div>
          <motion.div className="hero-image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" alt="Fashion" />
          </motion.div>
        </div>
      </section>

      <section className="features-strip">
        <div className="container features-grid">
          {[
            { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over ₹1500' },
            { icon: <FiShield />, title: 'Premium Quality', desc: 'Crafted to last' },
            { icon: <FiStar />, title: 'AI Powered', desc: 'Personal styling' },
          ].map((f, i) => (
            <div className="feature-item" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <div><h4>{f.title}</h4><p>{f.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-section container">
        <div className="section-header">
          <h2>New Arrivals</h2>
          <Link to="/products" className="see-all">View All <FiArrowRight /></Link>
        </div>
        <div className="products-grid">
          {loading
            ? [1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
};

export default Home;
