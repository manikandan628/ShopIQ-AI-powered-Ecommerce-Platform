import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice';
import api from '../utils/api';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      dispatch(addToast({ type: 'success', message: 'Account created! Please sign in.' }));
      navigate('/login');
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Registration failed' }));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Shop IQ for exclusive access</p>
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group"><label>Name</label><input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" /></div>
          <div className="form-group"><label>Email</label><input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" /></div>
          <div className="form-group"><label>Password</label><input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" /></div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};
export default Register;
