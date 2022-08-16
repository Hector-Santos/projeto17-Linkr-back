import postgres from "../databases/pgsql.js";

export async function insertComment (userId, postId, content) {
    postgres.query(`
        INSERT INTO comments ("userId", "postId", content)
        VALUES ($1, $2, $3)
    `, [userId, postId, content])
}