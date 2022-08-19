import { 
    getPost, 
    getPostsFromUser, 
    getTimelinePosts,
    countPosts, 
    insertPost, 
    deletePostById, 
    editPostById,  
    addLike, 
    subtractLike, 
    deleteLikesByPost, 
    deleteHashtagsByPost, 
    getLastLikes,
    repost,
    getReposts} from "../repositories/postsRepository.js";
import getMetadata from "../utils/getMetadata.js";
import  {usersRepository}  from '../repositories/usersRepository.js';
import {getLiked, insertLikedPost, deleteLiked} from "../repositories/likedPostsRepository.js";
import { createIfDoesntExist, createRelationships } from "../repositories/hashtagsRepository.js";
import { countFollowing } from "../repositories/followersRepository.js";

async function getTimeline(req, res, next){

    const { id: userId } = res.locals.dados;
    let offset = 0
    req.params.offset? offset = req.params.offset : offset = 0
    try {
        
        const posts = await getTimelinePosts(userId,offset);
        const followingCount = await countFollowing(userId);

        res.send({ posts, followingCount });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};

async function getCountPosts(req, res, next){

    const { id: userId } = res.locals.dados;
   
    try {

        const count = await countPosts(userId);
        if(count.length === 0) return res.send(0)
           res.send(count[0].count) 
        

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};

async function getMetadataFromPostId(req, res, next){

    const { postId } = req.params;

    try {
        
        const linkData = await getPost(postId);
        if(!linkData) return res.sendStatus(404);

        const metadata = await getMetadata(linkData.link);
        const { title, description, image } = metadata;
        res.send({ title, description, image, ogUrl: metadata["og:url"] });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

async function postPost(req, res){

    const { content, link, hashtags } = req.body;
    const id = res.locals.dados.id;

    try{

        const {rows:user} = await usersRepository.getUserById(id);
        if(!user.length) return res.sendStatus(401);
      
        const { rows: posts } = await insertPost(user[0].id, link, content);

        await createIfDoesntExist(hashtags);
        await createRelationships(posts[0].id, hashtags);

        res.sendStatus(201);

    }catch(error){
        console.log(error);
        res.sendStatus(400);
    }  

};

async function deletePost (req, res) {
    const { id: postId } = req.params;
    const likes = res.locals.dados.likes;
    const hashtags = res.locals.dados.hashtags;

    try {
        if (likes > 0) {
            await deleteLikesByPost(postId);
        }

        if (hashtags > 0) {
            await deleteHashtagsByPost(postId);
        } 

        await deletePostById(postId);

        res.status(200).send("Post successfully deleted");
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function editPost (req, res) {
    const { id: postId } = req.params;
    const content = req.body.content;

    try {
        await editPostById(postId, content);
        
        return res.status(200).send("Post successfully edited");
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function postsFromUser(req, res, next){

    const { userId } = req.params;

    try {
        
        const posts = await getPostsFromUser(userId);
        res.send({ posts });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};


async function postLikedPost(req, res, next){
    const userId = res.locals.dados.id
    const postId = req.body.postId

    try {

        const {rows:hasLike} = await getLiked(postId,userId);
        hasLike.length? res.sendStatus(409) : await insertLikedPost(postId,userId);
        res.sendStatus(201);

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
   
};

async function getLikedPost(req, res, next){
    const userId = res.locals.dados.id
    const postId = req.params.postId
    try {
        const {rows:hasLike} = await getLiked(postId,userId);
        hasLike.length? res.status(200).send(true): res.status(200).send(false)
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
};

async function deleteLikedPost(req, res, next){
    const userId = res.locals.dados.id
    const postId = req.body.postId
''
    try {
        await deleteLiked(postId,userId);
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
};


async function putLikePost(req, res, next){
    const postId = req.body.postId
    const userId = res.locals.dados.id
    const operation = req.params.operation
    try {
        if(operation === "add" && userId){
        await addLike(postId);
          return res.sendStatus(200);
        }else if(operation === "subtract" && userId){
            await subtractLike(postId);
            return res.sendStatus(200);
        }else{
          return res.sendStatus(401) 
        }

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
};

async function lastLikesInfo(req, res, next){

    const { id } = req.params;

    try {
        
        const likes = await getLastLikes(id);
        res.send(likes);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};

async function repostPost(req, res, next){

    const { id: postId } = req.params;
    const { id: userId } = res.locals.dados;

    try {
        
        await repost(postId, userId);
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};

async function getPostReposts(req, res, next){

    const { id: postId } = req.params;

    try {
        
        const reposts = await getReposts(postId);
        res.send(reposts);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export {
    getTimeline,
    getMetadataFromPostId,
    postPost,
    postsFromUser,
    postLikedPost,
    getLikedPost,
    deleteLikedPost,
    putLikePost,
    deletePost,
    editPost,
    lastLikesInfo,
    getCountPosts,
    repostPost,
    getPostReposts

}