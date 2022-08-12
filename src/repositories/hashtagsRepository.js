import postgres from "../databases/pgsql.js";

async function getTrending(){

    const { rows: hashtags } = await postgres.query(`
        SELECT
            COUNT(hashtags.id) AS "count",
            hashtags.name
        FROM hashtags
        JOIN "hashtagPosts"
        ON hashtags.id = "hashtagPosts"."hashtagId"
        GROUP BY hashtags.id
        ORDER BY "count" DESC
        LIMIT 10
    `);

    return hashtags;

}

async function getHashtagPosts(hashtagName){

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
                hashtags.name
            ) AS "hashtags"
        FROM "posts"
        JOIN "users"
        ON "posts"."userId" = "users".id
        JOIN "hashtagPosts"
        ON "posts".id = "hashtagPosts"."postId"
        JOIN "hashtags"
        ON hashtags.id = "hashtagPosts"."hashtagId"
        WHERE hashtags."name" = $1
        GROUP BY posts.id, users.id
        ORDER BY posts."createdAt" DESC
        LIMIT 20
    `, [
        hashtagName
    ]);

    return posts;

}

export {
    getTrending,
    getHashtagPosts
};