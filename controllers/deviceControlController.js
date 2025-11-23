const DeviceControl = require('./../models/deviceControlModel');
const factory = require('./handlerFactory');

exports.getDeviceControl = factory.getAll(DeviceControl);
exports.updateDeviceControl = factory.updateOne(DeviceControl);
