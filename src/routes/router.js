import express from 'express';

import authRouter from './authRouter.js';
import postsRouter from './postsRouter.js';
import usersRouter from './userRouter.js';
import commentRouter from './commentRouter.js';

const router = express.Router();

router.use(authRouter);
router.use(postsRouter);
router.use(usersRouter);
router.use(commentRouter);

export default router;