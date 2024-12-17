import mongoose from "mongoose";

// const FileSchema=mongoose.Schema({
//     name: String,
//     type: String,
//     data: Buffer
// })
const FileSchema = mongoose.Schema({
    TYPE: String ,      // The file type (e.g., 'jpg', 'png')
    GUIDNAME : String, // Unique identifier for the file
    DATE  :Date,         // The date the file was uploaded
    fileNametype: String,  // Original file name (without path)
    path  :String       // The relative path to the file (where it's saved)
  });

export default mongoose.model("files",FileSchema);