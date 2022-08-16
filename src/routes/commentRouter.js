import { Router } from "express";

import { postComment } from "../controllers/commentController.js";
import { authentication } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { commentValidation } from "../middlewares/postMiddleware.js";
import commentSchema from "../schemas/commentSchema.js";

const commentRouter = Router();

commentRouter.post(
    "/comment/:id", 
    (req, res, next) => validate(req, res, next, commentSchema), 
    authentication, 
    commentValidation, 
    postComment
);

export default commentRouter;

