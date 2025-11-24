const DeviceControl = require('./../models/deviceControlModel');
const factory = require('./handlerFactory');

exports.getDevice = factory.getOne(DeviceControl);
