import { NavLink } from 'react-router-dom';
import {
  Dashboard,
  Assessment,
  Checklist,
  Security,
  Task,
  Description,
  Settings
} from '@mui/icons-material';

const Sidebar = () => {
  const links = [
    { to: '/', label: 'Tableau de bord', icon: <Dashboard /> },
    { to: '/frameworks', label: 'Cadres de conformité', icon: <Assessment /> },
    { to: '/controls', label: 'Contrôles', icon: <Checklist /> },
    { to: '/risks', label: 'Évaluation des risques', icon: <Security /> },
    { to: '/tasks', label: 'Tâches', icon: <Task /> },
    { to: '/reports', label: 'Rapports', icon: <Description /> },
    { to: '/settings', label: 'Paramètres', icon: <Settings /> },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow flex flex-col">
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className="flex items-center gap-3 p-4 text-gray-700 hover:bg-gray-100"
        >
          <span>{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
