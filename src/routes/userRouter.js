import { Router } from "express";

import { getUser, getUsersByName } from "../controllers/usersController.js";
import { authentication } from "../middlewares/authMiddleware.js";

const usersRouter = Router();

usersRouter.get("/users",authentication, getUser);
//usersRouter.get("/search/:name", authentication, getUsersByName);
//usersRouter temporariamente sem autenticação
usersRouter.get("/search/:name", getUsersByName);


export default usersRouter;