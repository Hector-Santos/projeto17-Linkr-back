import { getPost } from "../repositories/postsRepository.js";

async function deleteValidation (req, res, next) {
    const userId = res.locals.dados.id;
    const { id: postId } = req.params;

    const post = await getPost(postId);


    if (!post) {
        return res.status(404).send("This post does not exist.")
    }

    if (post.userId !== userId) {
        return res.status(401).send("You cannot delete this post.")
    }

    if (post.likes > 0) {
        const likes = post.likes;
        res.locals.dados.likes = likes;
        console.log("Likes: " + likes);
    }

    if (post.hashtags > 0) {
        const hashtags = post.hashtags;
        res.locals.dados.hashtags = hashtags;
        console.log("hashtags: " + hashtags);
    }

    res.locals.postId = postId;
    next();
}

async function editValidation (req, res, next) {
    const userId = res.locals.dados.id;
    const { id: postId } = req.params;

    const post = await getPost(postId);

    if (!post) {
        return res.status(404).send("This post does not exist.")
    }

    if (post.userId !== userId) {
        return res.status(401).send("You cannot edit this post.")
    } 

    res.locals.postId = postId;
    next();
}

async function commentValidation (req, res, next) {
    const postId = req.params.postId;

    const post = await getPost(postId);

    if (!post) {
        return res.status(404).send("This post does not exist.")
    }

    res.locals.postId = postId;
    next();
};

export {
    deleteValidation,
    editValidation,
    commentValidation
};