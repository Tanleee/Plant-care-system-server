const express = require('express');
const authController = require('./../controllers/authController');
const sensorDataArchiveController = require('./../controllers/sensorDataArchieveController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(sensorDataArchiveController.getAllSensorDataArchieve)
  .post(
    authController.restrictTo('admin'),
    sensorDataArchiveController.createSensorDataArchieve
  );

router
  .route('/:id')
  .get(sensorDataArchiveController.getSensorDataArchieve)
  .patch(
    authController.restrictTo('admin'),
    sensorDataArchiveController.updateSensorDataArchieve
  )
  .delete(
    authController.restrictTo('admin'),
    sensorDataArchiveController.deleteSensorDataArchieve
  );

module.exports = router;
