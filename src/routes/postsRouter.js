import { Router } from "express";
import { getMetadataFromLink, getTimeline } from "../controllers/postsControllers.js";

const router = Router();

router.get('/timeline', getTimeline);
router.get('/get-url-metadata/:linkId', getMetadataFromLink);

export default router;