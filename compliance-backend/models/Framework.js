const mongoose = require('mongoose');

const frameworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Un cadre de conformité doit avoir un nom'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  version: {
    type: String,
    trim: true
  },
  controls: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Control'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour supprimer les contrôles associés lors de la suppression d'un framework
frameworkSchema.pre('remove', async function(next) {
  await this.model('Control').deleteMany({ frameworkId: this._id });
  next();
});

const Framework = mongoose.model('Framework', frameworkSchema);

module.exports = Framework;