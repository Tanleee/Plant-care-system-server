const express = require('express');
const authController = require('./../controllers/authController');
const sensorDataController = require('./../controllers/sensorDataController');

const router = express.Router();

router
  .route('/')
  .get(sensorDataController.getAllSensorData)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    sensorDataController.createSensorData
  );

router.use(authController.protect);

router
  .route('/:id')
  .get(sensorDataController.getSensorData)
  .patch(
    authController.restrictTo('admin'),
    sensorDataController.updateSensorData
  )
  .delete(
    authController.restrictTo('admin'),
    sensorDataController.deleteSensorData
  );

module.exports = router;
