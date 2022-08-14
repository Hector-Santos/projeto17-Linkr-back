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

export {
    deleteValidation,
    editValidation
};