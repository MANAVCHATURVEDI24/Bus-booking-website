const Notification = require('../models/notification');
const NotificationPreferences = require('../models/notificationPreferences');

class NotificationController {
  // Get user notifications
  static async getUserNotifications(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20, status } = req.query;
      
      const query = { userId };
      if (status) query.status = status;
      
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get latest notifications since timestamp
  static async getLatestNotifications(req, res) {
    try {
      const { userId } = req.params;
      const { since } = req.query;
      
      const query = { 
        userId,
        createdAt: { $gt: new Date(since) }
      };
      
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();
      
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create notification
  static async createNotification(req, res) {
    try {
      const notificationData = req.body;
      
      const notification = new Notification({
        ...notificationData,
        createdAt: new Date()
      });
      
      await notification.save();
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { 
          status: 'read',
          readAt: new Date()
        },
        { new: true }
      );
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mark all notifications as read for user
  static async markAllAsRead(req, res) {
    try {
      const { userId } = req.params;
      
      await Notification.updateMany(
        { userId, status: { $ne: 'read' } },
        { 
          status: 'read',
          readAt: new Date()
        }
      );
      
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete notification
  static async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      
      const notification = await Notification.findByIdAndDelete(notificationId);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get user notification preferences
  static async getUserPreferences(req, res) {
    try {
      const { userId } = req.params;
      
      let preferences = await NotificationPreferences.findOne({ userId });
      
      if (!preferences) {
        // Create default preferences
        preferences = new NotificationPreferences({ userId });
        await preferences.save();
      }
      
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update user notification preferences
  static async updateUserPreferences(req, res) {
    try {
      const preferencesData = req.body;
      
      const preferences = await NotificationPreferences.findOneAndUpdate(
        { userId: preferencesData.userId },
        preferencesData,
        { new: true, upsert: true }
      );
      
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Send booking confirmation
  static async sendBookingConfirmation(req, res) {
    try {
      const bookingData = req.body;
      
      const notification = new Notification({
        userId: bookingData.userId,
        type: 'booking_confirmation',
        title: bookingData.title,
        message: bookingData.message,
        data: bookingData.data,
        channels: bookingData.channels || ['email', 'sms', 'push'],
        priority: 'high',
        status: 'sent',
        sentAt: new Date()
      });
      
      await notification.save();
      res.json({ message: 'Booking confirmation sent successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Send booking cancellation
  static async sendBookingCancellation(req, res) {
    try {
      const bookingData = req.body;
      
      const notification = new Notification({
        userId: bookingData.userId,
        type: 'booking_cancellation',
        title: bookingData.title,
        message: bookingData.message,
        data: bookingData.data,
        channels: bookingData.channels || ['email', 'sms', 'push'],
        priority: 'high',
        status: 'sent',
        sentAt: new Date()
      });
      
      await notification.save();
      res.json({ message: 'Booking cancellation sent successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Send booking reminder
  static async sendBookingReminder(req, res) {
    try {
      const bookingData = req.body;
      
      const notification = new Notification({
        userId: bookingData.userId,
        type: 'booking_reminder',
        title: bookingData.title,
        message: bookingData.message,
        data: bookingData.data,
        channels: bookingData.channels || ['email', 'push'],
        priority: 'medium',
        status: 'sent',
        sentAt: new Date()
      });
      
      await notification.save();
      res.json({ message: 'Booking reminder sent successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Send promotional offer
  static async sendPromotionalOffer(req, res) {
    try {
      const offerData = req.body;
      
      const notification = new Notification({
        userId: offerData.userId,
        type: 'promotional_offer',
        title: offerData.title,
        message: offerData.message,
        data: offerData.data,
        channels: offerData.channels || ['email', 'push'],
        priority: 'low',
        status: 'sent',
        sentAt: new Date()
      });
      
      await notification.save();
      res.json({ message: 'Promotional offer sent successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = NotificationController;