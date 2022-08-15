import postgres from '../databases/pgsql.js';

async function getTimelinePosts(){

    const { rows: posts } = await postgres.query(`
        SELECT 
            posts.id,
            posts.content,
            COUNT("likedPosts".id) AS likes,
            posts.link,
            JSON_BUILD_OBJECT(
                'id', users.id,
                'username', users.username,
                'pictureUrl', users."pictureUrl"
            ) AS author,
            ARRAY_AGG(
                COALESCE(hashtags.name, '')
            ) AS "hashtags"
        FROM posts
        JOIN users
        ON users.id = posts."userId"
        LEFT JOIN "hashtagPosts"
        ON posts.id = "hashtagPosts"."postId"
        LEFT JOIN hashtags
        ON hashtags.id = "hashtagPosts"."hashtagId"
        LEFT JOIN "likedPosts"
        ON "likedPosts"."postId" = posts.id
        GROUP BY posts.id, users.id, users.username, users."pictureUrl"
        ORDER BY posts."createdAt" DESC
        LIMIT 20
    `);

    return posts;

};

async function getPost(postId){

    const { rows: posts } = await postgres.query(`
        SELECT * FROM posts
        WHERE id = $1
        LIMIT 1
    `, [
        postId
    ]);

    return (posts.length > 0) ? posts.at(0) : null;

}

async function insertPost(userId, link, content) {
	return postgres.query('INSERT INTO posts ("userId",link,content) VALUES ($1,$2,$3)', [userId, link, content])
}

async function deletePostById(postId) {
    postgres.query(`
        DELETE FROM posts
        WHERE id = $1
    `, [postId]);
}

async function deleteHashtagsByPost(postId) {
    postgres.query(`
        DELETE FROM "hashtagPosts"
        WHERE "postId" = $1
    `, [postId]);
}

async function deleteLikesByPost(postId) {
    postgres.query(`
        DELETE FROM "likedPosts"
        WHERE "postId" = $1
    `, [postId]);
}

async function editPostById(postId, content) {
    postgres.query(`
        UPDATE posts
        SET content = $1
        WHERE id = $2
    `, [content, postId]);
}

async function getPostsFromUser(userId){

    const { rows: posts } = await postgres.query(`
        SELECT 
            posts.id,
            posts.content,
            COUNT("likedPosts".id) AS likes,
            posts.link,
            JSON_BUILD_OBJECT(
                'id', users.id,
                'username', users.username,
                'pictureUrl', users."pictureUrl"
            ) AS author,
            ARRAY_AGG(
                COALESCE(hashtags.name, '')
            ) AS "hashtags"
        FROM posts
        JOIN users
        ON users.id = posts."userId"
        LEFT JOIN "hashtagPosts"
        ON posts.id = "hashtagPosts"."postId"
        LEFT JOIN hashtags
        ON hashtags.id = "hashtagPosts"."hashtagId"
        LEFT JOIN "likedPosts"
        ON "likedPosts"."postId" = posts.id
        WHERE users.id = $1
        GROUP BY posts.id, users.id, users.username, users."pictureUrl"
        ORDER BY posts."createdAt" DESC
        LIMIT 20
    `, [
        userId
    ]);

    return posts;

}

async function addLike(postId) {
	return postgres.query('UPDATE posts SET likes = likes + 1 WHERE id = $1;', [postId])
}

async function subtractLike(postId) {
	return postgres.query('UPDATE posts SET likes = likes - 1 WHERE id = $1;', [postId])
}


export {
    getTimelinePosts,
    getPost,
    insertPost,
    getPostsFromUser,
    addLike,
    subtractLike,
    deletePostById,
    deleteHashtagsByPost,
    deleteLikesByPost,
    editPostById,
    getPostsFromUser
}