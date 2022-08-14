import postgres from "../databases/pgsql.js";

async function getLiked(postId,userId) {
	return postgres.query('SELECT * FROM "likedPosts" WHERE "postId" = $1 AND "userId" = $2', [postId,userId]);
}


async function insertLikedPost(postId,userId) {
	return postgres.query('INSERT INTO "likedPosts" ("postId","userId") VALUES ($1,$2)', [postId,userId])
}

async function deleteLiked(postId,userId) {
	return postgres.query('DELETE FROM "likedPosts" WHERE "postId" = $1 AND "userId" = $2', [postId,userId])
}

export {
    getLiked,
    insertLikedPost,
    deleteLiked
}

