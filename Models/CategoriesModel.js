import mongoose from "mongoose";

const SubCategorySchema = mongoose.Schema({
    name: String,
});

const CategorySchema = mongoose.Schema({
    name: String,
    subCategories: [SubCategorySchema],  // Change the type of subCategories to the SubCategorySchema
});

export default mongoose.model("categories", CategorySchema);

