import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gestion des Tâches</h1>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-blue-600 hover:underline"
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Task
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <TaskList onEdit={handleEdit} />
      </div>

      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <TaskForm
          task={editingTask}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};

export default Tasks;
