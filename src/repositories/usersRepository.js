import postgres from "../databases/pgsql.js";

async function getUser(email) {
	return postgres.query('SELECT * FROM users WHERE email=$1', [email]);
}

async function getUserById(id) {
	return postgres.query('SELECT * FROM users WHERE id=$1', [id]);
}

async function getUserByName (name) {
	return postgres.query(`
		SELECT users.id, users.username, users."pictureUrl"
		FROM users
		WHERE users.username
		ILIKE '${name}%'
	`)
}


async function insertUser(email, password, userName, pictureUrl) {
	return postgres.query('INSERT INTO users (email,password,username,"pictureUrl") VALUES ($1,$2,$3,$4)', [email, password, userName, pictureUrl])
}

async function getById(id){

	const { rows: users } = await postgres.query(`
		SELECT * FROM users
		WHERE id = $1
		LIMIT 1
	`, [id]);

	return (users.length > 0) ? users.at(0) : null;

}

async function isFollowing(followerId, followedId){

	const { rows } = await postgres.query(`
		SELECT * FROM following
		WHERE following."followerId" = $1 AND following."followedId" = $2
		LIMIT 1
	`, [
		followerId,
		followedId
	]);

	return (rows.length > 0);


}

async function followUser(followerId, followedId){

	return postgres.query(`
		INSERT INTO following ("followerId", "followedId")
		VALUES ($1, $2)
	`, [
		followerId,
		followedId
	]);

}

async function unfollowUser(followerId, followedId){

	return postgres.query(`
		DELETE FROM following
		WHERE following."followerId" = $1 AND following."followedId" = $2
	`, [
		followerId,
		followedId
	]);

}

export const usersRepository = {
	getUser,
	getUserById,
	getUserByName,
    insertUser,
	getById,
	isFollowing,
	followUser,
	unfollowUser
}