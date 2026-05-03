import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { addToast } from '../store/uiSlice';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FiUser, FiLock, FiMapPin, FiLogOut } from 'react-icons/fi';

const Profile = () => {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [newAddr, setNewAddr] = useState({ label: '', street: '', city: '', state: '', zip: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    api.get('/api/profile').then(r => { setProfile(r.data.data); setName(r.data.data.name); });
    api.get('/api/addresses').then(r => setAddresses(r.data.data));
  }, []);

  const handleUpdateProfile = async () => {
    await api.put('/api/profile', { name });
    dispatch(addToast({ type: 'success', message: 'Profile updated' }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try { await api.put('/api/profile/password', pwForm); dispatch(addToast({ type: 'success', message: 'Password changed' })); setPwForm({ currentPassword: '', newPassword: '' }); }
    catch (err) { dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Failed' })); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    await api.post('/api/addresses', newAddr);
    const r = await api.get('/api/addresses'); setAddresses(r.data.data);
    setNewAddr({ label: '', street: '', city: '', state: '', zip: '' });
    dispatch(addToast({ type: 'success', message: 'Address added' }));
  };

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const S = { page: { padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto' }, section: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '2rem', marginBottom: '1.5rem' }, h2: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }, row: { display: 'flex', gap: '1rem', marginBottom: '1rem' }, inp: { flex: 1 } };

  return (
    <div style={S.page}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>My Account</h1>
      <div style={S.section}>
        <h2 style={S.h2}><FiUser /> Profile</h2>
        <div style={S.row}><input className="input-field" value={name} onChange={e => setName(e.target.value)} style={S.inp} /></div>
        <button className="btn-primary" onClick={handleUpdateProfile}>Save Changes</button>
      </div>
      <div style={S.section}>
        <h2 style={S.h2}><FiLock /> Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div style={S.row}><input type="password" className="input-field" placeholder="Current password" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} style={S.inp} /></div>
          <div style={S.row}><input type="password" className="input-field" placeholder="New password" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} style={S.inp} /></div>
          <button className="btn-outline" type="submit">Update Password</button>
        </form>
      </div>
      <div style={S.section}>
        <h2 style={S.h2}><FiMapPin /> Addresses</h2>
        {addresses.map(a => <div key={a.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}><strong>{a.label}</strong>: {a.street}, {a.city}, {a.state} {a.zip}</div>)}
        <form onSubmit={handleAddAddress} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={S.row}><input className="input-field" placeholder="Label (Home, Office)" value={newAddr.label} onChange={e => setNewAddr(p => ({ ...p, label: e.target.value }))} style={S.inp} required /><input className="input-field" placeholder="Street" value={newAddr.street} onChange={e => setNewAddr(p => ({ ...p, street: e.target.value }))} style={S.inp} required /></div>
          <div style={S.row}><input className="input-field" placeholder="City" value={newAddr.city} onChange={e => setNewAddr(p => ({ ...p, city: e.target.value }))} style={S.inp} required /><input className="input-field" placeholder="State" value={newAddr.state} onChange={e => setNewAddr(p => ({ ...p, state: e.target.value }))} style={S.inp} required /><input className="input-field" placeholder="ZIP" value={newAddr.zip} onChange={e => setNewAddr(p => ({ ...p, zip: e.target.value }))} style={S.inp} required /></div>
          <button className="btn-outline" type="submit">Add Address</button>
        </form>
      </div>
      <button className="btn-outline" onClick={handleLogout} style={{ color: 'var(--error)', borderColor: 'var(--error)' }}><FiLogOut /> Sign Out</button>
    </div>
  );
};
export default Profile;
