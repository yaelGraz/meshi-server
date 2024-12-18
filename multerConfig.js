import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define storage configuration for disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the directory where the file will be uploaded
    const uploadDir = path.join(__dirname, '../uploads/'); // Update as needed
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Set the destination folder
  },
  filename: (req, file, cb) => {
    // Set the filename of the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export default upload;

