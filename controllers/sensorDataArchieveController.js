const SensorDataArchieve = require('./../models/sensorDataArchiveModel');
const factory = require('./handlerFactory');

exports.getAllSensorDataArchieve = factory.getAll(SensorDataArchieve);
exports.getSensorDataArchieve = factory.getOne(SensorDataArchieve);
exports.createSensorDataArchieve = factory.createOne(SensorDataArchieve);
exports.updateSensorDataArchieve = factory.updateOne(SensorDataArchieve);
exports.deleteSensorDataArchieve = factory.deleteOne(SensorDataArchieve);
