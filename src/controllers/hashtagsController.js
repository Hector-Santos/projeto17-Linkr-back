import { getTrending, getHashtagPosts } from "../repositories/hashtagsRepository.js";

async function getCurrentTrending(req, res, next){

    try {
        
        const trendingHashtags = await getTrending();
        res.send(trendingHashtags);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};

async function hahstagPosts(req, res, next){

    const { hashtagName } = req.params;

    try {
        
        const posts = await getHashtagPosts(hashtagName);
        res.send(posts);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};

export {
    getCurrentTrending,
    hahstagPosts
};