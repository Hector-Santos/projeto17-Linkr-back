import postgres from '../databases/pgsql.js';

async function getTimelinePosts(){

    const { rows: posts } = await postgres.query(`
        SELECT 
            posts.id,
            posts.content,
            posts.likes,
            posts.link,
            JSON_BUILD_OBJECT(
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
        GROUP BY posts.id, users.username, users."pictureUrl"
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

async function getPostsFromUser(userId){

    const { rows: posts } = await postgres.query(`
        SELECT 
            posts.id,
            posts.content,
            posts.likes,
            posts.link,
            JSON_BUILD_OBJECT(
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
        WHERE users.id = $1
        GROUP BY posts.id, users.username, users."pictureUrl"
        ORDER BY posts."createdAt" DESC
        LIMIT 20
    `, [
        userId
    ]);

    return posts;

}

export {
    getTimelinePosts,
    getPost,
    insertPost,
    getPostsFromUser
}