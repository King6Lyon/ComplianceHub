const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Une preuve doit appartenir à un utilisateur']
  },
  controlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Control',
    required: [true, 'Une preuve doit être associée à un contrôle']
  },
  frameworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Framework',
    required: [true, 'Une preuve doit être associée à un cadre de conformité']
  },
  status: {
    type: String,
    enum: ['not_implemented', 'implemented', 'partial', 'not_applicable'],
    default: 'not_implemented'
  },
  comment: {
    type: String,
    trim: true
  },
  files: [{
    filename: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour s'assurer qu'un utilisateur ne peut avoir qu'une seule preuve par contrôle
evidenceSchema.index({ userId: 1, controlId: 1 }, { unique: true });

// Middleware pour mettre à jour lastUpdated avant de sauvegarder
evidenceSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const Evidence = mongoose.model('Evidence', evidenceSchema);

module.exports = Evidence;