import { Component } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { NotificationType, NotificationChannel, NotificationPriority } from '../../model/notification.model';

@Component({
  selector: 'app-notification-test',
  template: `
    <div class="notification-test-panel">
      <h3>Notification System Test</h3>
      <div class="test-buttons">
        <button class="test-btn booking" (click)="testBookingConfirmation()">
          Test Booking Confirmation
        </button>
        <button class="test-btn reminder" (click)="testBookingReminder()">
          Test Booking Reminder
        </button>
        <button class="test-btn offer" (click)="testPromotionalOffer()">
          Test Promotional Offer
        </button>
        <button class="test-btn system" (click)="testSystemUpdate()">
          Test System Update
        </button>
        <button class="test-btn permission" (click)="requestNotificationPermission()">
          Request Browser Permission
        </button>
      </div>
      <div class="test-status" *ngIf="testMessage">
        {{ testMessage }}
      </div>
    </div>
  `,
  styles: [`
    .notification-test-panel {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px;
      border: 2px dashed #2196F3;
    }
    .test-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 15px 0;
    }
    .test-btn {
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      color: white;
      font-weight: bold;
      transition: transform 0.2s;
    }
    .test-btn:hover {
      transform: translateY(-2px);
    }
    .booking { background: #4CAF50; }
    .reminder { background: #ff9800; }
    .offer { background: #9c27b0; }
    .system { background: #607d8b; }
    .permission { background: #2196F3; }
    .test-status {
      margin-top: 15px;
      padding: 10px;
      background: #e8f5e8;
      border-radius: 4px;
      color: #2e7d32;
    }
  `]
})
export class NotificationTestComponent {
  testMessage: string = '';

  constructor(private notificationService: NotificationService) {}

  private getCurrentUserId(): string | null {
    const user = sessionStorage.getItem('Loggedinuser');
    return user ? JSON.parse(user)._id : null;
  }

  testBookingConfirmation(): void {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.testMessage = 'Please login to test notifications';
      return;
    }

    const bookingData = {
      userId: userId,
      title: 'Booking Confirmed! 🎫',
      message: 'Your bus ticket from Delhi to Mumbai has been confirmed for tomorrow at 10:00 AM.',
      data: {
        bookingId: 'TEST-' + Date.now(),
        route: 'Delhi to Mumbai',
        date: new Date().toISOString().split('T')[0],
        seats: ['A1', 'A2']
      },
      channels: [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH],
      priority: NotificationPriority.HIGH
    };

    this.notificationService.sendBookingConfirmation(bookingData).subscribe({
      next: () => {
        this.testMessage = 'Booking confirmation notification sent successfully!';
        setTimeout(() => this.testMessage = '', 3000);
      },
      error: (error) => {
        this.testMessage = 'Error sending notification: ' + error.message;
        setTimeout(() => this.testMessage = '', 5000);
      }
    });
  }

  testBookingReminder(): void {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.testMessage = 'Please login to test notifications';
      return;
    }

    const bookingData = {
      userId: userId,
      title: 'Trip Reminder ⏰',
      message: 'Your trip from Delhi to Mumbai is tomorrow at 10:00 AM. Don\'t forget to carry your ID!',
      data: {
        bookingId: 'TEST-REMINDER-' + Date.now(),
        route: 'Delhi to Mumbai',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      priority: NotificationPriority.MEDIUM
    };

    this.notificationService.sendBookingReminder(bookingData).subscribe({
      next: () => {
        this.testMessage = 'Booking reminder notification sent successfully!';
        setTimeout(() => this.testMessage = '', 3000);
      },
      error: (error) => {
        this.testMessage = 'Error sending notification: ' + error.message;
        setTimeout(() => this.testMessage = '', 5000);
      }
    });
  }

  testPromotionalOffer(): void {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.testMessage = 'Please login to test notifications';
      return;
    }

    const offerData = {
      userId: userId,
      title: 'Special Offer! 🎉',
      message: 'Get 20% off on your next booking! Use code SAVE20. Valid until next week.',
      data: {
        offerCode: 'SAVE20',
        discount: '20%',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        url: 'https://tedbus.com/offers'
      },
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      priority: NotificationPriority.LOW
    };

    this.notificationService.sendPromotionalOffer(userId, offerData).subscribe({
      next: () => {
        this.testMessage = 'Promotional offer notification sent successfully!';
        setTimeout(() => this.testMessage = '', 3000);
      },
      error: (error) => {
        this.testMessage = 'Error sending notification: ' + error.message;
        setTimeout(() => this.testMessage = '', 5000);
      }
    });
  }

  testSystemUpdate(): void {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.testMessage = 'Please login to test notifications';
      return;
    }

    const notification = {
      userId: userId,
      type: NotificationType.SYSTEM_UPDATE,
      title: 'System Update 🔧',
      message: 'We\'ve updated our app with new features and bug fixes. Enjoy the improved experience!',
      data: {
        version: '2.1.0',
        features: ['Better notifications', 'Improved UI', 'Bug fixes']
      },
      channels: [NotificationChannel.PUSH, NotificationChannel.IN_APP],
      priority: NotificationPriority.LOW
    };

    this.notificationService.sendNotification(notification).subscribe({
      next: () => {
        this.testMessage = 'System update notification sent successfully!';
        setTimeout(() => this.testMessage = '', 3000);
      },
      error: (error) => {
        this.testMessage = 'Error sending notification: ' + error.message;
        setTimeout(() => this.testMessage = '', 5000);
      }
    });
  }

  requestNotificationPermission(): void {
    this.notificationService.requestNotificationPermission().then(permission => {
      if (permission === 'granted') {
        this.testMessage = 'Browser notifications enabled successfully!';
      } else if (permission === 'denied') {
        this.testMessage = 'Browser notifications denied. Please enable in browser settings.';
      } else {
        this.testMessage = 'Browser notifications not supported or permission pending.';
      }
      setTimeout(() => this.testMessage = '', 5000);
    });
  }
}