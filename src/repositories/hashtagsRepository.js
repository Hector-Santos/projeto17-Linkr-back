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

async function getHashtagPosts(hashtagName, offset){

    const { rows: posts } = await postgres.query(`
        SELECT
            posts.id,
            posts.content,
            posts.likes,
            posts.link,
            JSON_BUILD_OBJECT(
                'id', users.id,
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
        LIMIT 10
        OFFSET $2`,[
            hashtagName, offset
    ]);

    return posts;

}


async function countHashtagPosts(hashtagName, offset){

    const { rows: posts } = await postgres.query(`
    SELECT
    COUNT("hashtags".id) 
            FROM "posts"
            JOIN "hashtagPosts"
            ON "posts".id = "hashtagPosts"."postId"
            JOIN "hashtags"
            ON hashtags.id = "hashtagPosts"."hashtagId"
            WHERE hashtags."name" = $1
            GROUP BY  hashtags.id
            LIMIT 10
            OFFSET $2`,[
            hashtagName, offset
    ]);

    return posts;

}

async function createHahstag(name){

    return postgres.query(`
        INSERT INTO hashtags (name) VALUES ($1)
    `, [
        name
    ]);

}

async function searchHashtag(name){

    const { rows: hashtags } = await postgres.query(`
        SELECT * FROM hashtags
        WHERE name = $1
        LIMIT 1
    `, [
        name
    ]);

    return (hashtags.length > 0) ? hashtags[0] : null;

}

async function createHashtagPostRelation(postId, hashtagId){

    return postgres.query(`
        INSERT INTO "hashtagPosts" ("postId", "hashtagId") VALUES ($1, $2)
    `, [
        postId,
        hashtagId
    ]);

}

/**
 * @description Essa função espera receber um array de hashtags para que sejam inseridas no banco caso ainda não tenham sido.
 * @param {Array} hashtags Um array de hashtags (strings)
 */
async function createIfDoesntExist(hashtags = []){

    for(const hashtagName of hashtags){

        const exists = await searchHashtag(hashtagName);
        if(!exists) await createHahstag(hashtagName);

    }

}

/**
 * @description Essa função espera receber dois parâmetros. O ID do post e as hashtags que serão vinculadas a ele.
 * @param {Number} postId O ID único da postagem
 * @param {Array} hashtags Um array de hashtags (strings)
 */
async function createRelationships(postId, hashtags = []){

    for(const hashtagName of hashtags){

        const hashtagData = await searchHashtag(hashtagName);

        if(hashtagData) await createHashtagPostRelation(postId, hashtagData.id);

    }

}

export {
    getTrending,
    getHashtagPosts,
    createIfDoesntExist,
    createRelationships,
    countHashtagPosts
};