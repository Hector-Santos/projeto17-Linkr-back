import postgres from '../databases/pgsql.js';

async function getTimelinePosts(userId){

    const { rows: posts } = await postgres.query(`
        SELECT 
            posts."createdAt" AS "postCreation",
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
            ) AS "hashtags",
            reposts."originalPostId",
            "repostAuthor".username AS "repostAuthorUsername",
            "repostAuthor".id AS "repostAuthorId"
        FROM reposts
        JOIN "posts"
        ON "reposts"."originalPostId" = posts.id
        JOIN users "repostAuthor"
        ON reposts."repostingUserId" = "repostAuthor".id
        JOIN users
        ON users.id = posts."userId"
        LEFT JOIN "hashtagPosts"
        ON posts.id = "hashtagPosts"."postId"
        LEFT JOIN hashtags
        ON hashtags.id = "hashtagPosts"."hashtagId"
        LEFT JOIN "likedPosts"
        ON "likedPosts"."postId" = posts.id
        LEFT JOIN "following"
        ON "following"."followerId" = $1
        WHERE "following"."followedId" = reposts."repostingUserId" OR "following"."followedId" = posts."userId" OR reposts."repostingUserId" = $1
        GROUP BY posts.id, users.id, users.username, users."pictureUrl", reposts."originalPostId", reposts."repostingUserId", "repostAuthor".username, "repostAuthor".id

        UNION ALL

        SELECT 
            posts."createdAt" AS "postCreation",
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
            ) AS "hashtags",
            NULL,
            NULL,
            NULL
        FROM posts
        JOIN users
        ON users.id = posts."userId"
        LEFT JOIN "hashtagPosts"
        ON posts.id = "hashtagPosts"."postId"
        LEFT JOIN hashtags
        ON hashtags.id = "hashtagPosts"."hashtagId"
        LEFT JOIN "likedPosts"
        ON "likedPosts"."postId" = posts.id
        LEFT JOIN "following"
        ON "following"."followedId" = posts."userId"
        WHERE "following"."followerId" = $1 OR posts."userId" = $1
        GROUP BY posts.id, users.id, users.username, users."pictureUrl"
        ORDER BY "postCreation" DESC
        LIMIT 20
    `, [
        userId
    ]);

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
	return postgres.query('INSERT INTO posts ("userId",link,content) VALUES ($1,$2,$3) RETURNING id', [userId, link, content])
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

async function getLastLikes(postId){

    const { rows: likes } = await postgres.query(`
        SELECT 
            JSON_BUILD_OBJECT(
                'username', users.username,
                'id', users.id
            ) AS "user",
            COUNT("likedPosts".id) AS "total"
        FROM posts
        LEFT JOIN "likedPosts"
        ON posts.id = "likedPosts"."postId"
        LEFT JOIN users
        ON "likedPosts"."userId" = users.id
        WHERE "posts"."id" = $1
        GROUP BY "likedPosts"."postId", "likedPosts"."createdAt", users.id, users.username
        ORDER BY "likedPosts"."createdAt" DESC
        LIMIT 2
    `, [
        postId
    ]);

    return likes;

}

async function repost(postId, userId){

    await postgres.query(`
        INSERT INTO reposts ("originalPostId", "repostingUserId") VALUES ($1, $2)
    `, [
        postId,
        userId
    ]);

};

async function getReposts(postId){

    const { rows: reposts } = await postgres.query(`
        SELECT * FROM reposts
        WHERE "originalPostId" = $1
    `, [
        postId
    ]);

    return reposts;

};

export {
    getTimelinePosts,
    getPost,
    insertPost,
    addLike,
    subtractLike,
    deletePostById,
    deleteHashtagsByPost,
    deleteLikesByPost,
    editPostById,
    getPostsFromUser,
    getLastLikes,
    repost,
    getReposts
}