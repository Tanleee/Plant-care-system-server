const Notification = require('./../models/notificationModel');
const catchAsync = require('./../utils/catchAsync');

exports.getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort('-createdAt')
    .limit(50);

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      data: notifications
    }
  });
});

exports.markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    status: 'success'
  });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });

  res.status(200).json({
    status: 'success'
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  await Notification.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success'
  });
});
