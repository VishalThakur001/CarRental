import express from "express"
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadCount } from "../controllers/notificationController.js"
import { protect as auth } from "../middleware/auth.js"

const notificationRouter = express.Router()

notificationRouter.get('/', auth, getUserNotifications)
notificationRouter.get('/unread-count', auth, getUnreadCount)
notificationRouter.put('/:notificationId/read', auth, markNotificationAsRead)
notificationRouter.put('/mark-all-read', auth, markAllNotificationsAsRead)

export default notificationRouter
