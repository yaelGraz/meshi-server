import mongoose from "mongoose";

 HEAD
//const uri="mongodb://localhost:27017/meshiDB";
//const uri="mongodb+srv://yaelig053:<yaelig053>@cluster0.0lh8d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//const dbURI = "mongodb+srv://yaelig053:<yaelig053>@cluster0.0lh8d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// const uri="mongodb://localhost:27017/meshiDB";
const uri="mongodb+srv://ah0534172214:tvuch7221@cluster0.64malpb.mongodb.net/Meshi";


// const uri="mongodb://localhost:27017/meshiDB";
//const uri="mgodb+srv://ah0534172214:tvuch7221@cluster0.64malpb.mongodb.net/Meshi";



const connectDB=async()=>{await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));
}
// const connectDB=async()=>{
//     await mongoose.connect(uri);
// }

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


