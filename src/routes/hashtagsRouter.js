import { Router } from "express";
import { getCurrentTrending, hahstagPosts, getCountHashtagPosts } from "../controllers/hashtagsController.js";

const router = Router();

router.get('/trending-hashtags', getCurrentTrending);
router.get('/hashtag/:hashtagName/:offset', hahstagPosts);
router.get('/countpostshashtags/:hashtagName', getCountHashtagPosts);

export default router;