import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { assets } from '../assets/assets';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger", // danger, warning, info
  isLoading = false 
}) => {

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '🗑️',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          icon: '⚠️',
          confirmBg: 'bg-orange-600 hover:bg-orange-700',
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
      default:
        return {
          icon: '❓',
          confirmBg: 'bg-gray-600 hover:bg-gray-700',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600'
        };
    }
  };

  const styles = getTypeStyles();

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
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 text-center">
              <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{styles.icon}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{message}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-3 ${styles.confirmBg} text-white rounded-lg transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2`}
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                {isLoading ? 'Processing...' : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
