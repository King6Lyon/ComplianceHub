import React from 'react';
import { Link } from 'react-router-dom';
import FrameworkSelector from '../components/frameworks/FrameworkSelector';
import ControlList from '../components/frameworks/ControlList';
import { LayoutDashboard, ChevronLeft } from 'lucide-react';

const Frameworks = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Compliance Frameworks
          </h1>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <FrameworkSelector />
      </div>

      <ControlList />
    </div>
  );
};

export default Frameworks;
