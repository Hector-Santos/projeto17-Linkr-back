import postgres from "../databases/pgsql.js";

export async function getCommentsByPost(postId) {
    const { rows: dbComments } = await postgres.query(`
        SELECT *
        FROM comments
        WHERE "postId" = $1
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

    console.log(dbComments);

    return dbComments;
}

export async function insertComment(userId, postId, content) {
    postgres.query(`
        INSERT INTO comments ("userId", "postId", content)
        VALUES ($1, $2, $3)
    `, [userId, postId, content]);
}