import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Review, ReviewSummary, CreateReviewRequest } from '../model/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:5001/api'; // Adjust to your backend URL
  
  // Mock data for demonstration - replace with real API calls
  private mockReviews: Review[] = [
    {
      _id: '1',
      customerId: 'user1',
      customerName: 'Rajesh Kumar',
      routeId: 'route1',
      busId: 'bus1',
      operatorName: 'RedBus Express',
      rating: 4,
      reviewText: 'Great journey! Bus was clean and on time. Staff was very helpful.',
      reviewDate: new Date('2024-01-15'),
      journeyDate: new Date('2024-01-10'),
      verified: true,
      helpful: 12,
      categories: {
        punctuality: 5,
        cleanliness: 4,
        comfort: 4,
        staff: 5,
        value: 4
      }
    },
    {
      _id: '2',
      customerId: 'user2',
      customerName: 'Priya Sharma',
      routeId: 'route1',
      busId: 'bus1',
      operatorName: 'RedBus Express',
      rating: 5,
      reviewText: 'Excellent service! Comfortable seats and smooth ride. Highly recommended.',
      reviewDate: new Date('2024-01-20'),
      journeyDate: new Date('2024-01-18'),
      verified: true,
      helpful: 8,
      categories: {
        punctuality: 5,
        cleanliness: 5,
        comfort: 5,
        staff: 4,
        value: 5
      }
    },
    {
      _id: '3',
      customerId: 'user3',
      customerName: 'Amit Patel',
      routeId: 'route1',
      busId: 'bus1',
      operatorName: 'RedBus Express',
      rating: 3,
      reviewText: 'Average experience. Bus was delayed by 30 minutes but overall okay.',
      reviewDate: new Date('2024-01-25'),
      journeyDate: new Date('2024-01-22'),
      verified: true,
      helpful: 5,
      categories: {
        punctuality: 2,
        cleanliness: 4,
        comfort: 3,
        staff: 3,
        value: 3
      }
    }
  ];

  constructor(private http: HttpClient) {}

  // Get reviews for a specific route
  getRouteReviews(routeId: string): Observable<Review[]> {
    // Mock implementation - replace with actual API call
    const routeReviews = this.mockReviews.filter(review => review.routeId === routeId);
    return of(routeReviews);
    
    // Real API call would be:
    // return this.http.get<Review[]>(`${this.baseUrl}/reviews/route/${routeId}`);
  }

  // Get review summary for a route
  getReviewSummary(routeId: string): Observable<ReviewSummary> {
    const routeReviews = this.mockReviews.filter(review => review.routeId === routeId);
    
    if (routeReviews.length === 0) {
      return of({
        routeId,
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        categoryAverages: {
          punctuality: 0,
          cleanliness: 0,
          comfort: 0,
          staff: 0,
          value: 0
        }
      });
    }

    const totalReviews = routeReviews.length;
    const averageRating = routeReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    routeReviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    const categoryAverages = {
      punctuality: routeReviews.reduce((sum, review) => sum + review.categories.punctuality, 0) / totalReviews,
      cleanliness: routeReviews.reduce((sum, review) => sum + review.categories.cleanliness, 0) / totalReviews,
      comfort: routeReviews.reduce((sum, review) => sum + review.categories.comfort, 0) / totalReviews,
      staff: routeReviews.reduce((sum, review) => sum + review.categories.staff, 0) / totalReviews,
      value: routeReviews.reduce((sum, review) => sum + review.categories.value, 0) / totalReviews
    };

    return of({
      routeId,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      categoryAverages
    });
  }

  // Create a new review
  createReview(reviewData: CreateReviewRequest): Observable<Review> {
    const customer = JSON.parse(sessionStorage.getItem('Loggedinuser') || '{}');
    
    const newReview: Review = {
      _id: Date.now().toString(),
      customerId: customer.sub || 'anonymous',
      customerName: customer.name || 'Anonymous User',
      routeId: reviewData.routeId,
      busId: reviewData.busId,
      operatorName: 'RedBus Express', // This should come from bus data
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
      reviewDate: new Date(),
      journeyDate: reviewData.journeyDate,
      verified: true,
      helpful: 0,
      categories: reviewData.categories
    };

    // Add to mock data
    this.mockReviews.push(newReview);
    
    return of(newReview);
    
    // Real API call would be:
    // return this.http.post<Review>(`${this.baseUrl}/reviews`, reviewData);
  }

  // Mark review as helpful
  markHelpful(reviewId: string): Observable<boolean> {
    const review = this.mockReviews.find(r => r._id === reviewId);
    if (review) {
      review.helpful++;
      return of(true);
    }
    return of(false);
    
    // Real API call would be:
    // return this.http.post<boolean>(`${this.baseUrl}/reviews/${reviewId}/helpful`, {});
  }

  // Check if user can review (has completed journey)
  canUserReview(routeId: string, busId: string, bookingData?: any): Observable<boolean> {
    const customer = JSON.parse(sessionStorage.getItem('Loggedinuser') || '{}');
    
    // User must be logged in
    if (!customer.sub && !customer._id) {
      return of(false);
    }
    
    // If booking data is provided, check if the trip is completed
    if (bookingData) {
      const isCompleted = this.isBookingCompleted(bookingData);
      return of(isCompleted);
    }
    
    // Fallback: check if user has any completed bookings for this route/bus
    // This would typically be an API call to check user's booking history
    return of(true); // Allow review for now if logged in
    
    // Real API call would be:
    // return this.http.get<boolean>(`${this.baseUrl}/reviews/can-review/${routeId}/${busId}`);
  }

  // Helper method to check if a booking is completed
  private isBookingCompleted(booking: any): boolean {
    if (!booking?.departureDetails?.date) {
      return false;
    }
    
    try {
      const tripDate = new Date(booking.departureDetails.date);
      const today = new Date();
      tripDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      // Trip is completed if the departure date is in the past
      return tripDate < today;
    } catch (error) {
      console.error('Error checking booking completion:', error);
      return false;
    }
  }
}