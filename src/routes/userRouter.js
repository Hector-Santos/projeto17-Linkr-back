import { Router } from "express";

import { getUser, getUserById, getUsersByName, getUserId} from "../controllers/usersController.js";
import { authentication } from "../middlewares/authMiddleware.js";

const usersRouter = Router();

usersRouter.get("/users",authentication, getUser);
//usersRouter.get("/search/:name", authentication, getUsersByName);
//usersRouter temporariamente sem autenticação
usersRouter.get("/search/:name", getUsersByName);
usersRouter.get('/users/:id', getUserById);
usersRouter.get("/userId", authentication, getUserId);

export default usersRouter;