const DeviceControl = require('./../models/deviceControlModel');
const factory = require('./handlerFactory');

exports.getAllDevice = factory.getAll(DeviceControl);
exports.getDevice = factory.getOne(DeviceControl);
exports.createDevice = factory.createOne(DeviceControl);
exports.updateDevice = factory.updateOne(DeviceControl);
exports.deleteDevice = factory.deleteOne(DeviceControl);
