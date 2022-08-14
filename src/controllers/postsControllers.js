import { getPost, getPostsFromUser, getTimelinePosts, insertPost, deletePostById, editPostById } from "../repositories/postsRepository.js";
import getMetadata from "../utils/getMetadata.js";
import  {usersRepository}  from '../repositories/usersRepository.js';


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
    const id = res.locals.dados.id
    try{
      const {rows:user} = await usersRepository.getUserById(id)
      if(!user.length) return res.sendStatus(401)
      
      await insertPost(user[0].id, link, content)
        res.sendStatus(201);
      }catch(error){
        console.log(error)
        res.sendStatus(400)
      }  

};

async function deletePost (req, res) {
    const { id: postId } = req.params;

    try {
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
        res.send(posts);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};

export {
    getTimeline,
    getMetadataFromPostId,
    postPost,
    deletePost,
    editPost,
    postsFromUser
}