const express = require('express');
const authController = require('./../controllers/authController');
const sensorDataController = require('./../controllers/sensorDataController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(sensorDataController.getAllSensorData)
  .post(
    authController.restrictTo('admin'),
    sensorDataController.createSensorData
  );

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
