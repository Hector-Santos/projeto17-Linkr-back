import  {usersRepository}  from '../repositories/usersRepository.js';

async function getUser(req, res){
    const email = res.locals.dados.email
    try{
      const {rows:user} = await usersRepository.getUser(email)
      if(!user.length) return res.sendStatus(401)
      res.status(200).send(user[0])
      }catch(error){
        console.log(error)
        res.sendStatus(400)
      }  

};


export {
    getUser
}