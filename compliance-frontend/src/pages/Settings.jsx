import React, { useState } from 'react';
import { ArrowLeft, User, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/dashboard/UserProfile';
import MfaSetup from '../components/auth/MfaSetup';

const tabs = [
  {
    key: 'profile',
    title: 'Profile',
    icon: <User className="w-4 h-4 mr-2" />,
    content: <UserProfile />,
  },
  {
    key: 'security',
    title: 'Security',
    icon: <ShieldCheck className="w-4 h-4 mr-2" />,
    content: (
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Multi-Factor Authentication</h2>
        <MfaSetup />
      </div>
    ),
  },
  {
    key: 'preferences',
    title: 'Preferences',
    icon: <SlidersHorizontal className="w-4 h-4 mr-2" />,
    content: <p className="text-gray-500">Coming soon...</p>,
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Settings</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm text-blue-700 hover:text-blue-600 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-700 border-blue-700'
                  : 'text-gray-500 border-transparent hover:text-blue-700 hover:border-blue-300'
              }`}
            >
              {tab.icon}
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{tabs.find((tab) => tab.key === activeTab)?.content}</div>
      </div>
    </div>
  );
};

export default Settings;
