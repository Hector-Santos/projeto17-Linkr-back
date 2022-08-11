import express from 'express';
import authRouter from './authRouter.js';
import postsRouter from './postsRouter.js';
import usersRouter from './userRouter.js';


const router = express.Router();
router.use(authRouter)
router.use(usersRouter)
router.use(postsRouter)

export default router;