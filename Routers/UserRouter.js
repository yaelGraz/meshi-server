import  express  from "express";
import UserController from "../Controllers/UserController.js";

const UserRouter=express.Router();

UserRouter.get("/",UserController.get)
UserRouter.post("/login",UserController.login);


export default UserRouter;