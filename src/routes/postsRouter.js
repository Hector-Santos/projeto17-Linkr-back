import { Router } from "express";
import { getMetadataFromPostId, getTimeline, postPost, postsFromUser } from "../controllers/postsControllers.js";
import { authentication } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import postsSchema from "../schemas/postsSchema.js";

const postsRouter = Router();

postsRouter.get('/timeline', authentication, getTimeline);
postsRouter.get('/get-url-metadata/:postId', authentication, getMetadataFromPostId);
postsRouter.post("/posts", (req, res, next) => validate(req, res, next, postsSchema),authentication, postPost);
postsRouter.get('/posts/:userId', authentication, postsFromUser);

export default postsRouter;