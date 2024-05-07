import mongoose from "mongoose";

const uri="mongodb://localhost:27017/meshiDB";

const connectDB=async()=>{
    await mongoose.connect(uri);
}

mongoose.set('toJSON',{
    virtuals:true,
    transform:(doc,converted)=>{
        delete converted._id;
    }
})

const database=mongoose.connection;

database.on('error',(error)=>{
    console.log(error);
})

database.once('connected',()=>{
    console.log('Database Connected');
})
export default connectDB;