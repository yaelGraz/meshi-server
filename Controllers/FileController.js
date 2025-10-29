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
import crypto from "crypto";
import FileModel from "../Models/FileModel.js";
import { createClient } from "@supabase/supabase-js";

/**
 * נקודת אמת: כל הקבצים נשמרים בבאקט Supabase (ללא FS מקומי).
 * ניגשים ל-supabase דרך app.locals.supabase (כפי שהגדרת ב-index.js),
 * ואם לא הוזרק – ניצור לקוח מהמפתחות בסביבה.
 */

function getSupabase(req) {
  return req.app?.locals?.supabase
    ? req.app.locals.supabase
    : createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

const BUCKET = process.env.SUPABASE_BUCKET || "uploads";

// נתיב לוגי בבאקט: category/subcategory/guidName
function buildPath({ category, subcategory, guidName }) {
  // ניקוי תווים בעייתיים (כולל רווחים ותווי unicode)
  const cleanSegment = (str) => {
    return String(str || '')
      .normalize('NFKD')               // מפרק ניקוד
      .replace(/[^\w\s.-]/g, '')       // מסיר תווים לא חוקיים
      .trim()
      .replace(/\s+/g, '_')            // רווחים -> _
      .replace(/_+/g, '_')             // רצפי _ -> אחד
      .toLowerCase() || 'uncategorized';
  };

  const cat = cleanSegment(category);
  const sub = cleanSegment(subcategory);
  return `${cat}/${sub}/${guidName}`;
}


// הוסיפי מתחת:
// אפשרות A – קידוד URL לכל מקטע (שומר עברית כ-%D7...):
function safeSegment(s) {
  return encodeURIComponent(String(s).trim().replace(/\//g, '-'))
    .replace(/%20/g, '_'); // רווחים -> _
}


// --------- קריאות עיקריות ---------

/**
 * GET /files/:category/:subcategory
 * מחזיר רשימת קבצים לפי קטגוריה/תת־קטגוריה מתוך MongoDB
 */
async function list(req, res) {
  try {
    const category = String(req.params.category || "").trim();
    const subcategory = String(req.params.subcategory || "").trim();

    const rows = await FileModel.find({ category, subcategory })
      .sort({ createdAt: -1 })
      .lean();

    // נשמור תאימות לשדות שה-UI שלך מצפה (id/_id, url, originalName, וכו')
    const files = rows.map((f) => ({
      id: f._id?.toString(),
      _id: f._id,
      fileName: f.fileName,
      guidName: f.guidName,
      originalName: f.originalName,
      url: f.url,               // אם הבאקט פרטי – אפשר להפיק Signed URL בצד הלקוח/שרת
      mimetype: f.mimetype,
      size: f.size,
      category: f.category,
      subcategory: f.subcategory,
      createdAt: f.createdAt,
    }));

    res.json(files);
  } catch (e) {
    console.error("list error:", e);
    res.status(400).json({ message: e.message });
  }
}

/**
 * POST /files/upload?category=...&subcategory=...
 * body: multipart/form-data עם field בשם 'file'
 */
async function upload(req, res) {
  try {
    const supabase = getSupabase(req);
    const category = String(req.query.category || "").trim();
    const subcategory = String(req.query.subcategory || "").trim();
console.log("category ad subcategory in upload filecontroller",category,subcategory )
    const file = req.file || (req.files && req.files[0]);
    if (!file) return res.status(400).json({ error: "file is required" });

    // מייצרים guid יציב בשביל קישור עתידי/החלפה
    const ext = (file.originalname?.split(".").pop() || "").toLowerCase();
    const guidName = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${ext || "bin"}`;
    const path = buildPath({ category, subcategory, guidName });
console.log("path after buildpath  in upload filecontroller",path )
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) throw new Error(error.message || "supabase upload failed");

    // public URL (אם הבאקט ציבורי), אחרת אפשר להשאיר null ולהפיק signed כשצריך
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const saved = await FileModel.create({
      fileName: file.originalname,
      guidName,
      originalName: file.originalname,
      url: pub?.publicUrl || null,
      path,
      mimetype: file.mimetype,
      size: file.size,
      category,
      subcategory,
    });

    res.status(201).json({
      ok: true,
      file: {
        id: saved._id?.toString(),
        guidName: saved.guidName,
        originalName: saved.originalName,
        url: saved.url,
        category: saved.category,
        subcategory: saved.subcategory,
        mimetype: saved.mimetype,
        size: saved.size,
      },
    });
  } catch (e) {
    console.error("upload error:", e);
    res.status(400).json({ message: e.message });
  }
}

/**
 * GET /files/:category/:subcategory/fileContent/:guidName
 * מחזיר את תוכן הקובץ (stream) מהבאקט לפי guidName
 */
async function fileContent(req, res) {
  try {
    const supabase = getSupabase(req);
    const { category, subcategory, guidName } = {
      category: req.params.category,
      subcategory: req.params.subcategory,
      guidName: req.params.guidName,
    };

    // מאתרים את הרשומה כדי לקבל path ו-mimetype
    const doc = await FileModel.findOne({ category, subcategory, guidName }).lean();
    if (!doc) return res.status(404).json({ message: "File not found" });

    const { data, error } = await supabase.storage.from(BUCKET).download(doc.path);
    if (error) throw new Error(error.message || "supabase download failed");

    res.setHeader("Content-Type", doc.mimetype || "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(doc.originalName)}"`);
    const buf = await data.arrayBuffer();
    res.send(Buffer.from(buf));
  } catch (e) {
    console.error("fileContent error:", e);
    res.status(400).json({ message: e.message });
  }
}

/**
 * POST /files/exchange-file/:guidName?category=...&subcategory=...
 * מחליף תוכן קיים (אותו guidName/אותו path) – upsert: true
 */
async function exchangeFile(req, res) {
  try {
    const supabase = getSupabase(req);
    const category = String(req.query.category || "").trim();
    const subcategory = String(req.query.subcategory || "").trim();
    const guidName = String(req.params.guidName || "").trim();

    const file = req.file || (req.files && req.files[0]);
    if (!file) return res.status(400).json({ error: "file is required" });

    // מאתרים את המסמך כדי לקבל path. אם לא קיים – ניצור path חדש תואם GUID
    let doc = await FileModel.findOne({ category, subcategory, guidName });
    const path = doc?.path || buildPath({ category, subcategory, guidName });

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });

    if (error) throw new Error(error.message || "supabase replace failed");

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

    if (!doc) {
      // אם לא קיימת רשומה – ניצור חדשה
      doc = await FileModel.create({
        fileName: file.originalname,
        guidName,
        originalName: file.originalname,
        url: pub?.publicUrl || null,
        path,
        mimetype: file.mimetype,
        size: file.size,
        category,
        subcategory,
      });
    } else {
      // עדכון מטא־דאטה
      doc.fileName = file.originalname;
      doc.originalName = file.originalname;
      doc.url = pub?.publicUrl || doc.url;
      doc.mimetype = file.mimetype;
      doc.size = file.size;
      await doc.save();
    }

    res.json({
      ok: true,
      file: {
        id: doc._id?.toString(),
        guidName: doc.guidName,
        originalName: doc.originalName,
        url: doc.url,
        mimetype: doc.mimetype,
        size: doc.size,
        category: doc.category,
        subcategory: doc.subcategory,
      },
    });
  } catch (e) {
    console.error("exchangeFile error:", e);
    res.status(400).json({ message: e.message });
  }
}

/**
 * DELETE /files/:id
 * מוחק את הרשומה ב-DB ואת האובייקט בבאקט
 */
async function remove(req, res) {
  try {
    const supabase = getSupabase(req);
    const id = String(req.params.id || "").trim();
    if (!id) return res.status(400).json({ message: "id is required" });

    const doc = await FileModel.findByIdAndDelete(id).lean();
    if (!doc) return res.status(404).json({ message: "File not found" });

    // מוחקים את האובייקט מהבאקט
    const { error } = await supabase.storage.from(BUCKET).remove([doc.path]);
    if (error) {
      // לא נשבור אם המחיקה בבאקט נכשלה – מדווחים אבל לא מחזירים 500
      console.warn("supabase remove warning:", error.message || error);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error("remove error:", e);
    res.status(400).json({ message: e.message });
  }
}

export default {
  list,
  upload,
  fileContent,
  exchangeFile,
  remove,
};
