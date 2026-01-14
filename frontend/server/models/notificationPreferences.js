const mongoose = require('mongoose');

const notificationPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    unique: true
  },
  email: {
    type: Boolean,
    default: true
  },
  sms: {
    type: Boolean,
    default: true
  },
  push: {
    type: Boolean,
    default: true
  },
  inApp: {
    type: Boolean,
    default: true
  },
  bookingUpdates: {
    type: Boolean,
    default: true
  },
  promotionalOffers: {
    type: Boolean,
    default: false
  },
  systemUpdates: {
    type: Boolean,
    default: true
  },
  reminders: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NotificationPreferences', notificationPreferencesSchema);