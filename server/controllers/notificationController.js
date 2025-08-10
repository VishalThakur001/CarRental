import Notification from "../models/Notification.js"

// API to get user notifications
export const getUserNotifications = async (req, res) => {
    try {
        const {_id} = req.user;
        
        const notifications = await Notification.find({user: _id})
            .populate({
                path: 'booking',
                populate: {
                    path: 'car',
                    select: 'brand model image'
                }
            })
            .populate({
                path: 'review',
                populate: [
                    {
                        path: 'car',
                        select: 'brand model image'
                    },
                    {
                        path: 'user',
                        select: 'name image'
                    }
                ]
            })
            .sort({createdAt: -1})
            .limit(50);

        res.json({success: true, notifications});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// API to mark notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const {_id} = req.user;
        const {notificationId} = req.params;

        const notification = await Notification.findById(notificationId);
        
        if (!notification) {
            return res.json({success: false, message: "Notification not found"});
        }

        if (notification.user.toString() !== _id.toString()) {
            return res.json({success: false, message: "Unauthorized"});
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

        res.json({success: true, message: "Notification marked as read"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// API to mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const {_id} = req.user;

        await Notification.updateMany(
            {user: _id, isRead: false}, 
            {isRead: true, readAt: new Date()}
        );

        res.json({success: true, message: "All notifications marked as read"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// API to get unread notifications count
export const getUnreadCount = async (req, res) => {
    try {
        const {_id} = req.user;
        
        const count = await Notification.countDocuments({user: _id, isRead: false});
        
        res.json({success: true, unreadCount: count});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Helper function to create notification
export const createNotification = async (userId, type, title, message, bookingId = null, reviewId = null) => {
    try {
        const notificationData = {
            user: userId,
            type,
            title,
            message
        };

        if (bookingId) notificationData.booking = bookingId;
        if (reviewId) notificationData.review = reviewId;

        await Notification.create(notificationData);
    } catch (error) {
        console.log('Error creating notification:', error.message);
    }
}

// Function to delete old read notifications (older than 1 week)
export const cleanupOldNotifications = async () => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const result = await Notification.deleteMany({
            isRead: true,
            readAt: { $lt: oneWeekAgo }
        });
        
        console.log(`Deleted ${result.deletedCount} old notifications`);
        return result.deletedCount;
    } catch (error) {
        console.log('Error cleaning up notifications:', error.message);
    }
}
