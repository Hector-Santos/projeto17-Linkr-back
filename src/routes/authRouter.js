import express from 'express';
import { signIn, signUp } from '../controllers/authController.js';
import { validate } from '../middlewares/validationMiddleware.js';
import signUpSchema from '../schemas/signUpSchema.js';
import signInSchema from '../schemas/signInSchema.js';

const authRouter = express.Router();
authRouter.post("/signup", (req, res, next) => validate(req, res, next, signUpSchema), signUp);
authRouter.post("/signin", (req, res, next) => validate(req, res, next, signInSchema), signIn);


export default authRouter