import postgres from "../databases/pgsql.js";

async function getUser(email) {
	return postgres.query('SELECT * FROM users WHERE email=$1', [email]);
}

async function insertUser(email, password, userName, pictureUrl) {
	return postgres.query('INSERT INTO users (email,password,username,"pictureUrl") VALUES ($1,$2,$3,$4)', [email, password, userName, pictureUrl])
}

export const usersRepository = {
	getUser,
    insertUser
}