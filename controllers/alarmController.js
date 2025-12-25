const Alarm = require('./../models/alarmModel');
const factory = require('./handlerFactory');

exports.getAllAlarm = factory.getAll(Alarm);
exports.getAlarm = factory.getOne(Alarm);
exports.createAlarm = factory.createOne(Alarm);
exports.updateAlarm = factory.updateOne(Alarm);
exports.deleteAlarm = factory.deleteOne(Alarm);
