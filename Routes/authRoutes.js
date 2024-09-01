import express from 'express'
import { getMe, logIn, logOut, signUp } from '../Controllers/auth.controllers.js';
import { protectedRoutes } from '../Middlewares/protectedRoute.js';

const router = express.Router();

router.get('/me', protectedRoutes, getMe)
router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', logOut)

export default router