export interface Notification {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  channels: NotificationChannel[];
  status: NotificationStatus;
  priority: NotificationPriority;
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export enum NotificationType {
  BOOKING_CONFIRMATION = 'booking_confirmation',
  BOOKING_CANCELLATION = 'booking_cancellation',
  BOOKING_REMINDER = 'booking_reminder',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PROMOTIONAL_OFFER = 'promotional_offer',
  SYSTEM_UPDATE = 'system_update',
  TRIP_DELAY = 'trip_delay',
  TRIP_CANCELLATION = 'trip_cancellation'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  READ = 'read'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  bookingUpdates: boolean;
  promotionalOffers: boolean;
  systemUpdates: boolean;
  reminders: boolean;
}

export interface EmailNotification {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachments?: EmailAttachment[];
}

export interface SMSNotification {
  to: string;
  message: string;
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string;
  title: string;
  content: string;
  variables: string[];
}