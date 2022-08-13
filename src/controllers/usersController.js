import { usersRepository }  from '../repositories/usersRepository.js';

async function getUser(req, res){
    const email = res.locals.dados.email
    try{
      const {rows:user} = await usersRepository.getUser(email)
      if(!user.length) return res.sendStatus(401)
     
      res.status(200).send({
       id: user[0].id,
       email:user[0].email,
       username:user[0].username,
       pictureUrl:user[0].pictureUrl,
       createdAt:user[0].createdAt})
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