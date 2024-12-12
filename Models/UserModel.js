import mongoose from "mongoose";

const UserSchema=mongoose.Schema({
   id_number:String,
   password:String
})

export default mongoose.model("users",UserSchema);