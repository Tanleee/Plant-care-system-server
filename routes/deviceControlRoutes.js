const express = require('express');
const deviceControlController = require('./../controllers/deviceControlController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(deviceControlController.getAllDeviceControl)
  .post(
    authController.restrictTo('admin'),
    deviceControlController.createDeviceControl
  );

router
  .route('/:id')
  .get(deviceControlController.getDeviceControl)
  .patch(
    authController.restrictTo('admin', 'owner'),
    deviceControlController.updateDeviceControl
  )
  .delete(
    authController.restrictTo('admin'),
    deviceControlController.deleteDeviceControl
  );

module.exports = router;
