import express from 'express';
import { protectedRoutes } from '../Middlewares/protectedRoute.js';
import { deleteNotifications, deleteSingleNotification, getNotifications } from '../Controllers/notification.controllers.js';


const router = express.Router();

router.get('/', protectedRoutes, getNotifications);
router.delete('/', protectedRoutes, deleteNotifications)
router.delete('/:id', protectedRoutes, deleteSingleNotification);


export default router