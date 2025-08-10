import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BookingActionModal = ({ isOpen, onClose, onConfirm, booking, action, title, message, confirmText, confirmColor = "bg-primary" }) => {
    if (!booking) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
                    >
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                                {action === 'confirm' && (
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {action === 'complete' && (
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {message}
                            </p>
                        </div>

                        {/* Booking Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <img 
                                    src={booking.car?.image} 
                                    alt={`${booking.car?.brand} ${booking.car?.model}`}
                                    className="w-12 h-12 rounded-md object-cover"
                                />
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {booking.car?.brand} {booking.car?.model}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Customer: {booking.user?.name}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                    <span className="font-medium">Dates:</span> {' '}
                                    {booking.pickupDate?.split('T')[0]} to {booking.returnDate?.split('T')[0]}
                                </p>
                                <p>
                                    <span className="font-medium">Total:</span> {' '}
                                    ${booking.price}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 px-4 py-2 text-white ${confirmColor} hover:opacity-90 rounded-lg transition-colors font-medium`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookingActionModal;
