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

router
  .route('/:id')
  .get(controlLogController.getControlLog)
  .patch(
    router.use(authController.restrictTo('admin')),
    controlLogController.updateControlLog
  )
  .delete(
    router.use(authController.restrictTo('admin')),
    controlLogController.deleteControlLog
  );

module.exports = router;
