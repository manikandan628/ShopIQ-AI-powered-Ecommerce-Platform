import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import { ProductCardSkeleton } from './components/Skeleton';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Chat = lazy(() => import('./pages/Chat'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const PageLoader = () => (
  <div style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
      {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
    </div>
  </div>
);

function App() {
  const { theme } = useSelector(state => state.ui);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      <Navbar />
      <CartDrawer />
      <Toast />

      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/cart" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Cart /></ProtectedRoute></Suspense>} />
            <Route path="/checkout" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Checkout /></ProtectedRoute></Suspense>} />
            <Route path="/orders" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Orders /></ProtectedRoute></Suspense>} />
            <Route path="/wishlist" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Wishlist /></ProtectedRoute></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><Profile /></ProtectedRoute></Suspense>} />
            <Route path="/admin" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><AdminDashboard /></ProtectedRoute></Suspense>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
