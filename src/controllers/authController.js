import  jwt  from 'jsonwebtoken';
import  {userRepository}  from '../repositories/usersRepository.js';
import bcrypt from 'bcrypt';

export async function signUp(req, res) {
    const user = req.body
    try{
      const {rows:repetido} = await userRepository.getUser(user.email)
      if(repetido.length) return res.sendStatus(409)
      const encrypted = bcrypt.hashSync(user.password, 10)
    await userRepository.insertUser(user.name, user.email, encrypted)
      res.sendStatus(201);
    }catch(error){
      res.sendStatus(400)
    }
}

export async function signIn(req, res) {
  const user = req.body
  try{
    const {rows:login} = await userRepository.getUser(user.email)

    if(!login.length || !bcrypt.compareSync(user.password, login[0].password) ) return res.sendStatus(401)
    const dados = { email: user.email };
    const chaveSecreta = process.env.JWT_SECRET;
    const token = jwt.sign(dados, chaveSecreta)
    res.status(201).send(token);
  }catch(error){
    res.sendStatus(400)
  }
}
