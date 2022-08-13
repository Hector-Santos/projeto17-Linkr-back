import { usersRepository }  from '../repositories/usersRepository.js';

async function getUser(req, res){
    const id = res.locals.dados.id
    try{
      const {rows:user} = await usersRepository.getUserById(id)
      
      if(!user.length) return res.sendStatus(401);
     
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

export {
    getUser,
    getUsersByName
}