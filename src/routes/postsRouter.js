import { Router } from "express";
import { getMetadataFromPostId, getTimeline, postPost, postsFromUser, postLikedPost, deleteLikedPost, getLikedPost, putLikePost } from "../controllers/postsControllers.js";
import { authentication } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import postsSchema from "../schemas/postsSchema.js";
import likedPostsSchema from "../schemas/likedPostsSchema.js";



const postsRouter = Router();

postsRouter.get('/timeline', authentication, getTimeline);
postsRouter.get('/get-url-metadata/:postId', authentication, getMetadataFromPostId);
postsRouter.post("/posts", (req, res, next) => validate(req, res, next, postsSchema),authentication, postPost);
postsRouter.get('/posts/:userId', authentication, postsFromUser);
postsRouter.post("/likedPosts", (req, res, next) => validate(req, res, next, likedPostsSchema),authentication, postLikedPost);
postsRouter.get("/likedPosts/:postId",authentication, getLikedPost);
postsRouter.delete("/likedPosts",(req, res, next) => validate(req, res, next, likedPostsSchema),authentication, deleteLikedPost);
postsRouter.put("/posts/:operation",(req, res, next) => validate(req, res, next, likedPostsSchema),authentication, putLikePost);

export default postsRouter;