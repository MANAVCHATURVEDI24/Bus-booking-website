import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../service/notification.service';
import { NotificationPreferences } from '../../model/notification.model';

@Component({
  selector: 'app-notification-preferences',
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['./notification-preferences.component.css']
})
export class NotificationPreferencesComponent implements OnInit {
  preferencesForm: FormGroup;
  isLoading: boolean = false;
  isSaving: boolean = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.preferencesForm = this.createForm();
  }

  ngOnInit(): void {
    this.userId = this.getCurrentUserId();
    if (this.userId) {
      this.loadPreferences();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: [true],
      sms: [true],
      push: [true],
      inApp: [true],
      bookingUpdates: [true],
      promotionalOffers: [false],
      systemUpdates: [true],
      reminders: [true]
    });
  }

  private getCurrentUserId(): string | null {
    const user = sessionStorage.getItem('Loggedinuser');
    return user ? JSON.parse(user)._id : null;
  }

  private loadPreferences(): void {
    if (!this.userId) return;
    
    this.isLoading = true;
    this.notificationService.getUserPreferences(this.userId).subscribe({
      next: (preferences) => {
        this.preferencesForm.patchValue(preferences);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading preferences:', error);
        this.isLoading = false;
      }
    });
  }

  onSave(): void {
    if (!this.userId || this.preferencesForm.invalid) return;

    this.isSaving = true;
    const preferences: NotificationPreferences = {
      userId: this.userId,
      ...this.preferencesForm.value
    };

    this.notificationService.updateUserPreferences(preferences).subscribe({
      next: (updatedPreferences) => {
        this.isSaving = false;
        this.showSuccessMessage();
      },
      error: (error) => {
        console.error('Error saving preferences:', error);
        this.isSaving = false;
        this.showErrorMessage();
      }
    });
  }

  onReset(): void {
    this.preferencesForm.reset();
    this.loadPreferences();
  }

  private showSuccessMessage(): void {
    // You can integrate with a toast service here
    alert('Notification preferences saved successfully!');
  }

  private showErrorMessage(): void {
    alert('Failed to save preferences. Please try again.');
  }
}