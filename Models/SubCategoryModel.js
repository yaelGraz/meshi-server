import mongoose from "mongoose";

const SubCategorySchema = mongoose.Schema({
    name: String,
});

export default mongoose.model("subCategories", SubCategorySchema);
