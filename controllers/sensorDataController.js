const SensorData = require('./../models/sensorDataModel');
const factory = require('./handlerFactory');

exports.getAllSensorData = factory.getAll(SensorData);
exports.getSensorData = factory.getOne(SensorData);
exports.createSensorData = factory.createOne(SensorData);
exports.updateSensorData = factory.updateOne(SensorData);
exports.deleteSensorData = factory.deleteOne(SensorData);
