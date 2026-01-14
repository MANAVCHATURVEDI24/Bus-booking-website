const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  type: {
    type: String,
    enum: [
      'booking_confirmation',
      'booking_cancellation', 
      'booking_reminder',
      'payment_success',
      'payment_failed',
      'promotional_offer',
      'system_update',
      'trip_delay',
      'trip_cancellation'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  channels: [{
    type: String,
    enum: ['email', 'sms', 'push', 'in_app']
  }],
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed', 'read'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  scheduledAt: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ type: 1, scheduledAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema);