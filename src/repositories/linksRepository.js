import postgres from "../databases/pgsql.js";

async function getLink(linkId){

    const { rows: links } = await postgres.query(`
        SELECT * FROM links
        WHERE id = $1
        LIMIT 1
    `, [
        linkId
    ]);

    return (links.length > 0) ? links.at(0) : null;

};

export {
    getLink
}