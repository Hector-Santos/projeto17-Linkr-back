import postgres from "../databases/pgsql.js";

export async function getCommentsByPost(userId, postId) {
    const { rows: dbComments } = await postgres.query(`
        SELECT c.id, c."userId", u.username, u."pictureUrl", c.content,
            CASE WHEN u.id = p."userId" THEN true ELSE false END AS "postAuthor",
            (
                SELECT COUNT(*)::int FROM following f WHERE f."followedId" = u.id AND f."followerId" = $1
            ) AS "isFollower"
        FROM comments c
        JOIN posts p ON p.id = c."postId"
        JOIN users u ON u.id = c."userId"
        LEFT JOIN following f ON f."followedId" = p."userId" AND f."followerId" = u.id
        WHERE p.id = $2
        ORDER BY c.id
    `, [userId, postId]);

    console.log(dbComments);
    
    return dbComments;
}

export async function insertComment(userId, postId, content) {
    postgres.query(`
        INSERT INTO comments ("userId", "postId", content)
        VALUES ($1, $2, $3)
    `, [userId, postId, content]);
}