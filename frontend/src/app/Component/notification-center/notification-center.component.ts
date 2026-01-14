import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../service/notification.service';
import { Notification, NotificationType, NotificationStatus } from '../../model/notification.model';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isOpen: boolean = false;
  isLoading: boolean = false;
  
  private subscriptions: Subscription[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscribeToNotifications();
    this.requestNotificationPermission();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private subscribeToNotifications(): void {
    // Subscribe to notifications
    const notificationsSub = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
        this.isLoading = false;
      }
    );

    // Subscribe to unread count
    const unreadSub = this.notificationService.unreadCount$.subscribe(
      count => this.unreadCount = count
    );

    // Subscribe to real-time notifications
    const realTimeSub = this.notificationService.realTimeNotification$.subscribe(
      notification => {
        this.showToast(notification);
      }
    );

    this.subscriptions.push(notificationsSub, unreadSub, realTimeSub);
  }

  private requestNotificationPermission(): void {
    if (this.notificationService.isNotificationSupported()) {
      this.notificationService.requestNotificationPermission();
    }
  }

  toggleNotificationCenter(): void {
    this.isOpen = !this.isOpen;
  }

  markAsRead(notification: Notification): void {
    if (!notification.readAt && notification.id) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.readAt = new Date();
          this.updateUnreadCount();
        },
        error: (error) => console.error('Error marking notification as read:', error)
      });
    }
  }

  markAllAsRead(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.notificationService.markAllAsRead(userId).subscribe({
        next: () => {
          this.notifications.forEach(n => n.readAt = new Date());
          this.unreadCount = 0;
        },
        error: (error) => console.error('Error marking all as read:', error)
      });
    }
  }
  deleteNotification(notification: Notification): void {
    if (notification.id) {
      this.notificationService.deleteNotification(notification.id).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
          this.updateUnreadCount();
        },
        error: (error) => console.error('Error deleting notification:', error)
      });
    }
  }

  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.readAt).length;
  }

  private getCurrentUserId(): string | null {
    const user = sessionStorage.getItem('Loggedinuser');
    return user ? JSON.parse(user)._id : null;
  }

  private showToast(notification: Notification): void {
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerHTML = `
      <div class="toast-header">
        <strong>${notification.title}</strong>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="toast-body">${notification.message}</div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.BOOKING_CONFIRMATION:
        return 'check_circle';
      case NotificationType.BOOKING_CANCELLATION:
        return 'cancel';
      case NotificationType.BOOKING_REMINDER:
        return 'schedule';
      case NotificationType.PAYMENT_SUCCESS:
        return 'payment';
      case NotificationType.PAYMENT_FAILED:
        return 'error';
      case NotificationType.PROMOTIONAL_OFFER:
        return 'local_offer';
      case NotificationType.SYSTEM_UPDATE:
        return 'system_update';
      case NotificationType.TRIP_DELAY:
        return 'access_time';
      case NotificationType.TRIP_CANCELLATION:
        return 'event_busy';
      default:
        return 'notifications';
    }
  }

  getNotificationClass(notification: Notification): string {
    let classes = 'notification-item';
    if (!notification.readAt) {
      classes += ' unread';
    }
    classes += ` ${notification.type}`;
    return classes;
  }

  formatTime(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

  onNotificationClick(notification: Notification): void {
    this.markAsRead(notification);
    
    // Handle notification action based on type
    switch (notification.type) {
      case NotificationType.BOOKING_CONFIRMATION:
      case NotificationType.BOOKING_CANCELLATION:
        // Navigate to My Trips
        window.location.href = '/profile';
        break;
      case NotificationType.PROMOTIONAL_OFFER:
        // Navigate to offers page or show offer details
        if (notification.data?.url) {
          window.open(notification.data.url, '_blank');
        }
        break;
      default:
        // Default action - just mark as read
        break;
    }
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id || index.toString();
  }
}