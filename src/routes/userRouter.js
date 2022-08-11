import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { getUsers } from "../controllers/usersController.js";

const userRouter = Router();

userRouter.get("/search/:name", authentication, getUsers);

export default userRouter;