import { Router } from "express";
import { getMetadataFromPostId, getTimeline, postPost, postsFromUser, postLikedPost, deleteLikedPost, getLikedPost, putLikePost, deletePost, editPost, lastLikesInfo, getCountPosts } from "../controllers/postsControllers.js";
import { authentication } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import likedPostsSchema from "../schemas/likedPostsSchema.js";
import { deleteValidation, editValidation } from "../middlewares/postMiddleware.js";
import { postsSchema, editSchema } from "../schemas/postsSchema.js";


const postsRouter = Router();

postsRouter.get('/timeline', authentication, getTimeline);
postsRouter.get('/countposts', authentication, getCountPosts);
postsRouter.get('/get-url-metadata/:postId', authentication, getMetadataFromPostId);
postsRouter.post("/posts", (req, res, next) => validate(req, res, next, postsSchema),authentication, postPost);
postsRouter.delete("/post/:id", authentication, deleteValidation, deletePost);
postsRouter.get('/posts/:userId', authentication, postsFromUser);
postsRouter.post("/likedPosts", (req, res, next) => validate(req, res, next, likedPostsSchema),authentication, postLikedPost);
postsRouter.get("/likedPosts/:postId",authentication, getLikedPost);
postsRouter.delete("/likedPosts",(req, res, next) => validate(req, res, next, likedPostsSchema),authentication, deleteLikedPost);
postsRouter.put("/posts/:operation",(req, res, next) => validate(req, res, next, likedPostsSchema),authentication, putLikePost);
postsRouter.put("/post/:id", (req, res, next) => validate(req, res, next, editSchema), authentication, editValidation, editPost);
postsRouter.get('/posts/:id/last-likes', authentication, lastLikesInfo);


export default postsRouter;