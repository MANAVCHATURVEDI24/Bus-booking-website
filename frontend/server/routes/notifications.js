const express = require('express');
const router = express.Router();
const NotificationController = require('../controller/notification');

// Get user notifications
router.get('/user/:userId', NotificationController.getUserNotifications);

// Get latest notifications since timestamp
router.get('/user/:userId/latest', NotificationController.getLatestNotifications);

// Create notification
router.post('/', NotificationController.createNotification);

// Mark notification as read
router.patch('/:notificationId/read', NotificationController.markAsRead);

// Mark all notifications as read for user
router.patch('/user/:userId/read-all', NotificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', NotificationController.deleteNotification);

// Get user notification preferences
router.get('/preferences/:userId', NotificationController.getUserPreferences);

// Update user notification preferences
router.put('/preferences', NotificationController.updateUserPreferences);

// Send specific notification types
router.post('/send/booking-confirmation', NotificationController.sendBookingConfirmation);
router.post('/send/booking-cancellation', NotificationController.sendBookingCancellation);
router.post('/send/booking-reminder', NotificationController.sendBookingReminder);
router.post('/send/promotional-offer', NotificationController.sendPromotionalOffer);

module.exports = router;