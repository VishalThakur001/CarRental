import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const RatingReviewForm = ({ isOpen, onClose, booking, onReviewSubmitted }) => {
  const { axios } = useAppContext();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post('/api/reviews/create', {
        bookingId: booking._id,
        rating,
        reviewText: reviewText.trim()
      });

      if (data.success) {
        toast.success('Review submitted successfully!');
        onReviewSubmitted();
        handleClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setReviewText('');
    onClose();
  };

  const StarIcon = ({ filled, size = 'w-6 h-6' }) => (
    <svg className={`${size} ${filled ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-800">Rate Your Experience</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <img src={assets.close_icon} alt="Close" className="w-6 h-6" />
              </button>
            </div>

            {/* Booking Info */}
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-4">
                <img 
                  src={booking?.car?.image} 
                  alt="Car" 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {booking?.car?.brand} {booking?.car?.model}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {booking?.pickupDate?.split('T')[0]} to {booking?.returnDate?.split('T')[0]}
                  </p>
                  <p className="text-sm text-green-600 font-medium">✓ Trip Completed</p>
                </div>
              </div>
            </div>

            {/* Scrollable Form Container */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate this car? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      disabled={isSubmitting}
                      className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                    >
                      <StarIcon 
                        filled={star <= (hoveredRating || rating)}
                        size="w-8 h-8"
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-gray-600">
                    {rating > 0 && (
                      <>
                        {rating} of 5 stars
                        {rating === 1 && ' - Poor'}
                        {rating === 2 && ' - Fair'}
                        {rating === 3 && ' - Good'}
                        {rating === 4 && ' - Very Good'}
                        {rating === 5 && ' - Excellent'}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write your review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Share your experience with this car. How was the condition, cleanliness, performance, etc.?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:bg-gray-100"
                  rows="5"
                  maxLength="500"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Minimum 10 characters required
                  </p>
                  <p className="text-xs text-gray-500">
                    {reviewText.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 Review Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Mention the car's condition and cleanliness</li>
                  <li>• Comment on the owner's communication</li>
                  <li>• Note any standout features or issues</li>
                  <li>• Be honest and helpful for future renters</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0 || reviewText.trim().length < 10}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingReviewForm;
