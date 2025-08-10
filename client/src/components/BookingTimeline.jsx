import React from 'react';
import { motion } from 'motion/react';

const BookingTimeline = ({ booking, userType = 'customer' }) => {
  const getTimelineSteps = () => {
    const baseSteps = [
      {
        id: 'requested',
        title: 'Booking Requested',
        description: userType === 'customer' 
          ? 'You submitted a booking request' 
          : 'Customer submitted booking request',
        status: 'completed',
        icon: '📝',
        date: booking.createdAt
      }
    ];

    // Add status-specific steps based on current booking status
    switch (booking.status) {
      case 'pending':
        baseSteps.push({
          id: 'pending',
          title: 'Pending Approval',
          description: userType === 'customer' 
            ? 'Waiting for owner confirmation' 
            : 'Review and respond to booking',
          status: 'current',
          icon: '⏳',
          date: null
        });
        break;

      case 'booked':
        baseSteps.push(
          {
            id: 'confirmed',
            title: 'Booking Confirmed',
            description: userType === 'customer'
              ? 'Owner confirmed your booking'
              : 'You confirmed the booking',
            status: 'completed',
            icon: '✅',
            date: booking.updatedAt
          },
          {
            id: 'pickup',
            title: 'Ready for Pickup',
            description: userType === 'customer'
              ? 'Car is ready for pickup on scheduled date'
              : 'Car prepared for customer pickup',
            status: 'current',
            icon: '🚗',
            date: booking.pickupDate
          }
        );
        break;

      case 'on_rent':
        baseSteps.push(
          {
            id: 'confirmed',
            title: 'Booking Confirmed',
            description: userType === 'customer'
              ? 'Owner confirmed your booking'
              : 'You confirmed the booking',
            status: 'completed',
            icon: '✅',
            date: booking.updatedAt
          },
          {
            id: 'pickup',
            title: 'Car Picked Up',
            description: userType === 'customer'
              ? 'You picked up the car'
              : 'Customer picked up the car',
            status: 'completed',
            icon: '🚗',
            date: booking.pickupDate
          },
          {
            id: 'on_rent',
            title: 'On Rent',
            description: userType === 'customer'
              ? 'Enjoying your ride! Return by scheduled date'
              : 'Car is currently with customer',
            status: 'current',
            icon: '🛣️',
            date: null
          }
        );
        break;

      case 'completed':
        baseSteps.push(
          {
            id: 'confirmed',
            title: 'Booking Confirmed',
            description: userType === 'customer'
              ? 'Owner confirmed your booking'
              : 'You confirmed the booking',
            status: 'completed',
            icon: '✅',
            date: booking.updatedAt
          },
          {
            id: 'pickup',
            title: 'Car Picked Up',
            description: userType === 'customer'
              ? 'You picked up the car'
              : 'Customer picked up the car',
            status: 'completed',
            icon: '🚗',
            date: booking.pickupDate
          },
          {
            id: 'on_rent',
            title: 'On Rent',
            description: userType === 'customer'
              ? 'You enjoyed your ride'
              : 'Car was with customer',
            status: 'completed',
            icon: '🛣️',
            date: null
          },
          {
            id: 'returned',
            title: 'Car Returned',
            description: userType === 'customer'
              ? 'You returned the car'
              : 'Customer returned the car',
            status: 'completed',
            icon: '🔄',
            date: booking.returnDate
          },
          {
            id: 'completed',
            title: 'Booking Completed',
            description: userType === 'customer'
              ? 'Rental completed successfully'
              : 'Rental completed successfully',
            status: 'completed',
            icon: '🎉',
            date: booking.completedAt || booking.updatedAt
          }
        );
        break;

      case 'cancelled':
        // Find when it was cancelled based on which step it was at
        let cancelStep = 'pending';
        if (booking.updatedAt !== booking.createdAt) {
          // If updated time is different, it was cancelled after being confirmed
          cancelStep = 'confirmed';
        }

        if (cancelStep === 'confirmed') {
          baseSteps.push({
            id: 'confirmed',
            title: 'Booking Confirmed',
            description: userType === 'customer' 
              ? 'Owner confirmed your booking' 
              : 'You confirmed the booking',
            status: 'completed',
            icon: '✅',
            date: booking.updatedAt
          });
        }

        baseSteps.push({
          id: 'cancelled',
          title: 'Booking Cancelled',
          description: booking.cancellationReason || 'Booking was cancelled',
          status: 'cancelled',
          icon: '❌',
          date: booking.updatedAt
        });
        break;
    }

    return baseSteps;
  };

  const steps = getTimelineSteps();

  const getStepStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          iconBg: 'bg-green-100 border-green-300',
          iconColor: 'text-green-600',
          lineColor: 'bg-green-300',
          textColor: 'text-green-600',
          titleColor: 'text-gray-800'
        };
      case 'current':
        return {
          iconBg: 'bg-blue-100 border-blue-300 ring-4 ring-blue-100',
          iconColor: 'text-blue-600',
          lineColor: 'bg-gray-200',
          textColor: 'text-blue-600',
          titleColor: 'text-gray-800 font-semibold'
        };
      case 'cancelled':
        return {
          iconBg: 'bg-red-100 border-red-300',
          iconColor: 'text-red-600',
          lineColor: 'bg-red-300',
          textColor: 'text-red-600',
          titleColor: 'text-gray-800'
        };
      default:
        return {
          iconBg: 'bg-gray-100 border-gray-300',
          iconColor: 'text-gray-400',
          lineColor: 'bg-gray-200',
          textColor: 'text-gray-400',
          titleColor: 'text-gray-400'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full">
      <div className="relative">
        {steps.map((step, index) => {
          const styles = getStepStyles(step.status);
          const isLast = index === steps.length - 1;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start pb-8 last:pb-0"
            >
              {/* Vertical Line */}
              {!isLast && (
                <div className={`absolute left-6 top-12 w-0.5 h-full ${styles.lineColor}`} />
              )}

              {/* Step Icon */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${styles.iconBg}`}>
                <span className={`text-lg ${styles.iconColor}`}>
                  {step.icon}
                </span>
              </div>

              {/* Step Content */}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${styles.titleColor}`}>
                    {step.title}
                  </h4>
                  {step.date && (
                    <span className="text-xs text-gray-500">
                      {formatDate(step.date)}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${styles.textColor}`}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTimeline;
