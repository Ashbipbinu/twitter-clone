import express from "express";
import {
  followUnfollowUser,
  getSuggestedProfiles,
  getUserProfile,
  updateUserProfile,
} from "../Controllers/users.controllers.js";
import { protectedRoutes } from "../Middlewares/protectedRoute.js";
const router = express.Router();

router.get("/profile/:username", protectedRoutes, getUserProfile);
router.get("/suggested", protectedRoutes, getSuggestedProfiles);
router.post("/follow/:id", protectedRoutes, followUnfollowUser);
router.post("/update", protectedRoutes, updateUserProfile);


export default router;
