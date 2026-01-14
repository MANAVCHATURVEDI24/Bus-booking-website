import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css']
})
export class ReviewModalComponent implements OnInit {
  showReviewForm: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      routeId: string;
      busId: string;
      operatorName: string;
    }
  ) {}

  ngOnInit() {}

  openReviewForm() {
    this.showReviewForm = true;
  }

  closeReviewForm() {
    this.showReviewForm = false;
  }

  onReviewSubmitted() {
    this.showReviewForm = false;
    // Refresh the reviews display
    window.location.reload(); // Simple refresh - in production, use proper state management
  }

  closeModal() {
    this.dialogRef.close();
  }
}