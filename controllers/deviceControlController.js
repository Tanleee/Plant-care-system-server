const DeviceControl = require('./../models/deviceControlModel');
const factory = require('./handlerFactory');

exports.getAllDeviceControl = factory.getAll(DeviceControl);
exports.getDeviceControl = factory.getOne(DeviceControl);
exports.updateDeviceControl = factory.updateOne(DeviceControl);
exports.createDeviceControl = factory.createOne(DeviceControl);
exports.deleteDeviceControl = factory.deleteOne(DeviceControl);
