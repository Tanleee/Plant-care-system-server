const express = require('express');
const deviceController = require('./../controllers/deviceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(deviceController.getAllDevice)
  .post(authController.restrictTo('admin'), deviceController.createDevice);

router
  .route('/:id')
  .get(deviceController.getDevice)
  .patch(authController.restrictTo('admin'), deviceController.updateDevice)
  .delete(authController.restrictTo('admin'), deviceController.deleteDevice);

router.use(authController.restrictTo('admin'));

router.patch('/:id/regenerate-key', deviceController.regenerateApiKey);
router.patch('/:id/toggle-status', deviceController.toggleDeviceStatus);

module.exports = router;
