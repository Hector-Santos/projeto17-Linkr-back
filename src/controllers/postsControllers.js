import { getPost, getTimelinePosts, insertPost } from "../repositories/postsRepository.js";
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

export {
    getTimeline,
    getMetadataFromPostId
    postPost
}