const mongoose = require('mongoose');

const controlSchema = new mongoose.Schema({
  frameworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Framework',
    required: [true, 'Un contrôle doit appartenir à un cadre de conformité']
  },
  category: {
    type: String,
    required: [true, 'Un contrôle doit avoir une catégorie']
  },
  subCategory: {
    type: String,
    required: [true, 'Un contrôle doit avoir une sous-catégorie']
  },
  controlId: {
    type: String,
    required: [true, 'Un contrôle doit avoir un identifiant'],
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Un contrôle doit avoir un titre']
  },
  description: {
    type: String,
    trim: true
  },
  maturityLevels: [{
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    requirements: {
      type: String,
      required: true
    },
    implementationGuidance: {
      type: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Control = mongoose.model('Control', controlSchema);

module.exports = Control;