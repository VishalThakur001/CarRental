import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { assets } from '../assets/assets';
import BookingTimeline from './BookingTimeline';

const BookingDetailsModal = ({ isOpen, onClose, booking, userType = 'customer' }) => {
  if (!booking) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'booked':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Track your booking status and timeline
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img src={assets.close_icon} alt="Close" className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Booking Summary */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <img 
                    src={booking.car.image} 
                    alt="Car" 
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {booking.car.brand} {booking.car.model}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.car.year} • {booking.car.category} • {booking.car.location}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status === 'booked' ? 'Confirmed' : 
                         booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">PICKUP DATE</p>
                        <p className="text-sm font-medium">{formatDate(booking.pickupDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">RETURN DATE</p>
                        <p className="text-sm font-medium">{formatDate(booking.returnDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">TOTAL AMOUNT</p>
                        <p className="text-2xl font-bold text-primary">₹{booking.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-medium">BOOKED ON</p>
                        <p className="text-sm font-medium">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Timeline */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📊</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Booking Timeline</h4>
                    <p className="text-sm text-gray-600">Follow your booking journey</p>
                  </div>
                </div>

                <BookingTimeline booking={booking} userType={userType} />
              </div>

              {/* Additional Information */}
              {(booking.cancellationReason || booking.completedAt) && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Additional Information</h4>
                  
                  {booking.cancellationReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                      <p className="text-sm font-medium text-red-800 mb-1">Cancellation Reason</p>
                      <p className="text-sm text-red-700">{booking.cancellationReason}</p>
                    </div>
                  )}

                  {booking.completedAt && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-800 mb-1">Completed On</p>
                      <p className="text-sm text-green-700">
                        {new Date(booking.completedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors font-medium"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingDetailsModal;
