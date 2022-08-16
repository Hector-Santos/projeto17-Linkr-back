import { Router } from "express";

import { getComments, getCommentsCount, postComment } from "../controllers/commentController.js";
import { authentication } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { commentValidation } from "../middlewares/postMiddleware.js";
import commentSchema from "../schemas/commentSchema.js";

const commentRouter = Router();

commentRouter.get(
    "/comments/:postId", 
    authentication, 
    commentValidation,
    getComments
);

commentRouter.get(
    "/comments/count/:postId",
    authentication,
    commentValidation,
    getCommentsCount
);

commentRouter.post(
    "/comments/:postId", 
    (req, res, next) => validate(req, res, next, commentSchema), 
    authentication, 
    commentValidation, 
    postComment
);

export default commentRouter;

