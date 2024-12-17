import mongoose from "mongoose";
// import SubCategoriesModel from "./SubCategoriesModel";

const SubCategoriesSchema = mongoose.Schema({
    // id:Number,
    // _id: { type: String, required: true, default: nanoid }, // Use nanoid for unique IDs
    name:String,
    
})


const CategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    // subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategories' }]
    // subCategories: [{ name: String }]
    subCategories: [SubCategoriesSchema]
})

export default mongoose.model("categories", CategorySchema);