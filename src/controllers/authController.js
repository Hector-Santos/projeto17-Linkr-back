import  jwt  from 'jsonwebtoken';
import  {usersRepository}  from '../repositories/usersRepository.js';
import bcrypt from 'bcrypt';

export async function signUp(req, res) {
    const {email, password, userName, pictureUrl} = req.body
    try{
      const {rows:repetido} = await usersRepository.getUser(email)
      if(repetido.length) return res.sendStatus(409)
      const encrypted = bcrypt.hashSync(password, 10)
    await usersRepository.insertUser(email, encrypted, userName, pictureUrl)
      res.sendStatus(201);
    }catch(error){
      res.sendStatus(400)
    }
}

export async function signIn(req, res) {
  const {email, password} = req.body
  try{
    const {rows:login} = await usersRepository.getUser(email)
    if(!login.length || !bcrypt.compareSync(password, login[0].password) ) return res.sendStatus(401)
    const dados = { email: email };
    const chaveSecreta = process.env.JWT_SECRET;
    const token = jwt.sign(dados, chaveSecreta)
    res.status(201).send(token);
  }catch(error){
    res.sendStatus(409)
  }
}
