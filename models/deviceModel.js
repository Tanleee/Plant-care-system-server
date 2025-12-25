const mongoose = require('mongoose');
const crypto = require('crypto');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Device must have a name'],
    trim: true
  },
  apiKey: {
    type: String,
    required: true,
    unique: true,
    select: false // Không trả về API key khi query
  },
  isOnline: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

// Generate API key trước khi save
deviceSchema.pre('save', function (next) {
  if (!this.apiKey) {
    this.apiKey = crypto.randomBytes(32).toString('hex');
  }
  next();
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
