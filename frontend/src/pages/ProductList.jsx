import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import useDebounce from '../hooks/useDebounce';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url;
        if (debouncedSearch) {
          url = `/api/products/search?q=${debouncedSearch}&page=${page}&size=12`;
        } else if (category !== 'All') {
          url = `/api/products/category/${category}?page=${page}&size=12`;
        } else {
          url = `/api/products?page=${page}&size=12&sortBy=${sortBy}&direction=${direction}`;
        }
        const res = await api.get(url);
        const data = res.data.data;
        setProducts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [debouncedSearch, category, page, sortBy, direction]);

  const categories = ['All', 'Sweaters', 'Pants', 'Shirts', 'T-Shirts', 'Jackets', 'Jeans', 'Accessories', 'Shoes', 'Hoodies'];

  return (
    <div className="pl-page container">
      <div className="pl-header">
        <h1>The Catalog</h1>
        <div className="pl-search-bar">
          <FiSearch />
          <input type="text" placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
      </div>

      <div className="pl-controls">
        <div className="pl-categories">
          {categories.map(c => (
            <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`}
              onClick={() => { setCategory(c); setPage(0); }}>{c}</button>
          ))}
        </div>
        <select className="pl-sort" value={`${sortBy}-${direction}`}
          onChange={e => { const [s, d] = e.target.value.split('-'); setSortBy(s); setDirection(d); setPage(0); }}>
          <option value="createdAt-desc">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
        </select>
      </div>

      <div className="products-grid">
        {loading ? [1,2,3,4,5,6,7,8].map(i => <ProductCardSkeleton key={i} />)
          : products.map(p => <ProductCard key={p.id} product={p} />)}
        {!loading && products.length === 0 && <p className="no-results">No products found.</p>}
      </div>

      {totalPages > 1 && (
        <div className="pl-pagination">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}><FiChevronLeft /></button>
          <span>{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><FiChevronRight /></button>
        </div>
      )}
    </div>
  );
};

export default ProductList;