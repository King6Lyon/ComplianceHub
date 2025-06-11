import React from 'react';
import { useAuth } from '../../context/auth-context';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth?mode=login');
  };

  return (
    <header className="dashboard-header">
      <div className="logo">
        <Link to="/">ComplianceHub</Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/frameworks">Frameworks</Link></li>
          <li><Link to="/risks">Risks</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          {user?.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
        </ul>
      </nav>
      <div className="user-actions">
        <Link to="/settings/profile" className="profile-link">
          {user?.name}
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;