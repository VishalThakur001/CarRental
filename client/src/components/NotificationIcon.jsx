import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NotificationIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const { axios, user, isOwner } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUnreadCount();
            
            // Poll for new notifications every 30 seconds
            const interval = setInterval(() => {
                fetchUnreadCount();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/api/notifications');
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.log('Error fetching notifications:', error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const { data } = await axios.get('/api/notifications/unread-count');
            if (data.success) {
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.log('Error fetching unread count:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`/api/notifications/${notificationId}/read`);
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.log('Error marking notification as read:', error);
        }
    };

    const handleNotificationNavigation = (notification) => {
        // Mark as read first
        if (!notification.isRead) {
            markAsRead(notification._id);
        }

        // Show feedback toast
        const getNavigationMessage = (type, isOwner) => {
            if (type.includes('booking_')) {
                return isOwner ? 'Redirecting to manage bookings...' : 'Redirecting to my bookings...';
            }
            if (type.includes('review_')) {
                return isOwner ? 'Redirecting to manage reviews...' : 'Viewing car details...';
            }
            return 'Redirecting...';
        };

        toast.success(getNavigationMessage(notification.type, isOwner));

        // Close the dropdown
        setIsOpen(false);

        // Navigate based on notification type and user role
        const { type } = notification;

        try {
            // Booking-related notifications
            if (type.includes('booking_')) {
                if (isOwner) {
                    // For owners, navigate to manage bookings
                    navigate('/owner/manage-bookings');
                    window.scrollTo(0, 0);
                } else {
                    // For users, navigate to my bookings
                    navigate('/my-bookings');
                    window.scrollTo(0, 0);
                }
                return;
            }

            // Review-related notifications
            if (type.includes('review_')) {
                if (isOwner) {
                    // For owners, navigate to manage reviews
                    navigate('/owner/manage-reviews');
                    window.scrollTo(0, 0);
                } else {
                    // For users, try to navigate to specific car details
                    let carId = null;

                    // Check multiple possible locations for car ID
                    if (notification.review?.car?._id) {
                        carId = notification.review.car._id;
                    } else if (notification.booking?.car?._id) {
                        carId = notification.booking.car._id;
                    } else if (notification.carId) {
                        carId = notification.carId;
                    }

                    if (carId) {
                        navigate(`/car-details/${carId}`);
                        window.scrollTo(0, 0);
                    } else {
                        // Fallback to my bookings if no car ID found
                        navigate('/my-bookings');
                        window.scrollTo(0, 0);
                    }
                }
                return;
            }

            // Car-related notifications (if any)
            if (type.includes('car_')) {
                if (isOwner) {
                    navigate('/owner/manage-cars');
                    window.scrollTo(0, 0);
                } else {
                    navigate('/cars');
                    window.scrollTo(0, 0);
                }
                return;
            }

            // Default fallback based on user role
            if (isOwner) {
                navigate('/owner');
                window.scrollTo(0, 0);
            } else {
                navigate('/my-bookings');
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Error navigating from notification:', error);
            toast.error('Unable to navigate. Please try again.');
            // Fallback navigation in case of error
            if (isOwner) {
                navigate('/owner');
            } else {
                navigate('/');
            }
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('/api/notifications/mark-all-read');
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.log('Error marking all notifications as read:', error);
        }
    };

    const handleNotificationClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'booking_created':
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                );
            case 'booking_confirmed':
            case 'booking_booked':
                return (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'booking_cancelled':
            case 'booking_rejected':
                return (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            case 'booking_completed':
                return (
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'review_received':
                return (
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                );
            case 'review_replied':
                return (
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                    </svg>
                );
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const created = new Date(date);
        const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return created.toLocaleDateString();
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleNotificationClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                aria-label={`Notifications${unreadCount > 0 ? ` - ${unreadCount} unread` : ''}`}
                title={`${unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No unread notifications'}`}
            >
                <svg
                    className="w-6 h-6 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-primary hover:text-primary-dull transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto focus-within:outline-none">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                                    </svg>
                                    <p>No notifications yet</p>
                                    <p className="text-xs text-gray-400 mt-2">You'll see booking updates and reviews here</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-primary focus:ring-inset ${
                                            !notification.isRead ? 'bg-blue-50 border-l-4 border-l-primary' : ''
                                        }`}
                                        onClick={() => handleNotificationNavigation(notification)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleNotificationNavigation(notification);
                                            }
                                        }}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Notification: ${notification.title}. Click to view details.`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-full flex-shrink-0 ${
                                                !notification.isRead ? 'bg-primary/10' : 'bg-gray-100'
                                            }`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                {notification.booking?.car && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {notification.booking.car.brand} {notification.booking.car.model}
                                                    </p>
                                                )}
                                                {notification.review?.car && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {notification.review.car.brand} {notification.review.car.model}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-xs text-gray-400">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </p>
                                                    <div className="flex items-center text-xs text-primary group-hover:text-primary-dull transition-colors">
                                                        <span className="opacity-70 group-hover:opacity-100">View details</span>
                                                        <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationIcon;
