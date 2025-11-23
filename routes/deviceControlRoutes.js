const express = require('express');
const deviceControlController = require('./../controllers/deviceControlController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(deviceControlController.getDeviceControl)
  .patch(
    authController.restrictTo('admin', 'user'),
    deviceControlController.updateDeviceControl
  );

module.exports = router;
