import CategoriesModel from "../Models/CategoriesModel.js";

const CategoriesController={
    getList:async (req,res)=>{                                    
       console.log("categoriescontroller")
       try{
        const categories = await CategoriesModel.find({});
         res.send({categories});
        } catch(e){
            res.status(400).json({message:e.message+CategoriesModel})
        }  
    }  
}

export default CategoriesController;
