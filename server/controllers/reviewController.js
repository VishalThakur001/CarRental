import Review from "../models/Review.js"
import Booking from "../models/Booking.js"
import Car from "../models/Car.js"
import { createNotification } from "./notificationController.js"

// API to Create Review (after booking completion)
export const createReview = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, rating, reviewText } = req.body;

        // Validate input
        if (!bookingId || !rating || !reviewText) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        if (reviewText.length < 10 || reviewText.length > 500) {
            return res.json({ success: false, message: 'Review must be between 10 and 500 characters' });
        }

        // Check if booking exists and belongs to user
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: 'Booking not found' });
        }

        if (booking.user.toString() !== _id.toString()) {
            return res.json({ success: false, message: 'Unauthorized' });
        }

        if (booking.status !== 'completed') {
            return res.json({ success: false, message: 'Can only review completed bookings' });
        }

        // Check if review already exists for this booking
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.json({ success: false, message: 'Review already exists for this booking' });
        }

        // Create review
        const review = await Review.create({
            booking: bookingId,
            car: booking.car,
            user: _id,
            rating,
            reviewText
        });

        // Get car details to find the owner
        const car = await Car.findById(booking.car);
        if (car && car.owner) {
            // Send notification to car owner about new review
            await createNotification(
                car.owner,
                'review_received',
                'New Review Received',
                `You received a ${rating}-star review for your ${car.brand} ${car.model}`,
                null,
                review._id
            );
        }

        res.json({ success: true, message: 'Review submitted successfully', review });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Get Reviews for a Car
export const getCarReviews = async (req, res) => {
    try {
        const { carId } = req.params;

        const reviews = await Review.find({ car: carId })
            .populate('user', 'name image')
            .populate('booking', 'pickupDate returnDate')
            .sort({ createdAt: -1 });

        // Calculate average rating
        const totalReviews = reviews.length;
        const avgRating = totalReviews > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
            : 0;

        res.json({ 
            success: true, 
            reviews,
            avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
            totalReviews
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Get User's Reviews
export const getUserReviews = async (req, res) => {
    try {
        const { _id } = req.user;

        const reviews = await Review.find({ user: _id })
            .populate('car', 'brand model image')
            .populate('booking', 'pickupDate returnDate')
            .sort({ createdAt: -1 });

        res.json({ success: true, reviews });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Check if user can review a booking
export const canReviewBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking || booking.user.toString() !== _id.toString()) {
            return res.json({ success: false, message: 'Booking not found or unauthorized' });
        }

        if (booking.status !== 'completed') {
            return res.json({ success: false, canReview: false, message: 'Booking not completed yet' });
        }

        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.json({ success: true, canReview: false, message: 'Already reviewed', existingReview });
        }

        res.json({ success: true, canReview: true, booking });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Update Review
export const updateReview = async (req, res) => {
    try {
        const { _id } = req.user;
        const { reviewId } = req.params;
        const { rating, reviewText } = req.body;

        const review = await Review.findById(reviewId);
        if (!review || review.user.toString() !== _id.toString()) {
            return res.json({ success: false, message: 'Review not found or unauthorized' });
        }

        if (rating) review.rating = rating;
        if (reviewText) review.reviewText = reviewText;

        await review.save();

        res.json({ success: true, message: 'Review updated successfully', review });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Delete Review
export const deleteReview = async (req, res) => {
    try {
        const { _id } = req.user;
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review || review.user.toString() !== _id.toString()) {
            return res.json({ success: false, message: 'Review not found or unauthorized' });
        }

        await Review.findByIdAndDelete(reviewId);

        res.json({ success: true, message: 'Review deleted successfully' });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Reply to Review (Owner only)
export const replyToReview = async (req, res) => {
    try {
        const { _id, role } = req.user;
        const { reviewId } = req.params;
        const { replyText } = req.body;

        // Check if user is an owner
        if (role !== 'owner') {
            return res.json({ success: false, message: 'Only car owners can reply to reviews' });
        }

        // Validate reply text
        if (!replyText || replyText.trim().length < 10 || replyText.trim().length > 400) {
            return res.json({ success: false, message: 'Reply must be between 10 and 400 characters' });
        }

        const review = await Review.findById(reviewId).populate('car');
        if (!review) {
            return res.json({ success: false, message: 'Review not found' });
        }

        // Check if owner owns the car that was reviewed
        if (review.car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: 'You can only reply to reviews of your cars' });
        }

        // Check if owner already replied
        if (review.ownerReply && review.ownerReply.text) {
            return res.json({ success: false, message: 'You have already replied to this review' });
        }

        // Add owner reply
        review.ownerReply = {
            text: replyText.trim(),
            repliedAt: new Date(),
            owner: _id
        };

        await review.save();

        // Send notification to the reviewer about owner reply
        await createNotification(
            review.user,
            'review_replied',
            'Owner Replied to Your Review',
            `The owner of ${review.car.brand} ${review.car.model} replied to your review`,
            null,
            review._id
        );

        res.json({ success: true, message: 'Reply added successfully' });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Get Reviews for Owner's Cars
export const getOwnerCarReviews = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== 'owner') {
            return res.json({ success: false, message: 'Only car owners can access this endpoint' });
        }

        const reviews = await Review.find({})
            .populate({
                path: 'car',
                match: { owner: _id },
                select: 'brand model image owner'
            })
            .populate('user', 'name image')
            .populate('booking', 'pickupDate returnDate')
            .sort({ createdAt: -1 });

        // Filter out reviews where car is null (not owned by this owner)
        const ownerReviews = reviews.filter(review => review.car !== null);

        res.json({ success: true, reviews: ownerReviews });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Update Owner Reply
export const updateOwnerReply = async (req, res) => {
    try {
        const { _id, role } = req.user;
        const { reviewId } = req.params;
        const { replyText } = req.body;

        if (role !== 'owner') {
            return res.json({ success: false, message: 'Only car owners can update replies' });
        }

        if (!replyText || replyText.trim().length < 10 || replyText.trim().length > 400) {
            return res.json({ success: false, message: 'Reply must be between 10 and 400 characters' });
        }

        const review = await Review.findById(reviewId).populate('car');
        if (!review || review.car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: 'Review not found or unauthorized' });
        }

        if (!review.ownerReply || !review.ownerReply.text) {
            return res.json({ success: false, message: 'No reply exists to update' });
        }

        review.ownerReply.text = replyText.trim();
        await review.save();

        res.json({ success: true, message: 'Reply updated successfully' });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
