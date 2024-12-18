import  express  from "express";
import FileController from "../Controllers/FileController.js";
const FileRouter=express.Router();
import multerUpload from "../multerConfig.js";
import multer from 'multer'; 
import CategoriesController from '../Controllers/CategorisController.js'; // Assuming you have this controller


// FileRouter.post('/upload', multerUpload.single('file'), FileController.fileupload);
//FileRouter.get('', FileController.getFileNames);

// Route to fetch file data based on file name
FileRouter.get('/:fileName', FileController.filename);



FileRouter.get('/:category/:subcategory/fileContent/:guidName',FileController.getFileContent) 
//FileRouter.get('/SearchfileContent/:subcategory',FileController.searchFileContent) 
const fetchCategoryData = async (req, res, next) => {
  try {
    const { category, subcategory } = req.query;

    if (!category || !subcategory) {
      return res.status(400).json({ error: 'Category or subcategory not provided' });
    }

    const categoryId = await CategoriesController.getCategoryByName(category);
    const subcategoryId = await CategoriesController.getSubcategoryByName(category, subcategory);

    if (!categoryId || !subcategoryId) {
      return res.status(404).json({ error: 'Category or subcategory not found' });
    }

    req.categoryId = categoryId;
    req.subcategoryId = subcategoryId;

    next();
  } catch (error) {
    console.error('Error fetching category data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("Destination callback invoked");
//     console.log("Category ID:", req.categoryId);
//     console.log("Subcategory ID:", req.subcategoryId);
  
//     try {
//       const uploadPath = `./files/${req.categoryId}/${req.subcategoryId}/`;
//       console.log("Upload Path:", uploadPath);
  
//       fs.mkdirSync(uploadPath, { recursive: true });
//       cb(null, uploadPath);
//     } catch (error) {
//       console.error('Error in destination callback:', error);
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

// const upload = multer({ storage:storage });

FileRouter.delete('/:guidName', FileController.deleteFile);

FileRouter.post('/upload', fetchCategoryData, multerUpload.single('file'), FileController.fileupload);

FileRouter.post('/exchange-file/:guidName',fetchCategoryData, multerUpload.single('file'), FileController.exchangeFile);
FileRouter.use("/:category/:subcategory", (req, res, next) => {
  const { category, subcategory } = req.params;
  if (!category || !subcategory) {
    return res.status(400).json({ error: 'Category and subcategory are required' });
  }
  
  req.category = category;
  req.subcategory = subcategory;
  next();
});

FileRouter.get('/:category/:subcategory', FileController.filename);

export default FileRouter;

