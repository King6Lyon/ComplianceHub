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
        await updateTask(task.id, formData);
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
    <form onSubmit={handleSubmit}>
      {error && <Alert type="error" message={error} />}
      
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Due Date</label>
        <DatePicker
          selected={formData.dueDate}
          onChange={handleDateChange}
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      
      <div className="form-group">
        <label>Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Assign To</label>
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Related Control (optional)</label>
        <input
          type="text"
          name="relatedControl"
          value={formData.relatedControl}
          onChange={handleChange}
          placeholder="Control ID"
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Task'}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;