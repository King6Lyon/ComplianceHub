const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Une tâche doit appartenir à un utilisateur']
  },
  controlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Control'
  },
  title: {
    type: String,
    required: [true, 'Une tâche doit avoir un titre']
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Une tâche doit avoir une date d\'échéance']
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour faciliter les requêtes fréquentes
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

// Middleware pour mettre à jour le statut en "overdue" si la date d'échéance est passée
taskSchema.pre('save', function(next) {
  if (this.isModified('dueDate') || this.isNew) {
    if (this.dueDate < Date.now() && this.status !== 'completed') {
      this.status = 'overdue';
    }
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;