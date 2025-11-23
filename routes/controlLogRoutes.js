const express = require('express');
const controlLogController = require('./../controllers/controlLogController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(controlLogController.getAllControlLog)
  .post(
    authController.restrictTo('admin'),
    controlLogController.createControlLog
  );

router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .patch(controlLogController.updateControlLog)
  .delete(controlLogController.deleteControlLog);

module.exports = router;
