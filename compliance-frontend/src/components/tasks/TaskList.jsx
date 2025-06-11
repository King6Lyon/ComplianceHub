import React, { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus } from '../../api/tasks';
import Alert from '../common/Alert';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {error && <Alert type="error" message={error} />}
      
      <div className="task-filters">
        <button 
          onClick={() => setFilter('all')} 
          className={filter === 'all' ? 'active' : ''}
        >
          All Tasks
        </button>
        <button 
          onClick={() => setFilter('pending')} 
          className={filter === 'pending' ? 'active' : ''}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilter('in_progress')} 
          className={filter === 'in_progress' ? 'active' : ''}
        >
          In Progress
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed
        </button>
        <button 
          onClick={() => setFilter('overdue')} 
          className={filter === 'overdue' ? 'active' : ''}
        >
          Overdue
        </button>
      </div>
      
      {filteredTasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description.substring(0, 50)}...</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                  </span>
                </td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </td>
                <td>{task.assignedTo?.name || 'Unassigned'}</td>
                <td>
                  <button className="view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;