import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';  // Import fileURLToPath
import { dirname } from 'path';   

// Define storage configuration for disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the directory where the file will be uploaded
       // Equivalent to __dirname in ES Modules
       const __filename = fileURLToPath(import.meta.url);
       const __dirname = dirname(__filename);
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

