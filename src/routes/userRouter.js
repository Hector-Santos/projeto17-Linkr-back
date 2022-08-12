import { Router } from "express";

import { getUser, getUsersByName } from "../controllers/usersController.js";
import { authentication } from "../middlewares/authMiddleware.js";

const usersRouter = Router();

usersRouter.get("/users",authentication, getUser);
usersRouter.get("/search/:name", authentication, getUsersByName);

export default usersRouter;