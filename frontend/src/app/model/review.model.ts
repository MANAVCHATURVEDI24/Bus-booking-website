export interface Review {
  _id?: string;
  customerId: string;
  customerName: string;
  routeId: string;
  busId: string;
  operatorName: string;
  rating: number; // 1-5 stars
  reviewText: string;
  reviewDate: Date;
  journeyDate: Date;
  verified: boolean; // Only users who completed journey can review
  helpful: number; // Number of users who found this helpful
  categories: ReviewCategories;
}

export interface ReviewCategories {
  punctuality: number; // 1-5
  cleanliness: number; // 1-5
  comfort: number; // 1-5
  staff: number; // 1-5
  value: number; // 1-5
}

export interface ReviewSummary {
  routeId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categoryAverages: ReviewCategories;
}

export interface CreateReviewRequest {
  routeId: string;
  busId: string;
  rating: number;
  reviewText: string;
  journeyDate: Date;
  categories: ReviewCategories;
}