const express = require('express');
const deviceController = require('./../controllers/deviceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(deviceController.getAllDevice)
  .post(authController.restrictTo('admin'), deviceController.createDevice);

router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(deviceController.getDevice)
  .patch(deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

module.exports = router;
