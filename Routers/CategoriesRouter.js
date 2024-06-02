import  express  from "express";
import CategoriesController from "../Controllers/CategorisController.js";

const CategoriesRouter=express.Router();

CategoriesRouter.get('/',CategoriesController.getList);
CategoriesRouter.get('/:subcategoryName',CategoriesController.getCategoryBySubcategory);

CategoriesRouter.post('/add',CategoriesController.add);
CategoriesRouter.put('/update/:id',CategoriesController.updateCategory)
CategoriesRouter.put('/delete/:id',CategoriesController.deleteCategory)



export default CategoriesRouter;