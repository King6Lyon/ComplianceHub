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
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) return <div className="text-center py-6">Loading tasks...</div>;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Task Management</h2>
      {error && <Alert type="error" message={error} />}

      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'in_progress', 'completed', 'overdue'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded border text-sm font-medium ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-600">No tasks found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Description</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Status</th>
                <th className="p-2">Assigned To</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium text-gray-800">{task.title}</td>
                  <td className="p-2 text-gray-600">{task.description?.substring(0, 50) || ''}...</td>
                  <td className="p-2 text-gray-600">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="p-2 text-gray-600">{task.assignedTo?.name || 'Unassigned'}</td>
                  <td className="p-2">
                    <button className="text-blue-600 hover:underline text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList;
