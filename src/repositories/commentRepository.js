import postgres from "../databases/pgsql.js";

export async function getCommentsByPost(postId) {
    const { rows: dbComments } = await postgres.query(`
    SELECT u.username, u."pictureUrl", c.content,
        CASE WHEN u.id = p."userId" THEN true ELSE false END AS "postAuthor",
        CASE WHEN u.id = f."followerId" THEN true ELSE false END AS "following"
    FROM comments c
    JOIN users u ON u.id = c."userId"
    JOIN posts p ON p.id = c."postId"
    LEFT JOIN following f ON f."followedId" = p."userId"
    WHERE p.id = $1
    ORDER BY c.id
    `, [postId]);

    console.log(dbComments);
    
    return dbComments;
}

export async function getNumberOfComments(postId) {
    const {rows: dbComments } = await postgres.query(`
        SELECT "postId",
        COUNT (*)
        AS "commentsNum"
        FROM comments
        WHERE "postId" = $1
        GROUP BY "postId";
    `, [postId]);

    return dbComments;
}

export async function insertComment(userId, postId, content) {
    postgres.query(`
        INSERT INTO comments ("userId", "postId", content)
        VALUES ($1, $2, $3)
    `, [userId, postId, content]);
}