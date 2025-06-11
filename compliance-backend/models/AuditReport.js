const mongoose = require('mongoose');

const auditReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Un rapport doit appartenir à un utilisateur']
  },
  frameworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Framework',
    required: [true, 'Un rapport doit être associé à un cadre de conformité']
  },
  title: {
    type: String,
    required: [true, 'Un rapport doit avoir un titre']
  },
  description: {
    type: String,
    trim: true
  },
  controls: [{
    controlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Control'
    },
    status: {
      type: String,
      enum: ['not_implemented', 'implemented', 'partial', 'not_applicable']
    },
    comment: {
      type: String,
      trim: true
    }
  }],
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  filePath: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AuditReport = mongoose.model('AuditReport', auditReportSchema);

module.exports = AuditReport;