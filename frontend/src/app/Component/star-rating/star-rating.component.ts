import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() maxRating: number = 5;
  @Input() readonly: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [];
  hoveredRating: number = 0;

  ngOnInit() {
    this.stars = Array(this.maxRating).fill(0).map((x, i) => i + 1);
  }

  onStarClick(rating: number) {
    if (!this.readonly) {
      this.rating = rating;
      this.ratingChange.emit(this.rating);
    }
  }

  onStarHover(rating: number) {
    if (!this.readonly) {
      this.hoveredRating = rating;
    }
  }

  onMouseLeave() {
    if (!this.readonly) {
      this.hoveredRating = 0;
    }
  }

  getStarClass(star: number): string {
    const currentRating = this.hoveredRating || this.rating;
    const baseClass = `star ${this.size}`;
    
    if (star <= currentRating) {
      return `${baseClass} filled`;
    } else if (star - 0.5 <= currentRating) {
      return `${baseClass} half-filled`;
    } else {
      return `${baseClass} empty`;
    }
  }
}