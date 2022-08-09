import postgres from '../databases/pgsql.js';

async function getTimelinePosts(){

    const { rows: posts } = await postgres.query(`
        SELECT 
            posts.id,
            posts.content,
            JSON_BUILD_OBJECT(
                'username', users.username,
                'pictureUrl', users."pictureUrl"
            ) AS author,
            ARRAY_AGG(
                links.url
            ) AS "links",
            ARRAY_AGG(
                hashtags.name
            ) AS "hashtags"
        FROM posts
        JOIN users
        ON users.id = posts."userId"
        JOIN links
        ON links."postId" = posts.id
        JOIN "hashtagPosts"
        ON posts.id = "hashtagPosts"."postId"
        JOIN hashtags
        ON hashtags.id = "hashtagPosts"."hashtagId"
        GROUP BY posts.id, users.username, users."pictureUrl"
        ORDER BY posts."createdAt" DESC
        LIMIT 20
    `);

    return posts;

};

export {
    getTimelinePosts
}