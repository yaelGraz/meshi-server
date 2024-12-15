import  express  from "express";
import FileController from "../Controllers/FileController.js";
const FileRouter=express.Router();
import multerUpload from "../multerConfig.js";

FileRouter.post('/upload', multerUpload.single('file'), FileController.fileupload);
FileRouter.get('', FileController.getFileNames);

// Route to fetch file data based on file name
FileRouter.get('/:fileName', FileController.getFileData);



FileRouter.get('/:category/:subcategory/fileContent/:guidName',FileController.getFileContent) 
FileRouter.get('/SearchfileContent/:subcategory',FileController.searchFileContent) 


const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      console.log("req.body in multer.diskStorage", req.body);
      console.log("req.query in multer.diskStorage", req.query);
      console.log("req.query.category in multer.diskStorage", req.query.category);

      
      const categoryId = await CategoriesController.getCategoryByName(req.query.category);
      const subcategoryId = await CategoriesController.getSubcategoryByName(req.query.category, req.query.subcategory);

      console.log("categoryId in multer.diskStorage", categoryId);
      console.log("subcategoryId in multer.diskStorage", subcategoryId);
      
      const uploadPath = `./files/${categoryId}/${subcategoryId}/`;
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error getting category or subcategory:', error);
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    const guidName = req.body.guidName;
    console.log("guidName in fileName in multer.diskStorage:",guidName)
    const encodedFileName = file.originalname;
    console.log("encodedFileName", encodedFileName);

    // Decode the file name using iconv-lite directly to utf-8
    const decodedFileName = iconv.decode(iconv.encode(encodedFileName, 'binary'), 'utf-8').toString();
    console.log("decodedFileName", decodedFileName);

    cb(null, decodedFileName);
  },
});

const upload = multer({ storage: storage });
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

