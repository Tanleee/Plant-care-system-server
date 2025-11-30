const express = require('express');
const authController = require('./../controllers/authController');
const sensorDataController = require('./../controllers/sensorDataController');
const sensorDataArchiveController = require('./../controllers/sensorDataArchieveController');

const router = express.Router();

// Route cho IoT devices - không cần login, chỉ cần API key
router.use(authController.validateApiKey);

router.post('/sensor-data', sensorDataController.createSensorData);

router.post(
  '/sensor-data-archive',
  sensorDataArchiveController.createSensorDataArchieve
);

module.exports = router;
