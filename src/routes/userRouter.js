import { Router } from "express";
import { getUser } from "../controllers/usersController.js";
import { authentication } from "../middlewares/authMiddleware.js";


const usersRouter = Router();

usersRouter.get("/users",authentication, getUser);

export default usersRouter;