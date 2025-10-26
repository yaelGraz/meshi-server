import express from "express";
import multer from 'multer'; 
import FileController from "../Controllers/FileController.js";
// import FileModel from "../Models/fileModel.js";
import path from 'path';
import fs from 'fs';
import iconv from 'iconv-lite';
import CategoriesController from "../Controllers/CategorisController.js";
import { Console } from "console";
const FileRouter = express.Router();
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



FileRouter.get('/:category/:subcategory/fileContent/:guidName',FileController.getFileContent) 
FileRouter.get('/SearchfileContent/:subcategory',FileController.searchFileContent) 
FileRouter.get('/files/:category/:subcategory', FileController.filenames);
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     try {
//       console.log("req.body in multer.diskStorage", req.body);
//       console.log("req.query in multer.diskStorage", req.query);
//       console.log("req.query.category in multer.diskStorage", req.query.category);

      
//       const categoryId = await CategoriesController.getCategoryByName(req.query.category);
//       const subcategoryId = await CategoriesController.getSubcategoryByName(req.query.category, req.query.subcategory);

//       console.log("categoryId in multer.diskStorage", categoryId);
//       console.log("subcategoryId in multer.diskStorage", subcategoryId);
      
//       const uploadPath = `./files/${categoryId}/${subcategoryId}/`;
//       cb(null, uploadPath);
//     } catch (error) {
//       console.error('Error getting category or subcategory:', error);
//       cb(error);
//     }
//   },

//   filename: (req, file, cb) => {
//     const guidName = req.body.guidName;
//     console.log("guidName in fileName in multer.diskStorage:",guidName)
//     const encodedFileName = file.originalname;
//     console.log("encodedFileName", encodedFileName);

//     // Decode the file name using iconv-lite directly to utf-8
//     const decodedFileName = iconv.decode(iconv.encode(encodedFileName, 'binary'), 'utf-8').toString();
//     console.log("decodedFileName", decodedFileName);

//     cb(null, decodedFileName);
//   },
// });
 

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      console.log("req.body in multer.diskStorage", req.body);
      console.log("req.query in multer.diskStorage", req.query);
      
      const categoryId = await CategoriesController.getCategoryByName(req.query.category);
      const subcategoryId = await CategoriesController.getSubcategoryByName(req.query.category, req.query.subcategory);

      console.log("categoryId in multer.diskStorage", categoryId);
      console.log("subcategoryId in multer.diskStorage", subcategoryId);
  // Construct the upload path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
   
      //     const __dirname = dirname(__filename);
      const uploadPath = path.resolve(__dirname, `../files/${categoryId}/${subcategoryId}/`);

      // Ensure the directory exists
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    } catch (error) {
      console.error('Error getting category or subcategory:', error);
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    try {
      const guidName = req.body.guidName;
      console.log("guidName in fileName in multer.diskStorage:", guidName);
      
      const encodedFileName = file.originalname;
      console.log("encodedFileName", encodedFileName);
      
      // Decode the file name using iconv-lite directly to utf-8
      const decodedFileName = iconv.decode(iconv.encode(encodedFileName, 'binary'), 'utf-8').toString();
      console.log("decodedFileName", decodedFileName);

      cb(null, decodedFileName);
    } catch (error) {
      console.error('Error encoding file name:', error);
      cb(error);
    }
  },
});

const upload = multer({ storage: storage });


// const upload = multer({ storage: storage });
FileRouter.delete('/:guidName', FileController.deleteFile);

FileRouter.post('/upload',upload.single('file'),FileController.middlewareUpload),
FileRouter.post('/exchange-file/:guidName', upload.single('file'), FileController.exchangeFile);
FileRouter.use("/:category/:subcategory", (req, res, next) => {
  const { category, subcategory } = req.params;
  if (!category || !subcategory) {
    return res.status(400).json({ error: 'Category and subcategory are required' });
  }
  
  req.category = category;
  req.subcategory = subcategory;
  next();
});

FileRouter.get('/:category/:subcategory', FileController.filenames);

export default FileRouter;