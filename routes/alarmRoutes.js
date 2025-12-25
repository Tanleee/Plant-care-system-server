const express = require('express');
const alarmController = require('./../controllers/alarmController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(alarmController.getAllAlarm)
  .post(
    authController.restrictTo('admin', 'owner'),
    alarmController.createAlarm
  );

router
  .route('/:id')
  .get(alarmController.getAlarm)
  .patch(
    authController.restrictTo('admin', 'owner'),
    alarmController.updateAlarm
  )
  .delete(
    authController.restrictTo('admin', 'owner'),
    alarmController.deleteAlarm
  );

module.exports = router;
