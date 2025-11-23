const ControlLogModel = require('./../models/controlLogModel');
const factory = require('./handlerFactory');

exports.getAllControlLog = factory.getAll(ControlLogModel);
exports.getControlLog = factory.getOne(ControlLogModel);
exports.createControlLog = factory.createOne(ControlLogModel);
exports.updateControlLog = factory.updateOne(ControlLogModel);
exports.deleteControlLog = factory.deleteOne(ControlLogModel);
