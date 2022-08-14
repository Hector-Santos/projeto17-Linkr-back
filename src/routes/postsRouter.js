import { Router } from "express";
import { getMetadataFromPostId, getTimeline, postPost, postsFromUser, deletePost, editPost } from "../controllers/postsControllers.js";
import { authentication } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { deleteValidation, editValidation } from "../middlewares/postMiddleware.js";
import { postsSchema, editSchema } from "../schemas/postsSchema.js";

const postsRouter = Router();

postsRouter.get('/timeline', authentication, getTimeline);
postsRouter.get('/get-url-metadata/:postId', authentication, getMetadataFromPostId);
postsRouter.post("/posts", (req, res, next) => validate(req, res, next, postsSchema),authentication, postPost);
postsRouter.delete("/post/:id", authentication, deleteValidation, deletePost);
postsRouter.get('/posts/:userId', authentication, postsFromUser);
postsRouter.put("/post/:id", (req, res, next) => validate(req, res, next, editSchema), authentication, editValidation, editPost);

export default postsRouter;