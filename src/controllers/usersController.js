import { usersRepository }  from '../repositories/usersRepository.js';

async function getUser(req, res){
    const id = res.locals.dados.id
    console.log(id)
    try{
      const user = await usersRepository.getById(id)
      if(!user){ return res.sendStatus(401)
      }else{
        res.status(200).send({
            id: user.id,
            email:user.email,
            username:user.username,
            pictureUrl:user.pictureUrl,
            createdAt:user.createdAt})
      }
     
      
      }catch(error){
        console.log(error)
        res.sendStatus(400)
      }  
};

async function getUsersByName (req, res) {
    const { name } = req.params;

    try {
        const { rows: dbUsers } = await usersRepository.getUserByName(name);

        res.status(200).send(dbUsers);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function getUserById(req, res, next){

    const { id } = req.params;

    try {
        
        const userData = await usersRepository.getById(id);
        if(!userData) return res.sendStatus(404);
        const { username, pictureUrl } = userData;
        res.send({ username, pictureUrl });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

}

export {
    getUser,
    getUsersByName,
    getUserById
}