const express = require('express');
const authController = require('./../controllers/authController');
const alarmController = require('./../controllers/alarmController');
// const sensorDataController = require('./../controllers/sensorDataController');
// const sensorDataArchiveController = require('./../controllers/sensorDataArchieveController');

const router = express.Router();

// Route cho IoT devices - không cần login, chỉ cần API key
router.use(authController.validateApiKey);

router
  .route('/alarm-data')
  .get(alarmController.getAllAlarm)
  .post(alarmController.createAlarm);

router
  .route('/alarm-data/:id')
  .get(alarmController.getAlarm)
  .patch(alarmController.updateAlarm)
  .delete(alarmController.deleteAlarm);

module.exports = router;
