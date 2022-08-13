import jwt from "jsonwebtoken";

export function authentication(req, res, next) {
const authorization = req.headers.authorization
const token = authorization?.replace("Bearer ", "")
  if (!token) {
  return res.sendStatus(401);
  } 
const chaveSecreta = process.env.JWT_SECRET
try {
	const dados = jwt.verify(token, chaveSecreta)
    res.locals.dados = dados
} catch {
	return res.sendStatus(401);
}
    next()
}