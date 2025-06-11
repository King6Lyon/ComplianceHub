const mongoose = require('mongoose');

const riskAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Une évaluation des risques doit appartenir à un utilisateur']
  },
  frameworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Framework',
    required: [true, 'Une évaluation des risques doit être associée à un cadre de conformité']
  },
  risks: [{
    description: {
      type: String,
      required: [true, 'Un risque doit avoir une description']
    },
    impact: {
      type: Number,
      required: [true, 'Un risque doit avoir un impact'],
      min: 1,
      max: 5
    },
    likelihood: {
      type: Number,
      required: [true, 'Un risque doit avoir une probabilité'],
      min: 1,
      max: 5
    },
    mitigation: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'closed'],
      default: 'open'
    }
  }],
  score: {
    type: Number,
    min: 0,
    max: 25
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt avant de sauvegarder
riskAssessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const RiskAssessment = mongoose.model('RiskAssessment', riskAssessmentSchema);

module.exports = RiskAssessment;