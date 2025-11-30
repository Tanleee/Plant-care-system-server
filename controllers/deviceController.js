const Device = require('./../models/deviceModel');
const factory = require('./handlerFactory');
const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllDevice = factory.getAll(Device);
exports.getDevice = factory.getOne(Device);
exports.createDevice = factory.createOne(Device);
exports.updateDevice = factory.updateOne(Device);
exports.deleteDevice = factory.deleteOne(Device);

exports.regenerateApiKey = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id).select('+apiKey');

  if (!device) {
    return next(new AppError('No device found with that ID', 404));
  }

  // Generate API key mới
  device.apiKey = crypto.randomBytes(32).toString('hex');
  await device.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      data: device
    }
  });
});

exports.toggleDeviceStatus = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);

  if (!device) {
    return next(new AppError('No device found with that ID', 404));
  }

  device.isActive = !device.isActive;
  await device.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      data: device
    }
  });
});
