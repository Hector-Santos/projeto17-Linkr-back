import { usersRepository } from "../repositories/usersRepository.js";
import { insertComment } from "../repositories/commentRepository.js";

export async function postComment(req, res) {
    const content = req.body.content;
    const postId = req.params.id;
    const userId = res.locals.dados.id;

    try {
        const { rows: dbUsers } = await usersRepository.getUserById(userId);

        if (!dbUsers.length) {
            res.sendStatus(404);
        }

        await insertComment(dbUsers[0].id, postId, content);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}