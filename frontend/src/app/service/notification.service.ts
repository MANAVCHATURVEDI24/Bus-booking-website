import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { 
  Notification, 
  NotificationType, 
  NotificationChannel, 
  NotificationPreferences,
  EmailNotification,
  SMSNotification,
  PushNotification,
  NotificationStatus,
  NotificationPriority
} from '../model/notification.model';
import { url } from '../config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = url + 'api/notifications/';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private realTimeSubject = new Subject<Notification>();

  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();
  public realTimeNotification$ = this.realTimeSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeNotifications();
  }

  // Initialize notifications and setup real-time connection
  private initializeNotifications(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.loadUserNotifications(userId);
      this.setupRealTimeConnection();
    }
  }

  // Get current user ID from session storage
  private getCurrentUserId(): string | null {
    const user = sessionStorage.getItem('Loggedinuser');
    return user ? JSON.parse(user)._id : null;
  }

  // Load user notifications
  loadUserNotifications(userId: string): void {
    this.getUserNotifications(userId).subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      },
      error: (error) => console.error('Error loading notifications:', error)
    });
  }

  // Setup real-time connection (WebSocket simulation)
  private setupRealTimeConnection(): void {
    // Simulate real-time notifications every 30 seconds
    setInterval(() => {
      this.checkForNewNotifications();
    }, 30000);
  }
  // Check for new notifications
  private checkForNewNotifications(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.getLatestNotifications(userId).subscribe({
        next: (newNotifications) => {
          if (newNotifications.length > 0) {
            const currentNotifications = this.notificationsSubject.value;
            const updatedNotifications = [...newNotifications, ...currentNotifications];
            this.notificationsSubject.next(updatedNotifications);
            this.updateUnreadCount(updatedNotifications);
            
            // Emit real-time notification
            newNotifications.forEach(notification => {
              this.realTimeSubject.next(notification);
              this.showBrowserNotification(notification);
            });
          }
        },
        error: (error) => console.error('Error checking new notifications:', error)
      });
    }
  }

  // Update unread count
  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.readAt).length;
    this.unreadCountSubject.next(unreadCount);
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new window.Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icons/notification-icon.png',
        badge: '/assets/icons/badge-icon.png'
      });

      browserNotification.onclick = () => {
        window.focus();
        this.markAsRead(notification.id!);
      };
    }
  }

  // API Methods
  getUserNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}user/${userId}`);
  }

  getLatestNotifications(userId: string): Observable<Notification[]> {
    const lastCheck = localStorage.getItem('lastNotificationCheck') || new Date().toISOString();
    return this.http.get<Notification[]>(`${this.apiUrl}user/${userId}/latest?since=${lastCheck}`);
  }

  sendNotification(notification: Partial<Notification>): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}${notificationId}/read`, {});
  }

  markAllAsRead(userId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}user/${userId}/read-all`, {});
  }

  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${notificationId}`);
  }
  // Notification Preferences
  getUserPreferences(userId: string): Observable<NotificationPreferences> {
    return this.http.get<NotificationPreferences>(`${this.apiUrl}preferences/${userId}`);
  }

  updateUserPreferences(preferences: NotificationPreferences): Observable<NotificationPreferences> {
    return this.http.put<NotificationPreferences>(`${this.apiUrl}preferences`, preferences);
  }

  // Specific Notification Types
  sendBookingConfirmation(bookingData: any): Observable<void> {
    const notification = {
      userId: bookingData.customerId,
      type: NotificationType.BOOKING_CONFIRMATION,
      title: 'Booking Confirmed!',
      message: `Your bus ticket for ${bookingData.departureDetails.city} to ${bookingData.arrivalDetails.city} has been confirmed.`,
      data: bookingData,
      channels: [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH],
      priority: NotificationPriority.HIGH
    };
    return this.http.post<void>(`${this.apiUrl}send/booking-confirmation`, notification);
  }

  sendBookingCancellation(bookingData: any): Observable<void> {
    const notification = {
      userId: bookingData.customerId,
      type: NotificationType.BOOKING_CANCELLATION,
      title: 'Booking Cancelled',
      message: `Your booking for ${bookingData.departureDetails.city} to ${bookingData.arrivalDetails.city} has been cancelled.`,
      data: bookingData,
      channels: [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH],
      priority: NotificationPriority.HIGH
    };
    return this.http.post<void>(`${this.apiUrl}send/booking-cancellation`, notification);
  }

  sendBookingReminder(bookingData: any): Observable<void> {
    const notification = {
      userId: bookingData.customerId,
      type: NotificationType.BOOKING_REMINDER,
      title: 'Trip Reminder',
      message: `Your trip from ${bookingData.departureDetails.city} to ${bookingData.arrivalDetails.city} is tomorrow at ${bookingData.departureDetails.time}:00.`,
      data: bookingData,
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      priority: NotificationPriority.MEDIUM
    };
    return this.http.post<void>(`${this.apiUrl}send/booking-reminder`, notification);
  }

  sendPromotionalOffer(userId: string, offerData: any): Observable<void> {
    const notification = {
      userId: userId,
      type: NotificationType.PROMOTIONAL_OFFER,
      title: offerData.title,
      message: offerData.message,
      data: offerData,
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      priority: NotificationPriority.LOW
    };
    return this.http.post<void>(`${this.apiUrl}send/promotional-offer`, notification);
  }

  // Request browser notification permission
  requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return Notification.requestPermission();
    }
    return Promise.resolve('denied');
  }

  // Check if notifications are supported
  isNotificationSupported(): boolean {
    return 'Notification' in window;
  }
}