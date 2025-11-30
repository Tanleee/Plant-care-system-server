const express = require('express');
const notificationController = require('./../controllers/notificationController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(notificationController.getNotifications);
router.route('/read-all').patch(notificationController.markAllAsRead);

router.route('/:id').delete(notificationController.deleteNotification);
router.route('/:id/read').patch(notificationController.markAsRead);

module.exports = router;
