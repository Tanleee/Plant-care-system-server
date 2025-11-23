const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: String,
  location: {
    description: String,
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number]
  },
  isOnline: Boolean,
  lastSeen: Date,
  createdAt: Date,
  userId: {
    //The one who change
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
