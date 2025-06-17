import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  ListChecks,
  FileText,
  Settings,
  UserCog,
  ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-var(--white-color); h-screen shadow-lg flex flex-col">
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink to="/" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded">
              <LayoutDashboard className="w-5 h-5" />
              Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink to="/frameworks" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded">
              <ShieldCheck className="w-5 h-5" />
              Cadres de conformité
            </NavLink>
          </li>
          <li>
            <NavLink to="/controls" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded">
              <ListChecks className="w-5 h-5" />
              Contrôles
            </NavLink>
          </li>
          <li>
            <NavLink to="/risks" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded">
              <ClipboardList className="w-5 h-5" />
              Évaluation des risques
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded">
              <ListChecks className="w-5 h-5" />
              Tâches
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded">
              <FileText className="w-5 h-5" />
              Rapports
            </NavLink>
          </li>
        </ul>

        <div className="mt-6 border-t pt-4">
          <NavLink to="/settings" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded">
            <Settings className="w-5 h-5" />
            Paramètres
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
