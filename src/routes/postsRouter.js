import { Router } from "express";
import { deletePost, getMetadataFromPostId, getTimeline, postPost } from "../controllers/postsControllers.js";
import { authentication } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { editValidation } from "../middlewares/postMiddleware.js";
import postsSchema from "../schemas/postsSchema.js";

const postsRouter = Router();

postsRouter.get('/timeline', getTimeline);
postsRouter.get('/get-url-metadata/:postId', getMetadataFromPostId);
postsRouter.post("/posts", (req, res, next) => validate(req, res, next, postsSchema),authentication, postPost);
postsRouter.delete("/post/:id", authentication, editValidation, deletePost);

export default postsRouter;