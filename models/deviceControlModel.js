const mongoose = require('mongoose');

// Current status of device (user control , can not use controlLogModel cause it just save a state of a device at a time)
const deviceControlSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: process.env.DEVICE_CURRENT_STATUS_ID || 'DEVICE_CURRENT_STATUS'
  },
  pump: {
    type: Boolean,
    require: [true, 'Not enough data']
  },
  fan: {
    type: Boolean,
    require: [true, 'Not enough data']
  },
  light: {
    type: Boolean,
    require: [true, 'Not enough data']
  },
  updatedAt: Date,
  mode: {
    type: String,
    trim: true,
    enum: ['auto', 'manual', 'schedule']
  }
});

const DeviceControl = mongoose.model('DeviceControl', deviceControlSchema);

module.exports = DeviceControl;
