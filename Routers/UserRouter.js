import  express  from "express";
import UserController from "../Controllers/UserController.js";

const UserRouter=express.Router();

UserRouter.get("/getList",UserController.get)
UserRouter.post("/login",UserController.login);
UserRouter.post("/add",UserController.add)
UserRouter.put(`/update/:id`,UserController.update)
UserRouter.delete('/delete/:id',UserController.delete)


export default UserRouter;