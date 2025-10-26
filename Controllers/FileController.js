// import FileModel from "../Models/FileModel.js";
// import CategoriesController from "./CategorisController.js";
// import multer from 'multer';
// import mongoose from 'mongoose';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import multer from 'multer'; // 📌 שונה/נוסף: לייבוא Multer שנצטרך לשמור קבצים בזיכרון במקום בדיסק
// import { v4 as uuidv4 } from 'uuid';//📌
// import  iconv from 'iconv'

// const currentDirectory = process.cwd();



// const FileController = {
  
//   middlewareUpload:async(req,res)=>{ 
//     try {
//     // Attach additional parameters to the req object
//     console.log("req.body:", req.body);
//     console.log("Category:", req.body.category);
//     console.log("Subcategory:", req.body.subcategory);
//     console.log("Uploaded file:", req.file);
//     // Call the file upload function from the controller
//      FileController.fileupload(req, res);
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     if (!res.headersSent) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }
// },

//   getFileContent:async(req,res)=>{
//     try {
// const bucket = process.env.SUPABASE_BUCKET;
//       const decodedFileName = decodeURIComponent(req.params.fileName);
//       const { category, subcategory,guidName } = req.params;


//       const categoryId = await CategoriesController.getCategoryByName(category);

//         const subcategoryId = await CategoriesController.getSubcategoryByName(category, subcategory);

//       //  const GUIDNAME=await FileController.getGuidNameByFileName(req.params.fileName)
//         const fileType=await FileController.getFileTypeByGuidName(guidName)
//       const relativePath = `files/${categoryId}/${subcategoryId}/${guidName}.${fileType}`;
//       console.log("relativePath",relativePath)
//       const pathToCheck = path.resolve(relativePath);
//       console.log("pathToCheck",pathToCheck)
  
//       if (!fs.existsSync(pathToCheck)) {
//         console.log("File does not exist on server!!!");
//         return res.status(404).json({ error: 'File not found on server' });
//       }
  
//       const fileData = await FileModel.findOne({ path: relativePath });
  
//       if (!fileData) {
//         console.log("File not found in database!!!");
//         return res.status(404).json({ error: 'File not found in database' });
//       }
  
//       res.sendFile(pathToCheck);
  
//     } catch (error) {
//       console.error('Error fetching file content:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },
//   searchFileContent:async(req,res)=>{
//     try {
//       const { subcategory} = req.params;
//       const categories=await CategoriesController.fetchCategories();
//       const category = categories.find(category =>  category.subcategories.some(subcategory => subcategory.name === subcategoryName))
//      const categoryId = category._id;

//        const subcategoryId = await CategoriesController.getSubcategoryByName(category.name, subcategory);

//         const fileNames=FileController.filename(category.name,subcategory.name)

//       //const GUIDNAME=await FileController.getGuidNameByFileName(req.params.fileName)
//         const fileType=await FileController.getFileTypeByGuidName(fileNames[0]?.guidName)
//       const relativePath = `files/${categoryId}/${subcategoryId}/${fileNames[0]?.guidName}.${fileType}`;
//       console.log("relativePath",relativePath)
//       const pathToCheck = path.resolve(relativePath);
//       console.log("pathToCheck",pathToCheck)
  
//       if (!fs.existsSync(pathToCheck)) {
//         console.log("File does not exist on server!!!");
//         return res.status(404).json({ error: 'File not found on server' });
//       }
  
//       const fileData = await FileModel.findOne({ path: relativePath });
  
//       if (!fileData) {
//         console.log("File not found in database!!!");
//         return res.status(404).json({ error: 'File not found in database' });
//       }
  
//       res.sendFile(pathToCheck);
  
//     } catch (error) {
//       console.error('Error fetching file content:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },
//  exchangeFile : async (req, res) => {
//     try {
//       const { guidName } = req.params;
//       const { category, subcategory } = req.query;
  
//       // Find the file by GUIDNAME
//       const file = await FileModel.findOne({ GUIDNAME: guidName });
//       if (!file) {
//         return res.status(404).json({ error: 'File not found' });
//       }
  
//       // Remove file from database
//       await FileModel.deleteOne({ GUIDNAME: guidName });
  
//       // Remove file from disk
//       const __filename = fileURLToPath(import.meta.url);
//       const __dirname = dirname(__filename);
//       const filesDirectory = path.join(__dirname, '../'); // Go up one directory from the location of FileController.js
//       const filePath = path.join(filesDirectory, file.path); // Construct the file path using the files directory
  
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
  
//       // Proceed to upload the new file
//       const categoryId = await CategoriesController.getCategoryByName(category);
//       const subCategoryId = await CategoriesController.getSubcategoryByName(category, subcategory);
  
//       if (!req.file || !req.file.originalname) {
//         throw new Error('No file uploaded or file name not found');
//       }
  
//       // Generate unique name for the file
//       const newGuidName = uuidv4();
  
//       // Get file type from the original file name
//       const fileType = req.file.originalname.split('.').pop();
  
//       const relativeFilePath = `files/${categoryId}/${subCategoryId}`;
//       const newFilePath = path.join(__dirname, `../${relativeFilePath}`);
  
//       // Ensure directory exists
//       if (!fs.existsSync(newFilePath)) {
//         fs.mkdirSync(newFilePath, { recursive: true });
//       }
  
//       const newFile = req.file;
//       const destination = `${newFilePath}/${newGuidName}.${fileType}`;
  
//       // Move the uploaded file to the destination
//       fs.renameSync(newFile.path, destination);
  
//       // Save file metadata to MongoDB
//       const newFileData = new FileModel({
//         TYPE: fileType,
//         GUIDNAME: newGuidName,
//         DATE: new Date(),
//         fileName: newFile.filename,
//         path: `${relativeFilePath}/${newGuidName}.${fileType}`,
//       });
  
//       await newFileData.save();
  
//       res.status(200).json({ message: 'File exchanged successfully' });
//     } catch (error) {
//       console.error('Error exchanging file:', error);
//       if (!res.headersSent) {
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     }
//   },

//   deleteFile: async (req, res) => {
//     try {
//       const bucket = process.env.SUPABASE_BUCKET;
//       const { guidName } = req.params;
  
//       // Find the file by GUIDNAME
//       const file = await FileModel.findOne({ GUIDNAME: guidName });

  
//       if (!file) {
//         return res.status(404).json({ error: 'File not found' });
//       }
  
//       // Remove file from database
//       await FileModel.deleteOne({ GUIDNAME: guidName });
  
//       // Remove file from disk
//       const __filename = fileURLToPath(import.meta.url);
//       const __dirname = dirname(__filename);
//       const filesDirectory = path.join(__dirname, '../'); // Go up one directory from the location of FileController.js
// const filePath = path.join(filesDirectory, file.path); // Construct the file path using the files directory
// console.log("filesDirectory in deleteFile", filesDirectory);

//     fs.unlinkSync(filePath);
    
  
//       res.json({ message: 'File deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting file:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },
  


//   // fileupload: async (req, res) => {
//   //   try {
//   //     const { category, subcategory } = req.query;

//   //     const categoryId = await CategoriesController.getCategoryByName(category);
//   //     const subCategoryId = await CategoriesController.getSubcategoryByName(category, subcategory);

//   //     if (!req.file || !req.file.originalname) {
//   //       throw new Error('No file uploaded or file name not found');
//   //     }

//   //     // Get current directory path
//   //     const __filename = fileURLToPath(import.meta.url);
//   //     const __dirname = dirname(__filename);

//   //     // Generate unique name for the file
//   //     const guidName = uuidv4();

//   //     // Get file type from the original file name
//   //     const fileType = req.file.originalname.split('.').pop();

//   //     const relativeFilePath = `files/${categoryId}/${subCategoryId}`;
//   //     const filePath = path.join(__dirname, `../${relativeFilePath}`);

      
//   //     // Ensure directory exists
//   //     console.log('Ensuring directory exists at:', filePath);
//   //     if (!fs.existsSync(filePath)) {
//   //       console.log('Directory does not exist, creating:', filePath);
//   //       fs.mkdirSync(filePath, { recursive: true });
//   //     } else {
//   //       console.log('Directory already exists:', filePath);
//   //     }

//   //     const file = req.file;
        
//   //     const destination = `${filePath}/${guidName}.${fileType}`;
//   //     console.log('Moving file to destination:', destination);

//   //     // Move the uploaded file to the destination
//   //     fs.renameSync(file.path, destination);

//   //     // Save file metadata to MongoDB
//   //     const fileData = new FileModel({
//   //       TYPE: fileType,
//   //       GUIDNAME: guidName,
//   //       DATE: new Date(),
//   //       fileName: req.file.originalname,  // Make sure to use the correct field name
//   //       path: `${relativeFilePath}/${guidName}.${fileType}`,
//   //     });

//   //     await fileData.save();

//   //     res.status(200).json({ message: 'File uploaded successfully' });
//   //   } catch (error) {
//   //     console.error('Error uploading file:', error);
//   //     if (!res.headersSent) {
//   //       res.status(500).json({ error: 'Internal Server Error' });
//   //     }
//   //   }
//   // },

// getGuidNameByFileName: async (fileName) => {
//   try {

//     // Find the file in the database by file name
//     const fileData = await FileModel.findOne({ fileName: fileName });

//     // If the file data is found, return the GUIDNAME
//     if (fileData && fileData.GUIDNAME) {
//       return fileData.GUIDNAME;
//     } else {
//       throw new Error('File not found');
//     }
//   } catch (error) {
//     console.error('Error fetching GUIDNAME by file name:', error);
//     throw error;
//   }
// },
// getFileTypeByGuidName: async (guidName) => {
//   try {
//     // Find the file in the database by file name
//     const fileData = await FileModel.findOne({ GUIDNAME: guidName });

//     // If the file data is found, return the GUIDNAME
//     if (fileData && fileData.TYPE) {
//       return fileData.TYPE;
//     } else {
//       throw new Error('File not found');
//     }
//   } catch (error) {
//     console.error('Error fetching GUIDNAME by file name:', error);
//     throw error;
//   }
// },
  
//   filenames: async (req, res) => {
//     try {

//       const { category, subcategory } = req.params;
//       console.log("req.params",req.params)

//       const categoryId= await CategoriesController.getCategoryByName(category)

//       const subCategoryId= await CategoriesController.getSubcategoryByName(category,subcategory)
                                                                
     
//       const pathPrefix = `files/${categoryId}/${subCategoryId}`;
//       //const pathPrefix = `files\\`;
//       console.log(" pathPrefix ", pathPrefix )
//       const files = await FileModel.find({ path: { $regex: `^${pathPrefix}` } }); 
//       const fileNames = files.map(file => ({ 
//         fileName: file.fileName, 
//         guidName: file.GUIDNAME
//       }));
//       console.log(" fileNames", fileNames)
//       res.json(fileNames);
//     } catch (error) {
//       console.error('Error fetching file names:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },

//   fileupload: async (req, res) => {
//     try { 
//       const bucket = process.env.SUPABASE_BUCKET;
//       const { category, subcategory } = req.query;
//       // console.log("req.body in fileupload",req.body)
//       // console.log("req.query in fileupload",req.query)
//       const categoryId= await CategoriesController.getCategoryByName(category)
//       const subCategoryId= await CategoriesController.getSubcategoryByName(category,subcategory)
//       // console.log("categoryId",categoryId)
//       // console.log("subCategoryId",subCategoryId)

//       if (!req.file || !req.file.originalname) {
//         throw new Error('No file uploaded or file name not found');
//       }
//       // Get current directory path
//       const __filename = fileURLToPath(import.meta.url);
//       const __dirname = dirname(__filename);
      
//       // Generate unique name for the file
//       const guidName = uuidv4();

//       // Get file type from the original file name

//       const fileType = req.file.originalname.split('.').pop();

//       const relativeFilePath = `files/${categoryId}/${subCategoryId}`;
//       const filePath = path.join(__dirname, `../${relativeFilePath}`);
      
//       // Ensure directory exists
//       if (!fs.existsSync(filePath)) {
//         fs.mkdirSync(filePath, { recursive: true });
//       }
  
//       const file = req.file;
//       const destination = `${filePath}/${guidName}.${fileType}`; // Updated destination
  
//       // Move the uploaded file to the destination
//       fs.renameSync(file.path, destination);
  
//       // Save file metadata to MongoDB
//       const fileData = new FileModel({
//          TYPE: fileType,
//          GUIDNAME: guidName,
//          DATE: new Date(),
//          fileName: file.filename,
//          path: `${relativeFilePath}/${guidName}.${fileType}`,  // Updated path format
//       });
  
//       await fileData.save();
  
//       res.status(200).json({ message: 'File uploaded successfully' });
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       if (!res.headersSent) {
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     }
// },


//   // exchangeFile: async (req, res) => {
//   //   try {
//   //     const { guidName } = req.params;
//   //     const { category, subcategory } = req.query;

//   //     // Find the file by GUIDNAME
//   //     const file = await FileModel.findOne({ GUIDNAME: guidName });
//   //     if (!file) {
//   //       return res.status(404).json({ error: 'File not found' });
//   //     }

//   //     // Remove file from database
//   //     await FileModel.deleteOne({ GUIDNAME: guidName });

//   //     // Remove file from disk
//   //     const __filename = fileURLToPath(import.meta.url);
//   //     const __dirname = dirname(__filename);
//   //     const filesDirectory = path.join(__dirname, '../'); // Go up one directory from the location of FileController.js
//   //     const filePath = path.join(filesDirectory, file.path); // Construct the file path using the files directory

//   //     if (fs.existsSync(filePath)) {
//   //       fs.unlinkSync(filePath);
//   //     }

//   //     const categoryId = await CategoriesController.getCategoryByName(category);
//   //     const subCategoryId = await CategoriesController.getSubcategoryByName(category, subcategory);

//   //     const result = await saveFile(req, categoryId, subCategoryId);

//   //     res.status(200).json({ message: result.message });
//   //   } catch (error) {
//   //     console.error('Error exchanging file:', error);
//   //     if (!res.headersSent) {
//   //       res.status(500).json({ error: 'Internal Server Error' });
//   //     }
//   //   }
//   // },
//  saveFile:async(req, categoryId, subCategoryId) =>{
//   try {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = dirname(__filename);

//     if (!req.file || !req.file.originalname) {
//       throw new Error('No file uploaded or file name not found');
//     }

//     const guidName = uuidv4();
//     const fileType = req.file.originalname.split('.').pop();
//     const relativeFilePath = `files/${categoryId}/${subCategoryId}`;
//     const filePath = join(__dirname, `../${relativeFilePath}`);

//     // Ensure directory exists
//     console.log('Ensuring directory exists at:', filePath);
//     if (!fs.existsSync(filePath)) {
//       console.log('Directory does not exist, creating:', filePath);
//       fs.mkdirSync(filePath, { recursive: true });
//     } else {
//       console.log('Directory already exists:', filePath);
//     }

//     const file = req.file;
//     console.log('Uploaded file info:', file);

//     const destination = `${filePath}/${guidName}.${fileType}`;
//     console.log('Moving file to destination:', destination);

//     // Move the uploaded file to the destination
//     fs.renameSync(file.path, destination);

//     // Save file metadata to MongoDB
//     const fileData = new FileModel({
//       TYPE: fileType,
//       GUIDNAME: guidName,
//       DATE: new Date(),
//       fileName: req.file.originalname,
//       path: `${relativeFilePath}/${guidName}.${fileType}`,
//     });

//     await fileData.save();

//     return { message: 'File saved successfully' };
//   } catch (error) {
//     console.error('Error saving file:', error);
//     throw error;
//   }
// }
// }


// export default FileController;

// --------------------
import FileModel from "../Models/FileModel.js";
import CategoriesController from "./CategorisController.js";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const FileController = {
  // העלאת קובץ ל־Supabase
  fileupload: async (req, res) => {
    try {
      const supabase = req.app.locals.supabase;
      const bucket = process.env.SUPABASE_BUCKET;
      const { category, subcategory } = req.query;

      if (!req.file || !req.file.originalname) {
        throw new Error('No file uploaded');
      }

      const categoryId = await CategoriesController.getCategoryByName(category);
      const subCategoryId = await CategoriesController.getSubcategoryByName(category, subcategory);

      // יצירת שם ייחודי לקובץ
      const guidName = uuidv4();
      const fileType = req.file.originalname.split('.').pop();
      const filePath = `${categoryId}/${subCategoryId}/${guidName}.${fileType}`;

      console.log('Uploading to Supabase:', filePath);

      // העלאה ל־Supabase
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      // שמירה במסד הנתונים
      const fileData = new FileModel({
        TYPE: fileType,
        GUIDNAME: guidName,
        DATE: new Date(),
        fileName: req.file.originalname,
        path: filePath,
      });

      await fileData.save();

      res.status(200).json({ message: 'File uploaded to Supabase successfully', path: filePath });
    } catch (error) {
      console.error('Error uploading file:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },

  // הורדת קובץ מ־Supabase
  getFileContent: async (req, res) => {
    try {
      const supabase = req.app.locals.supabase;
      const bucket = process.env.SUPABASE_BUCKET;
      const { guidName, category, subcategory } = req.params;

      const fileType = await FileController.getFileTypeByGuidName(guidName);
      const categoryId = await CategoriesController.getCategoryByName(category);
      const subcategoryId = await CategoriesController.getSubcategoryByName(category, subcategory);

      const path = `${categoryId}/${subcategoryId}/${guidName}.${fileType}`;

      const { data, error } = await supabase.storage.from(bucket).download(path);
      if (error) {
        console.error('Error downloading from Supabase:', error);
        return res.status(404).json({ error: 'File not found' });
      }

      res.setHeader('Content-Type', data.type);
      res.send(Buffer.from(await data.arrayBuffer()));
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteFile: async (req, res) => {
    try {
      const supabase = req.app.locals.supabase;
      const bucket = process.env.SUPABASE_BUCKET;
      const { guidName } = req.params;

      const file = await FileModel.findOne({ GUIDNAME: guidName });
      if (!file) return res.status(404).json({ error: 'File not found' });

      const { error } = await supabase.storage.from(bucket).remove([file.path]);
      if (error) throw error;

      await FileModel.deleteOne({ GUIDNAME: guidName });

      res.json({ message: 'File deleted successfully from Supabase' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getFileTypeByGuidName: async (guidName) => {
    const file = await FileModel.findOne({ GUIDNAME: guidName });
    return file?.TYPE || null;
  }
};

// הגדרת multer לזיכרון (לא לשמירה על הדיסק)
import multer from "multer";
const storage = multer.memoryStorage();
export const upload = multer({ storage });
export default FileController;
