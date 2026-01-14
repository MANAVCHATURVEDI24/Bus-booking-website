import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../service/review.service';
import { CreateReviewRequest, ReviewCategories } from '../../model/review.model';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  @Input() routeId: string = '';
  @Input() busId: string = '';
  @Input() operatorName: string = '';
  @Input() bookingData: any = null; // Add booking data input
  @Output() reviewSubmitted = new EventEmitter<void>();
  @Output() formClosed = new EventEmitter<void>();

  reviewForm: FormGroup;
  submitting: boolean = false;
  canReview: boolean = false;
  checkingEligibility: boolean = true;

  maxDate: string = new Date().toISOString().split('T')[0];

  categories = [
    { key: 'punctuality', label: 'Punctuality', icon: 'fa-clock' },
    { key: 'cleanliness', label: 'Cleanliness', icon: 'fa-broom' },
    { key: 'comfort', label: 'Comfort', icon: 'fa-couch' },
    { key: 'staff', label: 'Staff Behavior', icon: 'fa-user-tie' },
    { key: 'value', label: 'Value for Money', icon: 'fa-dollar-sign' }
  ];

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      journeyDate: ['', Validators.required],
      categories: this.fb.group({
        punctuality: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
        cleanliness: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
        comfort: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
        staff: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
        value: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
      })
    });
  }

  ngOnInit() {
    this.checkReviewEligibility();
  }

  checkReviewEligibility() {
    this.checkingEligibility = true;
    this.reviewService.canUserReview(this.routeId, this.busId, this.bookingData).subscribe({
      next: (canReview) => {
        this.canReview = canReview;
        this.checkingEligibility = false;
      },
      error: (error) => {
        console.error('Error checking review eligibility:', error);
        this.canReview = false;
        this.checkingEligibility = false;
      }
    });
  }

  onRatingChange(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  onCategoryRatingChange(category: string, rating: number) {
    const categoriesControl = this.reviewForm.get('categories');
    if (categoriesControl) {
      categoriesControl.patchValue({ [category]: rating });
    }
  }

  onSubmit() {
    if (this.reviewForm.valid && !this.submitting) {
      this.submitting = true;
      
      const formValue = this.reviewForm.value;
      const reviewData: CreateReviewRequest = {
        routeId: this.routeId,
        busId: this.busId,
        rating: formValue.rating,
        reviewText: formValue.reviewText,
        journeyDate: new Date(formValue.journeyDate),
        categories: formValue.categories as ReviewCategories
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: (review) => {
          console.log('Review submitted successfully:', review);
          this.reviewSubmitted.emit();
          this.resetForm();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm() {
    this.reviewForm.reset();
    this.reviewForm.patchValue({
      rating: 0,
      categories: {
        punctuality: 0,
        cleanliness: 0,
        comfort: 0,
        staff: 0,
        value: 0
      }
    });
  }

  closeForm() {
    this.formClosed.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.reviewForm.controls).forEach(key => {
      const control = this.reviewForm.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.reviewForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
      if (field.errors['min']) return `Please provide a rating`;
    }
    return '';
  }

  getCategoryError(category: string): string {
    const field = this.reviewForm.get(`categories.${category}`);
    if (field?.errors && field.touched) {
      if (field.errors['required'] || field.errors['min']) {
        return `Please rate ${category}`;
      }
    }
    return '';
  }
}