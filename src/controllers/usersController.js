import { usersRepository }  from '../repositories/usersRepository.js';

export async function getUsers (req, res) {
    const { name } = req.params;

    try {
        const { rows: dbUsers } = await usersRepository.getUserByName(name);

        res.status(200).send(dbUsers);
    } catch (error) {
        res.sendStatus(500);
    }
}