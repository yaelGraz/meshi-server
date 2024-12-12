import  express  from "express";
import CategoriesController from "../Controllers/CategorisController.js";

const CategoriesRouter=express.Router();

CategoriesRouter.get("/",CategoriesController.getList);

export default CategoriesRouter;