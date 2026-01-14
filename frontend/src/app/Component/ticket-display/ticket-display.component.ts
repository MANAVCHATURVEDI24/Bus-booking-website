import { Component, Input, Output, EventEmitter } from '@angular/core';
declare var jsPDF: any;

@Component({
  selector: 'app-ticket-display',
  templateUrl: './ticket-display.component.html',
  styleUrls: ['./ticket-display.component.css']
})
export class TicketDisplayComponent {
  @Input() booking: any;
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  generateQRCode(): string {
    if (!this.booking?._id || !this.booking?.customerId) {
      return '';
    }
    // Generate a simple QR code data string
    const qrData = `TICKET-${this.booking._id}-${this.booking.customerId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}`;
  }

  downloadTicket(): void {
    if (!this.booking) {
      alert('Booking data not available');
      return;
    }

    const { jsPDF } = (window as any);
    if (!jsPDF) {
      alert('PDF generation not available');
      return;
    }

    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text('Bus Ticket', 20, 30);
    
    // Add booking details
    pdf.setFontSize(12);
    pdf.text(`Booking ID: ${this.booking._id || 'N/A'}`, 20, 50);
    pdf.text(`Passenger: ${this.booking.passengerDetails?.[0]?.name || 'N/A'}`, 20, 65);
    pdf.text(`From: ${this.booking.departureDetails?.city || 'N/A'}`, 20, 80);
    pdf.text(`To: ${this.booking.arrivalDetails?.city || 'N/A'}`, 20, 95);
    pdf.text(`Date: ${this.booking.departureDetails?.date || 'N/A'}`, 20, 110);
    pdf.text(`Departure: ${this.booking.departureDetails?.time || 'N/A'}:00`, 20, 125);
    pdf.text(`Arrival: ${this.booking.arrivalDetails?.time || 'N/A'}:00`, 20, 140);
    pdf.text(`Seats: ${this.booking.seats?.join(', ') || 'N/A'}`, 20, 155);
    pdf.text(`Fare: Rs. ${this.booking.fare || 'N/A'}`, 20, 170);
    pdf.text(`Status: ${this.booking.status || 'N/A'}`, 20, 185);
    
    // Save the PDF
    pdf.save(`ticket-${this.booking._id || 'unknown'}.pdf`);
  }

  closeTicketModal(): void {
    this.closeModal.emit();
  }

  formatTime(time: number | string): string {
    if (!time) return 'N/A';
    return `${time}:00`;
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date;
    }
  }
}