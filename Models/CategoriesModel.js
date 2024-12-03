import mongoose from "mongoose";

const CategorySchema=mongoose.Schema({
    // id:Number,
    name:String,
    subCategories:Number
    
})

export default mongoose.model("categories",CategorySchema);