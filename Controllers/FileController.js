// FileController.js
import FileModel from "../Models/FileModel.js";
import mime from 'mime';

const FileController = {
  fileUpload: async (req, res) => {
    try {
      // console.log("file controller req.file content",req.file);
     ;

      // Check if req.file is present
      // if (!req.file || !req.body || !req.body.name) {
      //   return res.status(400).json({ error: 'Invalid request body' });
      // }

      // Access the file data and name from the request body  
      const { name } = req.file.originalname;

      // Save the file data and name to MongoDB
      const fileDocument = new FileModel({
        name: req.file.originalname,
        type:req.file. mimetype,
        data: req.file.buffer,
      });

      // Save the file document to MongoDB
      await fileDocument.save();

      res.json({
        message: `File uploaded successfully`,
        file: name ,
      });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getFileNames: async (req, res) => {
    try {
     
      const files = await FileModel.find({}, 'name'); // Assuming your model has a 'name' field
      const fileNames = files.map(file => file.name);
      res.json(fileNames);
    } catch (error) {
      console.error('Error fetching file names:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
 
// getFileData: async (req, res) => {
//     try {
//       const { fileName } = req.params;

//       // Fetch the file data from MongoDB based on the file name
//       const file = await FileModel.findOne({ name: fileName });

//       if (!file) {
//         return res.status(404).json({ error: 'File not found' });
//       }
//       const base64Data = file.data.toString('base64');
//       console.log("base64Data",base64Data)
//       // Set the response headers
//       res.setHeader('Content-Type', file.type);
//       //res.setHeader('Content-Disposition', 'attachment; filename="example.docx"');
//       res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"`);
      
//       // Send the file data as the response
//       res.send(base64Data);
//     } catch (error) {
//       console.error('Error fetching file data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }    
//   },


  getFileData: async (req, res) => {
    try {
      const { fileName } = req.params;

      // Fetch the file data from MongoDB based on the file name
      const file = await FileModel.findOne({ name: fileName });

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Set the response headers
      res.setHeader('Content-Type', file.type);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"`);

      // Send the binary data as the response
      res.send(file.data);
    } catch (error) {
      console.error('Error fetching file data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};






export default FileController;
