import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, ClipboardList, Plus, ArrowLeft, Edit2 } from 'lucide-react';
import { getUsers, createUser, updateUser } from '../api/admin';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/common/Alert';
import Modal from '../components/common/Modal';

const tabs = [
  { key: 'users', label: 'User Management', icon: <Users className="w-4 h-4 mr-2" /> },
  { key: 'frameworks', label: 'Frameworks', icon: <ShieldCheck className="w-4 h-4 mr-2" /> },
  { key: 'audit', label: 'Audit Logs', icon: <ClipboardList className="w-4 h-4 mr-2" /> },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await createUser(userData);
      setUsers([...users, newUser]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create user' };
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const updatedUser = await updateUser(userId, userData);
      setUsers(users.map(u => u._id === userId ? updatedUser : u));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update user' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
         {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm text-blue-700 hover:text-blue-600 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
        </div>
        {error && <Alert type="error" message={error} />}

        {/* Tab headers */}
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
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'users' && (
            <UserManagement
              users={users}
              onCreate={handleCreateUser}
              onUpdate={handleUpdateUser}
              loading={loading}
            />
          )}
          {activeTab === 'frameworks' && <p className="text-gray-600">Framework management coming soon...</p>}
          {activeTab === 'audit' && <p className="text-gray-600">Audit logs coming soon...</p>}
        </div>
      </div>
    </div>
  );
};

const UserManagement = ({ users, onCreate, onUpdate, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (userData) => {
    const result = editingUser
      ? await onUpdate(editingUser._id, userData)
      : await onCreate(userData);

    if (result.success) {
      setShowForm(false);
      setEditingUser(null);
      setFormError('');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setEditingUser(null);
          setShowForm(true);
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
      >
        <Plus className="w-4 h-4 mr-1" /> Add New User
      </button>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-100 text-sm text-left">
              <tr>
                <th className="p-2">First Name</th>
                <th className="p-2">Last Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-200">
                  <td className="p-2">{user.firstName}</td>
                  <td className="p-2">{user.lastName}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">{user.active ? 'Active' : 'Inactive'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <UserForm
          user={editingUser}
          onSubmit={handleSubmit}
          error={formError}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
            setFormError('');
          }}
        />
      </Modal>
    </div>
  );
};

const UserForm = ({ user, onSubmit, error, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    active: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        active: user.active
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <h2 className="text-lg font-semibold mb-4">{user ? 'Edit User' : 'Add New User'}</h2>
      {error && <Alert type="error" message={error} />}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          disabled={!!user}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="user">User</option>
          <option value="auditor">Auditor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="active"
          checked={formData.active}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="text-sm">Active</label>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {user ? 'Update User' : 'Create User'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Admin;
