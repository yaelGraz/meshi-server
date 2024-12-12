import  express  from "express";
import FileController from "../Controllers/FileController.js";
const FileRouter=express.Router();
import multerUpload from "../multerConfig.js";

FileRouter.post('/upload', multerUpload.single('file'), FileController.fileUpload);
FileRouter.get('', FileController.getFileNames);

// Route to fetch file data based on file name
FileRouter.get('/:fileName', FileController.getFileData);

export default FileRouter;