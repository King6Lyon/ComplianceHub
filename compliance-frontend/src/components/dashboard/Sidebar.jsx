import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  ListChecks,
  FileText,
  Settings,
  ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-screen shadow-md flex flex-col px-4 py-6">
      <nav className="flex-1 space-y-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/frameworks"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <ShieldCheck className="w-5 h-5" />
              Cadres de conformité
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/controls"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <ListChecks className="w-5 h-5" />
              Contrôles
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/risks"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <ClipboardList className="w-5 h-5" />
              Évaluation des risques
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <ListChecks className="w-5 h-5" />
              Tâches
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <FileText className="w-5 h-5" />
              Rapports
            </NavLink>
          </li>
        </ul>

        <div className="border-t pt-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            Paramètres
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
