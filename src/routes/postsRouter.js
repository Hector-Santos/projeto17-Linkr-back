import { Router } from "express";
import { getMetadataFromPostId, getTimeline, postPost } from "../controllers/postsControllers.js";
import { authentication } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import postsSchema from "../schemas/postsSchema.js";

const postsRouter = Router();

router.get('/timeline', getTimeline);
router.get('/get-url-metadata/:postId', getMetadataFromPostId);
postsRouter.post("/posts", (req, res, next) => validate(req, res, next, postsSchema),authentication, postPost);

export default postsRouter;