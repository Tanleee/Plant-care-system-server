const mongoose = require('mongoose');

// sensor data (real time)
const sensorDataSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    min: -273,
    max: 100 // No plant can survive at this temperature
  },
  humidity: {
    type: Number,
    min: 0,
    max: 100
  },
  soilMoisture: {
    type: Number,
    min: 0,
    max: 100
  },
  light: {
    type: Number,
    min: 0
  },
  timestamp: {
    type: Date,
    default: Date.now()
  }
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);
module.exports = SensorData;
