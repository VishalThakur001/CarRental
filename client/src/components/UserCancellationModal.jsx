import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const UserCancellationModal = ({ isOpen, onClose, booking, onCancellationSuccess }) => {
  const { axios } = useAppContext();
  const [cancellationReason, setCancellationReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedReasons = [
    'Change of plans',
    'Found alternative transportation',
    'Emergency situation',
    'Car requirements changed',
    'Travel plans cancelled',
    'Other'
  ];

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    if (reason !== 'Other') {
      setCancellationReason(reason);
    } else {
      setCancellationReason('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post('/api/bookings/cancel', {
        bookingId: booking._id,
        cancellationReason: cancellationReason.trim()
      });

      if (data.success) {
        toast.success(data.message);
        onCancellationSuccess();
        handleClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCancellationReason('');
    setSelectedReason('');
    onClose();
  };

  if (!booking) return null;

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
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Cancel Booking</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <img src={assets.close_icon} alt="Close" className="w-6 h-6" />
              </button>
            </div>

            {/* Booking Details */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <img 
                  src={booking.car.image} 
                  alt="Car" 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {booking.car.brand} {booking.car.model}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    Total: ₹{booking.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="p-6 bg-amber-50 border-b border-amber-200">
              <div className="flex items-start gap-3">
                <span className="text-amber-600 text-lg">⚠️</span>
                <div>
                  <h4 className="font-medium text-amber-800">Important Notice</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Once cancelled, this booking cannot be restored. The car owner will be notified immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Why are you cancelling this booking? <span className="text-red-500">*</span>
                </label>
                
                {/* Predefined Reasons */}
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {predefinedReasons.map((reason) => (
                    <label key={reason} className="flex items-center">
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => handleReasonSelect(reason)}
                        disabled={isSubmitting}
                        className="mr-3 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>

                {/* Custom Reason Input */}
                {selectedReason === 'Other' && (
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Please specify your reason for cancellation..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:bg-gray-100"
                    rows="3"
                    maxLength="200"
                    required
                  />
                )}

                {selectedReason === 'Other' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {cancellationReason.length}/200 characters
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !cancellationReason.trim()}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
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

export default UserCancellationModal;
