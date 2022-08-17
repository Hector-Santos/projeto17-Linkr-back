import { Router } from "express";

import { getUser, getUserById, getUsersByName, getUserId, checkIfUserIsFollowing, follow, unfollow} from "../controllers/usersController.js";
import { authentication } from "../middlewares/authMiddleware.js";

const usersRouter = Router();

usersRouter.get("/users",authentication, getUser);
//usersRouter.get("/search/:name", authentication, getUsersByName);
//usersRouter temporariamente sem autenticação
usersRouter.get("/search/:name", getUsersByName);
usersRouter.get('/users/:id', getUserById);
usersRouter.get('/users/:id/is-following', authentication, checkIfUserIsFollowing);
usersRouter.post('/users/:id/follow', authentication, follow);
usersRouter.post('/users/:id/unfollow', authentication, unfollow);
usersRouter.get("/userId", authentication, getUserId);

export default usersRouter;