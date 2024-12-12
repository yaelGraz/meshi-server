import mongoose from "mongoose";

const FileSchema=mongoose.Schema({
    name: String,
    type: String,
    data: Buffer
})

export default mongoose.model("files",FileSchema);