import express from 'express';
import * as UserService from '../services/user.js';

const userRouter = express.Router();

userRouter.get("/", UserService.getUser);
userRouter.post("/",UserService.validateToken, UserService.createUser);
userRouter.delete("/:id", UserService.deleteUser);
userRouter.post("/auth", UserService.authUser);

export default userRouter;