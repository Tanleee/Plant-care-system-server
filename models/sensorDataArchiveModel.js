const mongoose = require('mongoose');

// long-term storage
const sensorDataArchiveSchema = new mongoose.Schema({
  date: {
    type: Date,
    require: [true, 'Please give a date for this record'],
    unique: [true, 'A day only have 1 record of data archieve']
  },
  average: {
    temperature: {
      type: Number,
      require: [true, 'Missing data']
    },
    humidity: {
      type: Number,
      require: [true, 'Missing data']
    },
    soilMoisture: {
      type: Number,
      require: [true, 'Missing data']
    },
    light: {
      type: Number,
      require: [true, 'Missing data']
    }
  },
  min: Object,
  max: Object,
  recordCount: Number
});

const SensorDataArchive = mongoose.model(
  'SensorDataArchive',
  sensorDataArchiveSchema
);

module.exports = SensorDataArchive;
