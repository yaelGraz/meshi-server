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
app.use(cors({
    origin: "https://meshi-site.netlify.app", // Replace with your React app's deployed URL when in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If your app requires cookies or authorization headers
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; script-src 'self' https://netfree.link"
    );
    next();
  });
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));



 app.use("/categories",CategoriesRouter);
app.use("/users",UserRouter);
app.use("/files",FileRouter)


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on https://meshi-server.onrender.com`);
})
