import mongoose from "mongoose";

  const FileSchema=mongoose.Schema({
     TYPE:String,
     GUIDNAME:String,
     DATE:Date,
     fileName:String,
     path:String

 })

export default mongoose.model("files",FileSchema);