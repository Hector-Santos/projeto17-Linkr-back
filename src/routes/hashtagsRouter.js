import { Router } from "express";
import { getCurrentTrending, hahstagPosts } from "../controllers/hashtagsController.js";

const router = Router();

router.get('/trending-hashtags', getCurrentTrending);
router.get('/hashtag/:hashtagName', hahstagPosts);

export default router;