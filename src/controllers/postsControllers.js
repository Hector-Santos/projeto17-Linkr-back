import { getPost, getPostsFromUser, getTimelinePosts, insertPost, addLike, subtractLike } from "../repositories/postsRepository.js";
import getMetadata from "../utils/getMetadata.js";
import  {usersRepository}  from '../repositories/usersRepository.js';
import {getLiked, insertLikedPost, deleteLiked} from "../repositories/likedPostsRepository.js";


async function getTimeline(req, res, next){

    try {
        
        const posts = await getTimelinePosts();
        res.send(posts);

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
    const content =  req.body.content
    const link = req.body.link
    const email = res.locals.dados.email
    try{
      const {rows:user} = await usersRepository.getUser(email)
      if(!user.length) return res.sendStatus(401)
      
      await insertPost(user[0].id, link, content)
        res.sendStatus(201);
      }catch(error){
        console.log(error)
        res.sendStatus(400)
      }  

};

async function postsFromUser(req, res, next){

    const { userId } = req.params;

    try {
        
        const posts = await getPostsFromUser(userId);
        res.send(posts);

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




export {
    getTimeline,
    getMetadataFromPostId,
    postPost,
    postsFromUser,
    postLikedPost,
    getLikedPost,
    deleteLikedPost,
    putLikePost
}