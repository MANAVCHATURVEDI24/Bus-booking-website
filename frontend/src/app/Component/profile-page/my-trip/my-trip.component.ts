import { Component, Input, OnInit } from '@angular/core';
import { BusService } from '../../../service/bus.service';

@Component({
  selector: 'app-my-trip',
  templateUrl: './my-trip.component.html',
  styleUrl: './my-trip.component.css'
})
export class MyTripComponent implements OnInit {
  @Input() booking:any
  showReviewForm: boolean = false;
  selectedBooking: any = null;
  userBookings: any[] = [];
  upcomingTrips: any[] = [];
  completedTrips: any[] = [];
  currentTab: 'all' | 'upcoming' | 'completed' = 'all';
  isLoading: boolean = true;
  showTicketModal: boolean = false;
  selectedTicket: any = null;
  private isLoadingBookings: boolean = false; // Prevent multiple API calls

  constructor(private busService: BusService) {}

  imageArr = [
    {
      _id: { $oid: "6049b8a97501a24470b9a526" },
      images: "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/1087/GW/DL/6fNUIf.jpeg"
    },
    // Other image objects...
    {
      _id: {
        $oid: "6049b8a97501a24470b9a527",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/1087/GW/DL/6fNUIf.jpeg",
    },
    {
      _id: {
        $oid: "6049b8a97501a24470b9a528",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/9365/1087/GW/DL/hDsqel.jpeg",
    },
    {
      _id: {
        $oid: "6049b8a97501a24470b9a529",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/10/411/ST/L/penRe7.jpeg",
    },
    {
      _id: {
        $oid: "6049b8a97501a24470b9a52a",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/19449/814/FR/DL/PuizKJ.jpeg",
    },
    {
      _id: {
        $oid: "6049b8a97501a24470b9a52b",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/450/OT/L/lejRej.jpeg",
    },
    {
      _id: {
        $oid: "6049b8a97501a24470b9a52c",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/54/ST/DL/11XMg2.jpeg",
    },
    {
      _id: {
        $oid: "6049b8a97501a24470b9a52d",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/16/OT/L/lejRej.jpeg",
    },
    {
      _id: {
        $oid: "6049b8a97501a24470b9a52e",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/1087/GW/DL/6fNUIf.jpeg",
    },
    {
      _id: {
        $oid: "6049d3567501a24470b9a533",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/4957/54/FR/L/lejRej.jpeg",
    },
    {
      _id: {
        $oid: "604b8aedb3f0410d74d91bef",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/9365/1087/GW/DL/hDsqel.jpeg",
    },
    {
      _id: {
        $oid: "604b8aedb3f0410d74d91bf0",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/1087/GW/DL/6fNUIf.jpeg",
    },
    {
      _id: {
        $oid: "604b8aedb3f0410d74d91bf1",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/1087/GW/DL/6fNUIf.jpeg",
    },
    {
      _id: {
        $oid: "604b8aedb3f0410d74d91bf2",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/5483/35/FR/DL/AHGCEp.jpeg",
    },
    {
      _id: {
        $oid: "604b8aedb3f0410d74d91bf3",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/10/54/FR/L/lejRej.jpeg",
    },
    {
      _id: {
        $oid: "604b8aedb3f0410d74d91bf4",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/420/SI/DL/RdzzBG.jpeg",
    },
    {
      _id: {
        $oid: "604b8aedb3f0410d74d91bf6",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/5483/35/FR/DL/AHGCEp.jpeg",
    },
    
    {
      _id: {
        $oid: "604b8aedb3f0410d74d91bf8",
      },
      images:
        "https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/1087/GW/DL/6fNUIf.jpeg",
    },
  ];

  randomimage:string=''
  
  ngOnInit(){
    const randomindex=Math.floor(Math.random() * this.imageArr.length);
    this.randomimage=this.imageArr[randomindex].images;
    this.loadUserBookings();
  }

  removeDuplicateBookings(bookings: any[]): any[] {
    const seen = new Set();
    return bookings.filter(booking => {
      // Create a unique identifier for each booking
      const identifier = `${booking._id}-${booking.customerId}-${JSON.stringify(booking.seats)}-${booking.fare}-${booking.departureDetails?.date}`;
      
      if (seen.has(identifier)) {
        console.log('Duplicate booking found and removed:', booking._id);
        return false;
      }
      
      seen.add(identifier);
      return true;
    });
  }

  loadUserBookings(): void {
    // Prevent multiple simultaneous API calls
    if (this.isLoadingBookings) {
      return;
    }
    
    const loggedinuserjson = sessionStorage.getItem("Loggedinuser");
    if (loggedinuserjson) {
      this.isLoadingBookings = true;
      const user = JSON.parse(loggedinuserjson);
      this.busService.getbusmongo(user._id).subscribe({
        next: (bookings) => {
          // Remove duplicates based on booking ID
          const uniqueBookings = this.removeDuplicateBookings(bookings);
          this.userBookings = uniqueBookings;
          this.categorizeTrips();
          this.updateBookingStatuses();
          this.isLoading = false;
          this.isLoadingBookings = false;
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.isLoading = false;
          this.isLoadingBookings = false;
        }
      });
    } else {
      this.isLoading = false;
      this.isLoadingBookings = false;
    }
  }

  categorizeTrips(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    this.upcomingTrips = [];
    this.completedTrips = [];
    
    // Create a Set to track processed bookings and avoid duplicates
    const processedBookings = new Set();
    
    this.userBookings.forEach(booking => {
      // Skip if we've already processed this booking
      if (processedBookings.has(booking._id)) {
        return;
      }
      processedBookings.add(booking._id);
      
      if (booking?.departureDetails?.date) {
        try {
          const tripDate = new Date(booking.departureDetails.date);
          tripDate.setHours(0, 0, 0, 0); // Set to start of day
          
          if (tripDate >= today) {
            // Trip is today or in the future
            booking.status = 'upcoming';
            this.upcomingTrips.push(booking);
          } else {
            // Trip is in the past
            booking.status = 'completed';
            this.completedTrips.push(booking);
          }
        } catch (error) {
          console.error('Error parsing date for booking:', booking._id, error);
          // Default to upcoming if date parsing fails
          booking.status = 'upcoming';
          this.upcomingTrips.push(booking);
        }
      } else {
        // No date available, default to upcoming
        booking.status = 'upcoming';
        this.upcomingTrips.push(booking);
      }
    });
    
    // Sort trips by date
    this.upcomingTrips.sort((a, b) => {
      const dateA = new Date(a.departureDetails?.date || 0);
      const dateB = new Date(b.departureDetails?.date || 0);
      return dateA.getTime() - dateB.getTime(); // Ascending order for upcoming
    });
    
    this.completedTrips.sort((a, b) => {
      const dateA = new Date(a.departureDetails?.date || 0);
      const dateB = new Date(b.departureDetails?.date || 0);
      return dateB.getTime() - dateA.getTime(); // Descending order for completed
    });
    
    console.log('Categorized trips:', {
      total: this.userBookings.length,
      upcoming: this.upcomingTrips.length,
      completed: this.completedTrips.length
    });
  }

  updateBookingStatuses(): void {
    // Update booking statuses in the backend
    this.userBookings.forEach(booking => {
      if (booking._id && booking.status) {
        this.busService.updateBookingStatus(booking._id, booking.status).subscribe({
          next: () => console.log(`Updated status for booking ${booking._id} to ${booking.status}`),
          error: (error) => console.error('Error updating booking status:', error)
        });
      }
    });
  }

  getDisplayedTrips(): any[] {
    switch (this.currentTab) {
      case 'upcoming':
        return this.upcomingTrips;
      case 'completed':
        return this.completedTrips;
      default:
        return this.userBookings;
    }
  }

  setCurrentTab(tab: 'all' | 'upcoming' | 'completed'): void {
    this.currentTab = tab;
  }

  isTripCompleted(booking: any): boolean {
    if (!booking?.departureDetails?.date) return false;
    try {
      const tripDate = new Date(booking.departureDetails.date);
      const today = new Date();
      tripDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return tripDate < today;
    } catch {
      return false;
    }
  }

  isTripUpcoming(booking: any): boolean {
    if (!booking?.departureDetails?.date) return true;
    try {
      const tripDate = new Date(booking.departureDetails.date);
      const today = new Date();
      tripDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return tripDate >= today;
    } catch {
      return true;
    }
  }

  getDaysUntilTrip(booking: any): number {
    if (!booking?.departureDetails?.date) return 0;
    try {
      const tripDate = new Date(booking.departureDetails.date);
      const today = new Date();
      tripDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = tripDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  }

  getTripStatusText(booking: any): string {
    const days = this.getDaysUntilTrip(booking);
    if (days < 0) {
      return `Completed ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
    } else if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Tomorrow';
    } else {
      return `In ${days} days`;
    }
  }

  openReviewForm(booking: any) {
    this.selectedBooking = booking;
    this.showReviewForm = true;
  }

  closeReviewForm() {
    this.showReviewForm = false;
    this.selectedBooking = null;
  }

  onReviewSubmitted() {
    this.showReviewForm = false;
    this.selectedBooking = null;
    // Show success message or refresh data
    alert('Thank you for your review!');
  }

  viewTicket(booking: any): void {
    this.selectedTicket = booking;
    this.showTicketModal = true;
  }

  closeTicketModal(): void {
    this.showTicketModal = false;
    this.selectedTicket = null;
  }

  getBookingStatusClass(status: string): string {
    if (!status) return 'status-default';
    switch(status.toLowerCase()) {
      case 'upcoming': return 'status-upcoming';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  trackByBookingId(index: number, booking: any): string {
    return booking?._id || index.toString();
  }
}
