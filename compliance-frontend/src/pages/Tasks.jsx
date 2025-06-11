import React, { useState } from 'react';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>
      <button 
        onClick={() => setShowForm(true)}
        className="add-task-btn"
      >
        Add New Task
      </button>
      
      <TaskList onEdit={handleEdit} />
      
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