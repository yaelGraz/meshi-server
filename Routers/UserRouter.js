import  express  from "express";
import UserController from "../Controllers/UserController.js";
import { verifyToken } from '../Middlewares/authMiddleware.js'
const UserRouter=express.Router();

UserRouter.get("/getList",verifyToken,UserController.get)
UserRouter.post("/login",UserController.login);
UserRouter.post("/add",verifyToken,UserController.add)
UserRouter.put(`/update/:id`,verifyToken,UserController.update)
UserRouter.delete('/delete/:id',verifyToken,UserController.delete)


export default UserRouter;