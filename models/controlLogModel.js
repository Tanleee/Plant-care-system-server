const mongoose = require('mongoose');

// Only save status of a device at a time.
const controlLogSchema = new mongoose.Schema(
  {
    userId: ObjectId,
    timestamp: {
      type: Date,
      default: Date.now()
    },
    device: {
      type: String,
      require: [true, 'Please provide name of device'],
      enum: ['pumper', 'light', 'fan']
    },
    status: {
      type: Boolean,
      require: [true, 'Please provide status of device']
    },
    mode: {
      type: String,
      trim: true,
      enum: ['auto', 'manual', 'schedule']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

controlLogSchema.virtual('action').get(function () {
  return this.device + '_' + this.status ? 'on' : 'off';
});

const ControlLog = mongoose.model('ControlLog', controlLogSchema);

module.exports = ControlLog;
