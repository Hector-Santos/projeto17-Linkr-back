import { Router } from "express";
import { getMetadataFromLink, getTimeline, postPost } from "../controllers/postsControllers.js";
import { authentication } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import postsSchema from "../schemas/postsSchema.js";

const postsRouter = Router();

postsRouter.get('/timeline', getTimeline);
postsRouter.get('/get-url-metadata/:linkId', getMetadataFromLink);
postsRouter.post("/posts", (req, res, next) => validate(req, res, next, postsSchema),authentication, postPost);

export default postsRouter;