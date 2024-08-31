import express from 'express'
import { logIn, logOut, signUp } from '../Controllers/auth.controllers.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', logOut)

export default router