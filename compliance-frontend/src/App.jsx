import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/auth-context';
import AuthPage from './pages/Auth';
import DashboardPage from './pages/Dashboard';
import FrameworksPage from './pages/Frameworks';
import ControlsPage from './pages/Controls';
import RisksPage from './pages/Risks';
import TasksPage from './pages/Tasks';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';
import AdminPage from './pages/Admin';
import Loading from './components/common/Loading';
import VerifyEmailPage from './pages/VerifyEmail';
import OAuthSuccess from './pages/OAuthSuccess';

function App() {
  const { user, loading, id } = useAuth();

  if (loading) {
    console.log('ControlDetailPage mount, id param =', id);
    return <Loading fullScreen />;
  }

  return (
    <Routes>
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route 
        path="/" 
        element={user ? <DashboardPage /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/auth" 
        element={!user ? <AuthPage /> : <Navigate to="/" />} 
      />
      <Route 
        path="/frameworks" 
        element={user ? <FrameworksPage /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/controls/:id" 
        element={user ? <ControlsPage /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/risks" 
        element={user ? <RisksPage /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/tasks" 
        element={user ? <TasksPage /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/reports" 
        element={user ? <ReportsPage /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/settings" 
        element={user ? <SettingsPage /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/admin" 
        element={user && user.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} 
      />
      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
    </Routes>
  );
}

export default App;