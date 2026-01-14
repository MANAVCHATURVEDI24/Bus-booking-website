const Booking=require("../models/booking");

exports.addbooking=async(req,res)=>{
    try {
        // Check for existing booking with same details to prevent duplicates
        const existingBooking = await Booking.findOne({
            customerId: req.body.customerId,
            busId: req.body.busId,
            'departureDetails.date': req.body.departureDetails.date,
            'departureDetails.time': req.body.departureDetails.time,
            seats: { $all: req.body.seats }
        });

        if (existingBooking) {
            return res.status(400).json({ 
                error: 'Duplicate booking detected. A booking with the same details already exists.',
                existingBookingId: existingBooking._id 
            });
        }

        const booking = await Booking.create(req.body);
        console.log('New booking created:', booking);
        res.send(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
}

exports.getBooking =async(req,res)=>{
    try {
        let {id}=req.params;
        const bookings=await Booking.find({ customerId: id }).lean().exec();
        
        // Remove any potential duplicates based on booking details
        const uniqueBookings = [];
        const seen = new Set();
        
        bookings.forEach(booking => {
            const identifier = `${booking.busId}-${booking.departureDetails?.date}-${booking.departureDetails?.time}-${JSON.stringify(booking.seats)}`;
            if (!seen.has(identifier)) {
                seen.add(identifier);
                uniqueBookings.push(booking);
            } else {
                console.log('Duplicate booking filtered out:', booking._id);
            }
        });
        
        // Sort by booking date (newest first)
        uniqueBookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
        
        res.send(uniqueBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}

exports.updateBookingStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json({ message: 'Booking status updated successfully', booking: updatedBooking });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
}