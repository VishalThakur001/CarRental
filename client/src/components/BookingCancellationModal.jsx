import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { assets } from '../assets/assets';

const BookingCancellationModal = ({ isOpen, onClose, onConfirm, booking }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedReasons = [
    'Car maintenance required',
    'Car not available due to technical issues',
    'Schedule conflict',
    'Customer requested changes we cannot accommodate',
    'Insurance or safety concerns',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(booking._id, reason.trim());
      onClose();
      setReason('');
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

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
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Cancel Booking</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <img src={assets.close_icon} alt="Close" className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Booking Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={booking?.car?.image} 
                    alt="Car" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {booking?.car?.brand} {booking?.car?.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking?.pickupDate?.split('T')[0]} to {booking?.returnDate?.split('T')[0]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 text-red-500">⚠️</div>
                  <div>
                    <p className="font-medium text-red-800 mb-1">
                      Are you sure you want to cancel this booking?
                    </p>
                    <p className="text-sm text-red-600">
                      This action cannot be undone. The customer will be notified of the cancellation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for cancellation <span className="text-red-500">*</span>
                </label>
                
                <div className="space-y-2 mb-4">
                  {predefinedReasons.map((predefinedReason) => (
                    <label key={predefinedReason} className="flex items-center">
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={predefinedReason}
                        checked={reason === predefinedReason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mr-3 text-primary focus:ring-primary"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-700">{predefinedReason}</span>
                    </label>
                  ))}
                </div>

                {reason === 'Other' && (
                  <div className="mt-3">
                    <textarea
                      placeholder="Please specify the reason..."
                      value={reason === 'Other' ? '' : reason}
                      onChange={(e) => setReason(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      rows="3"
                      required
                    />
                  </div>
                )}
                
                {reason !== 'Other' && reason && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional details (optional)
                    </label>
                    <textarea
                      placeholder="Add any additional information..."
                      onChange={(e) => setReason(reason + (e.target.value ? ` - ${e.target.value}` : ''))}
                      disabled={isSubmitting}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      rows="2"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={!reason.trim() || isSubmitting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {isSubmitting ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingCancellationModal;
