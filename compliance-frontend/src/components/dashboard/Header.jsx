import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth?mode=login');
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img 
          src="https://cybersecurity.fi/assets/images/logo.png" 
          alt="ComplianceHub Logo" 
          className="h-10 w-auto object-contain"
          style={{ filter: 'brightness(0)' }}
        />
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex gap-6 text-sm">
        <Link to="/frameworks" className="text-gray-700 hover:text-blue-600 font-medium">Frameworks</Link>
        <Link to="/risks" className="text-gray-700 hover:text-blue-600 font-medium">Risks</Link>
        <Link to="/tasks" className="text-gray-700 hover:text-blue-600 font-medium">Tasks</Link>
        <Link to="/reports" className="text-gray-700 hover:text-blue-600 font-medium">Reports</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
        )}
      </nav>

      {/* User + Logout */}
      <div className="flex items-center gap-4">
        <Link 
          to="/settings/profile" 
          className="text-sm text-gray-800 hover:text-blue-600 font-medium"
        >
          {user?.firstName || 'Settings'}
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-white bg-green-500 hover:bg-red-600 px-3 py-1 rounded-md"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
