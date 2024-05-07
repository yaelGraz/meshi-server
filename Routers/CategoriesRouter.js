import  express  from "express";
import CategoriesController from "../Controllers/CategorisController.js";

const CategoriesRouter=express.Router();

CategoriesRouter.get('/',CategoriesController.getList);
CategoriesRouter.post('/add',CategoriesController.add);
CategoriesRouter.put('/update/:id',CategoriesController.updateCategory)




export default CategoriesRouter;