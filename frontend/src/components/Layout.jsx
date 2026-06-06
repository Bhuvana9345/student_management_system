import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bot, BookOpen, CalendarCheck, CreditCard, GraduationCap, LayoutDashboard, LogOut, Menu, School, UserCog, UsersRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { college } from '../utils/college';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: UsersRound },
  { to: '/staff', label: 'Staff', icon: UserCog },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/marks', label: 'Marks', icon: GraduationCap },
  { to: '/fees', label: 'Fees', icon: CreditCard },
  { to: '/ai-guide', label: 'AI Guide', icon: Bot }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate('/login/admin');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><School size={28} /><span>{college.shortName}</span></div>
        <nav className="nav flex-column gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <button className="btn btn-light d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#mobileNav"><Menu /></button>
          <div>
            <h1 className="h4 mb-0">Student Management System</h1>
            <small className="text-muted">{college.name} | {college.address}</small>
          </div>
          <div className="ms-auto d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <div className="fw-semibold">{user?.name || 'Administrator'}</div>
              <small className="text-muted">{user?.role}</small>
            </div>
            <button className="btn btn-outline-danger" onClick={doLogout}><LogOut size={18} /> Logout</button>
          </div>
        </header>
        <Outlet />
      </main>
      <div className="offcanvas offcanvas-start" id="mobileNav" tabIndex="-1">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">CampusERP</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
        </div>
        <div className="offcanvas-body">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className="nav-link mobile-link">
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
