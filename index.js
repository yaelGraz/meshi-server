// import express from 'express'
// import cors from "cors";
// import bodyParser from "body-parser";
// import CategoriesRouter from './Routers/CategoriesRouter.js'
// import connectDB from './mongoose.js';
// import UserRouter from './Routers/UserRouter.js';
// import FileRouter from './Routers/FileRouter.js';


// connectDB();
// const app=express()
// const port=3000
// app.use(cors({
//     origin: "https://meshi-site.netlify.app", // Replace with your React app's deployed URL when in production
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true, // If your app requires cookies or authorization headers
// }));

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use((req, res, next) => {
//     res.setHeader(
//       "Content-Security-Policy",
//       "default-src 'none'; script-src 'self' https://netfree.link"
//     );
//     next();
//   });
// // app.use(bodyParser.json({ limit: '50mb' }));
// // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// // app.use(express.json({limit: '50mb'}));
// // app.use(express.urlencoded({limit: '50mb'}));



//  app.use("/categories",CategoriesRouter);
// app.use("/users",UserRouter);
// app.use("/files",FileRouter)


// app.listen(port, '0.0.0.0', () => {
//     console.log(`Server is running on https://meshi-server.onrender.com`);
// })
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import CategoriesRouter from './Routers/CategoriesRouter.js';
import connectDB from './mongoose.js';
import UserRouter from './Routers/UserRouter.js';
import FileRouter from './Routers/FileRouter.js';
import FileController from './Controllers/FileController.js';
import multer from 'multer';

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));



// const upload = multer({ storage: storage });

// Middleware to extract category and subcategory parameters
app.use("/files/:category/:subcategory", (req, res, next) => {
  const { category, subcategory } = req.params;
  if (!category || !subcategory) {
    return res.status(400).json({ error: 'Category and subcategory are required' });
  }
  
  req.category = category;
  req.subcategory = subcategory;
  next();
});

// Middleware to handle file uploads
//app.use("/files", upload.single('file'));

app.use("/", UserRouter);
app.use("/users",UserRouter);
app.use("/categories", CategoriesRouter);
app.use("/files", FileRouter); 
console.log("process.env.PORT",process.env.PORT)

app.listen(port,'0.0.0.0', () => {
  
    console.log(`Example app listening on http://localhost:${port}`);
});

