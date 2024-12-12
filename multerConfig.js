// multerConfig.js
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer(console.log("multer"),{
  
  storage: storage,
  limits: { fileSize: 5000 * 1024 * 1024 }, // Set the maximum file size to 50 MB (or any desired limit)
});



export default upload;
