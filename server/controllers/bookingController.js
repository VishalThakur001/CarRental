import Booking from "../models/Booking.js"
import Car from "../models/Car.js";
import { createNotification } from "./notificationController.js";


// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        // fetch all available cars for the given location
        const cars = await Car.find({location, isAvaliable: true})

        // check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car)=>{
           const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
           return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if(!isAvailable){
            return res.json({success: false, message: "Car is not available"})
        }

        const carData = await Car.findById(car)

        // Calculate price based on pickupDate and returnDate
        // Include the pickup day in the calculation and handle same-day rentals
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        // Calculate the difference in days and add 1 to include the pickup day
        const timeDifference = returned.getTime() - picked.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        // For same day pickup and return, charge for 1 day minimum
        // For multi-day rentals, add 1 to include the pickup day
        const noOfDays = daysDifference === 0 ? 1 : daysDifference + 1;
        const price = carData.pricePerDay * noOfDays;

        const newBooking = await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})

        // Create notifications for both user and owner
        await createNotification(
            _id,
            'booking_created',
            'Booking Submitted',
            `Your booking request for ${carData.brand} ${carData.model} has been submitted and is pending approval.`,
            newBooking._id
        );

        await createNotification(
            carData.owner,
            'booking_created',
            'New Booking Request',
            `You have a new booking request for your ${carData.brand} ${carData.model}.`,
            newBooking._id
        );

        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List User Bookings 
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings

export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get booked dates for a specific car
export const getCarBookedDates = async (req, res)=>{
    try {
        const { carId } = req.params;

        const bookings = await Booking.find({
            car: carId,
            status: { $in: ["pending", "booked"] }
        }).select("pickupDate returnDate status");

        const bookedDates = bookings.map(booking => ({
            start: booking.pickupDate,
            end: booking.returnDate,
            status: booking.status
        }));

        res.json({success: true, bookedDates});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status, cancellationReason} = req.body

        const booking = await Booking.findById(bookingId)

        // Allow both owner and user to cancel bookings
        const isOwner = booking.owner.toString() === _id.toString();
        const isUser = booking.user.toString() === _id.toString();

        if (!isOwner && !isUser) {
            return res.json({ success: false, message: "Unauthorized"})
        }

        // Users can only cancel their own pending or booked bookings
        if (isUser && !isOwner) {
            if (status !== 'cancelled') {
                return res.json({ success: false, message: "Users can only cancel bookings"})
            }
            if (booking.status === 'completed' || booking.status === 'cancelled') {
                return res.json({ success: false, message: "Cannot cancel completed or already cancelled bookings"})
            }
        }

        // Owners have full control over status changes
        if(!isOwner && status !== 'cancelled'){
            return res.json({ success: false, message: "Only owners can change booking status"})
        }

        booking.status = status;

        // If cancelling, save the reason
        if (status === 'cancelled' && cancellationReason) {
            booking.cancellationReason = cancellationReason;
        }

        // If marking as completed, set completion date
        if (status === 'completed') {
            booking.completedAt = new Date();
        }

        await booking.save();

        // Get car details for notification
        const populatedBooking = await Booking.findById(booking._id).populate('car user');
        const carDetails = populatedBooking.car;
        const userName = populatedBooking.user.name;

        // Create notifications based on status change
        let notificationData = {};

        switch (status) {
            case 'booked':
                notificationData = {
                    userTitle: 'Booking Confirmed',
                    userMessage: `Your booking for ${carDetails.brand} ${carDetails.model} has been confirmed! Car is ready for pickup.`,
                    ownerTitle: 'Booking Confirmed',
                    ownerMessage: `You confirmed the booking for ${carDetails.brand} ${carDetails.model} by ${userName}.`
                };
                break;
            case 'on_rent':
                notificationData = {
                    userTitle: 'Car Picked Up',
                    userMessage: `You have successfully picked up ${carDetails.brand} ${carDetails.model}. Enjoy your ride!`,
                    ownerTitle: 'Car Picked Up',
                    ownerMessage: `${userName} has picked up ${carDetails.brand} ${carDetails.model}. Rental is now active.`
                };
                break;
            case 'cancelled':
                notificationData = {
                    userTitle: 'Booking Cancelled',
                    userMessage: `Your booking for ${carDetails.brand} ${carDetails.model} has been cancelled.${cancellationReason ? ' Reason: ' + cancellationReason : ''}`,
                    ownerTitle: 'Booking Cancelled',
                    ownerMessage: `You cancelled the booking for ${carDetails.brand} ${carDetails.model} by ${userName}.`
                };
                break;
            case 'completed':
                notificationData = {
                    userTitle: 'Booking Completed',
                    userMessage: `Your rental of ${carDetails.brand} ${carDetails.model} has been completed. Thank you for choosing us!`,
                    ownerTitle: 'Booking Completed',
                    ownerMessage: `The booking for ${carDetails.brand} ${carDetails.model} by ${userName} has been completed.`
                };
                break;
        }

        if (notificationData.userTitle) {
            // Notify the user
            await createNotification(
                booking.user,
                `booking_${status}`,
                notificationData.userTitle,
                notificationData.userMessage,
                booking._id
            );

            // Notify the owner
            await createNotification(
                booking.owner,
                `booking_${status}`,
                notificationData.ownerTitle,
                notificationData.ownerMessage,
                booking._id
            );
        }

        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API for users to cancel their own bookings
export const cancelUserBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, cancellationReason } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Check if user owns this booking
        if (booking.user.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Check if booking can be cancelled
        if (booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'on_rent') {
            return res.json({
                success: false,
                message: "Cannot cancel completed, on-rent, or already cancelled bookings"
            });
        }

        // Update booking status
        booking.status = 'cancelled';
        booking.cancellationReason = cancellationReason || 'Cancelled by customer';
        await booking.save();

        // Get booking details for notifications
        const populatedBooking = await Booking.findById(booking._id).populate('car user');
        const carDetails = populatedBooking.car;
        const userName = populatedBooking.user.name;

        // Create notifications for both user and owner
        await createNotification(
            booking.user,
            'booking_cancelled',
            'Booking Cancelled',
            `You have cancelled your booking for ${carDetails.brand} ${carDetails.model}.`,
            booking._id
        );

        await createNotification(
            booking.owner,
            'booking_cancelled',
            'Customer Cancelled Booking',
            `${userName} has cancelled their booking for ${carDetails.brand} ${carDetails.model}. Reason: ${cancellationReason || 'No reason provided'}`,
            booking._id
        );

        res.json({
            success: true,
            message: "Booking cancelled successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
