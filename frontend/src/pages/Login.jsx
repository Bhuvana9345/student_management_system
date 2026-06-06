import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LockKeyhole, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { college } from '../utils/college';

const labels = { admin: 'Admin Login', student: 'Student Login', staff: 'Staff Login' };
const roleCopy = {
  admin: 'Lead the campus with clarity. Track admissions, academics, attendance, and finance from one calm control room.',
  student: 'Your academic day starts here. Use your register number and date of birth to view your college records.',
  staff: 'Faculty and office staff can enter with staff ID and registered name to manage daily academic work.'
};

export default function Login() {
  const { role = 'admin' } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', role: role.toUpperCase() });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
    setForm({
      email: '',
      password: '',
      role: role.toUpperCase()
    });
    setError('');
  }, [role]);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) return setError('Email and password are required.');
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-panel">
        <div className="login-visual">
          <School size={42} />
          <h1>{college.name}</h1>
          <p>{roleCopy[role] || roleCopy.admin}</p>
          <div className="college-address">
            <span>{college.address}</span>
            <span>{college.phone} | {college.email}</span>
            <span>{college.website}</span>
          </div>
        </div>
        <form className="login-card" onSubmit={submit}>
          <div className="login-icon"><LockKeyhole /></div>
          <h2>{labels[role] || labels.admin}</h2>
          <div className="role-tabs">
            {['admin', 'student', 'staff'].map((item) => <Link key={item} className={item === role ? 'active' : ''} to={`/login/${item}`}>{item}</Link>)}
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <label className="form-label">{role === 'student' ? 'Register Number' : role === 'staff' ? 'Staff ID Number' : 'Email'}</label>
          <input className="form-control" type={role === 'admin' ? 'email' : 'text'} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label className="form-label mt-3">{role === 'student' ? 'Date of Birth' : role === 'staff' ? 'Staff Name' : 'Password'}</label>
          <input className="form-control" type={role === 'student' ? 'date' : role === 'staff' ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn btn-primary w-100 mt-4" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
      </div>
    </section>
  );
}
