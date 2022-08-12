import { Router } from "express";
import { getMetadataFromPostId, getTimeline } from "../controllers/postsControllers.js";

const router = Router();

router.get('/timeline', getTimeline);
router.get('/get-url-metadata/:postId', getMetadataFromPostId);

export default router;