import mongoose from "mongoose";

const UserSchema=mongoose.Schema({
   name:String,
   userName:String,
   password:String,
   isAdmin:Boolean
})

export default mongoose.model("users",UserSchema);