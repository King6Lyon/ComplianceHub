const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Une notification doit appartenir à un utilisateur']
  },
  title: {
    type: String,
    required: [true, 'Une notification doit avoir un titre']
  },
  message: {
    type: String,
    required: [true, 'Une notification doit avoir un message']
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'danger', 'success'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  link: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour faciliter les requêtes fréquentes
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;