import React, { useState, useEffect } from 'react';
import { createTask, updateTask, getUsers } from '../../api/tasks';
import Alert from '../common/Alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskForm = ({ task, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium',
    assignedTo: '',
    relatedControl: ''
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate),
        priority: task.priority,
        assignedTo: task.assignedTo?.id || '',
        relatedControl: task.relatedControl?.id || ''
      });
    }

    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };
    loadUsers();
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dueDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (task) {
        await updateTask(task._id, formData);
      } else {
        await createTask(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-gray-800">{task ? 'Edit Task' : 'New Task'}</h2>

      {error && <Alert type="error" message={error} />}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <DatePicker
          selected={formData.dueDate}
          onChange={handleDateChange}
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Assign To</label>
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Related Control (optional)</label>
        <input
          type="text"
          name="relatedControl"
          value={formData.relatedControl}
          onChange={handleChange}
          placeholder="Control ID"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
