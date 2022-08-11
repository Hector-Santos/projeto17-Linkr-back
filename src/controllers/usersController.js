import  {usersRepository}  from '../repositories/usersRepository.js';

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


export {
    getUser
}