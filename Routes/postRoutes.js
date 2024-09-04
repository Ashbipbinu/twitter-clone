import express from 'express';
import { protectedRoutes } from '../Middlewares/protectedRoute.js';
import { commentPost, createPost, deletePost, getAllPost, getFollowingPosts, getUsersPosts, likeUnlikePost } from '../Controllers/post.controllers.js';

const router = express.Router();

router.get('/all', protectedRoutes, getAllPost);
router.get('/following',protectedRoutes, getFollowingPosts);
router.get('/:username',protectedRoutes, getUsersPosts);
router.post('/create', protectedRoutes, createPost)
router.post('/like/:_id', protectedRoutes,likeUnlikePost)
router.post('/comment/:_id', protectedRoutes,commentPost)  
router.delete('/delete/:_id', protectedRoutes, deletePost)


export default router