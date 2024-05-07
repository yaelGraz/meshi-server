// FileController.js
import FileModel from "../Models/fileModel.js";
import CategoriesController from "./CategorisController.js";
import multer from 'multer';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

import  iconv from 'iconv'

const currentDirectory = process.cwd();



const FileController = {
  middlewareUpload:async(req,res)=>{ 
    try {
    // Attach additional parameters to the req object
    console.log("req.body:", req.body);
    console.log("Category:", req.body.category);
    console.log("Subcategory:", req.body.subcategory);
    console.log("Uploaded file:", req.file);
    // Call the file upload function from the controller
     FileController.fileupload(req, res);
  } catch (error) {
    console.error('Error uploading file:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
},

  getFileContent:async(req,res)=>{
    try {
      console.log("i am in /:category/:subcategory/fileContent/:guidName ")
      console.log("req.params",req.params)
      const decodedFileName = decodeURIComponent(req.params.fileName);
      const { category, subcategory,guidName } = req.params;
      console.log("req.params",req.params)
      const categoryId = await CategoriesController.getCategoryByName(category);
    console.log("categoryId",categoryId)
        const subcategoryId = await CategoriesController.getSubcategoryByName(category, subcategory);
        console.log("subcategoryId",categoryId)
      //  const GUIDNAME=await FileController.getGuidNameByFileName(req.params.fileName)
        const fileType=await FileController.getFileTypeByGuidName(guidName)
      const relativePath = `files/${categoryId}/${subcategoryId}/${guidName}.${fileType}`;
      console.log("relativePath",relativePath)
      const pathToCheck = path.resolve(relativePath);
      console.log("pathToCheck",pathToCheck)
  
      if (!fs.existsSync(pathToCheck)) {
        console.log("File does not exist on server!!!");
        return res.status(404).json({ error: 'File not found on server' });
      }
  
      const fileData = await FileModel.findOne({ path: relativePath });
  
      if (!fileData) {
        console.log("File not found in database!!!");
        return res.status(404).json({ error: 'File not found in database' });
      }
  
      res.sendFile(pathToCheck);
  
    } catch (error) {
      console.error('Error fetching file content:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteFile: async (req, res) => {
    try {
      const { guidName } = req.params;
  
      // Find the file by GUIDNAME
      const file = await FileModel.findOne({ GUIDNAME: guidName });
      console.log("Found file in deleteFile ");
  
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // Remove file from database
      await FileModel.deleteOne({ GUIDNAME: guidName });
  
      // Remove file from disk
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const filesDirectory = path.join(__dirname, '../'); // Go up one directory from the location of FileController.js
console.log("filesDirectory in delteFil",filesDirectory)
const filePath = path.join(filesDirectory, file.path); // Construct the file path using the files directory
console.log("filesDirectory in deleteFile", filesDirectory);

fs.unlinkSync(filePath);
  
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  


  fileupload: async (req, res) => {
    try { 
      const { category, subcategory } = req.query;
      // console.log("req.body in fileupload",req.body)
      // console.log("req.query in fileupload",req.query)
      const categoryId= await CategoriesController.getCategoryByName(category)
      const subCategoryId= await CategoriesController.getSubcategoryByName(category,subcategory)
      // console.log("categoryId",categoryId)
      // console.log("subCategoryId",subCategoryId)

      if (!req.file || !req.file.originalname) {
        throw new Error('No file uploaded or file name not found');
      }
      // Get current directory path
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Generate unique name for the file
      const guidName = uuidv4();

      // Get file type from the original file name

      const fileType = req.file.originalname.split('.').pop();

      const relativeFilePath = `files/${categoryId}/${subCategoryId}`;
      const filePath = path.join(__dirname, `../${relativeFilePath}`);
      
      // Ensure directory exists
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
  
      const file = req.file;
      const destination = `${filePath}/${guidName}.${fileType}`; // Updated destination
  
      // Move the uploaded file to the destination
      fs.renameSync(file.path, destination);
  
      // Save file metadata to MongoDB
      const fileData = new FileModel({
         TYPE: fileType,
         GUIDNAME: guidName,
         DATE: new Date(),
         fileName: file.filename,
         path: `${relativeFilePath}/${guidName}.${fileType}`,  // Updated path format
      });
  
      await fileData.save();
  
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error uploading file:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
},

getGuidNameByFileName: async (fileName) => {
  try {
    // console.log("fileName in getGuidNameByFileName",fileName)
    // Find the file in the database by file name
    const fileData = await FileModel.findOne({ fileName: fileName });
    // console.log("fileData in getGuidNameByFileName",fileData)
    // If the file data is found, return the GUIDNAME
    if (fileData && fileData.GUIDNAME) {
      return fileData.GUIDNAME;
    } else {
      throw new Error('File not found');
    }
  } catch (error) {
    console.error('Error fetching GUIDNAME by file name:', error);
    throw error;
  }
},
getFileTypeByGuidName: async (guidName) => {
  try {
    // Find the file in the database by file name
    const fileData = await FileModel.findOne({ GUIDNAME: guidName });
// console.log("fileData in getFileTypeByGuidName:",fileData)
    // If the file data is found, return the GUIDNAME
    if (fileData && fileData.TYPE) {
      return fileData.TYPE;
    } else {
      throw new Error('File not found');
    }
  } catch (error) {
    console.error('Error fetching GUIDNAME by file name:', error);
    throw error;
  }
},
  
  filename: async (req, res) => {
    try {
// console.log("i am in fileame in fileController")
      const { category, subcategory } = req.params;
      // console.log("category",category)
      const categoryId= await CategoriesController.getCategoryByName(category)
      // console.log("categoryId",categoryId)
      const subCategoryId= await CategoriesController.getSubcategoryByName(category,subcategory)
      const pathPrefix = `files/${categoryId}/${subCategoryId}`;
      //const pathPrefix = `files\\`;
      // console.log("pathPrefix",pathPrefix)
      const files = await FileModel.find({ path: { $regex: `^${pathPrefix}` } }); 
      const fileNames = files.map(file => ({ 
        fileName: file.fileName, 
        guidName: file.GUIDNAME
      }));
      res.json(fileNames);
    } catch (error) {
      console.error('Error fetching file names:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};



export default FileController;
