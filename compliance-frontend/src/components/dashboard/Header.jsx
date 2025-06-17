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
    <header className="flex items-center justify-between bg-var(--white-color); shadow px-6 py-4">
      <div className="text-lg font-semibold text-gray-800" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
         <h2>ComplianceHub</h2>
      </div>

      <nav className="hidden md:flex gap-5 text-sm">
        <Link 
          to="/frameworks" 
          className="font-medium text-gray-800 hover:text-blue-600"
        >
        Frameworks
        </Link>
        <Link 
          to="/risks" 
          className="font-medium text-gray-800 hover:text-blue-600"
        >
        Risks
        </Link>
         <Link 
          to="/tasks" 
          className="font-medium text-gray-800 hover:text-blue-600"
        >
         Tasks
        </Link>
        <Link 
          to="/reports" 
          className="font-medium text-gray-800 hover:text-blue-600"
         >
          Reports
        </Link>
           {user?.role === 'admin' && (
        <Link 
          to="/admin" 
          className="font-medium text-gray-800 hover:text-blue-600"
         >
         Admin
        </Link>
      )}
      </nav>

<div className="flex items-center gap-4">
  <Link 
    to="/settings/profile" 
    className="font-medium text-gray-800 hover:text-blue-600"
  >
    {user?.name}
  </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
