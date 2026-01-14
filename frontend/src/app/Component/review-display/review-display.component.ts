import { Component, Input, OnInit } from '@angular/core';
import { Review, ReviewSummary } from '../../model/review.model';
import { ReviewService } from '../../service/review.service';

@Component({
  selector: 'app-review-display',
  templateUrl: './review-display.component.html',
  styleUrls: ['./review-display.component.css']
})
export class ReviewDisplayComponent implements OnInit {
  @Input() routeId: string = '';
  @Input() showSummary: boolean = true;
  @Input() maxReviews: number = 5;

  reviews: Review[] = [];
  reviewSummary: ReviewSummary | null = null;
  loading: boolean = true;
  showAllReviews: boolean = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    if (this.routeId) {
      this.loadReviews();
      if (this.showSummary) {
        this.loadReviewSummary();
      }
    }
  }

  loadReviews() {
    this.loading = true;
    this.reviewService.getRouteReviews(this.routeId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.sort((a, b) => 
          new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.loading = false;
      }
    });
  }

  loadReviewSummary() {
    this.reviewService.getReviewSummary(this.routeId).subscribe({
      next: (summary) => {
        this.reviewSummary = summary;
      },
      error: (error) => {
        console.error('Error loading review summary:', error);
      }
    });
  }

  getDisplayedReviews(): Review[] {
    if (this.showAllReviews) {
      return this.reviews;
    }
    return this.reviews.slice(0, this.maxReviews);
  }

  toggleShowAllReviews() {
    this.showAllReviews = !this.showAllReviews;
  }

  markHelpful(reviewId: string) {
    this.reviewService.markHelpful(reviewId).subscribe({
      next: (success) => {
        if (success) {
          const review = this.reviews.find(r => r._id === reviewId);
          if (review) {
            review.helpful++;
          }
        }
      },
      error: (error) => {
        console.error('Error marking review as helpful:', error);
      }
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInMs = now.getTime() - reviewDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }

  getRatingDistributionPercentage(count: number): number {
    if (!this.reviewSummary || this.reviewSummary.totalReviews === 0) {
      return 0;
    }
    return (count / this.reviewSummary.totalReviews) * 100;
  }

  getRatingCount(rating: number): number {
    if (!this.reviewSummary) return 0;
    const distribution = this.reviewSummary.ratingDistribution;
    switch (rating) {
      case 5: return distribution[5];
      case 4: return distribution[4];
      case 3: return distribution[3];
      case 2: return distribution[2];
      case 1: return distribution[1];
      default: return 0;
    }
  }
}