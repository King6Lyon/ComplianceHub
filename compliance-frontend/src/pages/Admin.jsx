import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { getUsers, createUser, updateUser } from '../api/admin';
import Alert from '../components/common/Alert';
import Modal from '../components/common/Modal';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');

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
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create user'
      };
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const updatedUser = await updateUser(userId, userData);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update user'
      };
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      {error && <Alert type="error" message={error} />}

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Tab eventKey="users" title="User Management">
          <UserManagement
            users={users}
            onCreate={handleCreateUser}
            onUpdate={handleUpdateUser}
            loading={loading}
          />
        </Tab>
        <Tab eventKey="frameworks" title="Frameworks">
          <h2>Framework Management</h2>
          <p>Coming soon...</p>
        </Tab>
        <Tab eventKey="audit" title="Audit Logs">
          <h2>Audit Logs</h2>
          <p>Coming soon...</p>
        </Tab>
      </Tabs>
    </div>
  );
};

const UserManagement = ({ users, onCreate, onUpdate, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (userData) => {
    let result;
    if (editingUser) {
      result = await onUpdate(editingUser.id, userData);
    } else {
      result = await onCreate(userData);
    }

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
        className="add-user-btn"
      >
        Add New User
      </button>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setShowForm(true);
                    }}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        active: true
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{user ? 'Edit User' : 'Add New User'}</h2>
      {error && <Alert type="error" message={error} />}

      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={!!user}
        />
      </div>

      <div className="form-group">
        <label>Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="auditor">Auditor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          Active
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">
          {user ? 'Update User' : 'Create User'}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Admin;
