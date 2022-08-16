import postgres from './../databases/pgsql.js';

async function countFollowing(userId){

    const { rows } = await postgres.query(`
        SELECT 
            COUNT("following".id) AS qty
        FROM "following"
        WHERE "following"."followerId" = $1
        GROUP BY "following"."followerId"
    `, [
        userId
    ]);

    return (rows.length > 0) ? Number(rows[0].qty) : 0;

}

async function countFollowers(userId){

    const { rows } = await postgres.query(`
        SELECT 
            COUNT("following".id) AS qty
        FROM "following"
        WHERE "following"."followedId" = $1
        GROUP BY "following"."followedId"
    `, [
        userId
    ]);

    return (rows.length > 0) ? Number(rows[0].qty) : 0;

}

export {
    countFollowing,
    countFollowers
}