import express from 'express'
import cors from "cors";
import bodyParser from "body-parser";
import CategoriesRouter from './Routers/CategoriesRouter.js'
import connectDB from './mongoose.js';
import UserRouter from './Routers/UserRouter.js';
import FileRouter from './Routers/FileRouter.js';


connectDB();
const app=express()
const port=3000
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));



// app.use("/",CategoriesRouter);
app.use("/",UserRouter);
app.use("/files",FileRouter)


app.listen(port,'0.0.0.0',()=>{
    console.log(`Example app listening on http://localhost:${port}`)
})
